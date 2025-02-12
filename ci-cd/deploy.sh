#!/bin/bash
ACR="youracr.azurecr.io"
IMAGE="converter-app:v1"

# Pull latest Docker image
docker pull ${ACR_LOGIN_SERVER}/${DOCKER_IMAGE}

# Stop and remove existing container
docker stop converter-app || true
docker rm converter-app || true

# Run new container
docker run -d --name converter-app -p 5000:80 ${ACR_LOGIN_SERVER}/${DOCKER_IMAGE}
