import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[#1E293B] bg-[#0A0E1A]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <h3 className="text-lg font-semibold text-white">FREQ <span className="text-[#7C3AED]">AI</span></h3>
          <p className="mt-3 text-sm text-[#9CA3AF]">Autonomous Maritime Intelligence</p>
        </div>
        <div>
          <h4 className="font-semibold text-white">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-[#9CA3AF]">
            <li><Link href="/platform" className="hover:text-[#7C3AED]">Platform</Link></li>
            <li><Link href="/solutions/barge-drafting" className="hover:text-[#7C3AED]">Solutions</Link></li>
            <li><Link href="/platform" className="hover:text-[#7C3AED]">Demo</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-[#9CA3AF]">
            <li><Link href="/about" className="hover:text-[#7C3AED]">About</Link></li>
            <li><Link href="/team" className="hover:text-[#7C3AED]">Team</Link></li>
            <li><Link href="/contact" className="hover:text-[#7C3AED]">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">Connect</h4>
          <ul className="mt-3 space-y-2 text-sm text-[#9CA3AF]">
            <li><a href="mailto:info@freqai.io" className="hover:text-[#7C3AED]">info@freqai.io</a></li>
            <li><a href="https://linkedin.com/in/andry-alvarez" target="_blank" rel="noreferrer" className="hover:text-[#7C3AED]">LinkedIn</a></li>
            <li>Slidell, Louisiana</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#1E293B] py-5 text-center text-sm text-[#6B7280]">© 2026 FREQ AI. All rights reserved.</div>
    </footer>
  )
}
