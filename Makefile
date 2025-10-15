# Makefile for Backend Blockchain Project

# Variables
DOCKER_COMPOSE_DEV = docker-compose -f docker-compose.dev.yml
DOCKER_COMPOSE_PROD = docker-compose -f docker-compose.prod.yml

.PHONY: help dev prod build-dev build-prod down-dev down-prod logs-dev logs-prod clean install test lint

# Default target
help:
	@echo "Available commands:"
	@echo "  dev          - Start development environment"
	@echo "  prod         - Start production environment"
	@echo "  build-dev    - Build and start development environment"
	@echo "  build-prod   - Build and start production environment"
	@echo "  down-dev     - Stop development environment"
	@echo "  down-prod    - Stop production environment"
	@echo "  logs-dev     - Show development logs"
	@echo "  logs-prod    - Show production logs"
	@echo "  clean        - Clean up Docker containers and images"
	@echo "  install      - Install dependencies"
	@echo "  test         - Run tests"
	@echo "  lint         - Run linting"

# Development commands
dev:
	$(DOCKER_COMPOSE_DEV) up

build-dev:
	$(DOCKER_COMPOSE_DEV) up --build

down-dev:
	$(DOCKER_COMPOSE_DEV) down

logs-dev:
	$(DOCKER_COMPOSE_DEV) logs -f

# Production commands
prod:
	$(DOCKER_COMPOSE_PROD) up -d

build-prod:
	$(DOCKER_COMPOSE_PROD) up --build -d

down-prod:
	$(DOCKER_COMPOSE_PROD) down

logs-prod:
	$(DOCKER_COMPOSE_PROD) logs -f

# Utility commands
clean:
	docker system prune -af
	docker volume prune -f

install:
	npm ci

test:
	npm test

lint:
	npm run lint

# Database commands
db-migrate:
	npm run db:migrate

db-seed:
	npm run db:seed

# Health check
health:
	curl -f http://localhost:3000/api/health || exit 1

# Production deployment helper
deploy-prod: build-prod
	@echo "Production deployment completed"
	@echo "Health check:"
	@sleep 10
	@curl -f http://localhost:3000/api/health && echo "\n✅ Application is healthy" || echo "\n❌ Application health check failed"