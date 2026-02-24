import React from 'react';

const HeroSection = () => {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="container">
        <div className="hero-content">
          <div className="hero-label">Autonomous Maritime Operations</div>
          <h1 id="hero-heading">
            Precision Barge Drafting,<br />
            Reduced from Hours to Minutes
          </h1>
          <p>
            FREQ AI transforms manual 4-hour barge drafting operations into a
            15-minute autonomous process using RGB-D computer vision and
            automated crane control — delivering consistent accuracy at
            industrial scale.
          </p>
          <div className="hero-actions">
            <a href="#digital-twin" className="btn btn-primary">
              See the Digital Twin
            </a>
            <a href="#contact" className="btn btn-outline">
              Request a Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
