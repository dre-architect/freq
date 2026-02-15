"""
G-Code Translator Agent - Translates vectors into crane-specific G-Code
Handles crane-specific command syntax and optimization
"""

import logging
from typing import Dict, Any, List


class GCodeTranslatorAgent:
    """
    Translates movement vectors into crane-specific G-Code.

    Responsibilities:
    - Convert vectors to G-Code commands
    - Apply crane-specific constraints
    - Optimize G-Code for target crane controller
    - Add metadata and comments
    """

    def __init__(self, config: Dict[str, Any] = None):
        """
        Initialize the G-Code Translator Agent.

        Args:
            config: Configuration for G-Code translation
        """
        self.config = config or {
            "crane_type": "generic",
            "coordinate_system": "cartesian",
            "unit_scale": 1000.0,  # Convert meters to millimeters
            "add_comments": True,
        }
        self.logger = logging.getLogger(__name__)
        self.logger.info("G-Code Translator Agent initialized")

    def translate_to_gcode(
        self, vectors: List[Dict[str, float]], geometry_data: Dict[str, Any]
    ) -> str:
        """
        Translate movement vectors to G-Code.

        Args:
            vectors: List of movement vectors
            geometry_data: Geometry information for metadata

        Returns:
            Complete G-Code program as string
        """
        self.logger.info("Translating vectors to G-Code")

        gcode_lines = self._generate_header(geometry_data)
        gcode_lines.extend(self._generate_initialization())
        gcode_lines.extend(self._translate_vectors(vectors))
        gcode_lines.extend(self._generate_footer())

        gcode = "\n".join(gcode_lines)
        self.logger.info(f"Translation complete: {len(gcode_lines)} lines")

        return gcode

    def _generate_header(self, geometry_data: Dict[str, Any]) -> List[str]:
        """Generate G-Code header with metadata."""
        header = [
            "; FREQ AI - Autonomous Barge Drafting System",
            "; G-Code Translator Agent v4.0",
            f"; Crane Type: {self.config['crane_type']}",
            f"; Draft: {geometry_data.get('draft', 0.0):.3f}m",
            f"; Trim: {geometry_data.get('trim', 0.0):.3f}°",
            f"; Heel: {geometry_data.get('heel', 0.0):.3f}°",
            ";",
        ]
        return header

    def _generate_initialization(self) -> List[str]:
        """Generate initialization G-Code commands."""
        init = [
            "G21  ; Set units to millimeters",
            "G90  ; Absolute positioning",
            "G94  ; Feed rate per minute",
            "G28  ; Home all axes",
            "G92 X0 Y0 Z0  ; Set current position as origin",
            "",
        ]
        return init

    def _translate_vectors(self, vectors: List[Dict[str, float]]) -> List[str]:
        """Translate movement vectors to G-Code commands."""
        commands = []
        scale = self.config["unit_scale"]

        for i, vector in enumerate(vectors):
            x = vector.get("x", 0.0) * scale
            y = vector.get("y", 0.0) * scale
            z = vector.get("z", 0.0) * scale

            if self.config["add_comments"]:
                commands.append(f"; Waypoint {i+1}")

            # Use G0 for rapid positioning or G1 for controlled feed
            if i == 0:
                commands.append(f"G0 X{x:.3f} Y{y:.3f} Z{z:.3f}  ; Rapid to start")
            else:
                commands.append(f"G1 X{x:.3f} Y{y:.3f} Z{z:.3f}  ; Linear move")

        commands.append("")
        return commands

    def _generate_footer(self) -> List[str]:
        """Generate G-Code footer with cleanup commands."""
        footer = [
            "; Return to safe position",
            "G0 Z2000.0  ; Lift to safe height",
            "G28  ; Return home",
            "",
            "; End of program",
            "M2   ; Program end",
        ]
        return footer

    def add_dwell_time(self, gcode: str, dwell_ms: int) -> str:
        """
        Add dwell time commands to G-Code.

        Args:
            gcode: Input G-Code
            dwell_ms: Dwell time in milliseconds

        Returns:
            Modified G-Code with dwell commands
        """
        self.logger.debug(f"Adding dwell time: {dwell_ms}ms")

        # Insert dwell commands at strategic points
        lines = gcode.split("\n")
        modified_lines = []

        for line in lines:
            modified_lines.append(line)
            if "G1" in line and "Z" in line:
                # Add dwell after Z-axis movements
                modified_lines.append(f"G4 P{dwell_ms}  ; Dwell for stabilization")

        return "\n".join(modified_lines)

    def optimize_for_crane(self, gcode: str) -> str:
        """
        Optimize G-Code for specific crane controller.

        Args:
            gcode: Input G-Code

        Returns:
            Optimized G-Code
        """
        self.logger.debug(f"Optimizing for crane type: {self.config['crane_type']}")

        # Scaffold - crane-specific optimizations would go here
        # Could include:
        # - Command substitution for proprietary syntax
        # - Axis remapping
        # - Speed profile optimization

        return gcode

    def validate_syntax(self, gcode: str) -> bool:
        """
        Validate G-Code syntax.

        Args:
            gcode: G-Code to validate

        Returns:
            True if valid, False otherwise
        """
        self.logger.debug("Validating G-Code syntax")

        lines = gcode.split("\n")
        valid_commands = {"G0", "G1", "G4", "G21", "G28", "G90", "G92", "G94", "M2"}

        for line in lines:
            line = line.strip()
            if not line or line.startswith(";"):
                continue

            # Check if line starts with a valid command
            command = line.split()[0]
            if command not in valid_commands:
                self.logger.warning(f"Unknown command: {command}")
                return False

        return True
