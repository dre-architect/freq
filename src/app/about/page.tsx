import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | FREQ AI',
  description: 'Learn about FREQ AI, our mission, and our operating principles.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-white sm:text-5xl">Building the Future of Maritime Intelligence</h1>
      <p className="mt-6 max-w-4xl text-lg text-[#9CA3AF]">FREQ AI was founded with a single conviction: the inland waterway industry deserves the same technological transformation that has modernized every other sector of global logistics.</p>

      <section className="py-20 space-y-6 text-[#9CA3AF]"><p>FREQ AI was born from direct experience on the water. Our founder spent years working in maritime cargo operations, watching skilled professionals perform critical measurements using processes that hadn&apos;t changed in decades — walking barge decks in hazardous conditions, reading analog gauges, relaying numbers by radio, and compiling reports by hand.</p><p>The inland waterway system carries over 600 million tons of cargo annually across more than 12,000 miles of navigable waterways. It is the quiet backbone of American commerce — moving grain, coal, petroleum, aggregates, and manufactured goods that touch nearly every sector of the economy. Yet the operational technology supporting this system has not kept pace with the industry&apos;s importance.</p><p>FREQ AI exists to close that gap. We are building an autonomous intelligence platform that transforms how maritime cargo operations are measured, monitored, and managed — starting with the most fundamental operation in the industry: barge drafting.</p></section>

      <section className="rounded-lg border border-[#1E293B] bg-[#111827] p-8"><h2 className="text-3xl font-bold text-white">Our Mission</h2><p className="mt-4 text-[#9CA3AF]">To eliminate risk, error, and inefficiency from maritime cargo operations through autonomous intelligence — making the inland waterway system safer, more accurate, and more productive for every operator, every barge, every load.</p></section>

      <section className="py-20"><h2 className="text-3xl font-bold text-white">Operating Principles</h2><div className="mt-10 grid gap-6 md:grid-cols-2">{[
        ['Safety First', 'Every system decision, every architectural choice, every operational sequence prioritizes crew safety above all other objectives. Zero tolerance for crew exposure during autonomous operations.'],
        ['Precision', 'Sub-inch measurement accuracy is not aspirational — it is the baseline. We build to tolerances that exceed manual processes by orders of magnitude.'],
        ['Speed', '4 hours to 15 minutes is the headline metric, but the real value is what operators do with the time they get back. Faster drafting means faster turnaround, reduced demurrage, and increased fleet utilization.'],
        ['Intelligence', 'Data collection is not enough. FREQ AI delivers autonomous decision-making — systems that analyze, verify, and report without human intervention in the loop.'],
      ].map(([t,d]) => <div key={t} className="rounded-lg border border-[#1E293B] bg-[#111827] p-6"><h3 className="text-xl font-semibold text-white">{t}</h3><p className="mt-3 text-sm text-[#9CA3AF]">{d}</p></div>)}</div></section>

      <section className="rounded-lg border border-[#1E293B] bg-[#111827] p-8"><h2 className="text-3xl font-bold text-white">Based in Slidell, Louisiana</h2><p className="mt-4 text-[#9CA3AF]">Headquartered on the Gulf Intracoastal Waterway, at the intersection of the Mississippi River and one of the densest inland waterway networks in the United States. We build where the barges are.</p></section>

      <section className="py-20"><h2 className="text-3xl font-bold text-white">Timeline</h2><div className="mt-10 border-l border-[#1E293B] pl-6 space-y-8">{[
        ['2024', 'Founded. Initial R&D and platform architecture.'],
        ['2025', 'Core platform development. Strategic partnership discussions initiated.'],
        ['2026', 'Phase 3 — Simulation development, digital twin technology, partnership expansion.'],
        ['2027', 'Commercial deployment and fleet-scale operations.'],
      ].map(([y,d]) => <div key={y}><p className="font-mono text-[#7C3AED]">{y}</p><p className="text-[#9CA3AF]">{d}</p></div>)}</div></section>
    </div>
  )
}
