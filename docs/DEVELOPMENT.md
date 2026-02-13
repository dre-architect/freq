# FREQ AI - Development Guide

## Getting Started

This guide will help you set up your development environment and understand the development workflow for FREQ AI.

## Development Environment Setup

### Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- npm 9 or higher
- Git
- Docker Desktop (optional, for containerized development)
- Visual Studio Code (recommended) or your preferred IDE

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/dre-architect/freq.git
   cd freq
   ```

2. **Set up Python virtual environment**
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate (Linux/Mac)
   source venv/bin/activate
   
   # Activate (Windows)
   venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   pip install -e .  # Install in editable mode
   ```

3. **Set up frontend**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

## Project Structure

### Backend (`/src`)

```
src/
├── agents/           # Specialized processing agents
├── core/            # Core business logic
└── interface/       # API and communication layers
```

**Key Files:**
- `main.py` - Application entry point
- `pyproject.toml` - Project metadata and dependencies
- `requirements.txt` - Python dependencies

### Frontend (`/frontend`)

```
frontend/
├── src/
│   ├── components/  # React components
│   ├── services/   # API services
│   └── main.jsx    # Entry point
├── public/         # Static assets
└── index.html      # HTML template
```

## Development Workflow

### Running the Backend

```bash
# Activate virtual environment
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Run the application
python main.py

# Or with hot reload (requires additional setup)
# uvicorn src.interface.api:app --reload
```

Backend will start at: http://localhost:5000

### Running the Frontend

```bash
cd frontend

# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Frontend will start at: http://localhost:3000 (dev mode)

### Running Both (Development Mode)

**Terminal 1 - Backend:**
```bash
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm run dev
```

### Using Docker Compose

```bash
# Start both services
docker-compose up

# Rebuild after changes
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f
```

## Code Style and Standards

### Python Code Style

We use [Black](https://black.readthedocs.io/) for code formatting and [Flake8](https://flake8.pycqa.org/) for linting.

```bash
# Format code
black src/ tests/

# Check formatting
black --check src/ tests/

# Lint code
flake8 src/ tests/ --max-line-length=100
```

**Configuration:** See `pyproject.toml` for Black settings

### JavaScript Code Style

We use ESLint for JavaScript/React linting.

```bash
cd frontend

# Lint code
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

**Configuration:** See `frontend/.eslintrc.json`

### Type Checking

```bash
# Python type checking with mypy
mypy src/

# TypeScript (if using TypeScript)
cd frontend
npm run type-check
```

## Testing

### Backend Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_lattice_core.py

# Run with coverage
pytest --cov=src --cov-report=html

# Run with verbose output
pytest -v

# Run specific test
pytest tests/test_lattice_core.py::TestLatticeCore::test_initialization
```

### Frontend Tests (when implemented)

```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Test Coverage

Aim for >80% test coverage. View coverage reports:

```bash
# Generate coverage report
pytest --cov=src --cov-report=html

# Open in browser
open htmlcov/index.html  # Mac/Linux
start htmlcov/index.html  # Windows
```

## Debugging

### Backend Debugging

**Using VS Code:**

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: Main",
      "type": "python",
      "request": "launch",
      "program": "${workspaceFolder}/main.py",
      "console": "integratedTerminal",
      "justMyCode": true
    },
    {
      "name": "Python: Tests",
      "type": "python",
      "request": "launch",
      "module": "pytest",
      "args": ["-v"],
      "console": "integratedTerminal",
      "justMyCode": false
    }
  ]
}
```

**Using pdb:**
```python
import pdb; pdb.set_trace()
```

### Frontend Debugging

**Browser DevTools:**
- Chrome DevTools
- React Developer Tools extension
- Redux DevTools (if using Redux)

**VS Code:**
Install "Debugger for Chrome" extension

## Common Development Tasks

### Adding a New Agent

1. Create agent file in `src/agents/`
2. Implement agent class with required methods
3. Register agent in `src/agents/__init__.py`
4. Add tests in `tests/test_new_agent.py`
5. Update documentation

### Adding a New API Endpoint

1. Add method to `src/interface/api.py`
2. Add route handler
3. Add tests
4. Update API documentation in `docs/API.md`

### Adding a New Frontend Component

1. Create component in `frontend/src/components/`
2. Import and use in parent component
3. Add tests (if applicable)
4. Update component documentation

### Updating Dependencies

**Backend:**
```bash
# Update requirements.txt
pip install --upgrade package_name
pip freeze > requirements.txt

# Or update in pyproject.toml and run
pip install -e .
```

**Frontend:**
```bash
cd frontend

# Update specific package
npm update package_name

# Update all packages
npm update

# Check for outdated packages
npm outdated
```

## Git Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test updates

### Commit Messages

Follow conventional commits:
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Test updates
- `chore` - Maintenance tasks

**Example:**
```
feat(agents): add collision detection to vector computer

Implements basic collision detection algorithm for crane path planning.
Uses bounding box intersection for initial collision checks.

Closes #123
```

### Pull Request Process

1. Create feature branch
2. Make changes
3. Add tests
4. Ensure all tests pass
5. Update documentation
6. Create pull request
7. Address review feedback
8. Merge when approved

## Performance Profiling

### Backend Profiling

```bash
# Using cProfile
python -m cProfile -o profile.stats main.py

# Analyze results
python -m pstats profile.stats
```

### Frontend Profiling

Use React DevTools Profiler or Chrome DevTools Performance tab.

## Troubleshooting

### Backend Issues

**Import errors:**
```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

**Port already in use:**
```bash
# Find process using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or use different port
```

### Frontend Issues

**Node modules issues:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Build failures:**
```bash
# Clear cache
rm -rf node_modules/.cache
npm run build
```

## Useful Commands

### Backend

```bash
# Run main application
python main.py

# Run tests
pytest

# Format code
black src/ tests/

# Type check
mypy src/

# Install new package
pip install package_name
```

### Frontend

```bash
# Start dev server
npm run dev

# Build
npm run build

# Lint
npm run lint

# Install package
npm install package_name
```

### Docker

```bash
# Build
docker-compose build

# Start
docker-compose up

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and start
docker-compose up --build
```

## Resources

### Documentation
- [Python Documentation](https://docs.python.org/)
- [React Documentation](https://react.dev/)
- [CesiumJS Documentation](https://cesium.com/docs/)
- [Docker Documentation](https://docs.docker.com/)

### Tools
- [Black](https://black.readthedocs.io/) - Python formatter
- [Flake8](https://flake8.pycqa.org/) - Python linter
- [Pytest](https://docs.pytest.org/) - Python testing
- [ESLint](https://eslint.org/) - JavaScript linter
- [Vite](https://vitejs.dev/) - Frontend build tool

## Getting Help

- Check existing documentation in `/docs`
- Search GitHub issues
- Ask in team chat
- Create new GitHub issue

## Best Practices

1. **Write tests first** (TDD approach)
2. **Keep commits small** and focused
3. **Document your code** with clear comments
4. **Follow code style** guidelines
5. **Review your own code** before submitting PR
6. **Update documentation** when changing behavior
7. **Use meaningful names** for variables and functions
8. **Handle errors gracefully**
9. **Log important events**
10. **Think about security** in every change
