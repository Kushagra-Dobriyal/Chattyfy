# Chattyfy CI/CD Deployment Guide

This guide explains how to deploy Chattyfy using a simplified CI/CD pipeline that eliminates the need for docker-compose and uses Docker Hub for image management. Everything is handled automatically by GitHub Actions.

## Architecture Overview

```
Developer pushes to main → GitHub Actions builds Docker images → 
Images pushed to Docker Hub → EC2 pulls and runs containers
```

## Prerequisites

1. **Docker Hub Account**: Create an account at [Docker Hub](https://hub.docker.com)
2. **EC2 Instance**: Running Ubuntu with Docker installed
3. **GitHub Repository**: With the Chattyfy codebase

## GitHub Secrets Setup

Add the following secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

### Docker Hub Credentials
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password or access token

### EC2 Connection Details
- `EC2_HOST`: Your EC2 instance public IP or domain
- `EC2_USERNAME`: SSH username (usually `ubuntu` or `ec2-user`)
- `EC2_SSH_KEY`: Your private SSH key for EC2 access
- `EC2_PORT`: SSH port (usually `22`)

### Application Environment Variables
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
- `VITE_API_URL`: Frontend API URL (e.g., `http://your-domain.com:3000`)

## EC2 Setup

### 1. Install Docker on EC2

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Logout and login again for group changes to take effect
```

### 2. Configure Security Groups

Ensure your EC2 security group allows:
- **Port 22**: SSH access
- **Port 80**: HTTP (frontend)
- **Port 3000**: Backend API
- **Port 443**: HTTPS (if using SSL)

### 3. Set Up Environment Variables

Create a `.env` file on your EC2 instance:

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Create .env file
cat > .env << EOF
DOCKER_USERNAME=your-docker-username
DOCKER_PASSWORD=your-docker-password
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
VITE_API_URL=http://your-domain.com:3000
EOF

# Source the environment variables
source .env
```

## Deployment Process

### Automatic Deployment (Recommended)

1. **Push to main branch**: The CI/CD pipeline will automatically:
   - Build Docker images for frontend and backend
   - Push images to Docker Hub
   - Deploy to EC2
   - Verify deployment and show logs

2. **Monitor deployment**: Check the GitHub Actions tab for deployment status and logs

### Manual Container Management (If Needed)

If you need to manage containers manually on EC2:

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Check container status
docker ps

# View logs
docker logs -f chattyfy-frontend
docker logs -f chattyfy-backend

# Restart containers
docker restart chattyfy-frontend chattyfy-backend

# Stop containers
docker stop chattyfy-frontend chattyfy-backend
```

## Container Management Commands

For manual container management on EC2:

```bash
# Check container status
docker ps

# View logs for specific container
docker logs -f chattyfy-frontend
docker logs -f chattyfy-backend

# Restart containers
docker restart chattyfy-frontend chattyfy-backend

# Stop containers
docker stop chattyfy-frontend chattyfy-backend

# Pull latest images manually
docker pull your-username/chattyfy-frontend:latest
docker pull your-username/chattyfy-backend:latest

# Clean up old images
docker image prune -f
```

## Container Management

### View Running Containers
```bash
docker ps
```

### View Container Logs
```bash
# Frontend logs
docker logs -f chattyfy-frontend

# Backend logs
docker logs -f chattyfy-backend
```

### Restart Containers
```bash
docker restart chattyfy-frontend chattyfy-backend
```

### Update to Latest Version
```bash
# Pull latest images and restart
docker pull your-username/chattyfy-frontend:latest
docker pull your-username/chattyfy-backend:latest
docker restart chattyfy-frontend chattyfy-backend
```

## Troubleshooting

### Common Issues

1. **Docker Hub Authentication Failed**
   - Verify `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets
   - Check if Docker Hub account has proper permissions

2. **EC2 Connection Failed**
   - Verify `EC2_HOST`, `EC2_USERNAME`, and `EC2_SSH_KEY` secrets
   - Ensure EC2 security group allows SSH access
   - Check if SSH key has correct permissions

3. **Container Won't Start**
   - Check container logs: `docker logs chattyfy-backend`
   - Verify environment variables are set correctly
   - Ensure ports are not already in use

4. **Frontend Can't Connect to Backend**
   - Verify `VITE_API_URL` is correct
   - Check if backend container is running on port 3000
   - Ensure EC2 security group allows port 3000

### Debugging Commands

```bash
# Check Docker daemon status
sudo systemctl status docker

# Check available disk space
df -h

# Check Docker images
docker images

# Check Docker containers
docker ps -a

# Check environment variables
env | grep -E "(DOCKER|MONGODB|JWT|CLOUDINARY|VITE)"
```

## Monitoring and Maintenance

### Health Checks
- Frontend: `http://your-domain.com`
- Backend: `http://your-domain.com:3000/health` (if implemented)

### Regular Maintenance
```bash
# Clean up unused Docker resources
docker system prune -f

# Update system packages
sudo apt update && sudo apt upgrade -y

# Restart Docker service if needed
sudo systemctl restart docker
```

## Security Considerations

1. **Use Docker Hub Access Tokens**: Instead of your password, create an access token in Docker Hub
2. **Rotate Secrets Regularly**: Update JWT secrets and API keys periodically
3. **Limit SSH Access**: Use key-based authentication and restrict SSH access
4. **Monitor Logs**: Regularly check container logs for suspicious activity
5. **Keep Images Updated**: Regularly update base images for security patches

## Migration from docker-compose

If you're migrating from the old docker-compose setup:

1. **Stop existing containers**:
   ```bash
   docker-compose down
   ```

2. **Remove old images**:
   ```bash
   docker rmi $(docker images -q)
   ```

3. **Deploy using new pipeline**:
   - Push to main branch (automatic deployment)

4. **Verify deployment**:
   ```bash
   docker ps
   ```

The new setup eliminates the need for docker-compose and provides a fully automated deployment process through GitHub Actions. 