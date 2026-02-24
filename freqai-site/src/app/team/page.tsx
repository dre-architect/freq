import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Team — FREQ AI",
  description:
    "Meet the team behind FREQ AI. Founded in Houston, TX — building autonomous maritime intelligence.",
};

const openRoles = [
  {
    title: "Computer Vision Engineer",
    type: "Full-time",
    location: "Houston, TX / Remote",
    description:
      "Build and optimize the RGB-D point cloud processing pipeline. Experience with depth cameras, Open3D, and real-time 3D reconstruction required.",
  },
  {
    title: "Robotics / Controls Engineer",
    type: "Full-time",
    location: "Houston, TX",
    description:
      "Integrate FREQ AI's G-Code output with physical crane control systems. Experience with industrial automation, PLCs, and ISO 6983 G-Code required.",
  },
  {
    title: "Full-Stack Engineer",
    type: "Full-time",
    location: "Houston, TX / Remote",
    description:
      "Build the operator dashboard and real-time monitoring systems. React, Python, WebSockets, and 3D visualization experience preferred.",
  },
];

export default function TeamPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding pt-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Small team, <span className="gradient-text">big problem</span>
          </h1>
          <p className="text-xl text-freq-muted leading-relaxed">
            FREQ AI is a lean startup going after a massive, entrenched
            industry. We&apos;re looking for engineers who want to build
            systems that operate in the physical world.
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="section-padding pt-8">
        <h2 className="text-3xl font-bold mb-8">Founder</h2>
        <div className="card max-w-3xl">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-freq-purple to-freq-teal flex items-center justify-center flex-shrink-0">
              <span className="text-white text-3xl font-bold">D</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Dre</h3>
              <p className="text-freq-purple text-sm mb-4">Founder & CEO</p>
              <p className="text-freq-muted leading-relaxed mb-4">
                Based in Houston, Texas. Building FREQ AI to automate the
                maritime industry&apos;s most manual, dangerous, and
                error-prone operations. Combining computer vision, autonomous
                systems, and industrial control to replace processes that
                haven&apos;t changed in a century.
              </p>
              <p className="text-freq-muted leading-relaxed">
                The vision: a single autonomous platform that handles barge
                drafting end-to-end — from sensor capture to crane execution —
                without a human ever stepping on a moving vessel.
              </p>
              <div className="mt-4">
                <a
                  href="mailto:dre@freqai.io"
                  className="text-freq-teal text-sm hover:underline"
                >
                  dre@freqai.io
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="section-padding">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl font-bold mb-4">Open roles</h2>
          <p className="text-freq-muted text-lg">
            We&apos;re hiring engineers who want to work at the intersection of
            AI, robotics, and maritime industry. Houston-based preferred, but
            we&apos;re open to remote for the right candidates.
          </p>
        </div>
        <div className="grid gap-6 max-w-3xl">
          {openRoles.map((role) => (
            <div key={role.title} className="card group">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <h3 className="text-lg font-semibold text-white">
                  {role.title}
                </h3>
                <div className="flex gap-2 flex-shrink-0">
                  <span className="px-2 py-1 rounded-md bg-freq-purple/10 text-freq-purple text-xs font-medium">
                    {role.type}
                  </span>
                  <span className="px-2 py-1 rounded-md bg-freq-teal/10 text-freq-teal text-xs font-medium">
                    {role.location}
                  </span>
                </div>
              </div>
              <p className="text-freq-muted text-sm leading-relaxed">
                {role.description}
              </p>
              <div className="mt-4">
                <a
                  href={`mailto:dre@freqai.io?subject=Application: ${role.title}`}
                  className="text-freq-purple text-sm font-medium hover:underline"
                >
                  Apply via email &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Culture */}
      <section className="section-padding bg-freq-card/30">
        <h2 className="text-3xl font-bold mb-8">How we work</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-white font-semibold mb-2">Ship real things</h3>
            <p className="text-freq-muted text-sm leading-relaxed">
              We build systems that interact with physical hardware in
              dangerous environments. Every line of code matters. We ship
              working software, not slide decks.
            </p>
          </div>
          <div className="card">
            <h3 className="text-white font-semibold mb-2">Safety obsessed</h3>
            <p className="text-freq-muted text-sm leading-relaxed">
              Our software controls cranes near people. We validate
              aggressively, test relentlessly, and treat every edge case as a
              potential safety incident.
            </p>
          </div>
          <div className="card">
            <h3 className="text-white font-semibold mb-2">Move fast, stay grounded</h3>
            <p className="text-freq-muted text-sm leading-relaxed">
              Startup speed with industrial rigor. We iterate quickly on
              software but never cut corners on safety validation or sensor
              accuracy.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="card text-center py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-freq-purple/5 to-freq-teal/5" />
          <div className="relative">
            <h2 className="text-2xl font-bold mb-4">
              Don&apos;t see your role listed?
            </h2>
            <p className="text-freq-muted mb-6 max-w-lg mx-auto">
              We&apos;re always interested in hearing from talented engineers,
              especially those with maritime, robotics, or computer vision
              backgrounds.
            </p>
            <a href="mailto:dre@freqai.io" className="btn-primary">
              Reach Out
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
