"""
Tests for G-Code Translator Agent
"""

from src.agents.gcode_translator_agent import GCodeTranslatorAgent


class TestGCodeTranslatorAgent:
    def test_initialization(self):
        """Test agent initialization."""
        agent = GCodeTranslatorAgent()
        assert agent.config["crane_type"] == "generic"
        assert agent.config["unit_scale"] == 1000.0

    def test_translate_to_gcode(self):
        """Test G-Code translation."""
        agent = GCodeTranslatorAgent()

        vectors = [
            {"x": 0.0, "y": 0.0, "z": 2.0},
            {"x": 1.0, "y": 0.0, "z": 1.5},
            {"x": 1.0, "y": 0.0, "z": 0.5},
        ]

        geometry_data = {"draft": 3.0, "trim": 0.5, "heel": -0.2}

        gcode = agent.translate_to_gcode(vectors, geometry_data)

        assert isinstance(gcode, str)
        assert "G21" in gcode  # Millimeters
        assert "G90" in gcode  # Absolute positioning
        assert "G28" in gcode  # Home
        assert "M2" in gcode  # End program

    def test_validate_syntax(self):
        """Test G-Code syntax validation."""
        agent = GCodeTranslatorAgent()

        valid_gcode = "G21\nG90\nG28\nG1 X100 Y100 Z50\nM2"
        assert agent.validate_syntax(valid_gcode) is True

        invalid_gcode = "G21\nG90\nXYZ123\nM2"  # Invalid command
        assert agent.validate_syntax(invalid_gcode) is False

    def test_add_dwell_time(self):
        """Test dwell time addition."""
        agent = GCodeTranslatorAgent()

        gcode = "G21\nG1 Z100\nG1 X50"
        modified = agent.add_dwell_time(gcode, 500)

        assert "G4 P500" in modified

    def test_gcode_contains_safety_commands(self):
        """Test that generated G-Code contains safety commands."""
        agent = GCodeTranslatorAgent()

        vectors = [{"x": 1.0, "y": 1.0, "z": 1.0}]
        geometry_data = {"draft": 2.0, "trim": 0.0, "heel": 0.0}

        gcode = agent.translate_to_gcode(vectors, geometry_data)

        # Check for safety sequences
        assert "G28" in gcode  # Home command
        assert "M2" in gcode  # Program end
        assert "G0 Z2000" in gcode or "safe" in gcode.lower()
