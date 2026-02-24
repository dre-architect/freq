import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Platform — FREQ AI",
  description:
    "The FREQ AI platform uses RGB-D computer vision, agent-based orchestration, and autonomous crane control to automate barge draft surveys.",
};

const agents = [
  {
    name: "Validator Agent",
    role: "Data Quality & Safety Gate",
    color: "freq-purple",
    description:
      "Enforces minimum point counts, confidence thresholds, draft limits, and trim/heel angle constraints. If the data doesn't meet safety standards, the pipeline stops. No exceptions.",
    checks: [
      "Point cloud density verification",
      "Confidence score thresholds",
      "Draft limit enforcement",
      "Trim and heel angle validation",
      "Sensor health monitoring",
    ],
  },
  {
    name: "Vector Computer Agent",
    role: "Movement Calculation Engine",
    color: "freq-teal",
    description:
      "Takes validated 3D geometry and computes optimal crane movement vectors with built-in safety margins. Accounts for load weight, boom angle, wind conditions, and barge stability.",
    checks: [
      "3D vector computation from point clouds",
      "Safety margin calculation",
      "Load distribution analysis",
      "Collision avoidance paths",
      "Movement optimization",
    ],
  },
  {
    name: "G-Code Translator Agent",
    role: "Crane Command Generator",
    color: "freq-purple-light",
    description:
      "Translates computed vectors into ISO 6983-compliant G-Code that crane control systems understand. Includes safety preambles, spindle control sequences, and emergency stop codes.",
    checks: [
      "ISO 6983 G-Code generation",
      "Safety preamble injection",
      "Tool change sequences",
      "Feed rate optimization",
      "Emergency stop codes",
    ],
  },
];

const techStack = [
  { category: "Sensing", items: ["RGB-D Cameras", "Depth Mapping", "Point Cloud Generation"] },
  { category: "Processing", items: ["Python 3.11", "Open3D", "NumPy", "Real-time Pipeline"] },
  { category: "Orchestration", items: ["Lattice Core", "Agent Pipeline", "JSON State Bus"] },
  { category: "Visualization", items: ["CesiumJS", "React 18", "3D Point Cloud Viewer"] },
  { category: "Output", items: ["ISO 6983 G-Code", "REST API", "WebSocket Streams"] },
  { category: "Infrastructure", items: ["Docker", "CI/CD", "pytest (25+ tests)"] },
];

export default function PlatformPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding pt-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            An <span className="gradient-text">agent-based architecture</span>{" "}
            for autonomous maritime operations
          </h1>
          <p className="text-xl text-freq-muted leading-relaxed">
            The FREQ AI platform is built on the Lattice Core — a central
            orchestration system that manages specialized agents through a
            sequential processing pipeline. From raw sensor data to validated
            crane commands, every step is automated, logged, and auditable.
          </p>
        </div>
      </section>

      {/* Pipeline Diagram */}
      <section className="section-padding pt-8">
        <h2 className="text-3xl font-bold mb-8">The pipeline</h2>
        <div className="card overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] py-4 px-2">
            {[
              { label: "RGB-D Camera", sub: "Depth sensing" },
              { label: "Point Cloud", sub: "3D reconstruction" },
              { label: "Validator", sub: "Safety gate" },
              { label: "Vector Computer", sub: "Path planning" },
              { label: "G-Code Translator", sub: "Crane commands" },
              { label: "Crane", sub: "Physical execution" },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-freq-purple/20 to-freq-teal/20 border border-freq-border flex items-center justify-center mb-2 mx-auto">
                    <span className="text-white font-mono text-xs font-bold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="text-white text-xs font-semibold">
                    {step.label}
                  </div>
                  <div className="text-freq-muted text-[10px]">{step.sub}</div>
                </div>
                {i < arr.length - 1 && (
                  <div className="mx-3 text-freq-purple">
                    <svg className="w-6 h-4" fill="none" viewBox="0 0 24 16" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 8h18m-4-4l4 4-4 4" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lattice Core */}
      <section className="section-padding">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-4">Lattice Core</h2>
            <p className="text-freq-muted leading-relaxed mb-6">
              The Lattice Core is the central nervous system of FREQ AI. It
              manages agent registration, orchestrates cycle execution, and
              maintains a shared JSON state that agents read from and write to.
            </p>
            <p className="text-freq-muted leading-relaxed mb-6">
              Agents never communicate directly with each other or with
              hardware. Every interaction flows through the Lattice Core&apos;s
              state bus — making the system fully auditable and inherently safer.
            </p>
            <div className="card bg-freq-bg">
              <h4 className="text-sm font-semibold text-freq-teal mb-2">
                State-first architecture
              </h4>
              <p className="text-freq-muted text-sm">
                All agent outputs are JSON state updates. This means every
                decision, every measurement, and every crane command is
                structured data that can be logged, replayed, and audited.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {agents.map((agent) => (
              <div key={agent.name} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {agent.name}
                    </h3>
                    <span className={`text-${agent.color} text-sm`}>
                      {agent.role}
                    </span>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-freq-purple/10 text-freq-purple text-xs font-mono">
                    agent
                  </span>
                </div>
                <p className="text-freq-muted text-sm leading-relaxed mb-4">
                  {agent.description}
                </p>
                <ul className="space-y-1">
                  {agent.checks.map((check) => (
                    <li
                      key={check}
                      className="text-freq-muted text-xs flex items-center"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-freq-teal mr-2 flex-shrink-0" />
                      {check}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section id="safety" className="section-padding bg-freq-card/30">
        <h2 className="text-3xl font-bold mb-4">
          Safety is <span className="text-freq-teal">built in</span>, not
          bolted on
        </h2>
        <p className="text-freq-muted text-lg max-w-2xl mb-12">
          Every layer of the FREQ AI platform is designed with safety as a
          hard constraint — not an afterthought.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Validation Gate",
              desc: "Data must pass quality and safety checks before entering the computation pipeline. Bad data is rejected, not corrected.",
            },
            {
              title: "Human Detection",
              desc: "Computer vision watchdog monitors the crane zone continuously. Operations halt immediately if a person is detected.",
            },
            {
              title: "State Isolation",
              desc: "Agents communicate through JSON state only — never directly with hardware drivers. This prevents cascading failures.",
            },
            {
              title: "Audit Trail",
              desc: "Every sensor reading, agent decision, and crane command is logged with timestamps. Full operational replay is possible.",
            },
          ].map((item) => (
            <div key={item.title} className="card">
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-freq-muted text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section-padding">
        <h2 className="text-3xl font-bold mb-8">Technology stack</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((group) => (
            <div key={group.category} className="card">
              <h3 className="text-freq-purple font-semibold text-sm uppercase tracking-wider mb-3">
                {group.category}
              </h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-freq-muted text-sm flex items-center">
                    <span className="w-1 h-1 rounded-full bg-freq-border mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
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
              Want the deep technical dive?
            </h2>
            <p className="text-freq-muted mb-6 max-w-lg mx-auto">
              See how FREQ AI applies to real barge drafting operations — with
              specific measurements, costs, and timelines.
            </p>
            <Link href="/solutions/barge-drafting" className="btn-primary">
              View Barge Drafting Solution
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
