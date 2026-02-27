'use client'

import { useMemo, useState } from 'react'

type SimulationState = 'idle' | 'running' | 'paused' | 'finished'
type ViewMode = 'Operational View' | 'Deck View' | 'Stability View' | 'Data View'

type Phase = {
  id: string
  title: string
  description: string
}

const phases: Phase[] = [
  {
    id: 'phase-1',
    title: 'Phase 1: Initial Survey',
    description: 'Vessel identification and environmental baselining are confirmed before drafting operations begin.',
  },
  {
    id: 'phase-2',
    title: 'Phase 2: Pre-Load Assessment',
    description: 'Baseline empty-vessel draft values are captured and operational thresholds are locked.',
  },
  {
    id: 'phase-3',
    title: 'Phase 3: Active Loading',
    description: 'Real-time readings stream while cargo loading progresses to maintain stability control.',
  },
  {
    id: 'phase-4',
    title: 'Phase 4: Cargo Verification',
    description: 'Measured cargo profile is validated against target loading parameters with variance checks.',
  },
  {
    id: 'phase-5',
    title: 'Phase 5: Post-Load Assessment',
    description: 'Final load-state readings are captured to verify trim, heel, and stability tolerances.',
  },
  {
    id: 'phase-6',
    title: 'Phase 6: Final Survey & Report',
    description: 'Draft survey package is finalized with compliance-ready digital documentation.',
  },
]

function toPercent(phaseIndex: number) {
  return Math.round(((phaseIndex + 1) / phases.length) * 100)
}

export default function SimulationConsole() {
  const [simulationState, setSimulationState] = useState<SimulationState>('idle')
  const [activePhaseIndex, setActivePhaseIndex] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('Operational View')

  const activePhase = phases[activePhaseIndex]

  const metrics = useMemo(() => {
    const progress = toPercent(activePhaseIndex)

    return {
      cycleCompletion: `${progress}%`,
      draftVariance: `${(0.48 - activePhaseIndex * 0.05).toFixed(2)} in`,
      synchronization: `${(99.2 + activePhaseIndex * 0.1).toFixed(1)}%`,
      optimization: `${(87 + activePhaseIndex * 2).toFixed(0)} score`,
    }
  }, [activePhaseIndex])

  const start = () => {
    if (simulationState === 'finished') {
      return
    }

    setSimulationState('running')
  }

  const pause = () => {
    if (simulationState !== 'running') {
      return
    }

    setSimulationState('paused')
  }

  const finish = () => {
    setActivePhaseIndex(phases.length - 1)
    setSimulationState('finished')
  }

  const restart = () => {
    setActivePhaseIndex(0)
    setSimulationState('idle')
    setViewMode('Operational View')
  }

  const advancePhase = () => {
    if (simulationState !== 'running') {
      return
    }

    setActivePhaseIndex((current) => {
      if (current >= phases.length - 1) {
        setSimulationState('finished')
        return current
      }

      return current + 1
    })
  }

  return (
    <div className="rounded-lg border border-[#1E293B] bg-[#111827] p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-white">Digital Twin Demonstration Console</h3>
          <p className="mt-2 text-sm text-[#9CA3AF]">
            Manual controls for start, pause, finish, and restart. No automatic playback.
          </p>
        </div>
        <p className="rounded-full border border-[#1E293B] px-4 py-2 text-xs uppercase tracking-wide text-[#06B6D4]">
          State: {simulationState}
        </p>
      </div>

      <div className="mt-6 h-2 w-full rounded bg-[#0A0E1A]">
        <div className="h-2 rounded bg-[#7C3AED] transition-all" style={{ width: `${toPercent(activePhaseIndex)}%` }} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(metrics).map(([label, value]) => (
          <div key={label} className="rounded-lg border border-[#1E293B] bg-[#0A0E1A] p-4">
            <p className="font-mono text-2xl text-white">{value}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-[#9CA3AF]">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {(['Operational View', 'Deck View', 'Stability View', 'Data View'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode)}
            className={`rounded-lg border px-3 py-2 text-sm ${
              viewMode === mode
                ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-[#7C3AED]'
                : 'border-[#1E293B] text-[#E5E7EB] hover:border-[#7C3AED]/60'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-[#1E293B] bg-[#0A0E1A] p-5">
        <p className="text-xs uppercase tracking-wide text-[#06B6D4]">{viewMode}</p>
        <h4 className="mt-2 text-lg font-semibold text-white">{activePhase.title}</h4>
        <p className="mt-2 text-sm text-[#9CA3AF]">{activePhase.description}</p>
        <p className="mt-3 text-xs text-[#6B7280]">
          Synchronized data feed alignment is continuously validated against drafting and stability checkpoints.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={start}
          className="rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white hover:bg-[#6D28D9]"
        >
          Start
        </button>
        <button
          type="button"
          onClick={pause}
          className="rounded-lg border border-[#7C3AED] px-4 py-2 text-sm font-medium text-[#7C3AED] hover:bg-[#7C3AED]/10"
        >
          Pause
        </button>
        <button
          type="button"
          onClick={finish}
          className="rounded-lg border border-[#1E293B] px-4 py-2 text-sm font-medium text-[#E5E7EB] hover:border-[#7C3AED]/60"
        >
          Finish
        </button>
        <button
          type="button"
          onClick={restart}
          className="rounded-lg border border-[#1E293B] px-4 py-2 text-sm font-medium text-[#E5E7EB] hover:border-[#7C3AED]/60"
        >
          Restart
        </button>
        <button
          type="button"
          onClick={advancePhase}
          className="rounded-lg border border-[#06B6D4] px-4 py-2 text-sm font-medium text-[#06B6D4] hover:bg-[#06B6D4]/10"
        >
          Advance Phase
        </button>
      </div>
    </div>
  )
}
