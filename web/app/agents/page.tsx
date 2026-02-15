'use client';

import { useEffect, useState } from 'react';
import { CGEAdapter, ChatGPTAdapter, GeminiAdapter, OpusAdapter, SSMAdapter, WatchdogAdapter } from '@/lib/agents';

const adapters = [new SSMAdapter(), new CGEAdapter(), new WatchdogAdapter(), new ChatGPTAdapter(), new OpusAdapter(), new GeminiAdapter()];

export default function AgentsPage() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const id = setInterval(async () => {
      const response = await fetch('/api/agent-logs', { cache: 'no-store' });
      if (!response.ok) return;
      const payload = await response.json();
      setLogs(payload.lines ?? []);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-4">
      <section className="panel">
        <h2 className="text-xl font-semibold">SOL Agent Hooks</h2>
        <p className="text-sm text-slate-400">Mockable adapters are wired for SSM, CGE, Watchdog, ChatGPT, Opus, and Gemini.</p>
      </section>
      <section className="panel grid grid-cols-3 gap-3 text-sm">
        {adapters.map((adapter) => (
          <article key={adapter.constructor.name} className="rounded border border-slate-700 p-3">
            <h3 className="font-semibold text-teal-300">{adapter.constructor.name}</h3>
            <p>Status: Online (stub)</p>
          </article>
        ))}
      </section>
      <section className="panel">
        <h3 className="mb-2 font-semibold text-teal-300">SOL Event Logs</h3>
        <div className="h-80 overflow-auto rounded border border-slate-700 bg-slate-950 p-2 text-xs text-slate-300">
          {logs.slice(-120).map((line, index) => (
            <p key={`${line}-${index}`}>{line}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
