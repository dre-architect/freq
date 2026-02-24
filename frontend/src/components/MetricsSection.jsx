import React from 'react';

const metrics = [
  {
    number: '15 min',
    label: 'Cycle Time',
    detail: 'Down from 4+ hours of manual drafting operations',
  },
  {
    number: '93.7%',
    label: 'Measurement Accuracy',
    detail: 'Validated against manual reference measurements',
  },
  {
    number: '24.8k',
    label: 'Points per Scan',
    detail: 'High-density RGB-D point cloud capture',
  },
  {
    number: '0',
    label: 'Safety Incidents',
    detail: 'Personnel remain at safe distance during operations',
  },
];

const MetricsSection = () => {
  return (
    <section
      id="performance"
      className="section section-navy"
      aria-labelledby="metrics-heading"
    >
      <div className="container">
        <div className="section-label">Performance</div>
        <h2 id="metrics-heading" className="section-title">
          Measured Results
        </h2>
        <p className="section-subtitle">
          Operational metrics from FREQ AI v4.0 deployment — validated against
          manual baselines and industrial safety standards.
        </p>

        <div className="metrics-grid">
          {metrics.map((m) => (
            <div key={m.label} className="metric-card">
              <div className="metric-number">{m.number}</div>
              <div className="metric-label-text">{m.label}</div>
              <div className="metric-detail">{m.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;
