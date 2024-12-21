.PHONY: build
build:
	docker build --platform linux/amd64 --memory=4g --memory-swap=4g -t ghcr.io/skyerus/portfolio-v2:latest .
	docker push ghcr.io/skyerus/portfolio-v2:latest
