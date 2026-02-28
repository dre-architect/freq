import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://freqai.io"),
  title: "FREQ AI — Autonomous Maritime Intelligence",
  description:
    "FREQ AI reduces 4-hour barge drafting operations to 15 minutes using RGB-D computer vision and autonomous crane control. Built in Houston, TX.",
  openGraph: {
    title: "FREQ AI — Autonomous Maritime Intelligence",
    description:
      "Autonomous barge drafting with computer vision and AI crane control.",
    url: "https://freqai.io",
    siteName: "FREQ AI",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "FREQ AI — Autonomous Maritime Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FREQ AI — Autonomous Maritime Intelligence",
    description:
      "Autonomous barge drafting with computer vision and AI crane control.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
