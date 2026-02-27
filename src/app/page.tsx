import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FREQ AI | Autonomous Maritime Cargo Intelligence',
  description:
    'FREQ AI replaces the 4-hour manual barge drafting process with autonomous intelligence delivering results in 15 minutes with zero crew exposure.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'FREQ AI',
  description: 'Autonomous maritime cargo intelligence platform',
  url: 'https://freqai.io',
  logo: 'https://freqai.io/og-image.svg',
  foundingDate: '2024',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Slidell',
    addressRegion: 'LA',
    addressCountry: 'US',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'info@freqai.io',
    contactType: 'sales',
  },
}

const card = 'rounded-lg border border-[#1E293B] bg-[#111827] p-6'

export default function HomePage() {
  return (
    <div>
      <section className="pattern-grid border-b border-[#1E293B] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="max-w-4xl text-4xl font-bold text-white sm:text-6xl">Maritime Cargo Drafting, Reinvented.</h1>
          <p className="mt-6 max-w-3xl text-lg text-[#9CA3AF]">FREQ AI replaces the 4-hour manual barge drafting process with autonomous intelligence — delivering results in 15 minutes with zero crew exposure.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/platform" className="rounded-lg bg-[#7C3AED] px-6 py-3 font-medium text-white hover:bg-[#6D28D9]">Explore the Platform</Link>
            <Link href="/contact" className="rounded-lg border border-[#7C3AED] px-6 py-3 font-medium text-[#7C3AED] hover:bg-[#7C3AED]/10">Contact Us</Link>
          </div>
        </div>
      </section>

      <Section title="The Problem" body="Every day, thousands of barges on America's inland waterways undergo a manual cargo drafting process that hasn't changed in decades. Crew members walk barge decks in hazardous conditions, take manual gauge readings, relay numbers by radio, and compile reports by hand. The process takes 4 hours per barge, introduces 1-3% measurement error, and exposes workers to the highest non-navigational fatality risk in the maritime industry: man overboard.">
        <Stats items={[['$2.1B', 'Annual cargo discrepancies on US inland waterways'], ['4 Hours', 'Average manual drafting time per barge'], ['1-3%', 'Industry-standard measurement error rate'], ['#1 Risk', 'Man overboard — highest non-navigational fatality']]} />
      </Section>

      <Section title="The Solution" body="FREQ AI builds the intelligence layer for autonomous maritime cargo operations. Our platform replaces manual processes with AI-driven data acquisition, real-time analysis, and verified reporting — reducing drafting time by over 90% while eliminating crew safety risk entirely.">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            ['10-15 Minutes', 'Autonomous drafting cycle time', 'What took 4 hours now takes minutes through automated data acquisition and AI-driven analysis.'],
            ['Sub-Inch Accuracy', 'Precision measurement', 'Exceeding manual accuracy by orders of magnitude, eliminating cargo discrepancies and revenue leakage.'],
            ['Zero Exposure', 'Complete crew safety', 'No personnel required on deck during drafting operations. Man-overboard risk eliminated entirely.'],
            ['Real-Time Intelligence', 'Continuous monitoring', 'Live cargo status, draft readings, and stability metrics available instantly to all stakeholders.'],
          ].map(([a, b, c]) => (
            <div key={a} className={card}><h3 className="font-mono text-2xl text-white">{a}</h3><p className="mt-1 text-[#06B6D4]">{b}</p><p className="mt-3 text-sm text-[#9CA3AF]">{c}</p></div>
          ))}
        </div>
      </Section>

      <Section title="How It Works">
        <div className="grid gap-6 md:grid-cols-4">
          {[
            ['Target', 'Identify the vessel and define operational parameters for the drafting sequence.'],
            ['Execute', 'Autonomous data acquisition captures precise measurements across the entire vessel.'],
            ['Analyze', 'AI-driven intelligence processes raw data into verified cargo metrics in real-time.'],
            ['Report', 'Comprehensive draft readings, stability analysis, and compliance documentation delivered instantly.'],
          ].map(([title, text], i) => (
            <div key={title} className={card}><p className="text-sm text-[#7C3AED]">Step {i + 1}</p><h3 className="mt-2 text-xl font-semibold text-white">{title}</h3><p className="mt-3 text-sm text-[#9CA3AF]">{text}</p></div>
          ))}
        </div>
      </Section>

      <Section title="The Opportunity" body="America's inland waterway system is the backbone of domestic commerce — and it's overdue for modernization.">
        <Stats items={[['22,356', 'Active barges on US inland waterways'], ['600M+', 'Tons of cargo transported annually'], ['$6.96B', 'Autonomous maritime market (2025)'], ['D+', 'ASCE infrastructure grade for inland waterways']]} />
      </Section>

      <section className="py-24">
        <div className="mx-auto max-w-5xl rounded-lg border border-[#1E293B] bg-[#111827] px-6 py-14 text-center sm:px-10">
          <h2 className="text-3xl font-bold text-white">Ready to modernize your cargo operations?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#9CA3AF]">Connect with our team to learn how FREQ AI can transform your maritime drafting process.</p>
          <Link href="/contact" className="mt-8 inline-block rounded-lg bg-[#7C3AED] px-6 py-3 font-medium text-white hover:bg-[#6D28D9]">Get in Touch</Link>
          <p className="mt-4 text-sm text-[#9CA3AF]">info@freqai.io</p>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  )
}

function Section({ title, body, children }: { title: string; body?: string; children: React.ReactNode }) {
  return <section className="py-24"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><h2 className="text-3xl font-bold text-white">{title}</h2>{body && <p className="mt-4 max-w-4xl text-[#9CA3AF]">{body}</p>}<div className="mt-10">{children}</div></div></section>
}

function Stats({ items }: { items: string[][] }) {
  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{items.map(([n, l]) => <div key={n} className={card}><p className="font-mono text-3xl text-white">{n}</p><p className="mt-2 text-sm text-[#9CA3AF]">{l}</p></div>)}</div>
}
