import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'FREQ AI — Sophisticated Operational Lattice',
  description: 'Phase III Digital Shadow simulation environment'
};

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/simulation', label: 'Simulation' },
  { href: '/agents', label: 'Agents' }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-800 bg-slate-950/90 px-6 py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <h1 className="text-lg font-semibold text-teal-300">FREQ AI — Sophisticated Operational Lattice</h1>
            <nav className="flex gap-3 text-sm">
              {links.map((link) => (
                <Link className="rounded border border-slate-700 px-3 py-1 hover:border-teal-400" key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-6">{children}</main>
      </body>
    </html>
  );
}
