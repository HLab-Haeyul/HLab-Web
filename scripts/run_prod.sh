#!/bin/bash

# ============================================
# Color System
# ============================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# 단계 시작 (파란색)
step() {
  echo -e "${BLUE}[STEP]${NC} $1"
}

# 정보 (청록색)
info() {
  echo -e "${CYAN}[INFO]${NC} $1"
}

# 성공 (초록색)
success() {
  echo -e "${GREEN}[✔]${NC} $1"
}

# 경고 (노란색)
warn() {
  echo -e "${YELLOW}[⚠]${NC} $1"
}

# 에러 (빨간색)
error() {
  echo -e "${RED}[✘]${NC} $1"
}

# 제목 (굵은 글씨)
title() {
  echo ""
  echo -e "${BOLD}========================================${NC}"
  echo -e "${BOLD}  $1${NC}"
  echo -e "${BOLD}========================================${NC}"
  echo ""
}

PORT=3000

get_container_name() {
  local container_id="$1"

  docker inspect --format '{{.Name}}' "$container_id" 2>/dev/null | sed 's#^/##'
}

find_container_ids_using_port() {
  local port="$1"
  local container_id

  docker ps -q 2>/dev/null | while read -r container_id; do
    if [ -n "$container_id" ] && docker port "$container_id" 2>/dev/null | grep -qE -- "-> .*:${port}$"; then
      echo "$container_id"
    fi
  done
}

stop_containers_using_port() {
  local port="$1"
  local container_ids
  local container_id
  local container_name

  container_ids=$(find_container_ids_using_port "$port")
  if [ -z "$container_ids" ]; then
    return 0
  fi

  warn "포트 ${port}를 사용하는 Docker 컨테이너를 중지합니다..."

  while read -r container_id; do
    if [ -n "$container_id" ]; then
      container_name=$(get_container_name "$container_id")
      info "컨테이너 중지: ${container_name:-$container_id}"
      docker stop "$container_id" > /dev/null 2>&1 || true
    fi
  done <<EOF
$container_ids
EOF

  sleep 2
}

stop_container_by_name() {
  local container_name="$1"
  local container_ids

  container_ids=$(docker ps -q --filter "name=^/${container_name}$" 2>/dev/null)
  if [ -z "$container_ids" ]; then
    return 0
  fi

  warn "실행 중인 컨테이너를 중지합니다: ${container_name}"
  for container_id in $container_ids; do
    info "컨테이너 중지: ${container_name} (${container_id})"
    docker stop "$container_id" > /dev/null 2>&1 || true
  done

  sleep 2
}

stop_known_conflicting_containers() {
  stop_container_by_name "hlab-web-prod"
  stop_container_by_name "hlab-web-dev"
}

kill_processes_using_port() {
  local port="$1"
  local pids

  pids=$(lsof -t -i :"$port")
  if [ -n "$pids" ]; then
    kill $pids 2>/dev/null || true
    sleep 2

    if lsof -i :"$port" > /dev/null 2>&1; then
      warn "정상 종료 실패, 프로세스를 강제 종료합니다 (SIGKILL)..."
      pids=$(lsof -t -i :"$port")
      if [ -n "$pids" ]; then
        kill -9 $pids 2>/dev/null || true
      fi
      sleep 1
    fi
  fi
}

title "HLab-Web Production Deploy"

step "프로덕션 빌드 중..."
docker-compose -f ./docker/docker-compose.prod.yml build
if [ $? -eq 0 ]; then
  success "빌드 성공"
else
  error "빌드 실패"
  exit 1
fi

step "서버 시작..."

if [ -n "$(docker ps -q --filter 'name=hlab-web-prod')" ] || [ -n "$(docker ps -q --filter 'name=hlab-web-dev')" ]; then
  warn "충돌 가능한 HLab 컨테이너를 종료 중..."
  stop_known_conflicting_containers
  success "기존 컨테이너 종료 완료"
fi

if lsof -i :"$PORT" > /dev/null 2>&1; then
  CONTAINERS=$(find_container_ids_using_port "$PORT")

  if [ -n "$CONTAINERS" ]; then
    warn "포트 ${PORT}를 사용하는 Docker 컨테이너가 있습니다:"
    while read -r container_id; do
      if [ -n "$container_id" ]; then
        echo "  - $(get_container_name "$container_id")"
      fi
    done <<EOF
$CONTAINERS
EOF
    stop_containers_using_port "$PORT"
  fi

  if lsof -i :"$PORT" > /dev/null 2>&1; then
    warn "포트 ${PORT}가 여전히 사용 중입니다. 기존 프로세스를 종료합니다..."
    kill_processes_using_port "$PORT"
  fi

  if lsof -i :"$PORT" > /dev/null 2>&1; then
    error "포트 ${PORT}를 해제하지 못했습니다."
    exit 1
  fi

  success "기존 포트 점유 리소스 종료 완료"
fi

docker-compose -f ./docker/docker-compose.prod.yml up -d
if [ $? -ne 0 ]; then
  error "서버 시작 실패"
  exit 1
fi
success "서버 시작 완료"

info "포트: ${PORT}"
success "배포 완료 🚀"
