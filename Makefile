# app name should be overridden.
# ex) development-stage: make build-dev APP_NAME=<APP_NAME>

APP_NAME = nodejs-microservice-task
APP_NAME := $(APP_NAME)

.PHONY: build


build:
 	OMDB_API_KEY=$(OMDB_API_KEY) docker-compose build --no-cache

clean:
	docker-compose rm -f

run:
 	OMDB_API_KEY=$(OMDB_API_KEY) docker-compose up

down:	
	docker-compose down

all: 
	docker-compose down && OMDB_API_KEY=$(OMDB_API_KEY) docker-compose build --no-cache && OMDB_API_KEY=$(OMDB_API_KEY) docker-compose up

test:
	cd movie-service && OMDB_API_KEY=$(OMDB_API_KEY) docker-compose run --rm movie-service npm test
