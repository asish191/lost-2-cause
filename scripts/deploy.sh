#!/bin/bash

# Lost2Cause Deployment Script
# Usage: ./scripts/deploy.sh [environment] [action]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="lost2cause"
DOCKER_REGISTRY="your-registry.com"
ENVIRONMENT=${1:-staging}
ACTION=${2:-deploy}

# Environment-specific configurations
case $ENVIRONMENT in
    "staging")
        DOMAIN="staging.lost2cause.com"
        PORT="3000"
        ;;
    "production")
        DOMAIN="lost2cause.com"
        PORT="3000"
        ;;
    *)
        echo -e "${RED}Error: Invalid environment. Use 'staging' or 'production'${NC}"
        exit 1
        ;;
esac

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    log_success "All dependencies are installed"
}

build_image() {
    log_info "Building Docker image for $ENVIRONMENT..."
    
    docker build \
        --build-arg NODE_ENV=$ENVIRONMENT \
        --build-arg NEXT_PUBLIC_API_URL=https://$DOMAIN \
        -t $DOCKER_REGISTRY/$PROJECT_NAME:$ENVIRONMENT-$(date +%Y%m%d-%H%M%S) \
        -t $DOCKER_REGISTRY/$PROJECT_NAME:$ENVIRONMENT-latest \
        .
    
    log_success "Docker image built successfully"
}

push_image() {
    log_info "Pushing Docker image to registry..."
    
    docker push $DOCKER_REGISTRY/$PROJECT_NAME:$ENVIRONMENT-latest
    
    log_success "Docker image pushed successfully"
}

deploy() {
    log_info "Deploying to $ENVIRONMENT environment..."
    
    # Create deployment directory
    DEPLOY_DIR="/opt/$PROJECT_NAME/$ENVIRONMENT"
    sudo mkdir -p $DEPLOY_DIR
    
    # Copy docker-compose file
    cp docker-compose.yml $DEPLOY_DIR/
    cp nginx.conf $DEPLOY_DIR/
    
    # Create environment-specific docker-compose override
    cat > $DEPLOY_DIR/docker-compose.override.yml << EOF
version: '3.8'
services:
  app:
    image: $DOCKER_REGISTRY/$PROJECT_NAME:$ENVIRONMENT-latest
    environment:
      - NODE_ENV=$ENVIRONMENT
      - NEXT_PUBLIC_API_URL=https://$DOMAIN
    restart: unless-stopped
EOF
    
    # Deploy using docker-compose
    cd $DEPLOY_DIR
    docker-compose -f docker-compose.yml -f docker-compose.override.yml down
    docker-compose -f docker-compose.yml -f docker-compose.override.yml pull
    docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
    
    log_success "Deployment completed successfully"
}

rollback() {
    log_warning "Rolling back to previous version..."
    
    DEPLOY_DIR="/opt/$PROJECT_NAME/$ENVIRONMENT"
    cd $DEPLOY_DIR
    
    # Get the previous image tag
    PREVIOUS_IMAGE=$(docker images --format "table {{.Repository}}:{{.Tag}}" | grep $PROJECT_NAME | grep -v latest | head -2 | tail -1)
    
    if [ -z "$PREVIOUS_IMAGE" ]; then
        log_error "No previous version found for rollback"
        exit 1
    fi
    
    # Update docker-compose override with previous image
    sed -i "s|image:.*|image: $PREVIOUS_IMAGE|" docker-compose.override.yml
    
    # Redeploy
    docker-compose -f docker-compose.yml -f docker-compose.override.yml down
    docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
    
    log_success "Rollback completed successfully"
}

health_check() {
    log_info "Performing health check..."
    
    # Wait for application to start
    sleep 10
    
    # Check if application is responding
    if curl -f http://localhost:$PORT/health > /dev/null 2>&1; then
        log_success "Health check passed"
    else
        log_error "Health check failed"
        exit 1
    fi
}

cleanup() {
    log_info "Cleaning up old images..."
    
    # Remove images older than 7 days
    docker image prune -f --filter "until=168h"
    
    log_success "Cleanup completed"
}

# Main script
main() {
    log_info "Starting deployment process for $ENVIRONMENT environment"
    
    check_dependencies
    
    case $ACTION in
        "deploy")
            build_image
            push_image
            deploy
            health_check
            cleanup
            ;;
        "rollback")
            rollback
            health_check
            ;;
        "build")
            build_image
            ;;
        "push")
            push_image
            ;;
        "health")
            health_check
            ;;
        *)
            log_error "Invalid action. Use 'deploy', 'rollback', 'build', 'push', or 'health'"
            exit 1
            ;;
    esac
    
    log_success "Deployment script completed successfully"
}

# Run main function
main "$@"
