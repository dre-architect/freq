import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Autonomous Barge Draft Measurement | FREQ AI',
  description: 'Learn how FREQ AI transforms manual barge drafting into autonomous operations.',
}

export default function BargeDraftingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-white sm:text-5xl">Autonomous Barge Draft Measurement</h1>
      <p className="mt-6 max-w-4xl text-lg text-[#9CA3AF]">The most fundamental operation in inland waterway logistics — transformed.</p>

      <section className="py-20"><h2 className="text-3xl font-bold text-white">How Barge Drafting Works Today</h2><div className="mt-6 space-y-5 text-[#9CA3AF]"><p>Barge drafting — the process of measuring how deep a loaded barge sits in the water to determine cargo weight — is performed manually on virtually every vessel in the US inland waterway system. The process has remained largely unchanged for decades.</p><p>A typical manual drafting sequence involves a crew member walking the barge deck to each draft mark location, visually reading painted marks on the hull at the waterline, recording readings on paper or by radio to a shore-based operator, repeating the process at multiple points along the vessel, and compiling the readings into a draft survey report.</p><p>This process takes approximately 4 hours per barge, requires crew presence on deck in active operational zones, introduces 1-3% measurement error from visual reading and manual recording, and produces paper-based documentation with limited traceability.</p></div></section>

      <section className="pb-20"><h2 className="text-3xl font-bold text-white">Why This Process Is Broken</h2><div className="mt-10 grid gap-6 md:grid-cols-3">{[
        ['Safety', 'Man overboard is the highest non-navigational cause of fatality in the maritime industry. Every manual drafting operation puts crew members on exposed barge decks alongside active crane and loading equipment.'],
        ['Accuracy', 'Visual gauge reading, radio relay, and manual recording introduce compounding errors. A 1-3% measurement discrepancy on a 1,500-ton barge represents 15-45 tons of unaccounted cargo — real revenue loss on every load.'],
        ['Time', '4 hours per barge creates operational bottlenecks across the entire supply chain. Vessels waiting for draft surveys accumulate demurrage charges, delay downstream logistics, and reduce fleet utilization.'],
      ].map(([t,d]) => <div key={t} className="rounded-lg border border-[#1E293B] bg-[#111827] p-6"><h3 className="text-xl font-semibold text-white">{t}</h3><p className="mt-3 text-sm text-[#9CA3AF]">{d}</p></div>)}</div></section>

      <section className="pb-20"><h2 className="text-3xl font-bold text-white">How FREQ AI Solves It</h2><p className="mt-4 max-w-4xl text-[#9CA3AF]">FREQ AI replaces the entire manual drafting sequence with an autonomous operation that completes in 10-15 minutes with zero crew exposure.</p><div className="mt-8 grid gap-6 md:grid-cols-2"><div className="rounded-lg border border-[#1E293B] bg-[#111827] p-6"><h3 className="text-2xl font-semibold text-white">Before (Manual)</h3><ul className="mt-4 space-y-2 text-[#9CA3AF]"><li>4-hour process</li><li>Crew on deck required</li><li>Visual gauge reading</li><li>Radio relay to shore</li><li>Paper documentation</li><li>1-3% error rate</li><li>Man-overboard risk</li></ul></div><div className="rounded-lg border border-[#1E293B] bg-[#111827] p-6"><h3 className="text-2xl font-semibold text-white">After (FREQ AI)</h3><ul className="mt-4 space-y-2 text-[#9CA3AF]"><li>10-15 minute process</li><li>Zero crew exposure</li><li>Autonomous measurement</li><li>Real-time digital reporting</li><li>Complete audit trail</li><li>Sub-inch accuracy</li><li>Safety risk eliminated</li></ul></div></div></section>

      <section className="pb-20"><h2 className="text-3xl font-bold text-white">The Operational Sequence</h2><p className="mt-4 text-[#9CA3AF]">Every FREQ AI drafting operation follows a structured six-phase sequence from initial assessment through final verification.</p><div className="mt-10 border-l border-[#1E293B] pl-6 space-y-6">{[
        ['Phase 1: Initial Survey', 'Vessel identification and baseline condition assessment. Environmental parameters captured. Operational zone established.'],
        ['Phase 2: Pre-Load Assessment', 'Empty vessel draft readings acquired at all measurement points. Baseline cargo state verified. Loading parameters confirmed.'],
        ['Phase 3: Active Loading', 'Real-time monitoring during cargo loading operations. Continuous draft measurement, stability tracking, and load distribution analysis.'],
        ['Phase 4: Cargo Verification', 'Progressive verification of cargo weight and distribution against target parameters. Automated alerts for deviation from plan.'],
        ['Phase 5: Post-Load Assessment', 'Final loaded draft readings acquired. Comprehensive stability analysis completed. Trim and heel verified within tolerances.'],
        ['Phase 6: Final Survey & Report', 'Complete draft survey generated. All measurements, calculations, and compliance documentation compiled into verified report.'],
      ].map(([t,d]) => <div key={t} className="rounded-lg border border-[#1E293B] bg-[#111827] p-6"><h3 className="text-xl font-semibold text-white">{t}</h3><p className="mt-2 text-sm text-[#9CA3AF]">{d}</p></div>)}</div></section>

      <section><div className="rounded-lg border border-[#1E293B] bg-[#111827] p-8 text-center"><p className="text-xl text-white">See how FREQ AI can transform your drafting operations.</p><Link href="/contact" className="mt-5 inline-block rounded-lg bg-[#7C3AED] px-6 py-3 font-medium text-white hover:bg-[#6D28D9]">Contact Us</Link></div></section>
    </div>
  )
}
