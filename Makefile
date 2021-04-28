run-dev-frontend:
	cd src/frontend && yarn serve
run-dev-backend:
	cd src/backend && go run main.go

build-frontend:
	cd src/frontend && yarn build

build-backend:
	cd src/backend && go build -o ../../build/server main.go
