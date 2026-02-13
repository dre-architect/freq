"""
Tests for Vector Computer Agent
"""

import pytest
from src.agents.vector_computer_agent import VectorComputerAgent


class TestVectorComputerAgent:
    def test_initialization(self):
        """Test agent initialization."""
        agent = VectorComputerAgent()
        assert agent.config['step_size'] == 0.1
        assert agent.config['safety_margin'] == 0.2
    
    def test_compute_movement_vectors(self):
        """Test movement vector computation."""
        agent = VectorComputerAgent()
        
        geometry_data = {
            'draft': 3.0,
            'trim': 0.5,
            'heel': -0.3
        }
        
        vectors = agent.compute_movement_vectors(geometry_data)
        
        assert isinstance(vectors, list)
        assert len(vectors) > 0
        assert all('x' in v and 'y' in v and 'z' in v for v in vectors)
    
    def test_optimize_path(self):
        """Test path optimization."""
        agent = VectorComputerAgent()
        
        input_vectors = [
            {'x': 0.0, 'y': 0.0, 'z': 0.0},
            {'x': 1.0, 'y': 1.0, 'z': 1.0},
            {'x': 2.0, 'y': 2.0, 'z': 2.0}
        ]
        
        optimized = agent.optimize_path(input_vectors)
        
        assert isinstance(optimized, list)
        assert len(optimized) == len(input_vectors)
    
    def test_compute_compensation_vectors(self):
        """Test compensation vector computation."""
        agent = VectorComputerAgent()
        
        geometry_data = {
            'draft': 3.0,
            'trim': 2.0,
            'heel': 1.5
        }
        
        compensation = agent.compute_compensation_vectors(geometry_data)
        
        assert isinstance(compensation, dict)
        assert 'x_offset' in compensation
        assert 'y_offset' in compensation
        assert 'z_offset' in compensation
    
    def test_apply_safety_margins(self):
        """Test safety margin application."""
        agent = VectorComputerAgent()
        
        vectors = [
            {'x': 1.0, 'y': 1.0, 'z': 1.0},
            {'x': 2.0, 'y': 2.0, 'z': 2.0}
        ]
        
        safe_vectors = agent.apply_safety_margins(vectors)
        
        # Z values should be increased by safety margin
        for original, safe in zip(vectors, safe_vectors):
            assert safe['z'] > original['z']
    
    def test_calculate_distance(self):
        """Test distance calculation."""
        agent = VectorComputerAgent()
        
        v1 = {'x': 0.0, 'y': 0.0, 'z': 0.0}
        v2 = {'x': 3.0, 'y': 4.0, 'z': 0.0}
        
        distance = agent.calculate_distance(v1, v2)
        
        assert distance == 5.0  # 3-4-5 triangle
