'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/platform', label: 'Platform' },
  { href: '/solutions/barge-drafting', label: 'Solutions' },
  { href: '/about', label: 'About' },
  { href: '/team', label: 'Team' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[#1E293B] bg-[#0A0E1A]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          FREQ <span className="text-[#7C3AED]">AI</span>
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-md border border-[#1E293B] p-2 text-[#E5E7EB] md:hidden"
          aria-label="Toggle navigation"
        >
          <span className="block h-0.5 w-5 bg-current" />
          <span className="mt-1 block h-0.5 w-5 bg-current" />
          <span className="mt-1 block h-0.5 w-5 bg-current" />
        </button>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => {
            const active = pathname === link.href || (link.href === '/solutions/barge-drafting' && pathname.startsWith('/solutions'))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b-2 pb-1 text-sm transition ${
                  active
                    ? 'border-[#7C3AED] text-[#7C3AED]'
                    : 'border-transparent text-[#E5E7EB] hover:text-[#7C3AED]'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
          <Link href="/contact" className="rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white hover:bg-[#6D28D9]">
            Get Started
          </Link>
        </div>
      </nav>
      {open && (
        <div className="border-t border-[#1E293B] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-[#E5E7EB] hover:text-[#7C3AED]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-block rounded-lg bg-[#7C3AED] px-4 py-2 text-center text-sm font-medium text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
