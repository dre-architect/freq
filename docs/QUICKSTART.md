# FREQ AI - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will get FREQ AI running on your machine in under 5 minutes.

## Prerequisites

- Docker Desktop installed
- 8GB+ RAM available
- Internet connection

## Installation Steps

### 1. Clone and Start

```bash
# Clone the repository
git clone https://github.com/dre-architect/freq.git
cd freq

# Start the system
docker-compose up -d
```

### 2. Verify Installation

```bash
# Check services are running
docker-compose ps

# Should show:
# freq-ai-backend   running   0.0.0.0:5000->5000/tcp
# freq-ai-frontend  running   0.0.0.0:80->80/tcp
```

### 3. Access the Dashboard

Open your browser and navigate to:
- **Dashboard**: http://localhost
- **API**: http://localhost:5000/api/v1/health

You should see the FREQ AI Digital Shadow dashboard with:
- 3D CesiumJS viewer
- System metrics panel
- Agent status indicators
- Real-time system log

## What's Running?

### Backend (Port 5000)
- Lattice Core orchestration system
- Three processing agents:
  - Validator Agent
  - Vector Computer Agent
  - G-Code Translator Agent
- REST API at `/api/v1/`
- WebSocket endpoint at `/ws`

### Frontend (Port 80)
- React 18 application
- CesiumJS 3D visualization
- Real-time dashboard
- System monitoring interface

## Quick Test

### Test the API

```bash
# Health check
curl http://localhost:5000/api/v1/health

# Expected response:
# {
#   "status": "healthy",
#   "version": "4.0.0",
#   "timestamp": "2024-02-13T12:00:00Z"
# }
```

### Test the System

```bash
# Get system state
curl http://localhost:5000/api/v1/state

# Expected response:
# {
#   "status": "ready",
#   "start_time": "2024-02-13T10:00:00Z",
#   "cycles_completed": 0
# }
```

## Common Issues

### Port Already in Use

If ports 80 or 5000 are already in use:

```bash
# Edit docker-compose.yml and change port mappings
ports:
  - "8080:80"    # Frontend
  - "5001:5000"  # Backend
```

### Docker Issues

```bash
# Stop all containers
docker-compose down

# Remove and rebuild
docker-compose down -v
docker-compose up --build
```

### Permission Denied

On Linux, you might need to run with sudo:

```bash
sudo docker-compose up -d
```

## Next Steps

### 1. Explore the Dashboard
- Open http://localhost in your browser
- Explore the 3D visualization
- Check system metrics
- View agent status
- Monitor system logs

### 2. Try the API
- Read the [API Documentation](docs/API.md)
- Test endpoints with curl or Postman
- Explore the REST API

### 3. Development Setup
- See [Development Guide](docs/DEVELOPMENT.md)
- Set up your local environment
- Run without Docker for faster development

### 4. Learn the Architecture
- Read [Lattice Core Architecture](docs/LATTICE_CORE_ARCHITECTURE.md)
- Understand the agent pipeline
- Learn about the processing flow

## System Architecture (Simple View)

```
┌──────────────┐
│  RGB-D       │
│  Camera      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Point Cloud  │
│ Processor    │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Validator   │────▶│   Vector     │────▶│   G-Code     │
│   Agent      │     │  Computer    │     │  Translator  │
└──────────────┘     └──────────────┘     └──────────────┘
       │                     │                     │
       └─────────────────────┴─────────────────────┘
                             │
                             ▼
                    ┌──────────────┐
                    │ Crane G-Code │
                    └──────────────┘
```

## Performance Expectations

On a typical development machine:
- **Startup Time**: ~30 seconds
- **API Response**: <100ms
- **Memory Usage**: ~500MB (both services)
- **CPU Usage**: <10% at idle

## Stopping the System

```bash
# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs before stopping
docker-compose logs
```

## Getting Help

- 📖 Full documentation in `/docs`
- 🐛 Report issues on GitHub
- 💬 Check discussions
- 📧 Email support@freq-ai.example.com

## Success Checklist

- [ ] Docker containers running
- [ ] Dashboard accessible at http://localhost
- [ ] API responding at http://localhost:5000/api/v1/health
- [ ] No error messages in logs
- [ ] System status shows "ready"

If all items are checked, you're ready to go! 🎉

## What's Next?

1. **Production Deployment**: See [Deployment Guide](docs/DEPLOYMENT.md)
2. **Custom Configuration**: Edit `.env` file with your settings
3. **Development**: Set up local development environment
4. **Integration**: Connect your RGB-D cameras
5. **Customization**: Modify agents for your specific use case

## Key Features to Explore

### Digital Shadow Dashboard
- Real-time 3D visualization of barge operations
- Live metrics: draft, trim, heel
- System health monitoring
- Event log streaming

### API Endpoints
- `/api/v1/health` - Health check
- `/api/v1/state` - System state
- `/api/v1/cycle/start` - Start drafting cycle
- Full API documentation at [docs/API.md](docs/API.md)

### Agent Pipeline
1. **Validator**: Ensures data quality and safety
2. **Vector Computer**: Calculates crane movements
3. **G-Code Translator**: Generates crane commands

## Resources

- [README](README.md) - Project overview
- [API Documentation](docs/API.md) - REST API reference
- [Architecture](docs/LATTICE_CORE_ARCHITECTURE.md) - System design
- [Development](docs/DEVELOPMENT.md) - Development guide
- [Deployment](docs/DEPLOYMENT.md) - Production deployment

---

**Congratulations!** You now have FREQ AI running. Start exploring and building autonomous barge drafting solutions! 🚢
