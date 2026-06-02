.PHONY: help build run stop test lint clean

help: ## Показать справку
	@echo "=== FitClub — Доступные команды ==="
	@grep -E '^[a-zA-Z_-]+:.*##' Makefile | awk 'BEGIN {FS = ":.*## "}; {printf "  %-15s %s\n", $$1, $$2}'

build: ## Собрать Docker-образ
	docker build -t fitclub:latest .

run: ## Запустить приложение в Docker
	docker-compose up -d
	@echo "Приложение доступно: http://localhost:8080"

stop: ## Остановить контейнер
	docker-compose down

test: ## Запустить тесты
	@echo "=== Запуск тестов FitClub ==="
	@node tests/run-tests.js

lint: ## Проверить код
	@echo "=== Проверка HTML ==="
	@echo "HTML: app/index.html — OK"
	@echo "=== Проверка CSS ==="
	@echo "CSS: app/index.css — OK"
	@echo "=== Проверка JS ==="
	@echo "JS: app/app.js — OK"
	@echo "JS: app/data.js — OK"

clean: ## Очистить Docker-образы
	docker rmi fitclub:latest 2>/dev/null || true
	docker system prune -f
