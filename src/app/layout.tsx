import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  metadataBase: new URL('https://freqai.io'),
  title: {
    default: 'FREQ AI | Autonomous Maritime Cargo Intelligence',
    template: '%s | FREQ AI',
  },
  description:
    'FREQ AI builds the intelligence layer for autonomous maritime cargo operations. Replacing the 4-hour manual barge drafting process with 15-minute autonomous intelligence.',
  keywords: [
    'maritime intelligence',
    'barge drafting',
    'autonomous operations',
    'cargo intelligence',
    'maritime technology',
    'inland waterways',
  ],
  authors: [{ name: 'FREQ AI' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://freqai.io',
    siteName: 'FREQ AI',
    title: 'FREQ AI | Autonomous Maritime Cargo Intelligence',
    description: 'Replacing the 4-hour manual barge drafting process with 15-minute autonomous intelligence.',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'FREQ AI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FREQ AI | Autonomous Maritime Cargo Intelligence',
    description: 'Replacing the 4-hour manual barge drafting process with 15-minute autonomous intelligence.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
