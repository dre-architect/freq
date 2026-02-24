import React from 'react';

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-brand">
          FREQ <span>AI</span>
        </div>
        <ul className="footer-links">
          <li><a href="#solution">Solution</a></li>
          <li><a href="#digital-twin">Digital Twin</a></li>
          <li><a href="#technology">Technology</a></li>
          <li><a href="#performance">Performance</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="footer-copyright">
          &copy; 2026 FREQ AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
