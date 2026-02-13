# Contributing to FREQ AI

Thank you for your interest in contributing to FREQ AI! This document provides guidelines for contributing to the project.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and considerate in all interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [GitHub Issues](https://github.com/dre-architect/freq/issues)
2. If not, create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Python version, etc.)
   - Screenshots if applicable

### Suggesting Enhancements

1. Check existing issues and discussions
2. Create a new issue with:
   - Clear description of the enhancement
   - Use cases and benefits
   - Potential implementation approach

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Add tests** for new functionality
4. **Update documentation** as needed
5. **Ensure tests pass** (`pytest`)
6. **Submit a pull request**

## Development Setup

See [DEVELOPMENT.md](docs/DEVELOPMENT.md) for detailed setup instructions.

Quick setup:
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/freq.git
cd freq

# Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt
pip install -e .

# Run tests
pytest
```

## Coding Standards

### Python

- Follow [PEP 8](https://pep8.org/) style guide
- Use [Black](https://black.readthedocs.io/) for formatting
- Use [Flake8](https://flake8.pycqa.org/) for linting
- Write docstrings for all public methods
- Type hints encouraged

```bash
# Format code
black src/ tests/

# Lint code
flake8 src/ tests/ --max-line-length=100
```

### JavaScript/React

- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use [ESLint](https://eslint.org/) for linting
- Use meaningful component and variable names
- Write comments for complex logic

```bash
cd frontend
npm run lint
```

## Testing

### Backend Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src

# Run specific test
pytest tests/test_lattice_core.py
```

### Writing Tests

- Write tests for new features
- Maintain or improve code coverage
- Use descriptive test names
- Follow existing test patterns

Example:
```python
class TestNewFeature:
    def test_feature_works_correctly(self):
        """Test that new feature works as expected."""
        # Arrange
        agent = MyAgent()
        
        # Act
        result = agent.do_something()
        
        # Assert
        assert result == expected_value
```

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting)
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Maintenance

**Examples:**
```
feat(agents): add collision detection algorithm
fix(api): correct endpoint path for cycle status
docs(readme): update installation instructions
```

## Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Refactoring

Example: `feature/add-ml-prediction`

## Pull Request Process

1. **Update your branch** with latest main
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests** and ensure they pass
   ```bash
   pytest
   ```

3. **Update documentation** if needed

4. **Create pull request** with:
   - Descriptive title
   - Summary of changes
   - Link to related issues
   - Screenshots for UI changes

5. **Address review feedback**

6. **Squash commits** if requested

## Code Review

All contributions require code review before merging:

- At least one approval required
- All tests must pass
- Code coverage should not decrease
- Documentation updated
- No merge conflicts

## Documentation

- Update relevant documentation
- Add comments for complex code
- Update API docs for new endpoints
- Add examples where helpful

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

- Check [documentation](docs/)
- Search [existing issues](https://github.com/dre-architect/freq/issues)
- Ask in [discussions](https://github.com/dre-architect/freq/discussions)
- Email: support@freq-ai.example.com

## Recognition

Contributors will be acknowledged in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to FREQ AI! 🚀
