'use client';

import { GhostState } from '@/lib/types';

const phases = ['PRE-SURVEY', 'BALLAST-ADJ', 'CRANE-POS', 'CARGO-LOAD', 'TRIM-CORR', 'FINAL-SURV'];

export function OperationsPanels({ state }: { state: GhostState }) {
  const isStop = state.watchdog.status === 'STOP';

  return (
    <div className={`space-y-3 ${isStop ? 'animate-pulse' : ''}`}>
      {isStop && (
        <div className="status-stop rounded-lg p-3 text-center text-lg font-bold">
          MAN OVERBOARD — EMERGENCY STOP
          <div className="mt-1 text-sm">Safety hold: {state.watchdog.safety_message.split('Safety hold: ')[1] ?? '10'}</div>
        </div>
      )}
      <section className="panel">
        <h2 className="mb-2 text-sm font-semibold text-teal-300">Workflow</h2>
        <div className="mb-2 flex flex-wrap gap-2 text-xs">
          {phases.map((phase, idx) => (
            <span
              key={phase}
              className={`rounded px-2 py-1 ${idx + 1 === state.workflow.current_step ? 'bg-teal-500/30' : 'bg-slate-800'}`}
            >
              {idx + 1}. {phase}
            </span>
          ))}
        </div>
        <p>{state.workflow.step_label}</p>
      </section>

      <section className="panel grid grid-cols-2 gap-2 text-sm">
        <h3 className="col-span-2 font-semibold text-teal-300">Draft Readings (ft)</h3>
        <span>Fore: {state.draft_readings.fore}</span>
        <span>Aft: {state.draft_readings.aft}</span>
        <span>Port: {state.draft_readings.port}</span>
        <span>Starboard: {state.draft_readings.starboard}</span>
        <span className="col-span-2 font-semibold">Mean: {state.draft_readings.mean}</span>
      </section>

      <section className="panel text-sm">
        <h3 className="mb-2 font-semibold text-teal-300">Crane Status</h3>
        <p className={`inline-block rounded px-2 py-1 ${isStop ? 'status-stop' : 'status-pass'}`}>{state.crane_signals.status}</p>
        <p className="mt-2">Load: {state.crane_signals.load_weight} / {state.crane_signals.max_capacity}t</p>
        <p>Boom: {state.crane_signals.boom_angle}° | Slew: {state.crane_signals.slew_bearing}°</p>
      </section>

      <section className="panel text-sm">
        <h3 className="mb-2 font-semibold text-teal-300">Stability & Watchdog</h3>
        <p>Trim: {state.stability.trim}</p>
        <p>Heel: {state.stability.heel}</p>
        <p>GM: {state.stability.gm}m ({state.stability.status})</p>
        <p className={`mt-2 inline-block rounded px-2 py-1 ${isStop ? 'status-stop' : 'status-pass'}`}>
          Watchdog: {state.watchdog.status}
        </p>
      </section>
    </div>
  );
}
