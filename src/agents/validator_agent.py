"""
Validator Agent - Validates point cloud data and geometric measurements
Ensures data quality and safety constraints before processing
"""

import logging
from typing import Dict, Any, List, Tuple


class ValidatorAgent:
    """
    Validates input data and processing results.
    
    Responsibilities:
    - Point cloud data validation
    - Geometric measurement verification
    - Safety constraint checking
    - Data quality assessment
    """
    
    def __init__(self, config: Dict[str, Any] = None):
        """
        Initialize the Validator Agent.
        
        Args:
            config: Configuration for validation parameters
        """
        self.config = config or {
            'max_draft': 15.0,       # Maximum allowable draft in meters
            'min_points': 1000,      # Minimum points required
            'confidence_threshold': 0.85  # Minimum confidence level
        }
        self.logger = logging.getLogger(__name__)
        self.logger.info("Validator Agent initialized")
    
    def validate_point_cloud(self, point_cloud: Dict[str, Any]) -> Tuple[bool, str]:
        """
        Validate point cloud data quality.
        
        Args:
            point_cloud: Point cloud data to validate
            
        Returns:
            Tuple of (is_valid, message)
        """
        self.logger.debug("Validating point cloud")
        
        # Check minimum number of points
        num_points = point_cloud.get('num_points', 0)
        if num_points < self.config['min_points']:
            message = f"Insufficient points: {num_points} < {self.config['min_points']}"
            self.logger.warning(message)
            return False, message
        
        # Check for required fields
        required_fields = ['points', 'colors', 'timestamp']
        for field in required_fields:
            if field not in point_cloud:
                message = f"Missing required field: {field}"
                self.logger.warning(message)
                return False, message
        
        self.logger.info(f"Point cloud validated: {num_points} points")
        return True, "Point cloud validation passed"
    
    def validate_geometry(self, geometry_data: Dict[str, Any]) -> Tuple[bool, str]:
        """
        Validate geometric measurements.
        
        Args:
            geometry_data: Geometric data to validate
            
        Returns:
            Tuple of (is_valid, message)
        """
        self.logger.debug("Validating geometry")
        
        # Check draft measurement
        draft = geometry_data.get('draft', 0.0)
        if draft < 0 or draft > self.config['max_draft']:
            message = f"Draft out of range: {draft}m (max: {self.config['max_draft']}m)"
            self.logger.warning(message)
            return False, message
        
        # Check for reasonable trim and heel angles
        trim = abs(geometry_data.get('trim', 0.0))
        heel = abs(geometry_data.get('heel', 0.0))
        
        if trim > 10.0:  # More than 10 degrees
            message = f"Excessive trim angle: {trim}°"
            self.logger.warning(message)
            return False, message
        
        if heel > 10.0:  # More than 10 degrees
            message = f"Excessive heel angle: {heel}°"
            self.logger.warning(message)
            return False, message
        
        self.logger.info(f"Geometry validated: draft={draft}m, trim={trim}°, heel={heel}°")
        return True, "Geometry validation passed"
    
    def validate_safety_constraints(self, gcode: str) -> Tuple[bool, str]:
        """
        Validate safety constraints for crane operations.
        
        Args:
            gcode: G-Code to validate
            
        Returns:
            Tuple of (is_valid, message)
        """
        self.logger.debug("Validating safety constraints")
        
        # Check for required safety commands
        if 'G28' not in gcode:
            message = "Missing home command (G28)"
            self.logger.warning(message)
            return False, message
        
        # Check for proper program ending
        if 'M2' not in gcode:
            message = "Missing end program command (M2)"
            self.logger.warning(message)
            return False, message
        
        self.logger.info("Safety constraints validated")
        return True, "Safety validation passed"
    
    def assess_confidence(self, data: Dict[str, Any]) -> float:
        """
        Assess confidence level of the data.
        
        Args:
            data: Data to assess
            
        Returns:
            Confidence score (0.0 to 1.0)
        """
        self.logger.debug("Assessing data confidence")
        
        # Scaffold implementation - to be expanded with actual ML models
        confidence = 0.95
        
        if confidence < self.config['confidence_threshold']:
            self.logger.warning(f"Low confidence: {confidence}")
        
        return confidence
