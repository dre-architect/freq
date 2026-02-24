import React from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import DigitalTwinSection from './components/DigitalTwinSection';
import PipelineSection from './components/PipelineSection';
import MetricsSection from './components/MetricsSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import './index.css';

function App() {
  return (
    <div className="site">
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSection />
        <DigitalTwinSection />
        <PipelineSection />
        <MetricsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
