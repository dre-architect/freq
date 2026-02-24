"use client";

import { useState } from "react";
import type { FormEvent } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    // In production, wire this to an API route or service like Formspree
    console.log("Form submitted:", Object.fromEntries(data));
    setSubmitted(true);
  }

  return (
    <>
      {/* Hero */}
      <section className="section-padding pt-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Let&apos;s <span className="gradient-text">talk</span>
          </h1>
          <p className="text-xl text-freq-muted leading-relaxed">
            Whether you&apos;re a terminal operator, barge fleet owner, marine
            surveyor, investor, or engineer — we want to hear from you.
          </p>
        </div>
      </section>

      <section className="section-padding pt-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-white font-semibold mb-3">Email</h3>
              <a
                href="mailto:dre@freqai.io"
                className="text-freq-teal hover:underline"
              >
                dre@freqai.io
              </a>
            </div>

            <div className="card">
              <h3 className="text-white font-semibold mb-3">Location</h3>
              <p className="text-freq-muted">Houston, Texas</p>
              <p className="text-freq-muted text-sm mt-1">
                Operating along the Houston Ship Channel
              </p>
            </div>

            <div className="card">
              <h3 className="text-white font-semibold mb-3">For inquiries about</h3>
              <ul className="space-y-2 text-freq-muted text-sm">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-freq-purple mr-2" />
                  Pilot partnerships
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-freq-teal mr-2" />
                  Investment opportunities
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-freq-purple mr-2" />
                  Engineering roles
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-freq-teal mr-2" />
                  Press and media
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-freq-purple mr-2" />
                  Technical questions
                </li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="card text-center py-16">
                <div className="w-16 h-16 rounded-full bg-freq-teal/10 flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-freq-teal"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Message received
                </h3>
                <p className="text-freq-muted">
                  We&apos;ll get back to you shortly. Thanks for reaching out.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-white mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 bg-freq-bg border border-freq-border rounded-lg text-white placeholder-freq-muted/50 focus:outline-none focus:border-freq-purple transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-white mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 bg-freq-bg border border-freq-border rounded-lg text-white placeholder-freq-muted/50 focus:outline-none focus:border-freq-purple transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-4 py-3 bg-freq-bg border border-freq-border rounded-lg text-white placeholder-freq-muted/50 focus:outline-none focus:border-freq-purple transition-colors"
                    placeholder="Your company (optional)"
                  />
                </div>

                <div>
                  <label
                    htmlFor="interest"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    I&apos;m interested in
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    className="w-full px-4 py-3 bg-freq-bg border border-freq-border rounded-lg text-white focus:outline-none focus:border-freq-purple transition-colors"
                  >
                    <option value="pilot">Pilot partnership</option>
                    <option value="investment">Investment</option>
                    <option value="careers">Careers / joining the team</option>
                    <option value="technical">Technical questions</option>
                    <option value="press">Press / media</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 bg-freq-bg border border-freq-border rounded-lg text-white placeholder-freq-muted/50 focus:outline-none focus:border-freq-purple transition-colors resize-none"
                    placeholder="Tell us what you're looking for..."
                  />
                </div>

                <button type="submit" className="btn-primary w-full justify-center">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
