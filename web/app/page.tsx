'use client';

import { OperationsPanels } from '@/components/OperationsPanels';
import { SimulationCanvas } from '@/components/SimulationCanvas';
import { useGhostState } from '@/lib/useGhostState';

export default function DashboardPage() {
  const { state, demoMode, setDemoMode, setState } = useGhostState();

  async function loadLive() {
    setDemoMode(false);
    const response = await fetch('/api/ghost-state', { cache: 'no-store' });
    if (response.ok) setState(await response.json());
  }

  return (
    <div className="space-y-4">
      <section className="panel flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Phase III Operations Dashboard</h2>
          <p className="text-sm text-slate-400">15-minute autonomous drafting workflow (Digital Shadow mode)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setDemoMode(true)} className="rounded border border-slate-600 px-3 py-2">Demo Mode</button>
          <button onClick={loadLive} className="rounded border border-teal-500 px-3 py-2 text-teal-200">Live JSON Polling</button>
        </div>
      </section>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3"><SimulationCanvas state={state} /></div>
        <div className="col-span-2"><OperationsPanels state={state} /></div>
      </div>
    </div>
  );
}
