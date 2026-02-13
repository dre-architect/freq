"""
FREQ AI Main Entry Point
Starts the Lattice Core system and API server
"""

import logging
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent))

from src.interface.api import FreqAPI
from src.core.lattice_core import LatticeCore


def setup_logging():
    """Configure logging for the application."""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler('freq_ai.log')
        ]
    )


def main():
    """Main entry point for FREQ AI system."""
    setup_logging()
    logger = logging.getLogger(__name__)
    
    logger.info("=" * 60)
    logger.info("FREQ AI v4.0 - Autonomous Barge Drafting System")
    logger.info("=" * 60)
    
    # Initialize the API
    config = {
        'core': {},
        'processor': {},
        'gcode': {},
        'validator': {},
        'vector_computer': {},
        'gcode_translator': {}
    }
    
    api = FreqAPI(config)
    logger.info("FREQ AI system initialized successfully")
    
    # In production, this would start Flask/FastAPI server
    # For scaffold, just demonstrate the system works
    logger.info("System ready for drafting cycles")
    logger.info("API endpoints available at /api/v1/")
    
    # Demo: Process a mock drafting cycle
    logger.info("\n--- Running demo drafting cycle ---")
    import numpy as np
    
    mock_rgbd_data = {
        'rgb': np.zeros((480, 640, 3)),
        'depth': np.zeros((480, 640)),
        'camera_intrinsics': {
            'fx': 525.0,
            'fy': 525.0,
            'cx': 319.5,
            'cy': 239.5
        }
    }
    
    result = api.process_drafting_cycle(mock_rgbd_data)
    logger.info(f"Demo cycle result: {result}")
    
    # Get system state
    state = api.get_system_state()
    logger.info(f"System state: {state}")
    
    logger.info("\nFREQ AI system demo complete")


if __name__ == "__main__":
    main()
