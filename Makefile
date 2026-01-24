.PHONY: help dev dev-build dev-down dev-logs prod prod-build prod-down prod-logs clean

help: ## Hiển thị help
	@echo "Các lệnh có sẵn:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development commands
dev: ## Khởi động development mode
	docker-compose -f docker-compose.dev.yml up -d

dev-build: ## Build và khởi động development mode
	docker-compose -f docker-compose.dev.yml up -d --build

dev-down: ## Dừng development mode
	docker-compose -f docker-compose.dev.yml down

dev-logs: ## Xem logs trong development mode
	docker-compose -f docker-compose.dev.yml logs -f

dev-restart: ## Restart development mode
	docker-compose -f docker-compose.dev.yml restart

# Production commands
prod: ## Khởi động production mode
	docker-compose up -d

prod-build: ## Build và khởi động production mode
	docker-compose up -d --build

prod-down: ## Dừng production mode
	docker-compose down

prod-logs: ## Xem logs trong production mode
	docker-compose logs -f

prod-restart: ## Restart production mode
	docker-compose restart

# Database commands
db-shell: ## Truy cập PostgreSQL shell
	docker-compose exec postgres psql -U postgres -d ecommerce_db

migration-run: ## Chạy database migrations
	docker-compose exec app npm run migration:run

migration-revert: ## Rollback migration
	docker-compose exec app npm run migration:revert

# Utility commands
clean: ## Xóa tất cả containers, volumes, và images
	docker-compose -f docker-compose.dev.yml down -v --rmi all
	docker-compose down -v --rmi all

clean-volumes: ## Xóa volumes (xóa database data)
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose down -v

logs-app: ## Xem logs của app
	docker-compose logs -f app

logs-db: ## Xem logs của database
	docker-compose logs -f postgres

shell-app: ## Truy cập vào app container
	docker-compose exec app sh

ps: ## Xem status của containers
	docker-compose ps

