import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — FREQ AI",
  description:
    "FREQ AI is a Houston-based startup building autonomous maritime intelligence systems using computer vision and AI.",
};

const milestones = [
  {
    year: "2024",
    title: "Company Founded",
    description:
      "FREQ AI was founded in Houston, Texas — the epicenter of U.S. inland waterway commerce and the nation's largest port complex by tonnage.",
  },
  {
    year: "2024",
    title: "Lattice Core Architecture",
    description:
      "Designed and built the Lattice Core agent-based orchestration system — a modular pipeline that takes raw sensor data through validation, computation, and crane control.",
  },
  {
    year: "2025",
    title: "v4.0 System Complete",
    description:
      "Completed FREQ AI v4.0 with full agent pipeline: Validator Agent, Vector Computer Agent, G-Code Translator Agent, 3D point cloud visualization, and REST API.",
  },
  {
    year: "2025",
    title: "Early Partner Engagement",
    description:
      "Began conversations with terminal operators, barge fleet owners, and marine surveyors along the Houston Ship Channel for pilot deployments.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding pt-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            We&apos;re building the{" "}
            <span className="gradient-text">operating system</span> for
            autonomous maritime operations
          </h1>
          <p className="text-xl text-freq-muted leading-relaxed">
            FREQ AI was founded with a single conviction: the maritime
            industry&apos;s most dangerous and time-consuming manual processes can be
            replaced entirely by computer vision and intelligent automation.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding pt-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="card">
            <div className="w-12 h-12 rounded-xl bg-freq-purple/10 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-freq-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-freq-muted leading-relaxed">
              Eliminate the need for humans to perform dangerous manual
              measurements on moving vessels. We&apos;re replacing century-old
              visual inspection methods with autonomous RGB-D sensing and
              AI-driven crane operations — starting with barge draft surveys on
              the Houston Ship Channel.
            </p>
          </div>

          <div className="card">
            <div className="w-12 h-12 rounded-xl bg-freq-teal/10 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-freq-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Why Houston</h2>
            <p className="text-freq-muted leading-relaxed">
              Houston is home to the largest petrochemical port complex in the
              United States. The Houston Ship Channel processes over 250 million
              tons of cargo annually, with thousands of barge movements per
              month. This is ground zero for inland waterway commerce — and
              where draft survey automation will have the most immediate
              impact.
            </p>
          </div>
        </div>
      </section>

      {/* Core Beliefs */}
      <section className="section-padding">
        <h2 className="text-3xl font-bold mb-12">What we believe</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-freq-purple mb-3">
              Vision-first sensing
            </h3>
            <p className="text-freq-muted text-sm leading-relaxed">
              We use RGB-D cameras and optical sensors exclusively — no LiDAR.
              Camera-based systems are cheaper, more maintainable, and produce
              richer data for AI interpretation. This is a deliberate
              architectural choice.
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-freq-teal mb-3">
              Safety is non-negotiable
            </h3>
            <p className="text-freq-muted text-sm leading-relaxed">
              Every sensor reading passes through validation before it can
              trigger crane movement. Our watchdog system uses computer vision
              to detect human presence and halts all operations immediately.
              Agents never talk directly to hardware.
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-3">
              Modular by design
            </h3>
            <p className="text-freq-muted text-sm leading-relaxed">
              The Lattice Core architecture is built so any agent can be
              swapped, upgraded, or audited independently. Barge drafting is
              our first application — but the platform is designed for any
              crane-based maritime operation.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-freq-card/30">
        <h2 className="text-3xl font-bold mb-12">Our journey</h2>
        <div className="space-y-8">
          {milestones.map((milestone, i) => (
            <div key={i} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-freq-purple/10 border border-freq-purple/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-freq-purple text-sm font-bold">
                    {milestone.year}
                  </span>
                </div>
                {i < milestones.length - 1 && (
                  <div className="w-px h-full bg-freq-border mt-2" />
                )}
              </div>
              <div className="pb-8">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {milestone.title}
                </h3>
                <p className="text-freq-muted text-sm leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="card text-center py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-freq-purple/5 to-freq-teal/5" />
          <div className="relative">
            <h2 className="text-2xl font-bold mb-4">
              Interested in what we&apos;re building?
            </h2>
            <p className="text-freq-muted mb-6 max-w-lg mx-auto">
              Whether you&apos;re a potential partner, investor, or fellow engineer
              — we&apos;d love to hear from you.
            </p>
            <Link href="/contact" className="btn-primary">
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
