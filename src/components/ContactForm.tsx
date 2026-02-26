'use client'

import { FormEvent, useState } from 'react'

const FORMSPREE_ID = ''

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (!FORMSPREE_ID) {
      return
    }

    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })

      if (response.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      action={FORMSPREE_ID ? `https://formspree.io/f/${FORMSPREE_ID}` : 'mailto:info@freqai.io'}
      method="POST"
      encType="text/plain"
      className="rounded-lg border border-[#1E293B] bg-[#111827] p-6"
    >
      <div className="space-y-4">
        <input name="name" required placeholder="Name" className="w-full rounded-lg border border-[#1E293B] bg-[#0A0E1A] p-3 text-sm text-[#E5E7EB]" />
        <input name="email" type="email" required placeholder="Email" className="w-full rounded-lg border border-[#1E293B] bg-[#0A0E1A] p-3 text-sm text-[#E5E7EB]" />
        <input name="company" placeholder="Company" className="w-full rounded-lg border border-[#1E293B] bg-[#0A0E1A] p-3 text-sm text-[#E5E7EB]" />
        <textarea name="message" required placeholder="Message" rows={5} className="w-full rounded-lg border border-[#1E293B] bg-[#0A0E1A] p-3 text-sm text-[#E5E7EB]" />
      </div>
      <button type="submit" className="mt-5 rounded-lg bg-[#7C3AED] px-6 py-3 font-medium text-white hover:bg-[#6D28D9]">Send Message</button>
      {status === 'success' && <p className="mt-4 text-sm text-[#10B981]">✓ Message sent. We’ll be in touch shortly.</p>}
      {status === 'error' && <p className="mt-4 text-sm text-[#EF4444]">Something went wrong. Please email us directly at info@freqai.io</p>}
      {!FORMSPREE_ID && (
        <p className="mt-4 text-xs text-[#6B7280]">Formspree ID not configured. Submissions will open your email client.</p>
      )}
    </form>
  )
}
