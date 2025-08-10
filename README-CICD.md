# CI/CD Pipeline Documentation

This document describes the CI/CD pipeline setup for the Lost2Cause Next.js application.

## Overview

The project includes multiple CI/CD configurations to support different deployment scenarios:

- **GitHub Actions**: For GitHub-based workflows
- **GitLab CI**: For GitLab-based workflows
- **Docker**: For containerized deployments
- **Manual Deployment Scripts**: For server-based deployments

## Prerequisites

Before setting up the CI/CD pipeline, ensure you have:

1. **Node.js 20+** installed
2. **Docker** and **Docker Compose** installed
3. **Git** configured with proper access
4. **Environment variables** configured (see Configuration section)

## Configuration

### Environment Variables

Create the following environment variables in your CI/CD platform:

#### GitHub Actions Secrets
```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
DOCKER_USERNAME=your_docker_username
DOCKER_PASSWORD=your_docker_password
```

#### GitLab CI Variables
```bash
CI_REGISTRY=your_registry_url
CI_REGISTRY_USER=your_registry_username
CI_REGISTRY_PASSWORD=your_registry_password
```

### Next.js Configuration

Update your `next.config.ts` to enable standalone output for Docker:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
};

export default nextConfig;
```

## Pipeline Stages

### 1. Lint and Type Check
- Runs ESLint for code quality
- Performs TypeScript type checking
- Ensures code follows project standards

### 2. Build and Test
- Installs dependencies
- Builds the Next.js application
- Uploads build artifacts for later use

### 3. Security Scan
- Runs Trivy vulnerability scanner
- Uploads results to security dashboard
- Identifies potential security issues

### 4. Deploy to Staging
- Deploys to staging environment on `develop` branch
- Uses Vercel for hosting
- Includes health checks

### 5. Deploy to Production
- Deploys to production environment on `main` branch
- Requires manual approval
- Includes rollback capabilities

### 6. Docker Build and Push
- Builds optimized Docker images
- Pushes to container registry
- Supports multiple environments

## Usage

### GitHub Actions

The pipeline automatically triggers on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

To manually trigger:
1. Go to Actions tab in GitHub
2. Select "CI/CD Pipeline"
3. Click "Run workflow"

### GitLab CI

The pipeline automatically triggers on:
- Push to `main` or `develop` branches
- Merge requests

To manually trigger:
1. Go to CI/CD > Pipelines
2. Click "Run pipeline"

### Docker Deployment

#### Local Development
```bash
# Build and run development environment
docker-compose --profile dev up -d

# Build and run production environment
docker-compose up -d
```

#### Production Deployment
```bash
# Make script executable
chmod +x scripts/deploy.sh

# Deploy to staging
./scripts/deploy.sh staging deploy

# Deploy to production
./scripts/deploy.sh production deploy

# Rollback deployment
./scripts/deploy.sh production rollback
```

## Docker Configuration

### Multi-stage Dockerfile

The Dockerfile uses a multi-stage build process:

1. **deps**: Installs production dependencies
2. **builder**: Builds the Next.js application
3. **runner**: Creates optimized production image

### Docker Compose

The `docker-compose.yml` includes:

- **app**: Main Next.js application
- **app-dev**: Development version with hot reload
- **nginx**: Reverse proxy with load balancing
- **redis**: Caching layer (optional)
- **postgres**: Database (optional)

### Nginx Configuration

The Nginx configuration provides:

- Load balancing across multiple app instances
- Rate limiting for API endpoints
- Gzip compression
- Security headers
- SSL/TLS support (commented)

## Monitoring and Health Checks

### Health Check Endpoint

The application includes a health check endpoint at `/health` that returns:
- HTTP 200: Application is healthy
- HTTP 503: Application is unhealthy

### Monitoring

The pipeline includes:
- Build status monitoring
- Deployment status tracking
- Health check validation
- Error reporting

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review TypeScript compilation errors

2. **Deployment Failures**
   - Verify environment variables are set
   - Check Docker registry credentials
   - Ensure target environment is accessible

3. **Health Check Failures**
   - Verify application is starting correctly
   - Check port configuration
   - Review application logs

### Debug Commands

```bash
# Check Docker container status
docker ps -a

# View application logs
docker-compose logs app

# Check Nginx configuration
docker-compose exec nginx nginx -t

# Access application shell
docker-compose exec app sh
```

## Security Considerations

### Best Practices

1. **Secrets Management**
   - Use CI/CD platform secrets
   - Never commit sensitive data
   - Rotate credentials regularly

2. **Container Security**
   - Use minimal base images
   - Run as non-root user
   - Scan for vulnerabilities

3. **Network Security**
   - Use HTTPS in production
   - Implement rate limiting
   - Configure proper firewall rules

### Security Scanning

The pipeline includes:
- Trivy vulnerability scanning
- Dependency vulnerability checks
- Container image scanning
- Security header validation

## Performance Optimization

### Build Optimization

- Multi-stage Docker builds
- Layer caching
- Dependency optimization
- Asset compression

### Runtime Optimization

- Nginx reverse proxy
- Gzip compression
- Static asset caching
- Load balancing

## Backup and Recovery

### Backup Strategy

1. **Application Data**
   - Database backups
   - File storage backups
   - Configuration backups

2. **Deployment Data**
   - Docker image backups
   - Configuration backups
   - Environment backups

### Recovery Procedures

1. **Application Recovery**
   - Use deployment rollback
   - Restore from backups
   - Verify data integrity

2. **Infrastructure Recovery**
   - Rebuild containers
   - Restore configurations
   - Validate connectivity

## Support

For issues with the CI/CD pipeline:

1. Check the troubleshooting section
2. Review pipeline logs
3. Verify configuration settings
4. Contact the development team

## Contributing

To contribute to the CI/CD pipeline:

1. Follow the existing patterns
2. Test changes thoroughly
3. Update documentation
4. Submit pull requests

---

**Last Updated**: $(date)
**Version**: 1.0.0
