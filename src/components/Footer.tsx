import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-freq-border bg-freq-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-freq-purple to-freq-teal flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold text-white">
                FREQ<span className="text-freq-purple">AI</span>
              </span>
            </Link>
            <p className="text-freq-muted text-sm leading-relaxed">
              Autonomous maritime intelligence. Reducing 4-hour barge drafting operations to 15 minutes with computer vision and AI.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/platform" className="text-freq-muted hover:text-white text-sm transition-colors">How It Works</Link></li>
              <li><Link href="/solutions/barge-drafting" className="text-freq-muted hover:text-white text-sm transition-colors">Barge Drafting</Link></li>
              <li><Link href="/platform#safety" className="text-freq-muted hover:text-white text-sm transition-colors">Safety Systems</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-freq-muted hover:text-white text-sm transition-colors">About Us</Link></li>
              <li><Link href="/team" className="text-freq-muted hover:text-white text-sm transition-colors">Team</Link></li>
              <li><Link href="/contact" className="text-freq-muted hover:text-white text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li><a href="mailto:dre@freqai.io" className="text-freq-muted hover:text-white text-sm transition-colors">dre@freqai.io</a></li>
              <li><span className="text-freq-muted text-sm">Houston, Texas</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-freq-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-freq-muted text-sm">
            &copy; {new Date().getFullYear()} FREQ AI. All rights reserved.
          </p>
          <p className="text-freq-muted text-sm mt-2 md:mt-0">
            Built in Houston, TX
          </p>
        </div>
      </div>
    </footer>
  );
}
