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

title "HLab-Web Development Server"

if lsof -i :3000 > /dev/null 2>&1; then
  warn "포트 3000이 이미 사용 중입니다. 기존 프로세스 종료 중..."
  PID=$(lsof -t -i :3000)
  if [-n "$PID"]; then
    kill -9 $PID 2>/dev/null || true
    
    for i in {1...5}; do
      sleep 1
      if ! lsof -i :3000 > /dev/null 2>&1; then
        success "기존 프로세스 종료 완료"
        break
      fi
    done

    if lsof -i :3000 > /dev/null 2>&1; then
      warn "정상 종료 실패, ㄴSIGKILL 강제 종료합니다..."
      PIDS=$(lsof -t -i :3000)
      [-n "$PIDS"] && kill -9 $PIDS 2>/dev/null || true
      sleep 1
    fi
  fi
  success "기존 프로세스 종료 완료"
fi

step "개발 서버 시작 중..."
docker-compose -f ./docker/docker-compose.dev.yml up --build
if [ $? -ne 0 ]; then
  error "개발 서버 시작 실패"
  exit 1
fi

info "포트: 3000"
success "개발 서버가 종료되었습니다."
