import React, { useMemo } from 'react';

/**
 * Generates a simulated depth-measurement grid for the barge plan view.
 * Returns a flat array of { depth, color } objects arranged in row-major order.
 */
function generateBargeGrid(rows, cols) {
  const cells = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const ni = i / (rows - 1) - 0.5;
      const nj = j / (cols - 1) - 0.5;
      const depthFactor = 1 - (ni * ni + nj * nj) * 2.5;
      const depth = 8 + Math.max(0, depthFactor) * 5;

      let color;
      if (depth > 11) {
        color = '#047857';
      } else if (depth > 9.5) {
        color = '#0E7490';
      } else {
        color = '#B45309';
      }

      cells.push({ depth: Math.round(depth * 10) / 10, color });
    }
  }
  return cells;
}

const BargeSchematic = () => {
  const grid = useMemo(() => generateBargeGrid(8, 12), []);

  return (
    <div className="barge-schematic" aria-label="Barge measurement schematic">
      {/* Plan-view grid */}
      <div className="barge-diagram">
        <div className="barge-hull">
          <div className="barge-grid">
            {grid.map((cell, idx) => (
              <div
                key={idx}
                className="barge-cell"
                style={{ backgroundColor: cell.color }}
                title={`${cell.depth} m`}
                role="img"
                aria-label={`Measurement point: ${cell.depth} meters`}
              />
            ))}
          </div>
          <div className="barge-label">
            Barge B-101 — Plan View Depth Map (96 sample points)
          </div>
        </div>
      </div>

      {/* Side readouts */}
      <div className="barge-readouts">
        <div className="readout">
          <div className="readout-label">Mean Draft</div>
          <div className="readout-value">
            12.4<span className="readout-unit">m</span>
          </div>
          <div className="readout-status nominal">Within limits</div>
        </div>
        <div className="readout">
          <div className="readout-label">Fore Draft</div>
          <div className="readout-value">
            12.2<span className="readout-unit">m</span>
          </div>
          <div className="readout-status nominal">Nominal</div>
        </div>
        <div className="readout">
          <div className="readout-label">Aft Draft</div>
          <div className="readout-value">
            12.6<span className="readout-unit">m</span>
          </div>
          <div className="readout-status nominal">Nominal</div>
        </div>
        <div className="readout">
          <div className="readout-label">Confidence</div>
          <div className="readout-value">
            98.2<span className="readout-unit">%</span>
          </div>
          <div className="readout-status nominal">High</div>
        </div>
      </div>
    </div>
  );
};

export default BargeSchematic;
