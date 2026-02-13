# FREQ AI - Lattice Core Architecture

## Overview

FREQ AI v4.0 implements the **Lattice Core** architecture, a distributed, agent-based system designed for high-efficiency autonomous barge drafting operations. The system reduces drafting time from 4 hours to 15 minutes using RGB-D Computer Vision instead of traditional LiDAR sensors.

## Architecture Principles

### 1. Lattice Core Design

The Lattice Core is the central orchestration layer that coordinates all system components:

```
┌─────────────────────────────────────────────────────────┐
│                    Lattice Core                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Agent Registry & Lifecycle Management          │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Data Flow Orchestration                        │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  State Management & Event Bus                   │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Key Features:**
- **Decentralized Processing**: Each agent operates independently
- **Event-Driven**: Asynchronous communication between components
- **Fault Tolerant**: Graceful degradation and recovery
- **Scalable**: Horizontal scaling of agent instances

### 2. Agent-Based Processing Pipeline

The system employs three specialized agents that form a processing pipeline:

```
RGB-D Input → Point Cloud → Geometry → Vectors → G-Code
              ↓             ↓          ↓          ↓
         [Validator]   [Validator] [Vector]  [Translator]
                                   [Computer]
```

#### 2.1 Validator Agent
- **Purpose**: Data quality assurance and safety validation
- **Responsibilities**:
  - Point cloud data validation
  - Geometric measurement verification
  - Safety constraint checking
  - Confidence assessment
- **Input**: Raw sensor data, geometry data, G-Code
- **Output**: Validation results (pass/fail + confidence scores)

#### 2.2 Vector Computer Agent
- **Purpose**: Movement path computation and optimization
- **Responsibilities**:
  - Calculate crane movement vectors from geometry
  - Path optimization for efficiency
  - Trim/heel compensation
  - Safety margin application
- **Input**: Validated geometry data
- **Output**: Optimized movement vectors

#### 2.3 G-Code Translator Agent
- **Purpose**: Hardware-specific code generation
- **Responsibilities**:
  - Vector-to-G-Code translation
  - Crane-specific command syntax
  - Command optimization
  - Metadata injection
- **Input**: Movement vectors, geometry metadata
- **Output**: Executable G-Code for crane controller

### 3. Core Processing Modules

#### 3.1 Point Cloud Processor
Converts RGB-D sensor data into structured 3D point clouds:

```python
RGB-D Frame → Depth Map Processing → 3D Points → Filtering → Geometry Extraction
```

**Capabilities:**
- Multi-frame fusion
- Outlier removal
- Voxel-based downsampling
- Geometric feature extraction

#### 3.2 G-Code Generator
Produces optimized G-Code for crane operations:

```
Vectors → Command Generation → Optimization → Validation → Output
```

**Features:**
- Industry-standard G-Code (ISO 6983)
- Safety sequences (homing, safe height)
- Feed rate optimization
- Collision avoidance

## System Components

### Backend (Python)

```
/src
├── agents/
│   ├── validator_agent.py       # Data validation
│   ├── vector_computer_agent.py # Path computation
│   └── gcode_translator_agent.py # G-Code generation
├── core/
│   ├── lattice_core.py          # Central orchestration
│   ├── point_cloud_processor.py # RGB-D processing
│   └── gcode_generator.py       # G-Code generation
└── interface/
    ├── api.py                   # REST API
    └── websocket_handler.py     # Real-time updates
```

### Frontend (React + CesiumJS)

```
/frontend/src
├── components/
│   ├── CesiumViewer.jsx        # 3D visualization
│   └── Dashboard.jsx           # Control panel
└── services/
    └── FreqAPIService.js       # Backend communication
```

## Data Flow

### Complete Drafting Cycle

1. **RGB-D Capture**: Computer vision system captures RGB-D frame
2. **Point Cloud Generation**: Depth map converted to 3D points
3. **Validation (Stage 1)**: Point cloud quality checked
4. **Geometry Extraction**: Barge draft, trim, heel computed
5. **Validation (Stage 2)**: Geometry measurements verified
6. **Vector Computation**: Crane movement path calculated
7. **Path Optimization**: Trajectory smoothing and safety margins
8. **G-Code Translation**: Vectors converted to crane commands
9. **Validation (Stage 3)**: Safety constraints verified
10. **Execution**: G-Code sent to crane controller

### Real-Time Updates

The Digital Shadow dashboard receives real-time updates via WebSocket:
- Point cloud visualization
- System state changes
- Progress notifications
- Alert messages

## Technology Stack

### Backend
- **Language**: Python 3.11+
- **Core Libraries**: NumPy, SciPy
- **Future Extensions**: Open3D, OpenCV, Flask

### Frontend
- **Framework**: React 18
- **3D Engine**: CesiumJS (WebGL-based)
- **Build Tool**: Vite
- **State Management**: React Hooks

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions
- **Web Server**: Nginx (production)

## Performance Characteristics

### Target Metrics
- **Cycle Time**: 15 minutes (vs. 4 hours manual)
- **Accuracy**: ±5mm draft measurement
- **Latency**: <100ms point cloud processing
- **Throughput**: 30Hz RGB-D frame processing

### Scalability
- **Horizontal**: Multiple agent instances per type
- **Vertical**: GPU acceleration for point cloud processing
- **Distributed**: Multi-crane coordination

## Security Considerations

1. **Input Validation**: All sensor data validated before processing
2. **Safety Constraints**: Hard-coded limits on crane movements
3. **Fail-Safe**: Automatic shutdown on validation failures
4. **Audit Trail**: All operations logged with timestamps

## Deployment Architecture

```
┌─────────────────┐
│   Load Balancer │
└────────┬────────┘
         │
    ┌────┴────┐
    │  Nginx  │ (Frontend)
    └────┬────┘
         │
    ┌────┴────────────────┐
    │                     │
┌───┴───┐          ┌─────┴──────┐
│ React │          │   Python   │
│  App  │◄────────►│  Backend   │
└───────┘ REST/WS  └────────────┘
                           │
                    ┌──────┴──────┐
                    │   Sensors   │
                    │   (RGB-D)   │
                    └─────────────┘
```

## Future Enhancements

### Phase 2 Features
- Machine learning-based geometry prediction
- Multi-barge coordination
- Predictive maintenance
- Advanced collision avoidance

### Phase 3 Features
- Edge computing deployment
- 5G connectivity
- Digital twin simulation
- Autonomous fleet management

## References

- G-Code Standard: ISO 6983
- Point Cloud Library: [Open3D Documentation](https://www.open3d.org/)
- CesiumJS: [Cesium Platform](https://cesium.com/)
- Docker Best Practices: [Docker Documentation](https://docs.docker.com/)
