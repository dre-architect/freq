'use client';

import { GhostState } from '@/lib/types';

export function SimulationCanvas({ state }: { state: GhostState }) {
  const draftPct = Math.min(100, (state.draft_readings.mean / 13) * 100);
  return (
    <div className="panel h-[560px]">
      <h2 className="mb-4 text-sm font-semibold text-teal-300">Slidell Roadstone Digital Shadow (30.2785°N, 89.7812°W)</h2>
      <div className="relative h-[500px] rounded-lg bg-slate-950">
        <div className="absolute left-8 top-8 text-xs text-slate-400">Mississippi Sound</div>
        <div className="absolute left-12 top-16 h-72 w-[70%] rounded-lg border border-slate-500 bg-slate-800">
          <div className="absolute bottom-0 w-full rounded-b-lg bg-teal-600/70" style={{ height: `${draftPct}%` }} />
          <div
            className="absolute h-4 w-4 rounded-full bg-amber-300"
            style={{ left: `${(state.crane_signals.slew_bearing - 170) * 2}px`, top: `${120 - state.crane_signals.boom_angle}px` }}
          />
        </div>
      </div>
    </div>
  );
}
