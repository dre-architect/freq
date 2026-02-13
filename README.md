# FREQ AI v4.0

**Autonomous Barge Drafting System**

High-efficiency barge drafting core using RGB-D Computer Vision. Reduces drafting time from 4 hours to 15 minutes through automated crane operations orchestrated via the Lattice Core architecture.

[![CI/CD](https://github.com/dre-architect/freq/workflows/FREQ%20AI%20CI/CD/badge.svg)](https://github.com/dre-architect/freq/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Features

- **RGB-D Computer Vision**: Uses affordable RGB-D cameras instead of expensive LiDAR
- **15-Minute Cycles**: Reduces traditional 4-hour drafting operations to 15 minutes
- **Lattice Core Architecture**: Modular, agent-based system for maximum flexibility
- **Digital Shadow Dashboard**: Real-time 3D visualization using React + CesiumJS
- **Autonomous Operation**: End-to-end automation from sensor input to crane G-Code
- **Safety First**: Multiple validation stages and safety constraints

## 📋 System Overview

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────┐
│   RGB-D     │─────▶│  Lattice Core    │─────▶│   Crane     │
│   Camera    │      │  • Validator     │      │  Controller │
└─────────────┘      │  • Vector Comp   │      └─────────────┘
                     │  • G-Code Trans  │
                     └──────────────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │ Digital Shadow   │
                     │   Dashboard      │
                     └──────────────────┘
```

### Architecture Components

**Backend (Python)**
- **Lattice Core**: Central orchestration system
- **Point Cloud Processor**: RGB-D data processing
- **Validator Agent**: Data quality and safety validation
- **Vector Computer Agent**: Movement path computation
- **G-Code Translator Agent**: Crane command generation

**Frontend (React + CesiumJS)**
- **3D Visualization**: Real-time point cloud display
- **Control Dashboard**: System monitoring and control
- **Live Metrics**: Draft, trim, heel measurements
- **System Logs**: Real-time event streaming

## 🏗️ Project Structure

```
freq/
├── src/
│   ├── agents/              # Specialized processing agents
│   │   ├── validator_agent.py
│   │   ├── vector_computer_agent.py
│   │   └── gcode_translator_agent.py
│   ├── core/                # Core processing modules
│   │   ├── lattice_core.py
│   │   ├── point_cloud_processor.py
│   │   └── gcode_generator.py
│   └── interface/           # API and communication
│       ├── api.py
│       └── websocket_handler.py
├── frontend/                # React + CesiumJS dashboard
│   ├── src/
│   │   ├── components/
│   │   └── services/
│   └── public/
├── tests/                   # Test suite
├── docs/                    # Documentation
│   ├── LATTICE_CORE_ARCHITECTURE.md
│   ├── API.md
│   └── DEPLOYMENT.md
├── docker-compose.yml       # Container orchestration
├── Dockerfile              # Backend container
└── requirements.txt        # Python dependencies
```

## 🚦 Quick Start

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dre-architect/freq.git
   cd freq
   ```

2. **Start the system**
   ```bash
   docker-compose up -d
   ```

3. **Access the dashboard**
   - Frontend: http://localhost
   - API: http://localhost:5000/api/v1
   - Health Check: http://localhost:5000/api/v1/health

### Development Setup

**Backend**
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run backend
python main.py
```

**Frontend**
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📊 Usage

### Start a Drafting Cycle

**Via Python:**
```python
from src.interface.api import FreqAPI
import numpy as np

api = FreqAPI()

# Prepare RGB-D data
rgbd_data = {
    'rgb': np.zeros((480, 640, 3)),
    'depth': np.zeros((480, 640)),
    'camera_intrinsics': {
        'fx': 525.0,
        'fy': 525.0,
        'cx': 319.5,
        'cy': 239.5
    }
}

# Process cycle
result = api.process_drafting_cycle(rgbd_data)
print(result)
```

**Via REST API:**
```bash
curl -X POST http://localhost:5000/api/v1/cycle/start \
  -H "Content-Type: application/json" \
  -d @rgbd_data.json
```

### Monitor System State

```bash
# Check health
curl http://localhost:5000/api/v1/health

# Get system state
curl http://localhost:5000/api/v1/state
```

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test
pytest tests/test_lattice_core.py
```

## 📖 Documentation

- [Lattice Core Architecture](docs/LATTICE_CORE_ARCHITECTURE.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 🔧 Configuration

### Backend Configuration

Edit environment variables or configuration files:

```bash
# .env file
LOG_LEVEL=INFO
MAX_DRAFT=15.0
MIN_POINTS=1000
CONFIDENCE_THRESHOLD=0.85
```

### Frontend Configuration

```javascript
// frontend/vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
}
```

## 🐳 Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔒 Security

- Input validation at multiple stages
- Safety constraints enforcement
- Automated shutdown on validation failures
- Comprehensive audit logging
- See [Security Guidelines](docs/SECURITY.md) for details

## 🛣️ Roadmap

**Phase 1 (Current)** ✅
- RGB-D point cloud processing
- Basic agent pipeline
- G-Code generation
- Digital Shadow dashboard
- Docker deployment

**Phase 2**
- Machine learning-based predictions
- Multi-barge coordination
- Advanced collision avoidance
- GPU acceleration

**Phase 3**
- Edge computing deployment
- Digital twin simulation
- Autonomous fleet management
- Predictive maintenance

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## 📧 Contact

- **Project Lead**: FREQ AI Team
- **Email**: support@freq-ai.example.com
- **Issues**: https://github.com/dre-architect/freq/issues

## 🙏 Acknowledgments

- Computer Vision: RGB-D processing techniques
- G-Code Standard: ISO 6983
- 3D Visualization: CesiumJS platform
- Container Orchestration: Docker

---

**FREQ AI v4.0** - Revolutionizing barge drafting through autonomous computer vision and intelligent crane orchestration.
