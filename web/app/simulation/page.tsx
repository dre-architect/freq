'use client';
import { SimulationCanvas } from '@/components/SimulationCanvas';
import { useGhostState } from '@/lib/useGhostState';

export default function SimulationPage() {
  const { state, setState, setDemoMode } = useGhostState();

  return (
    <div className="space-y-4">
      <section className="panel flex items-center justify-between">
        <h2 className="text-xl font-semibold">Simulation View</h2>
        <button
          className="rounded border border-teal-500 px-3 py-2"
          onClick={async () => {
            setDemoMode(false);
            const response = await fetch('/api/ghost-state', { cache: 'no-store' });
            if (response.ok) setState(await response.json());
          }}
        >
          Refresh Live State
        </button>
      </section>
      <SimulationCanvas state={state} />
    </div>
  );
}
