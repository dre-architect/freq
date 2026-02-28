import React from 'react';

const ProblemSection = () => {
  return (
    <section id="solution" className="section section-light" aria-labelledby="solution-heading">
      <div className="container">
        <div className="section-label">The Challenge</div>
        <h2 id="solution-heading" className="section-title">
          Manual Drafting Is a Bottleneck
        </h2>
        <p className="section-subtitle">
          Traditional barge drafting relies on manual measurements, subjective
          judgment, and labor-intensive processes that consume critical
          operational hours.
        </p>

        <div className="comparison-grid">
          {/* Traditional Process */}
          <div className="comparison-card traditional">
            <div className="comparison-card-header">
              <h3>Traditional Process</h3>
              <div className="comparison-card-time">Average cycle: 4+ hours</div>
            </div>
            <ul className="comparison-list">
              <li>
                <span className="comparison-icon" aria-hidden="true">!</span>
                <span>Manual tape measurements at multiple hull points</span>
              </li>
              <li>
                <span className="comparison-icon" aria-hidden="true">!</span>
                <span>Subjective visual assessment of trim and heel angles</span>
              </li>
              <li>
                <span className="comparison-icon" aria-hidden="true">!</span>
                <span>Hand-calculated crane movement vectors with safety margins</span>
              </li>
              <li>
                <span className="comparison-icon" aria-hidden="true">!</span>
                <span>Paper-based G-Code generation and manual verification</span>
              </li>
              <li>
                <span className="comparison-icon" aria-hidden="true">!</span>
                <span>Weather-dependent; requires personnel in hazardous proximity</span>
              </li>
            </ul>
          </div>

          {/* FREQ AI Solution */}
          <div className="comparison-card solution">
            <div className="comparison-card-header">
              <h3>FREQ AI Solution</h3>
              <div className="comparison-card-time">Average cycle: 15 minutes</div>
            </div>
            <ul className="comparison-list">
              <li>
                <span className="comparison-icon" aria-hidden="true">+</span>
                <span>RGB-D depth camera captures full 3D point cloud of hull geometry</span>
              </li>
              <li>
                <span className="comparison-icon" aria-hidden="true">+</span>
                <span>Automated validation of draft, trim, and heel against safety thresholds</span>
              </li>
              <li>
                <span className="comparison-icon" aria-hidden="true">+</span>
                <span>Computed crane vectors with built-in safety margins and collision avoidance</span>
              </li>
              <li>
                <span className="comparison-icon" aria-hidden="true">+</span>
                <span>ISO 6983-compliant G-Code generated and verified automatically</span>
              </li>
              <li>
                <span className="comparison-icon" aria-hidden="true">+</span>
                <span>Operates in all conditions; personnel remain at safe distance</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
