import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Barge Drafting Solution — FREQ AI",
  description:
    "FREQ AI automates barge draft surveys using RGB-D computer vision and autonomous crane control. 4 hours → 15 minutes.",
};

const comparison = [
  {
    metric: "Survey time",
    traditional: "3–4 hours",
    freqai: "~15 minutes",
  },
  {
    metric: "Measurement accuracy",
    traditional: "±5–10 cm (visual)",
    freqai: "±2 cm (RGB-D)",
  },
  {
    metric: "Human risk exposure",
    traditional: "Surveyor boards vessel",
    freqai: "Zero human boarding",
  },
  {
    metric: "Weather dependency",
    traditional: "Delays in rain/fog/darkness",
    freqai: "Operates in all conditions",
  },
  {
    metric: "Data format",
    traditional: "Paper forms, manual entry",
    freqai: "Structured JSON, full audit trail",
  },
  {
    metric: "Cost per survey",
    traditional: "$2,000–$5,000",
    freqai: "~$150 (automated)",
  },
  {
    metric: "Availability",
    traditional: "Business hours, surveyor schedule",
    freqai: "24/7 autonomous operation",
  },
  {
    metric: "Dispute resolution",
    traditional: "Subjective visual readings",
    freqai: "Timestamped 3D point cloud evidence",
  },
];

export default function BargeDraftingPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding pt-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-freq-teal/10 border border-freq-teal/20 text-freq-teal text-sm font-medium mb-6">
            Solution Deep Dive
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Autonomous{" "}
            <span className="gradient-text">barge draft surveys</span>
          </h1>
          <p className="text-xl text-freq-muted leading-relaxed">
            Draft surveying determines how much cargo a barge carries by
            measuring how deep it sits in the water. It&apos;s the single most
            critical measurement in bulk cargo commerce — and it&apos;s still done
            by hand.
          </p>
        </div>
      </section>

      {/* What is draft surveying */}
      <section className="section-padding pt-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              What is a draft survey?
            </h2>
            <p className="text-freq-muted leading-relaxed mb-4">
              A draft survey measures the depth (draft) at which a barge floats
              before and after loading or unloading cargo. By comparing these
              measurements against the vessel&apos;s known displacement tables,
              you can calculate the exact weight of cargo transferred.
            </p>
            <p className="text-freq-muted leading-relaxed mb-4">
              This is the standard method for cargo quantity determination on
              inland waterways. It&apos;s used for billing, regulatory compliance,
              and dispute resolution between shippers, terminal operators, and
              barge fleet owners.
            </p>
            <p className="text-freq-muted leading-relaxed">
              Today, certified marine surveyors physically board the barge,
              read draft marks painted on the hull at six locations (fore, mid,
              aft — both port and starboard), account for trim and heel, and
              calculate displacement by hand or spreadsheet.
            </p>
          </div>
          <div className="card bg-freq-bg border-freq-purple/20">
            <h3 className="text-lg font-semibold text-white mb-4">
              The six draft readings
            </h3>
            <div className="space-y-3 font-mono text-sm">
              {[
                { pos: "Fore Port", code: "FP" },
                { pos: "Fore Starboard", code: "FS" },
                { pos: "Midship Port", code: "MP" },
                { pos: "Midship Starboard", code: "MS" },
                { pos: "Aft Port", code: "AP" },
                { pos: "Aft Starboard", code: "AS" },
              ].map((reading) => (
                <div
                  key={reading.code}
                  className="flex items-center justify-between p-3 rounded-lg bg-freq-card"
                >
                  <span className="text-freq-muted">{reading.pos}</span>
                  <span className="text-freq-teal">{reading.code}</span>
                </div>
              ))}
            </div>
            <p className="text-freq-muted text-xs mt-4">
              FREQ AI captures all six readings simultaneously using mounted
              RGB-D cameras — no human boarding required.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-padding">
        <h2 className="text-3xl font-bold mb-8">
          Traditional vs. <span className="gradient-text">FREQ AI</span>
        </h2>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-freq-border">
                <th className="text-left py-3 px-4 text-freq-muted text-sm font-medium">
                  Metric
                </th>
                <th className="text-left py-3 px-4 text-red-400 text-sm font-medium">
                  Traditional Survey
                </th>
                <th className="text-left py-3 px-4 text-freq-teal text-sm font-medium">
                  FREQ AI
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.metric} className="border-b border-freq-border/50">
                  <td className="py-3 px-4 text-white text-sm font-medium">
                    {row.metric}
                  </td>
                  <td className="py-3 px-4 text-freq-muted text-sm">
                    {row.traditional}
                  </td>
                  <td className="py-3 px-4 text-freq-teal text-sm font-medium">
                    {row.freqai}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding bg-freq-card/30">
        <h2 className="text-3xl font-bold mb-12">
          How FREQ AI automates draft surveys
        </h2>
        <div className="space-y-8 max-w-3xl">
          {[
            {
              step: "1",
              title: "RGB-D cameras capture the hull",
              description:
                "Depth cameras mounted on existing crane infrastructure capture high-density point clouds of the barge hull and waterline. Multiple cameras provide overlapping coverage of all six draft mark positions simultaneously.",
            },
            {
              step: "2",
              title: "Point cloud is reconstructed in 3D",
              description:
                "Raw depth data is converted into a 3D point cloud representation. The system identifies the waterline, draft marks, and hull geometry — building a complete digital model of the vessel's current loading state.",
            },
            {
              step: "3",
              title: "Validator Agent checks all safety constraints",
              description:
                "Before any calculations proceed, the Validator Agent verifies point density, confidence scores, and measurement quality. It checks draft limits, trim angles, and heel angles against safety thresholds. If anything is out of spec, the pipeline stops.",
            },
            {
              step: "4",
              title: "Vector Computer calculates crane movements",
              description:
                "Validated geometry feeds into the Vector Computer Agent, which computes the optimal crane movement vectors for any required loading operations. Safety margins are built into every vector calculation.",
            },
            {
              step: "5",
              title: "G-Code commands are generated and executed",
              description:
                "The G-Code Translator Agent produces ISO 6983-compliant commands for the crane control system. Every command includes safety preambles and is logged with timestamps for complete auditability.",
            },
            {
              step: "6",
              title: "Results are logged and available instantly",
              description:
                "All draft measurements, 3D point clouds, agent decisions, and crane commands are stored as structured JSON data. Operators see results in real time through the web dashboard. Cargo quantities are calculated automatically from displacement tables.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-6">
              <div className="w-10 h-10 rounded-full bg-freq-purple/10 border border-freq-purple/30 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-freq-purple text-sm font-bold">
                  {item.step}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-freq-muted text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Market */}
      <section className="section-padding">
        <h2 className="text-3xl font-bold mb-8">Market opportunity</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <div className="text-3xl font-bold gradient-text mb-2">
              $4.6B
            </div>
            <h3 className="text-white font-semibold mb-2">
              Marine survey market
            </h3>
            <p className="text-freq-muted text-sm leading-relaxed">
              The global marine survey services market, with draft surveys
              representing a significant segment of recurring operational
              revenue for survey firms.
            </p>
          </div>
          <div className="card">
            <div className="text-3xl font-bold gradient-text mb-2">
              31,000+
            </div>
            <h3 className="text-white font-semibold mb-2">
              U.S. inland barges
            </h3>
            <p className="text-freq-muted text-sm leading-relaxed">
              Active barges on the U.S. inland waterway system, each requiring
              draft surveys for every loading and unloading operation — often
              multiple times per voyage.
            </p>
          </div>
          <div className="card">
            <div className="text-3xl font-bold gradient-text mb-2">
              630M tons
            </div>
            <h3 className="text-white font-semibold mb-2">
              Annual inland cargo
            </h3>
            <p className="text-freq-muted text-sm leading-relaxed">
              Total cargo moved on U.S. inland waterways annually. Every ton
              requires accurate draft measurement for proper billing and
              regulatory compliance.
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
              Ready to pilot FREQ AI at your terminal?
            </h2>
            <p className="text-freq-muted mb-6 max-w-lg mx-auto">
              We&apos;re partnering with terminal operators and barge fleet owners
              in the Houston Ship Channel for early deployments.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary">
                Schedule a Conversation
              </Link>
              <Link href="/platform" className="btn-outline">
                View Platform Details
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
