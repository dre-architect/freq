import React, { useState, useEffect } from 'react';
import CesiumViewer from './components/CesiumViewer';
import Dashboard from './components/Dashboard';
import { FreqAPIService } from './services/FreqAPIService';
import './index.css';

function App() {
  const [systemState, setSystemState] = useState({
    status: 'initializing',
    cycles_completed: 0,
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize API service
    const apiService = new FreqAPIService();
    
    // Fetch initial system state
    const fetchSystemState = async () => {
      try {
        const state = await apiService.getSystemState();
        setSystemState(state);
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to fetch system state:', error);
        setIsConnected(false);
      }
    };

    fetchSystemState();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchSystemState, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-title">
          <h1>FREQ AI Digital Shadow</h1>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>v4.0</span>
        </div>
        <div className="header-status">
          <div className="status-badge">
            <span className="status-dot"></span>
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Status: {systemState.status || 'Unknown'}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Cycles: {systemState.cycles_completed || 0}
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <div className="viewer-container">
          <CesiumViewer />
        </div>
        <Dashboard systemState={systemState} />
      </main>
    </div>
  );
}

export default App;
