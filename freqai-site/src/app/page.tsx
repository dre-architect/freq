import Link from "next/link";

const stats = [
  { value: "15 min", label: "Draft survey time", sub: "down from 4 hours" },
  { value: "93%", label: "Time reduction", sub: "per loading operation" },
  { value: "±2cm", label: "Draft accuracy", sub: "RGB-D measurement precision" },
  { value: "24/7", label: "Autonomous operation", sub: "no human surveyors required" },
];

const pipeline = [
  {
    step: "01",
    title: "Capture",
    description:
      "RGB-D cameras mounted on crane infrastructure capture high-density point clouds of the barge hull and waterline in real time.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Validate",
    description:
      "Our Validator Agent checks point density, confidence scores, draft limits, and trim/heel angles. Bad data never reaches the crane.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Compute",
    description:
      "The Vector Computer Agent calculates optimal crane movement vectors with built-in safety margins from validated 3D geometry.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    step: "04",
    title: "Execute",
    description:
      "ISO 6983-compliant G-Code commands are generated and sent to the crane control system. Every move is logged and auditable.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

const problems = [
  {
    title: "Manual draft surveys take 4+ hours",
    description:
      "Certified surveyors physically board barges, take visual readings at multiple draft marks, and manually calculate displacement. Weather delays, human error, and scheduling bottlenecks compound the problem.",
  },
  {
    title: "$12B+ in annual cargo disputes",
    description:
      "Inaccurate draft readings lead to over-loading, under-loading, and contested cargo quantities. Every centimeter of draft error translates to tons of misreported cargo.",
  },
  {
    title: "Safety incidents during boarding",
    description:
      "Surveyors board moving vessels in all weather conditions. Falls, crush injuries, and drownings are persistent risks in an industry that has resisted automation for decades.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-freq-purple/5 via-transparent to-transparent" />
        <div className="section-padding pt-32 pb-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-freq-purple/10 border border-freq-purple/20 text-freq-purple text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-freq-purple mr-2 animate-pulse" />
              Now in development — Houston, TX
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Autonomous barge drafting in{" "}
              <span className="gradient-text">15 minutes</span>, not 4 hours
            </h1>
            <p className="text-xl text-freq-muted max-w-2xl mb-8 leading-relaxed">
              FREQ AI uses RGB-D computer vision and autonomous crane control to
              replace manual draft surveys — eliminating human error, reducing
              costs by 93%, and keeping surveyors off dangerous decks.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/platform" className="btn-primary">
                See How It Works
              </Link>
              <Link href="/contact" className="btn-outline">
                Request a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-freq-border bg-freq-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-white font-medium text-sm">{stat.label}</div>
                <div className="text-freq-muted text-xs mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="section-padding">
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            The maritime industry has a{" "}
            <span className="text-freq-teal">measurement problem</span>
          </h2>
          <p className="text-freq-muted text-lg">
            Barge drafting — the process of measuring how deep a loaded vessel
            sits in the water — hasn&apos;t fundamentally changed in over a century.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem) => (
            <div key={problem.title} className="card">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {problem.title}
              </h3>
              <p className="text-freq-muted text-sm leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section className="section-padding bg-freq-card/30">
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            From sensor to crane in{" "}
            <span className="gradient-text">four steps</span>
          </h2>
          <p className="text-freq-muted text-lg">
            Our Lattice Core architecture orchestrates a fully autonomous
            pipeline — from raw depth data to validated crane commands.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pipeline.map((item) => (
            <div key={item.step} className="card group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-freq-purple/10 flex items-center justify-center text-freq-purple group-hover:bg-freq-purple group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <span className="text-freq-muted/30 text-3xl font-bold">
                  {item.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-freq-muted text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="card text-center py-16 px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-freq-purple/5 to-freq-teal/5" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to automate your draft operations?
            </h2>
            <p className="text-freq-muted text-lg max-w-2xl mx-auto mb-8">
              We&apos;re working with early partners in the Houston Ship Channel.
              If you operate barges, terminals, or surveying services — let&apos;s talk.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary">
                Contact Us
              </Link>
              <Link href="/solutions/barge-drafting" className="btn-outline">
                View Solution Details
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
