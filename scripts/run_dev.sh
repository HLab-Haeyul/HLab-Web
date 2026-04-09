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

find_container_using_port() {
  local port="$1"

  docker ps --format '{{.ID}}\t{{.Names}}' 2>/dev/null | while IFS=$'\t' read -r container_id container_name; do
    if [ -n "$container_id" ] && docker port "$container_id" 2>/dev/null | grep -qE -- "-> .*:${port}$"; then
      echo "$container_name"
    fi
  done
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

title "HLab-Web Development Server"

if [ -n "$(docker ps -q --filter 'name=hlab-web-dev')" ]; then
  warn "개발 서버가 이미 실행 중입니다. 기존 컨테이너를 종료 중..."
  docker compose -f ./docker/docker-compose.dev.yml down
  sleep 2
  success "기존 컨테이너 종료 완료"
fi

if lsof -i :"$PORT" > /dev/null 2>&1; then
  CONTAINERS=$(find_container_using_port "$PORT")

  if [ -n "$CONTAINERS" ]; then
    warn "포트 ${PORT}를 사용하는 Docker 컨테이너가 있습니다:"
    echo "$CONTAINERS" | sed 's/^/  - /'
    error "컨테이너가 포트를 점유 중이므로 자동 종료하지 않습니다. 먼저 해당 컨테이너를 중지해 주세요."
    exit 1
  fi

  warn "포트 ${PORT}가 이미 사용 중입니다. Docker 컨테이너가 아니므로 기존 프로세스를 종료합니다..."
  kill_processes_using_port "$PORT"

  if lsof -i :"$PORT" > /dev/null 2>&1; then
    error "포트 ${PORT}를 해제하지 못했습니다."
    exit 1
  fi

  success "기존 프로세스 종료 완료"
fi

step "개발 서버 시작 중..."
docker compose -f ./docker/docker-compose.dev.yml up --build
if [ $? -ne 0 ]; then
  error "개발 서버 시작 실패"
  exit 1
fi

info "포트: ${PORT}"
success "개발 서버가 종료되었습니다."
