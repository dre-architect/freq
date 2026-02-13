"""
FREQ AI REST API
Provides HTTP endpoints for the Digital Shadow dashboard
"""

import logging
from typing import Dict, Any
from datetime import datetime

from ..core.lattice_core import LatticeCore
from ..core.point_cloud_processor import PointCloudProcessor
from ..core.gcode_generator import GCodeGenerator
from ..agents.validator_agent import ValidatorAgent
from ..agents.vector_computer_agent import VectorComputerAgent
from ..agents.gcode_translator_agent import GCodeTranslatorAgent


class FreqAPI:
    """
    REST API for FREQ AI system.
    
    Provides endpoints for:
    - Starting drafting cycles
    - Retrieving system state
    - Uploading RGB-D data
    - Downloading generated G-Code
    """
    
    def __init__(self, config: Dict[str, Any] = None):
        """
        Initialize the FREQ API.
        
        Args:
            config: API configuration
        """
        self.config = config or {}
        self.logger = logging.getLogger(__name__)
        
        # Initialize core system
        self.lattice_core = LatticeCore(config.get('core', {}))
        
        # Initialize processors
        self.point_cloud_processor = PointCloudProcessor(config.get('processor', {}))
        self.gcode_generator = GCodeGenerator(config.get('gcode', {}))
        
        # Initialize agents
        self.validator = ValidatorAgent(config.get('validator', {}))
        self.vector_computer = VectorComputerAgent(config.get('vector_computer', {}))
        self.gcode_translator = GCodeTranslatorAgent(config.get('gcode_translator', {}))
        
        # Register agents with core
        self.lattice_core.register_agent('validator', self.validator)
        self.lattice_core.register_agent('vector_computer', self.vector_computer)
        self.lattice_core.register_agent('gcode_translator', self.gcode_translator)
        
        self.logger.info("FREQ API initialized")
    
    def process_drafting_cycle(self, rgbd_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process a complete drafting cycle.
        
        Args:
            rgbd_data: RGB-D sensor data
            
        Returns:
            Dictionary containing results and generated G-Code
        """
        self.logger.info("Processing drafting cycle")
        
        try:
            # Step 1: Process RGB-D data into point cloud
            point_cloud = self.point_cloud_processor.process_rgbd_frame(
                rgbd_data.get('rgb', []),
                rgbd_data.get('depth', []),
                rgbd_data.get('camera_intrinsics', {})
            )
            
            # Step 2: Validate point cloud
            is_valid, message = self.validator.validate_point_cloud(point_cloud)
            if not is_valid:
                return {
                    'success': False,
                    'error': message,
                    'timestamp': datetime.now().isoformat()
                }
            
            # Step 3: Extract geometry
            geometry_data = self.point_cloud_processor.extract_barge_geometry(point_cloud)
            
            # Step 4: Validate geometry
            is_valid, message = self.validator.validate_geometry(geometry_data)
            if not is_valid:
                return {
                    'success': False,
                    'error': message,
                    'timestamp': datetime.now().isoformat()
                }
            
            # Step 5: Compute movement vectors
            vectors = self.vector_computer.compute_movement_vectors(geometry_data)
            vectors = self.vector_computer.optimize_path(vectors)
            vectors = self.vector_computer.apply_safety_margins(vectors)
            
            # Step 6: Translate to G-Code
            gcode = self.gcode_translator.translate_to_gcode(vectors, geometry_data)
            
            # Step 7: Validate G-Code
            is_valid, message = self.validator.validate_safety_constraints(gcode)
            if not is_valid:
                return {
                    'success': False,
                    'error': message,
                    'timestamp': datetime.now().isoformat()
                }
            
            # Step 8: Update core state
            result = self.lattice_core.start_drafting_cycle({
                'geometry': geometry_data,
                'vectors': vectors,
                'gcode': gcode
            })
            
            return {
                'success': True,
                'cycle_id': result['cycle_id'],
                'geometry': geometry_data,
                'gcode': gcode,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Error processing drafting cycle: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def get_system_state(self) -> Dict[str, Any]:
        """
        Get current system state.
        
        Returns:
            Dictionary containing system state
        """
        return self.lattice_core.get_state()
    
    def health_check(self) -> Dict[str, Any]:
        """
        Perform system health check.
        
        Returns:
            Dictionary containing health status
        """
        return {
            'status': 'healthy',
            'version': '4.0.0',
            'timestamp': datetime.now().isoformat()
        }
