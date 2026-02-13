import React, { useEffect, useRef } from 'react';
import { Viewer, Entity, PointGraphics } from 'resium';
import { Cartesian3, Color, Ion } from 'cesium';

// Note: In production, set your Cesium Ion access token
// Ion.defaultAccessToken = 'your_token_here';

const CesiumViewer = () => {
  const viewerRef = useRef(null);

  useEffect(() => {
    // Set initial camera position
    if (viewerRef.current && viewerRef.current.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement;
      viewer.camera.setView({
        destination: Cartesian3.fromDegrees(-75.0, 40.0, 1000),
        orientation: {
          heading: 0,
          pitch: -0.5,
          roll: 0,
        },
      });
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Viewer
        ref={viewerRef}
        full
        timeline={false}
        animation={false}
        baseLayerPicker={false}
        geocoder={false}
        homeButton={false}
        navigationHelpButton={false}
        sceneModePicker={false}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Example: Barge position marker */}
        <Entity
          name="Barge Position"
          position={Cartesian3.fromDegrees(-75.0, 40.0, 0)}
          description="Current barge position"
        >
          <PointGraphics pixelSize={10} color={Color.CYAN} />
        </Entity>
      </Viewer>
      
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          background: 'rgba(10, 14, 39, 0.9)',
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          border: '1px solid rgba(0, 212, 255, 0.2)',
        }}
      >
        <div style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
          3D Visualization
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
          RGB-D Point Cloud • Real-time
        </div>
      </div>
    </div>
  );
};

export default CesiumViewer;
