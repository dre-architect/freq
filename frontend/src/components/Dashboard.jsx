import React, { useState } from 'react';

const Dashboard = ({ systemState }) => {
  const [logs, setLogs] = useState([
    { type: 'info', message: 'System initialized', timestamp: new Date().toISOString() },
    { type: 'success', message: 'Lattice Core ready', timestamp: new Date().toISOString() },
    { type: 'info', message: 'Waiting for RGB-D input...', timestamp: new Date().toISOString() },
  ]);

  const handleStartCycle = () => {
    const newLog = {
      type: 'info',
      message: 'Starting new drafting cycle...',
      timestamp: new Date().toISOString(),
    };
    setLogs([...logs, newLog]);
  };

  return (
    <aside className="sidebar">
      {/* System Metrics */}
      <div className="panel">
        <h2 className="panel-title">System Metrics</h2>
        <div className="metric-grid">
          <div className="metric">
            <div className="metric-label">Draft</div>
            <div className="metric-value">
              0.0<span className="metric-unit">m</span>
            </div>
          </div>
          <div className="metric">
            <div className="metric-label">Trim</div>
            <div className="metric-value">
              0.0<span className="metric-unit">°</span>
            </div>
          </div>
          <div className="metric">
            <div className="metric-label">Heel</div>
            <div className="metric-value">
              0.0<span className="metric-unit">°</span>
            </div>
          </div>
          <div className="metric">
            <div className="metric-label">Cycle Time</div>
            <div className="metric-value">
              15<span className="metric-unit">min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="panel">
        <h2 className="panel-title">Control Panel</h2>
        <button className="btn btn-primary" onClick={handleStartCycle} style={{ width: '100%' }}>
          Start Drafting Cycle
        </button>
      </div>

      {/* Agent Status */}
      <div className="panel">
        <h2 className="panel-title">Agent Status</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <AgentStatusItem name="Validator" status="ready" />
          <AgentStatusItem name="Vector Computer" status="ready" />
          <AgentStatusItem name="G-Code Translator" status="ready" />
        </div>
      </div>

      {/* System Log */}
      <div className="panel">
        <h2 className="panel-title">System Log</h2>
        <div className="log-container">
          {logs.map((log, index) => (
            <div key={index} className={`log-entry ${log.type}`}>
              [{new Date(log.timestamp).toLocaleTimeString()}] {log.message}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

const AgentStatusItem = ({ name, status }) => {
  const statusColors = {
    ready: 'var(--success-color)',
    processing: 'var(--warning-color)',
    error: 'var(--error-color)',
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem',
        background: 'rgba(0, 212, 255, 0.05)',
        borderRadius: '0.5rem',
        border: '1px solid rgba(0, 212, 255, 0.1)',
      }}
    >
      <span style={{ fontSize: '0.875rem' }}>{name}</span>
      <span
        style={{
          fontSize: '0.75rem',
          color: statusColors[status],
          textTransform: 'uppercase',
          fontWeight: 600,
        }}
      >
        {status}
      </span>
    </div>
  );
};

export default Dashboard;
