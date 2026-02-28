# FREQ AI — Phase III Digital Shadow Demo

This repository now includes a demo-grade Phase III simulation environment for autonomous maritime barge drafting using a low-cost **Digital Shadow** pipeline.

## Build Plan Artifact
- `docs/PHASE3_BUILD_PLAN.md`

## Deliverables Implemented

### A) Ghost LiDAR Generator
- Path: `src/sol/simulation/ghost_lidar.py`
- Pure Python stdlib only
- Outputs JSON state object every tick (`output/ghost_state.json`)
- Emits SOL event logs every tick (stdout + `output/sol_event.log`)
- 6-phase 15-minute workflow with realistic value progression
- MOB trigger in `CARGO-LOAD` at ~65% progress with 10-second freeze and resume
- CLI flags: `--fast`, `--tick`, `--no-mob`, `--output`

### B) Visual Dashboard
- Path: `web/` (Next.js + Tailwind)
- Pages:
  - `/` Dashboard (split layout, controls, workflow/data panels)
  - `/simulation` 2D digital shadow visualization
  - `/agents` agent status cards + SOL event logs
- Polling endpoint: `/api/ghost-state` every 1 second (live mode)
- `Demo Mode` seeded fallback data supported
- MOB visual response: red pulse + emergency banner + status transitions

### C) AI Agent Hooks (Mockable)
- Path: `web/lib/agents.ts`
- Interface: `AgentAdapter` with
  - `propose_plan()`
  - `validate()`
  - `generate_copy()`
  - `analyze_logs()`
- Stubs:
  - `SSMAdapter`
  - `CGEAdapter`
  - `WatchdogAdapter`
  - `ChatGPTAdapter`
  - `OpusAdapter`
  - `GeminiAdapter`

### D) Deployment Runbook (Vercel)

1. Install dependencies and build:
   ```bash
   cd web
   npm install
   npm run build
   ```
2. Deploy with Vercel CLI:
   ```bash
   npm i -g vercel
   vercel
   ```
3. For production deploy:
   ```bash
   vercel --prod
   ```
4. Set the project root to `web` when prompted.
5. Run simulator on the host writing to `../output/ghost_state.json` relative to `web`:
   ```bash
   cd ..
   PYTHONPATH=src python -m sol.simulation.ghost_lidar --fast
   ```

## One-command local run
```bash
./scripts/run_phase3_demo.sh
```

## Manual local run
Terminal 1:
```bash
PYTHONPATH=src python -m sol.simulation.ghost_lidar --fast
```

Terminal 2:
```bash
cd web
npm install
npm run dev
```

Open `http://localhost:3000`.

## Backlog (post-demo)
1. CesiumJS 3D globe view centered on Slidell coordinates.
2. Eclipse Ditto-backed digital shadow state service.
3. Real-time websocket updates (replace polling).
4. Multi-barge orchestration and queue simulation.
5. Hardware LiDAR adapter drop-in replacement for Ghost generator.

## Recommendations — 5 overlooked features to increase demo strength
1. **Replay Timeline Controls**: scrub through the full 15-minute cycle to instantly show PRE→FINAL transitions.
2. **Regulatory Audit Export**: one-click PDF/JSON report including MOB event, timestamps, and agent decisions.
3. **Scenario Library**: selectable presets (normal load, rough-water trim drift, overload prevention) for investor demos.
4. **Role-based Operator View**: separate “Exec” summary vs “Operations” detail panel to tailor stakeholder walkthroughs.
5. **Data Quality Confidence Meter**: expose synthetic-sensor confidence scoring to reinforce governance and trust.
