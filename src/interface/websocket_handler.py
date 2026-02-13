"""
WebSocket Handler for real-time communication
Provides real-time updates to the Digital Shadow dashboard
"""

import logging
import json
from typing import Dict, Any, Callable
from datetime import datetime


class WebSocketHandler:
    """
    Handles WebSocket connections for real-time updates.
    
    Provides:
    - Real-time point cloud streaming
    - Live system state updates
    - Progress notifications
    - Alert broadcasting
    """
    
    def __init__(self, config: Dict[str, Any] = None):
        """
        Initialize the WebSocket Handler.
        
        Args:
            config: WebSocket configuration
        """
        self.config = config or {
            'max_connections': 100,
            'heartbeat_interval': 30  # seconds
        }
        self.logger = logging.getLogger(__name__)
        self.connections = []
        self.logger.info("WebSocket Handler initialized")
    
    def register_connection(self, connection: Any) -> None:
        """
        Register a new WebSocket connection.
        
        Args:
            connection: WebSocket connection object
        """
        if len(self.connections) >= self.config['max_connections']:
            self.logger.warning("Maximum connections reached")
            return
        
        self.connections.append(connection)
        self.logger.info(f"Connection registered: {len(self.connections)} active")
    
    def remove_connection(self, connection: Any) -> None:
        """
        Remove a WebSocket connection.
        
        Args:
            connection: WebSocket connection object
        """
        if connection in self.connections:
            self.connections.remove(connection)
            self.logger.info(f"Connection removed: {len(self.connections)} active")
    
    def broadcast_message(self, message: Dict[str, Any]) -> None:
        """
        Broadcast a message to all connected clients.
        
        Args:
            message: Message to broadcast
        """
        message['timestamp'] = datetime.now().isoformat()
        json_message = json.dumps(message)
        
        self.logger.debug(f"Broadcasting to {len(self.connections)} clients")
        
        # In production, this would actually send to WebSocket connections
        # Scaffold implementation
        for connection in self.connections:
            # connection.send(json_message)
            pass
    
    def send_point_cloud_update(self, point_cloud: Dict[str, Any]) -> None:
        """
        Send point cloud update to connected clients.
        
        Args:
            point_cloud: Point cloud data
        """
        message = {
            'type': 'point_cloud_update',
            'data': {
                'num_points': point_cloud.get('num_points', 0),
                'frame_shape': point_cloud.get('frame_shape', [])
            }
        }
        self.broadcast_message(message)
    
    def send_state_update(self, state: Dict[str, Any]) -> None:
        """
        Send system state update to connected clients.
        
        Args:
            state: System state data
        """
        message = {
            'type': 'state_update',
            'data': state
        }
        self.broadcast_message(message)
    
    def send_alert(self, alert_type: str, alert_message: str) -> None:
        """
        Send alert to connected clients.
        
        Args:
            alert_type: Type of alert (info, warning, error)
            alert_message: Alert message
        """
        message = {
            'type': 'alert',
            'alert_type': alert_type,
            'message': alert_message
        }
        self.broadcast_message(message)
    
    def send_progress_update(self, cycle_id: int, progress: float) -> None:
        """
        Send progress update for a drafting cycle.
        
        Args:
            cycle_id: Cycle identifier
            progress: Progress percentage (0-100)
        """
        message = {
            'type': 'progress_update',
            'cycle_id': cycle_id,
            'progress': progress
        }
        self.broadcast_message(message)
