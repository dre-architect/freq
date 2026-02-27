import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Team | FREQ AI',
  description: 'Meet the team behind FREQ AI.',
}

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-white sm:text-5xl">The Team Behind FREQ AI</h1>
      <p className="mt-6 max-w-3xl text-lg text-[#9CA3AF]">Built by people who understand both the water and the technology.</p>

      <section className="py-20"><h2 className="text-3xl font-bold text-white">Leadership</h2><div className="mt-8 rounded-lg border border-[#1E293B] border-l-4 border-l-[#7C3AED] bg-[#111827] p-8"><div className="flex flex-col gap-6 sm:flex-row sm:items-start"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#374151] text-2xl font-semibold text-white">DA</div><div><h3 className="text-2xl font-bold text-white">Dre Alvarez</h3><p className="text-[#06B6D4]">Founder & CEO</p><p className="mt-4 max-w-4xl text-[#9CA3AF]">Former maritime cargo operations professional with direct experience in barge drafting, terminal operations, and inland waterway logistics. Combining firsthand industry knowledge with expertise in AI systems architecture, Dre founded FREQ AI to solve the operational challenges he witnessed daily — bringing autonomous intelligence to an industry ready for transformation.</p><p className="mt-3 text-sm text-[#9CA3AF]">Location: Slidell, Louisiana</p><a href="https://linkedin.com/in/andry-alvarez" target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-[#7C3AED] hover:opacity-80">LinkedIn</a></div></div></div></section>

      <section className="pb-20"><h2 className="text-3xl font-bold text-white">We&apos;re Building the Team</h2><p className="mt-4 max-w-4xl text-[#9CA3AF]">FREQ AI is in active growth phase. We&apos;re looking for exceptional people who want to build technology that transforms a critical industry.</p><div className="mt-10 grid gap-6 md:grid-cols-3">{[
        ['AI/ML Engineer', 'Build the intelligence models that power autonomous cargo measurement and analysis.'],
        ['Maritime Operations Specialist', 'Bridge the gap between maritime industry expertise and autonomous system design.'],
        ['Simulation Developer', 'Create photorealistic digital twin environments for maritime operational training and demonstration.'],
      ].map(([t,d]) => <div key={t} className="rounded-lg border border-[#1E293B] bg-[#111827] p-6"><h3 className="text-xl font-semibold text-white">{t}</h3><p className="mt-3 text-sm text-[#9CA3AF]">{d}</p><Link href="/contact" className="mt-4 inline-block text-sm text-[#7C3AED]">Interested? Reach out.</Link></div>)}</div></section>

      <section className="rounded-lg border border-[#1E293B] bg-[#111827] p-8"><h2 className="text-3xl font-bold text-white">Strategic Partnerships</h2><p className="mt-4 text-[#9CA3AF]">FREQ AI is building relationships with industry leaders in cloud infrastructure, maritime technology, and autonomous systems to accelerate the transformation of inland waterway operations.</p></section>
    </div>
  )
}
