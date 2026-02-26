import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact | FREQ AI',
  description: 'Contact FREQ AI for autonomous maritime cargo intelligence.',
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-white sm:text-5xl">Get in Touch</h1>
      <p className="mt-6 max-w-4xl text-lg text-[#9CA3AF]">Whether you&apos;re an operator exploring autonomous drafting, a technology partner, or an investor — we&apos;d like to hear from you.</p>

      <section className="py-20 grid gap-8 lg:grid-cols-2">
        <ContactForm />
        <div className="rounded-lg border border-[#1E293B] bg-[#111827] p-6">
          <h2 className="text-2xl font-bold text-white">Direct Contact</h2>
          <ul className="mt-5 space-y-4 text-[#9CA3AF]">
            <li>Email: <a href="mailto:info@freqai.io" className="text-[#7C3AED] hover:opacity-80">info@freqai.io</a></li>
            <li>Location: Slidell, Louisiana</li>
            <li>LinkedIn: <a href="https://linkedin.com/in/andry-alvarez" target="_blank" rel="noreferrer" className="text-[#7C3AED] hover:opacity-80">linkedin.com/in/andry-alvarez</a></li>
            <li>Response time: We typically respond within 24 hours.</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
