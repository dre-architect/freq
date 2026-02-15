"""
Tests for Validator Agent
"""

from src.agents.validator_agent import ValidatorAgent


class TestValidatorAgent:
    def test_initialization(self):
        """Test agent initialization."""
        agent = ValidatorAgent()
        assert agent.config["max_draft"] == 15.0
        assert agent.config["min_points"] == 1000

    def test_validate_point_cloud_insufficient_points(self):
        """Test validation fails with insufficient points."""
        agent = ValidatorAgent()

        point_cloud = {
            "num_points": 500,
            "points": [],
            "colors": [],
            "timestamp": "2024-01-01T00:00:00",
        }

        is_valid, message = agent.validate_point_cloud(point_cloud)

        assert not is_valid
        assert "Insufficient points" in message

    def test_validate_point_cloud_missing_field(self):
        """Test validation fails with missing required field."""
        agent = ValidatorAgent()

        point_cloud = {
            "num_points": 5000,
            "points": [],
            # Missing 'colors' and 'timestamp'
        }

        is_valid, message = agent.validate_point_cloud(point_cloud)

        assert not is_valid
        assert "Missing required field" in message

    def test_validate_point_cloud_success(self):
        """Test successful point cloud validation."""
        agent = ValidatorAgent()

        point_cloud = {
            "num_points": 5000,
            "points": [],
            "colors": [],
            "timestamp": "2024-01-01T00:00:00",
        }

        is_valid, message = agent.validate_point_cloud(point_cloud)

        assert is_valid
        assert "validation passed" in message.lower()

    def test_validate_geometry_excessive_draft(self):
        """Test validation fails with excessive draft."""
        agent = ValidatorAgent()

        geometry = {"draft": 20.0, "trim": 0.0, "heel": 0.0}  # Exceeds max_draft of 15.0

        is_valid, message = agent.validate_geometry(geometry)

        assert not is_valid
        assert "Draft out of range" in message

    def test_validate_geometry_excessive_trim(self):
        """Test validation fails with excessive trim."""
        agent = ValidatorAgent()

        geometry = {"draft": 5.0, "trim": 15.0, "heel": 0.0}  # Exceeds 10 degrees

        is_valid, message = agent.validate_geometry(geometry)

        assert not is_valid
        assert "trim angle" in message.lower()

    def test_validate_geometry_success(self):
        """Test successful geometry validation."""
        agent = ValidatorAgent()

        geometry = {"draft": 5.0, "trim": 2.0, "heel": 1.0}

        is_valid, message = agent.validate_geometry(geometry)

        assert is_valid

    def test_validate_safety_constraints_missing_home(self):
        """Test safety validation fails without home command."""
        agent = ValidatorAgent()

        gcode = "G21\nG90\nG1 X10 Y10\nM2"

        is_valid, message = agent.validate_safety_constraints(gcode)

        assert not is_valid
        assert "G28" in message

    def test_validate_safety_constraints_success(self):
        """Test successful safety validation."""
        agent = ValidatorAgent()

        gcode = "G21\nG90\nG28\nG1 X10 Y10\nM2"

        is_valid, message = agent.validate_safety_constraints(gcode)

        assert is_valid
