# Makefile for docker-oauth-integration

IMAGE_NAME = dicoDingo/admin2

# If this commit have been tagged, set IMAGE_VERSION with it
GIT_TAG ?= $(shell git tag -l --points-at HEAD | head -n1)
# If not, tag this image 'latest'
IMAGE_VERSION := $(if $(GIT_TAG),$(GIT_TAG),latest)

# -----------------------------------------------------------------
#        Main targets
# -----------------------------------------------------------------

help: ## print this message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-10s\033[0m\t%s\n", $$1, $$2}'

version:
	@echo "$(IMAGE_NAME):$(IMAGE_VERSION) , git tag : $(GIT_TAG)"

build-image: ## create the image
	docker build --no-cache -t $(IMAGE_NAME):latest .

push: build ## build and push image
	docker tag $(IMAGE_NAME):latest $(IMAGE_NAME):$(IMAGE_VERSION)
	docker push $(IMAGE_NAME):$(IMAGE_VERSION)

buildVersion: ## create the image with specified tag, run "make ARGS="1.0" buildVersion"
	docker build --no-cache -t $(IMAGE_NAME):${ARGS} .

run: ## create a new container from the image
	docker run -p 3000:3000 -d $(IMAGE_NAME):latest

pull: ## pull the image from the ADEO registry
	docker pull $(IMAGE_NAME):latest

start: ## start local env use backend
	npm run start
