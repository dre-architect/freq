import React from 'react';

const Navigation = () => {
  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <div className="container">
        <div className="nav-brand">
          FREQ <span>AI</span>
        </div>
        <ul className="nav-links">
          <li><a href="#solution">Solution</a></li>
          <li><a href="#digital-twin">Digital Twin</a></li>
          <li><a href="#technology">Technology</a></li>
          <li><a href="#performance">Performance</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <span className="nav-version">v4.0</span>
      </div>
    </nav>
  );
};

export default Navigation;
