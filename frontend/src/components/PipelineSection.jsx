import React from 'react';

const steps = [
  {
    number: '01',
    name: 'RGB-D Capture',
    desc: 'Depth camera acquires 3D hull geometry',
  },
  {
    number: '02',
    name: 'Point Cloud',
    desc: 'Raw data converted to structured 3D point cloud',
  },
  {
    number: '03',
    name: 'Validation',
    desc: 'Draft, trim, heel checked against safety thresholds',
  },
  {
    number: '04',
    name: 'Vector Compute',
    desc: 'Crane movement vectors with safety margins',
  },
  {
    number: '05',
    name: 'G-Code Gen',
    desc: 'ISO 6983-compliant crane instructions',
  },
  {
    number: '06',
    name: 'Crane Execute',
    desc: 'Automated execution with watchdog monitoring',
  },
];

const agents = [
  {
    name: 'Validator Agent',
    desc: 'Enforces minimum point counts, confidence thresholds, draft limits, and trim/heel angle constraints before any downstream processing.',
    status: 'Operational',
  },
  {
    name: 'Vector Computer Agent',
    desc: 'Computes optimal crane movement vectors from validated geometry, incorporating safety margins and collision avoidance boundaries.',
    status: 'Operational',
  },
  {
    name: 'G-Code Translator Agent',
    desc: 'Translates movement vectors into ISO 6983-compliant G-Code with full safety sequences — spindle, coolant, and tool-change protocols.',
    status: 'Operational',
  },
];

const PipelineSection = () => {
  return (
    <section
      id="technology"
      className="section section-light"
      aria-labelledby="pipeline-heading"
    >
      <div className="container">
        <div className="section-label">Lattice Core Architecture</div>
        <h2 id="pipeline-heading" className="section-title">
          End-to-End Autonomous Pipeline
        </h2>
        <p className="section-subtitle">
          A sequential agent-based pipeline orchestrated by the Lattice Core.
          Each stage validates, transforms, and passes structured JSON state to
          the next — agents never communicate directly with hardware.
        </p>

        {/* Pipeline Flow */}
        <div className="pipeline-flow" role="list" aria-label="Processing pipeline steps">
          {steps.map((step) => (
            <div key={step.number} className="pipeline-step" role="listitem">
              <div className="pipeline-number">{step.number}</div>
              <div className="pipeline-step-name">{step.name}</div>
              <div className="pipeline-step-desc">{step.desc}</div>
            </div>
          ))}
        </div>

        {/* Agent Cards */}
        <div className="agent-cards">
          {agents.map((agent) => (
            <div key={agent.name} className="agent-card">
              <h4>{agent.name}</h4>
              <p>{agent.desc}</p>
              <div className="agent-card-status">
                <span className="status-indicator" aria-hidden="true"></span>
                {agent.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PipelineSection;
