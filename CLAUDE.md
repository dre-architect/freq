# CLAUDE.md — Project Handoff for Claude Code

## Project Overview

**FREQ AI v4.0** is an autonomous barge drafting system that reduces traditional 4-hour manual drafting operations to 15 minutes using RGB-D computer vision and automated crane control. The system uses a "Lattice Core" agent-based architecture to orchestrate a pipeline from sensor input through validation, vector computation, and G-Code generation for crane operations.

## Repository Structure

```
freq/
├── src/                          # Python backend
│   ├── agents/                   # Specialized processing agents
│   │   ├── validator_agent.py        # Data quality + safety validation
│   │   ├── vector_computer_agent.py  # Crane movement vector computation
│   │   └── gcode_translator_agent.py # Vector-to-G-Code translation
│   ├── core/                     # Core processing modules
│   │   ├── lattice_core.py           # Central orchestration system
│   │   ├── point_cloud_processor.py  # RGB-D → 3D point cloud conversion
│   │   └── gcode_generator.py        # ISO 6983 G-Code generation
│   └── interface/                # API and communication layer
│       ├── api.py                    # REST API endpoints
│       └── websocket_handler.py      # Real-time WebSocket updates (scaffold)
├── frontend/                     # React + CesiumJS dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx         # Control panel with metrics and logs
│   │   │   └── CesiumViewer.jsx      # 3D point cloud visualization
│   │   ├── services/
│   │   │   └── FreqAPIService.js     # Axios-based backend communication
│   │   └── App.jsx                   # Main React application
│   ├── vite.config.js
│   ├── nginx.conf
│   └── package.json
├── tests/                        # pytest test suite (25 tests, 58% coverage)
├── docs/                         # Extended documentation
│   ├── LATTICE_CORE_ARCHITECTURE.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── DEVELOPMENT.md
│   └── QUICKSTART.md
├── main.py                       # Application entry point
├── pyproject.toml                # Python project config (pytest, black, flake8, mypy)
├── requirements.txt              # Python dependencies
├── Dockerfile                    # Backend container (Python 3.11)
├── docker-compose.yml            # Orchestrates backend + frontend services
└── .github/workflows/ci-cd.yml  # CI/CD pipeline
```

## Build, Test, and Lint Commands

### Backend (Python)

```bash
# Install dependencies
pip install -r requirements.txt

# Run all tests with coverage
pytest

# Run a specific test file
pytest tests/test_lattice_core.py

# Format code
black src/ tests/

# Lint code
flake8 src/ tests/ --max-line-length=100

# Type checking
mypy src/

# Run the application
python main.py
```

### Frontend (React)

```bash
cd frontend
npm install
npm run dev      # Development server
npm run build    # Production build
npm run lint     # ESLint
```

### Docker

```bash
docker-compose up -d        # Start all services
docker-compose logs -f      # View logs
docker-compose down         # Stop services
```

## Architecture: Lattice Core Pipeline

The system processes data through a sequential agent pipeline:

```
RGB-D Camera → Point Cloud Processor → Validator Agent → Vector Computer Agent → G-Code Translator Agent → Crane
```

- **Lattice Core** (`lattice_core.py`): Central orchestrator that manages agent registration, system state, and cycle execution
- **Validator Agent**: Enforces min point counts, confidence thresholds, draft limits, trim/heel angle constraints
- **Vector Computer Agent**: Computes crane movement vectors with safety margins from validated geometry
- **G-Code Translator Agent**: Produces ISO 6983-compliant G-Code with safety sequences (spindle, coolant, tool changes)

Agents communicate through the Lattice Core's shared JSON state — they never talk directly to hardware.

## Coding Conventions

- **Python style**: PEP 8, formatted with Black (line length 100), linted with Flake8
- **Test pattern**: pytest classes named `TestXxx` with methods `test_xxx`, using Arrange/Act/Assert
- **Commit messages**: Conventional Commits format — `feat(scope): description`, `fix(scope): description`
- **Branch naming**: `feature/description`, `fix/description`, `docs/description`
- **Python version**: 3.9+ (target 3.11 for production)
- **Frontend**: React 18 with JSX, Vite bundler, Airbnb-style JS conventions

## Key Configuration

- **pytest**: Configured in `pyproject.toml` under `[tool.pytest.ini_options]` — runs with `-v --cov=src --cov-report=term-missing` by default
- **Black**: Line length 100, target Python 3.9 — configured in `pyproject.toml`
- **Environment variables**: See `.env.example` for all configurable values (draft limits, safety thresholds, API ports, etc.)

## Current Implementation Status

**Fully implemented**: Lattice Core, all 3 agents, point cloud processor framework, G-Code generator, REST API skeleton, React dashboard with CesiumJS, Docker setup, CI/CD, 25 passing tests.

**Scaffold / needs integration**: WebSocket handler, actual RGB-D sensor connection, physical crane communication, Open3D point cloud filtering, Flask/FastAPI server runtime, authentication, database persistence.

## Critical Safety Directives

1. **Vision-First**: Use RGB-D / optical sensors only — no LiDAR
2. **State-First**: Agents update JSON state; they never talk directly to hardware drivers
3. **Safety validation** must occur before any crane G-Code execution
4. **Watchdog**: Must stop crane if humans are detected via computer vision
