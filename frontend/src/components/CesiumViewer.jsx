import React, { useEffect, useRef, useMemo } from 'react';
import { Viewer, Entity, PointGraphics, PolylineGraphics } from 'resium';
import { Cartesian3, Color, Ion } from 'cesium';

// Note: Set your Cesium Ion access token for production satellite imagery
// Ion.defaultAccessToken = 'your_token_here';

/**
 * Generate a grid of measurement points over the barge area.
 * Simulates an RGB-D point cloud scan with depth-coded colors.
 */
function generatePointCloud() {
  const center = { lat: 29.7450, lon: -95.0150 };
  const length = 0.0008;
  const width = 0.00022;
  const rows = 14;
  const cols = 5;
  const points = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const lat = center.lat - length / 2 + (i / (rows - 1)) * length;
      const lon = center.lon - width / 2 + (j / (cols - 1)) * width;

      // Simulate depth: deeper in center, shallower at edges
      const ni = i / (rows - 1) - 0.5;
      const nj = j / (cols - 1) - 0.5;
      const depthFactor = 1 - (ni * ni + nj * nj) * 2.5;
      const depth = 8 + Math.max(0, depthFactor) * 5;

      let color;
      if (depth > 11) {
        color = Color.fromCssColorString('#047857'); // deep — nominal
      } else if (depth > 9.5) {
        color = Color.fromCssColorString('#0E7490'); // mid — normal
      } else {
        color = Color.fromCssColorString('#B45309'); // shallow — attention
      }

      points.push({ lat, lon, depth: Math.round(depth * 10) / 10, color });
    }
  }

  return points;
}

/**
 * Generate barge outline coordinates as a closed polyline.
 */
function bargeOutline() {
  const center = { lat: 29.7450, lon: -95.0150 };
  const halfLen = 0.00045;
  const halfWid = 0.00014;

  return Cartesian3.fromDegreesArray([
    center.lon - halfWid, center.lat - halfLen,
    center.lon + halfWid, center.lat - halfLen,
    center.lon + halfWid, center.lat + halfLen,
    center.lon - halfWid, center.lat + halfLen,
    center.lon - halfWid, center.lat - halfLen,
  ]);
}

/**
 * Additional barge entities positioned in the channel.
 */
function secondaryBarges() {
  return [
    { name: 'Barge B-102 (Queued)', lat: 29.7475, lon: -95.0130 },
    { name: 'Barge B-103 (Complete)', lat: 29.7425, lon: -95.0170 },
  ];
}

const CesiumViewer = () => {
  const viewerRef = useRef(null);
  const pointCloud = useMemo(() => generatePointCloud(), []);
  const outline = useMemo(() => bargeOutline(), []);
  const otherBarges = useMemo(() => secondaryBarges(), []);

  useEffect(() => {
    if (viewerRef.current && viewerRef.current.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement;
      viewer.camera.setView({
        destination: Cartesian3.fromDegrees(-95.0150, 29.7450, 600),
        orientation: {
          heading: 0.3,
          pitch: -0.65,
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
        fullscreenButton={false}
        infoBox={false}
        selectionIndicator={false}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Active barge outline */}
        <Entity name="Barge B-101 — Active Drafting">
          <PolylineGraphics
            positions={outline}
            width={2}
            material={Color.fromCssColorString('#CBD5E1')}
          />
        </Entity>

        {/* RGB-D point cloud measurement grid */}
        {pointCloud.map((pt, idx) => (
          <Entity
            key={`pc-${idx}`}
            name={`Measurement ${idx + 1}`}
            position={Cartesian3.fromDegrees(pt.lon, pt.lat, 2)}
            description={`Depth: ${pt.depth} m`}
          >
            <PointGraphics pixelSize={7} color={pt.color} />
          </Entity>
        ))}

        {/* Secondary barges */}
        {otherBarges.map((barge, idx) => (
          <Entity
            key={`barge-${idx}`}
            name={barge.name}
            position={Cartesian3.fromDegrees(barge.lon, barge.lat, 0)}
            description={barge.name}
          >
            <PointGraphics
              pixelSize={8}
              color={Color.fromCssColorString('#64748B')}
            />
          </Entity>
        ))}
      </Viewer>

      {/* Overlay: Active Operation */}
      <div className="viewer-overlay">
        <div className="viewer-overlay-title">Barge B-101 — Active Scan</div>
        <div className="viewer-overlay-detail">
          Houston Ship Channel &middot; 70 measurement points
        </div>
      </div>

      {/* Legend */}
      <div className="viewer-legend">
        <div className="viewer-legend-title">Draft Depth</div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#047857' }}></span>
          Deep (&gt;11 m)
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#0E7490' }}></span>
          Normal (9.5–11 m)
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#B45309' }}></span>
          Shallow (&lt;9.5 m)
        </div>
      </div>
    </div>
  );
};

export default CesiumViewer;
