import React from 'react';

const CTASection = () => {
  return (
    <section id="contact" className="section section-light" aria-labelledby="cta-heading">
      <div className="container">
        <div className="cta-content">
          <h2 id="cta-heading">Ready to Transform Your Operations?</h2>
          <p>
            See how FREQ AI can reduce your barge drafting cycle from hours to
            minutes. Schedule a technical demonstration with our team.
          </p>
          <div className="cta-actions">
            <a href="mailto:contact@freqai.com" className="btn btn-primary">
              Schedule a Demo
            </a>
            <a href="#digital-twin" className="btn btn-outline-dark">
              View Digital Twin
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
