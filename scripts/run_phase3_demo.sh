#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

mkdir -p output
: > output/sol_event.log

PYTHONPATH=src python -m sol.simulation.ghost_lidar --fast --tick 1 > output/simulator_stdout.log 2>&1 &
SIM_PID=$!

cleanup() {
  if kill -0 "$SIM_PID" >/dev/null 2>&1; then
    kill "$SIM_PID" || true
  fi
}
trap cleanup EXIT

cd web
npm install
npm run dev
