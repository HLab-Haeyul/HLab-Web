.PHONY: help dev build prod stop logs clean db-migrate db-reset

help:
	@echo "[사용 가능한 명령어]"
	@echo " make dev				 - 개발 서버 실행"
	@echo " make build			 - 프로덕션 빌드"
	@echo " make prod			 - 프로덕션 서버 실행"
	@echo " make stop			 - 모든 컨테이너 중지"
	@echo " make logs			 - 컨테이너 로그 확인"
	@echo " make clean			 - 사용하지 않는 도커 자원 정리"
	@echo " make db-migrate		 - 데이터베이스 마이그레이션 실행"
	@echo " make db-reset		 - 데이터베이스 초기화 및 마이그레이션 실행"

dev:
	./scripts/run_dev.sh

build:
	docker-compose -f ./docker/docker-compose.prod.yml build

prod:
	./scripts/run_prod.sh

stop:
	docker-compose -f ./docker/docker-compose.prod.yml down

logs:
	docker-compose -f ./docker/docker-compose.prod.yml logs -f

clean:
	docker system prune -f

db-migrate:
	docker-compose -f ./docker/docker-compose.dev.yml run --rm web npx sequelize-cli db:migrate

db-reset:
	docker-compose -f ./docker/docker-compose.dev.yml run --rm web npx sequelize-cli db:drop
	docker-compose -f ./docker/docker-compose.dev.yml run --rm web npx sequelize-cli db:create
	docker-compose -f ./docker/docker-compose.dev.yml run --rm web npx sequelize-cli db:migrate
	docker-compose -f ./docker/docker-compose.dev.yml run --rm web npx sequelize-cli db:seed:all