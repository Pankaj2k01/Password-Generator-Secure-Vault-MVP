#!/bin/bash

# Script to start MongoDB for local development
echo "Starting MongoDB for Password Vault development..."

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "Using Docker to start MongoDB..."
    docker run -d \
        --name password-vault-mongo \
        -p 27017:27017 \
        -v password-vault-data:/data/db \
        mongo:latest
    
    echo "MongoDB started on port 27017"
    echo "Container name: password-vault-mongo"
    echo "Data volume: password-vault-data"
    echo ""
    echo "To stop MongoDB:"
    echo "  docker stop password-vault-mongo"
    echo ""
    echo "To remove MongoDB container:"
    echo "  docker rm password-vault-mongo"
    echo ""
    echo "To remove data volume:"
    echo "  docker volume rm password-vault-data"
    
elif command -v mongod &> /dev/null; then
    echo "Using local MongoDB installation..."
    mongod --dbpath ./data/db --logpath ./data/mongodb.log --fork
    echo "MongoDB started with local installation"
    
else
    echo "Neither Docker nor MongoDB installation found!"
    echo "Please install either:"
    echo "1. Docker: https://docs.docker.com/get-docker/"
    echo "2. MongoDB: https://docs.mongodb.com/manual/installation/"
    exit 1
fi