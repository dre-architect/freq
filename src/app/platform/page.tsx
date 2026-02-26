import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Platform | FREQ AI',
  description: 'Explore the FREQ AI intelligence layer for autonomous maritime cargo operations.',
}

const card = 'rounded-lg border border-[#1E293B] bg-[#111827] p-6'

export default function PlatformPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-white sm:text-5xl">The Intelligence Layer for Maritime Cargo Operations</h1>
      <p className="mt-6 max-w-4xl text-lg text-[#9CA3AF]">FREQ AI&apos;s platform sits between your existing hardware and your operational decisions — transforming raw sensor data into actionable cargo intelligence.</p>

      <section className="py-20"><p className="max-w-5xl text-[#9CA3AF]">Our platform is hardware-agnostic by design. Whether your operation uses radar, LiDAR, pressure sensors, or visual monitoring, FREQ AI&apos;s intelligence layer normalizes data from any source into a unified operational picture. The result: autonomous drafting, real-time monitoring, and verified compliance reporting — regardless of what hardware generates the input.</p></section>

      <section className="pb-20">
        <h2 className="text-3xl font-bold text-white">Core Capabilities</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            ['Autonomous Measurement', 'Precision cargo draft readings acquired without manual intervention. Sub-inch accuracy across all measurement points.'],
            ['Real-Time Monitoring', 'Continuous visibility into cargo status, vessel stability, and operational progress. Live data available to all stakeholders.'],
            ['Safety Governance', 'Integrated hazard detection with automatic operational safeguards. Man-overboard risk eliminated from the drafting process.'],
            ['Compliance & Reporting', 'Automated generation of draft surveys, cargo manifests, and regulatory documentation. Complete audit trail for every operation.'],
            ['Hardware Agnostic', 'Works with any sensor input — radar, LiDAR, pressure, drone, or visual. Your hardware, our intelligence.'],
            ['Fleet Scale', 'Designed for single-vessel operations or enterprise fleet management. Intelligence that scales with your operation.'],
          ].map(([t, d]) => <div key={t} className={card}><h3 className="text-xl font-semibold text-white">{t}</h3><p className="mt-3 text-sm text-[#9CA3AF]">{d}</p></div>)}
        </div>
      </section>

      <section className="pb-20"><h2 className="text-3xl font-bold text-white">Use Cases</h2><div className="mt-10 grid gap-6 md:grid-cols-2">{[
        ['Barge Draft Measurement', 'Automate the 4-hour manual drafting process. Acquire precise draft readings at all measurement points in 10-15 minutes with zero crew exposure.', '/solutions/barge-drafting'],
        ['Cargo Load Optimization', 'Maximize revenue per barge trip through precision loading. Real-time draft monitoring ensures optimal cargo weight within safety margins.'],
        ['Safety Monitoring', 'Continuous operational zone monitoring with automatic hazard detection. Eliminate man-overboard risk during cargo operations.'],
        ['Fleet Intelligence', 'Real-time visibility across your entire barge fleet. Draft status, cargo metrics, and operational alerts unified in a single platform.'],
      ].map(([t,d,l]) => <div key={t} className={card}><h3 className="text-xl font-semibold text-white">{t}</h3><p className="mt-3 text-sm text-[#9CA3AF]">{d}</p>{l && <Link href={l} className="mt-4 inline-block text-sm text-[#7C3AED] hover:opacity-80">Learn More →</Link>}</div>)}</div></section>

      <section className="pb-20"><div className="rounded-lg border border-[#1E293B] bg-[#111827] p-12 text-center"><h2 className="text-3xl font-bold text-white">See the Platform in Action</h2><p className="mx-auto mt-4 max-w-2xl text-[#9CA3AF]">Our simulation demonstrates the complete autonomous drafting sequence — from initial vessel survey through final verification.</p><div className="mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-full border border-[#7C3AED] text-[#7C3AED]"><span className="ml-1 text-3xl">▶</span></div><p className="mt-6 text-sm text-[#9CA3AF]">Simulation demo coming soon.</p></div></section>

      <section><div className="rounded-lg border border-[#1E293B] bg-[#111827] p-8 text-center"><p className="text-xl text-white">Ready to see what FREQ AI can do for your operation?</p><Link href="/contact" className="mt-5 inline-block rounded-lg bg-[#7C3AED] px-6 py-3 font-medium text-white hover:bg-[#6D28D9]">Contact Us</Link></div></section>
    </div>
  )
}
