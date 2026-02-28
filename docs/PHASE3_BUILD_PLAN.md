# Phase III Build Plan — Digital Shadow Demo

## Milestone 1 — Ghost LiDAR Generator
**Acceptance criteria**
- Pure Python stdlib generator at `src/sol/simulation/ghost_lidar.py`
- Writes contract-compliant JSON state to `output/ghost_state.json` every tick
- Emits SOL-formatted event logs to stdout every tick
- Supports `--fast`, `--tick`, `--no-mob`, `--output`
- Implements MOB trigger (STOP, freeze 10s, PASS resume)

## Milestone 2 — Dashboard + Simulation
**Acceptance criteria**
- Next.js app under `web/` with pages: Dashboard, Simulation
- Split layout 60/40 visualization/data on dashboard
- Polls `/api/ghost-state` every 1s (live mode)
- Demo mode available with seeded data
- Professional dark theme and FREQ AI branding

## Milestone 3 — Agents + MOB Visual Response
**Acceptance criteria**
- Agents page with adapter status and SOL event log stream
- Adapter interface includes `propose_plan`, `validate`, `generate_copy`, `analyze_logs`
- MOB visual response in dashboard: red pulsing panel and emergency banner

## Milestone 4 — Verification and Deployment Assets
**Acceptance criteria**
- End-to-end verified: simulator writes state + web app renders updates
- README and deployment runbook include Vercel instructions
- Backlog includes Cesium/3D and Eclipse Ditto integration path
