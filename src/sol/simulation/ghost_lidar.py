"""Ghost LiDAR generator for SOL Phase III demo.

Pure Python stdlib only.
"""

from __future__ import annotations

import argparse
import json
import math
import random
import signal
import sys
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Tuple

PHASES: List[Tuple[str, str]] = [
    ("PRE-SURVEY", "Pre-Load Draft Survey"),
    ("BALLAST-ADJ", "Ballast Adjustment"),
    ("CRANE-POS", "Crane Positioning"),
    ("CARGO-LOAD", "Cargo Loading and Monitoring"),
    ("TRIM-CORR", "Trim Correction"),
    ("FINAL-SURV", "Final Draft Survey"),
]


@dataclass
class RuntimeConfig:
    tick_seconds: float
    total_sim_seconds: int
    output_path: Path
    disable_mob: bool


class GhostLiDAR:
    def __init__(self, config: RuntimeConfig):
        self.config = config
        self.running = True
        self.tick = 0
        self.event_log_path = config.output_path.parent / "sol_event.log"
        self.mob_triggered = False
        self.mob_hold_remaining = 0
        self._last_state: Dict[str, object] | None = None

    def stop(self, *_: object) -> None:
        self.running = False

    def run(self) -> None:
        self.config.output_path.parent.mkdir(parents=True, exist_ok=True)
        signal.signal(signal.SIGINT, self.stop)

        started_at = time.time()
        while self.running:
            elapsed = self.tick * self.config.tick_seconds
            if elapsed > self.config.total_sim_seconds:
                break

            if self.mob_hold_remaining > 0 and self._last_state is not None:
                state = dict(self._last_state)
                state["timestamp"] = _iso_now()
                watchdog = dict(state["watchdog"])
                watchdog["time_elapsed_seconds"] = int(elapsed)
                watchdog["time_remaining_seconds"] = max(
                    0, self.config.total_sim_seconds - int(elapsed)
                )
                watchdog["safety_message"] = (
                    f"Human detected in operational zone — EMERGENCY STOP | "
                    f"Safety hold: {self.mob_hold_remaining}"
                )
                state["watchdog"] = watchdog
                self.mob_hold_remaining -= 1
                if self.mob_hold_remaining == 0:
                    state = self._resume_from_mob(state)
            else:
                state = self._build_state(elapsed)

            self._write_state(state)
            self._print_event_log(state)
            self._last_state = state
            self.tick += 1

            if self.config.tick_seconds > 0:
                time.sleep(self.config.tick_seconds)

        duration = time.time() - started_at
        print(
            f"\n[SOL.GhostLiDAR] shutdown ticks={self.tick} "
            f"duration_seconds={duration:.2f} mob_triggered={self.mob_triggered}"
        )

    def _resume_from_mob(self, state: Dict[str, object]) -> Dict[str, object]:
        watchdog = dict(state["watchdog"])
        watchdog["status"] = "PASS"
        watchdog["human_detected"] = False
        watchdog["safety_message"] = "all clear, operations resuming"
        state["watchdog"] = watchdog

        crane = dict(state["crane_signals"])
        crane["status"] = "LOADING"
        crane["signal_code"] = "SIG-LOAD"
        crane["g_code"] = (
            f"G01 X{crane['slew_bearing']:.1f} Y{crane['boom_angle']:.1f} "
            f"Z{crane['hook_height']:.1f} F500"
        )
        state["crane_signals"] = crane
        return state

    def _build_state(self, elapsed: float) -> Dict[str, object]:
        total = self.config.total_sim_seconds
        global_progress = min(1.0, elapsed / total)
        phase_size = 1 / len(PHASES)
        phase_index = min(len(PHASES) - 1, int(global_progress / phase_size))
        phase, label = PHASES[phase_index]
        phase_progress = (global_progress - phase_index * phase_size) / phase_size
        phase_progress = max(0.0, min(1.0, phase_progress))

        drafts = self._draft_readings(phase, phase_progress)
        crane = self._crane_signals(phase, phase_progress)
        stability = self._stability(phase, phase_progress)
        watchdog = {
            "status": "PASS",
            "human_detected": False,
            "time_elapsed_seconds": int(elapsed),
            "time_remaining_seconds": max(0, total - int(elapsed)),
            "safety_message": "",
        }

        if (
            not self.config.disable_mob
            and not self.mob_triggered
            and phase == "CARGO-LOAD"
            and phase_progress >= 0.65
        ):
            self.mob_triggered = True
            self.mob_hold_remaining = int(round(10 / self.config.tick_seconds))
            watchdog.update(
                {
                    "status": "STOP",
                    "human_detected": True,
                    "safety_message": "Human detected in operational zone — EMERGENCY STOP",
                }
            )
            crane["status"] = "EMERGENCY_STOP"
            crane["signal_code"] = "SIG-ESTOP"
            crane["g_code"] = "M00 STOP"

        return {
            "timestamp": _iso_now(),
            "phase": phase,
            "phase_progress": round(phase_progress, 3),
            "draft_readings": drafts,
            "crane_signals": crane,
            "stability": stability,
            "watchdog": watchdog,
            "workflow": {
                "current_step": phase_index + 1,
                "total_steps": 6,
                "step_label": label,
                "elapsed_minutes": round((elapsed / 60), 2),
                "target_minutes": 15.0,
            },
        }

    def _draft_readings(self, phase: str, p: float) -> Dict[str, object]:
        rng = random.Random(f"draft-{self.tick}")
        if phase == "PRE-SURVEY":
            base = 10.0 + 0.5 * p
        elif phase == "BALLAST-ADJ":
            base = 10.4 + 0.1 * math.sin(p * math.pi)
        elif phase == "CRANE-POS":
            base = 10.5 + 0.02 * math.sin(p * 6.0)
        elif phase == "CARGO-LOAD":
            base = 10.5 + 2.0 * p
        elif phase == "TRIM-CORR":
            base = 12.45 + 0.05 * math.sin(p * math.pi)
        else:
            base = 12.5 + 0.02 * math.sin(p * 4.0)

        fore = base + rng.uniform(-0.06, 0.03)
        aft = base + rng.uniform(-0.03, 0.07)
        port = base + rng.uniform(-0.04, 0.05)
        starboard = base + rng.uniform(-0.04, 0.05)
        mean = (fore + aft + port + starboard) / 4

        return {
            "fore": round(fore, 2),
            "aft": round(aft, 2),
            "port": round(port, 2),
            "starboard": round(starboard, 2),
            "mean": round(mean, 2),
            "unit": "ft",
        }

    def _crane_signals(self, phase: str, p: float) -> Dict[str, object]:
        if phase in {"PRE-SURVEY", "BALLAST-ADJ"}:
            load = 0
            boom = 25.0
            slew = 180.0
            hook = 18.0
            status = "IDLE"
            signal = "SIG-IDLE"
        elif phase == "CRANE-POS":
            load = 120
            boom = 28.0 + (14.0 * p)
            slew = 180.0 + (20.0 * p)
            hook = 18.0 - (2.0 * p)
            status = "POSITIONING"
            signal = "SIG-POS"
        elif phase == "CARGO-LOAD":
            load = int(200 + (3000 * p))
            boom = 36.0 + (8.0 * p)
            slew = 190.0 + (12.0 * p)
            hook = 16.0 - (3.0 * p)
            status = "LOADING"
            signal = "SIG-LOAD"
        elif phase == "TRIM-CORR":
            load = 2900
            boom = 34.0 + (2.0 * math.sin(p * math.pi))
            slew = 202.0 - (6.0 * p)
            hook = 13.2
            status = "TRIM_ADJUST"
            signal = "SIG-TRIM"
        else:
            load = 2800
            boom = 30.0 - (6.0 * p)
            slew = 196.0 - (16.0 * p)
            hook = 14.0 + (4.0 * p)
            status = "RETURNING"
            signal = "SIG-FINAL"

        g_code = f"G01 X{slew:.1f} Y{boom:.1f} Z{hook:.1f} F500"
        return {
            "load_weight": int(load),
            "max_capacity": 3200,
            "boom_angle": round(boom, 1),
            "slew_bearing": round(slew, 1),
            "hook_height": round(hook, 1),
            "status": status,
            "signal_code": signal,
            "g_code": g_code,
        }

    def _stability(self, phase: str, p: float) -> Dict[str, object]:
        if phase == "CARGO-LOAD":
            trim = 0.02 + (0.23 * p)
            heel = -0.01 - (0.12 * p)
            gm = 4.2 - (0.9 * p)
            displacement = 2500 + int(1000 * p)
        elif phase == "TRIM-CORR":
            trim = 0.18 - (0.13 * p)
            heel = -0.09 + (0.08 * p)
            gm = 3.4 + (0.35 * p)
            displacement = 3450
        elif phase == "FINAL-SURV":
            trim = 0.05 - (0.02 * p)
            heel = -0.02 + (0.01 * p)
            gm = 3.75
            displacement = 3450
        else:
            trim = 0.01 * math.sin(p * math.pi)
            heel = -0.01 * math.sin(p * math.pi)
            gm = 4.3
            displacement = 2200

        status = "NOMINAL" if gm >= 3.2 else "CAUTION"
        return {
            "trim": round(trim, 3),
            "heel": round(heel, 3),
            "displacement": displacement,
            "gm": round(gm, 2),
            "status": status,
        }

    def _write_state(self, state: Dict[str, object]) -> None:
        self.config.output_path.write_text(json.dumps(state, indent=2), encoding="utf-8")

    def _print_event_log(self, state: Dict[str, object]) -> None:
        lines = [
            (
                f"[SOL.GhostLiDAR] tick={self.tick} phase={state['phase']} "
                f"progress={state['phase_progress']:.2f}"
            ),
            (
                "[SOL.DraftMonitor] draft_readings: "
                f"fore={state['draft_readings']['fore']:.2f}ft "
                f"aft={state['draft_readings']['aft']:.2f}ft "
                f"mean={state['draft_readings']['mean']:.2f}ft"
            ),
            (
                f"[SOL.CraneController] signal={state['crane_signals']['signal_code']} "
                f"load={state['crane_signals']['load_weight']}t "
                f"boom={state['crane_signals']['boom_angle']:.1f} "
                f"g_code={state['crane_signals']['g_code']}"
            ),
            (
                f"[SOL.StabilityAnalyzer] trim={state['stability']['trim']:.3f} "
                f"heel={state['stability']['heel']:.3f} "
                f"GM={state['stability']['gm']:.2f}m "
                f"status={state['stability']['status']}"
            ),
            (
                f"[SOL.WorkflowEngine] phase_active: {state['phase']} — "
                f"{state['workflow']['step_label']}"
            ),
            (
                f"[SOL.WatchdogAgent] safety_check: {state['watchdog']['status']}"
                + (
                    f" — {state['watchdog']['safety_message']}"
                    if state['watchdog']['safety_message']
                    else " — reason"
                )
            ),
        ]

        if state["watchdog"]["status"] == "PASS" and state["watchdog"]["safety_message"] == "all clear, operations resuming":
            lines[-1] = "[SOL.WatchdogAgent] safety_check: PASS — all clear, operations resuming"
        elif state["watchdog"]["status"] == "STOP":
            lines[-1] = "[SOL.WatchdogAgent] safety_check: STOP — human detected in operational zone"

        for line in lines:
            print(line)
        with self.event_log_path.open("a", encoding="utf-8") as fp:
            fp.write("\n".join(lines) + "\n")


def _iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def parse_args(argv: List[str]) -> RuntimeConfig:
    parser = argparse.ArgumentParser(description="SOL Ghost LiDAR simulator")
    parser.add_argument("--fast", action="store_true", help="Run 15-minute workflow in 60 seconds")
    parser.add_argument("--tick", type=float, default=1.0, help="Tick duration in seconds")
    parser.add_argument("--no-mob", action="store_true", help="Disable man overboard trigger")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("output/ghost_state.json"),
        help="Output JSON path",
    )
    args = parser.parse_args(argv)

    total_seconds = 60 if args.fast else 900
    return RuntimeConfig(
        tick_seconds=max(0.1, args.tick),
        total_sim_seconds=total_seconds,
        output_path=args.output,
        disable_mob=args.no_mob,
    )


def main(argv: List[str] | None = None) -> int:
    config = parse_args(argv or sys.argv[1:])
    simulator = GhostLiDAR(config)
    simulator.run()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
