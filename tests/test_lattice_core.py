"""
Tests for Lattice Core
"""

import pytest
from src.core.lattice_core import LatticeCore


class TestLatticeCore:
    def test_initialization(self):
        """Test that Lattice Core initializes correctly."""
        core = LatticeCore()
        assert core.state['status'] == 'initialized'
        assert core.state['cycles_completed'] == 0
    
    def test_agent_registration(self):
        """Test agent registration."""
        core = LatticeCore()
        
        class MockAgent:
            pass
        
        agent = MockAgent()
        core.register_agent('test_agent', agent)
        
        assert 'test_agent' in core.agents
        assert core.agents['test_agent'] is agent
    
    def test_get_state(self):
        """Test state retrieval."""
        core = LatticeCore()
        state = core.get_state()
        
        assert isinstance(state, dict)
        assert 'status' in state
        assert 'start_time' in state
        assert 'cycles_completed' in state
    
    def test_start_drafting_cycle(self):
        """Test starting a drafting cycle."""
        core = LatticeCore()
        
        input_data = {
            'rgb': [],
            'depth': [],
            'camera_intrinsics': {}
        }
        
        result = core.start_drafting_cycle(input_data)
        
        assert result['status'] == 'success'
        assert result['cycle_id'] == 1
        assert core.state['cycles_completed'] == 1
    
    def test_shutdown(self):
        """Test graceful shutdown."""
        core = LatticeCore()
        core.shutdown()
        
        assert core.state['status'] == 'shutdown'
