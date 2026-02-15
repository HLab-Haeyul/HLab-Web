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

title "HLab-Web Production Deploy"

step "프로덕션 빌드 중..."
docker compose -f ./docker/docker-compose.prod.yml build
if [ $? -eq 0 ]; then
  success "빌드 성공"
else
  error "빌드 실패"
  exit 1
fi

step "서버 시작..."

if lsof -i :3000 > /dev/null 2>&1; then
  PIDS=$(lsof -t -i :3000)  
  if [ -n "$PIDS" ]; then  
    kill $PIDS  
    sleep 5 
    if lsof -i :3000 > /dev/null 2>&1; then  
      warn "정상 종료 실패, 프로세스를 강제 종료합니다 (SIGKILL)..."  
      kill -9 $PIDS  
      sleep 2  
    fi  
  fi  
  warn "포트 3000이 이미 사용 중입니다. 기존 프로세스 종료 중..."
  kill -9 $(lsof -t -i :3000)
  sleep 2
  success "기존 프로세스 종료 완료"
fi

docker-compose -f ./docker/docker-compose.prod.yml up -d
if [ $? -ne 0 ]; then
  error "서버 시작 실패"
  exit 1
fi
success "서버 시작 완료"

info "포트: 3000"
success "배포 완료 🚀"