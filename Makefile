# app name should be overridden.
# ex) development-stage: make build-dev APP_NAME=<APP_NAME>

APP_NAME = nodejs-microservice-task
APP_NAME := $(APP_NAME)

.PHONY: build


build:
	docker-compose build --no-cache

clean:
	docker-compose rm -f

run:
	JWT_SECRET=secret OMDB_API_KEY=ef866f8d docker-compose up

down:	
	docker-compose down

all: 
	docker-compose down && JWT_SECRET=secret OMDB_API_KEY=ef866f8d docker-compose build --no-cache && JWT_SECRET=secret OMDB_API_KEY=ef866f8d docker-compose up

test:
	cd movie-service && JWT_SECRET=secret OMDB_API_KEY=ef866f8d docker-compose run --rm movie-service npm test
