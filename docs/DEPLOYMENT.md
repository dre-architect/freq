# FREQ AI - Deployment Guide

## Prerequisites

### System Requirements

**Minimum Hardware:**
- CPU: 4 cores, 2.5 GHz
- RAM: 8 GB
- Storage: 20 GB
- Network: 100 Mbps

**Recommended Hardware:**
- CPU: 8+ cores, 3.0+ GHz
- RAM: 16+ GB
- Storage: 50+ GB SSD
- GPU: NVIDIA GPU with CUDA support (for point cloud processing)
- Network: 1 Gbps

**Software:**
- Docker 20.10+
- Docker Compose 2.0+
- Git

### Optional (for development)
- Python 3.11+
- Node.js 18+
- npm 9+

## Deployment Options

### Option 1: Docker Compose (Recommended)

This is the simplest deployment method, suitable for single-server deployments.

#### Step 1: Clone the repository

```bash
git clone https://github.com/dre-architect/freq.git
cd freq
```

#### Step 2: Configure environment

Create a `.env` file in the root directory:

```bash
# Backend Configuration
LOG_LEVEL=INFO
PYTHONUNBUFFERED=1

# Frontend Configuration
VITE_API_URL=http://localhost:5000/api/v1
VITE_WS_URL=ws://localhost:5000/ws

# Optional: Cesium Ion Access Token
CESIUM_ION_TOKEN=your_token_here
```

#### Step 3: Build and start services

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

#### Step 4: Access the application

- **Frontend Dashboard**: http://localhost
- **Backend API**: http://localhost:5000/api/v1
- **Health Check**: http://localhost:5000/api/v1/health

#### Step 5: Stop services

```bash
docker-compose down
```

### Option 2: Manual Deployment

For development or customized deployments.

#### Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Run the backend
python main.py
```

Backend will be available at http://localhost:5000

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build
npm run preview
```

Frontend will be available at http://localhost:3000 (dev) or http://localhost:4173 (preview)

### Option 3: Production Deployment

For production environments with reverse proxy and SSL.

#### Architecture

```
Internet → Nginx (SSL) → Frontend Container
                      → Backend Container
```

#### Step 1: Set up Nginx reverse proxy

```nginx
server {
    listen 443 ssl http2;
    server_name freq.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # WebSocket
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
```

#### Step 2: Configure SSL certificates

```bash
# Using Let's Encrypt
sudo certbot --nginx -d freq.yourdomain.com
```

#### Step 3: Start services with production settings

```bash
# Use production docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

## Configuration

### Backend Configuration

Edit configuration in `src/core/config.py` or via environment variables:

```python
# Point Cloud Processing
MAX_DEPTH = 10.0        # meters
MIN_DEPTH = 0.1         # meters
VOXEL_SIZE = 0.01       # meters

# Validator Agent
MAX_DRAFT = 15.0        # meters
MIN_POINTS = 1000       # minimum point cloud size
CONFIDENCE_THRESHOLD = 0.85

# Vector Computer
STEP_SIZE = 0.1         # meters
SAFETY_MARGIN = 0.2     # meters

# G-Code Generator
SAFE_HEIGHT = 2.0       # meters
FEED_RATE = 100.0       # mm/min
```

### Frontend Configuration

Edit `frontend/vite.config.js` or environment variables:

```javascript
{
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://backend:5000',
      '/ws': 'ws://backend:5000'
    }
  }
}
```

## Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:5000/api/v1/health

# Check system state
curl http://localhost:5000/api/v1/state
```

### Logs

```bash
# Docker logs
docker-compose logs backend
docker-compose logs frontend

# Application logs
tail -f logs/freq_ai.log
```

### Metrics

Monitor these key metrics:
- CPU usage
- Memory usage
- Response time
- Error rate
- Cycle completion time

## Backup and Recovery

### Data Backup

```bash
# Backup data directory
tar -czf freq_backup_$(date +%Y%m%d).tar.gz data/ logs/

# Backup database (if using one)
# Add database backup commands here
```

### Recovery

```bash
# Stop services
docker-compose down

# Restore data
tar -xzf freq_backup_YYYYMMDD.tar.gz

# Restart services
docker-compose up -d
```

## Troubleshooting

### Backend won't start

```bash
# Check logs
docker-compose logs backend

# Check Python dependencies
pip install -r requirements.txt

# Verify Python version
python --version  # Should be 3.11+
```

### Frontend build fails

```bash
# Clear cache
cd frontend
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+
```

### Connection refused

```bash
# Check if services are running
docker-compose ps

# Check network connectivity
docker network ls
docker network inspect freq_freq-network

# Verify ports are not in use
netstat -tulpn | grep 5000
netstat -tulpn | grep 80
```

### Out of memory

```bash
# Increase Docker memory limit
# Edit Docker Desktop settings or daemon.json

# Or use swap
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## Scaling

### Horizontal Scaling

For high-traffic deployments:

1. Deploy multiple backend instances
2. Use load balancer (Nginx, HAProxy)
3. Implement session affinity for WebSocket

```yaml
# docker-compose.scale.yml
services:
  backend:
    deploy:
      replicas: 3
```

```bash
docker-compose up --scale backend=3
```

### Vertical Scaling

- Increase CPU cores
- Add more RAM
- Use GPU acceleration for point cloud processing

## Security Checklist

- [ ] Change default passwords
- [ ] Enable SSL/TLS
- [ ] Configure firewall rules
- [ ] Implement authentication
- [ ] Enable audit logging
- [ ] Regular security updates
- [ ] Backup encryption
- [ ] Network segmentation

## Maintenance

### Updates

```bash
# Pull latest changes
git pull origin main

# Rebuild containers
docker-compose build

# Restart with new images
docker-compose up -d
```

### Database Cleanup (if applicable)

```bash
# Clean old logs
find logs/ -name "*.log" -mtime +30 -delete

# Clean old data files
find data/ -name "*.tmp" -mtime +7 -delete
```

## Support

For issues and support:
- GitHub Issues: https://github.com/dre-architect/freq/issues
- Documentation: https://github.com/dre-architect/freq/docs
- Email: support@freq-ai.example.com
