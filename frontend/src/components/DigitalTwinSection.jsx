import React from 'react';
import CesiumViewer from './CesiumViewer';
import BargeSchematic from './BargeSchematic';

const DigitalTwinSection = () => {
  return (
    <section
      id="digital-twin"
      className="section section-gray"
      aria-labelledby="twin-heading"
    >
      <div className="container">
        <div className="section-label">Digital Twin Simulation</div>
        <h2 id="twin-heading" className="section-title">
          Real-Time Maritime Cargo Visualization
        </h2>
        <p className="section-subtitle">
          Live 3D point cloud data from RGB-D depth sensors mapped onto a
          geospatial digital twin — enabling precision draft measurement and
          autonomous crane planning from a single unified view.
        </p>

        {/* 3D Geospatial View */}
        <div className="digital-twin-viewer" role="img" aria-label="3D geospatial view of barge operations in the Houston Ship Channel">
          <CesiumViewer />
        </div>

        {/* Metrics Strip */}
        <div className="twin-metrics-strip">
          <div className="twin-metric">
            <div className="twin-metric-label">Draft Depth</div>
            <div className="twin-metric-value">
              12.4<span className="twin-metric-unit">m</span>
            </div>
            <div className="twin-metric-status nominal">Within limits</div>
          </div>
          <div className="twin-metric">
            <div className="twin-metric-label">Trim Angle</div>
            <div className="twin-metric-value">
              0.3<span className="twin-metric-unit">deg</span>
            </div>
            <div className="twin-metric-status nominal">Nominal</div>
          </div>
          <div className="twin-metric">
            <div className="twin-metric-label">Heel Angle</div>
            <div className="twin-metric-value">
              0.1<span className="twin-metric-unit">deg</span>
            </div>
            <div className="twin-metric-status nominal">Nominal</div>
          </div>
          <div className="twin-metric">
            <div className="twin-metric-label">Point Density</div>
            <div className="twin-metric-value">
              24.8<span className="twin-metric-unit">k pts</span>
            </div>
            <div className="twin-metric-status nominal">High confidence</div>
          </div>
        </div>

        {/* Barge Measurement Schematic */}
        <BargeSchematic />
      </div>
    </section>
  );
};

export default DigitalTwinSection;
