import { useState, useEffect, useRef } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";

import { TEAL, ORANGE } from "@/app/theme";
import { Divider, GradientEyebrow, CTAButton, MoleculeNetwork } from "@/app/components/common";

export function ContactPage({ focusForm = false, onFocusHandled }: { focusForm?: boolean; onFocusHandled?: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  useEffect(() => {
    if (!focusForm) return;
    const t = setTimeout(() => {
      const el = formRef.current;
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
        setHighlight(true);
        setTimeout(() => setHighlight(false), 1600);
      }
      onFocusHandled?.();
    }, 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusForm]);

  return (
    <div
      className="relative overflow-hidden pt-24 pb-28"
      style={{ background: "linear-gradient(180deg, transparent 0%, rgba(232,124,42,0.03) 45%, transparent 100%)" }}
    >
      <style>{`
        @keyframes faqFloat { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(0,-26px) scale(1.05); } }
        @keyframes faqDrift { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,16px) scale(1.08); } }
        @keyframes faqGlow  { 0%,100% { opacity:.4; } 50% { opacity:.8; } }
        @keyframes faqPop   { from { opacity:0; transform: translateY(16px) scale(.97); } to { opacity:1; transform: translateY(0) scale(1); } }
        .faq-pop { animation: faqPop .6s cubic-bezier(.16,.84,.44,1) both; }
        @media (prefers-reduced-motion: reduce) { .faq-pop { animation: none; } }

        .contact-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.12);
          color: #E8EDF5;
          font-size: 16px;
          padding: 10px 0 12px;
          outline: none;
          transition: border-color 0.3s;
          font-family: inherit;
        }
        .contact-input::placeholder { color: rgba(255,255,255,0.25); }
        .contact-input:focus { border-bottom-color: ${TEAL}; }
        .contact-input.highlight-focus { border-bottom-color: ${TEAL}; box-shadow: 0 2px 0 0 ${TEAL}55; }
        textarea.contact-input { resize: none; }
      `}</style>

      {/* Background — matches FAQ/Logistics/Partnership exactly */}
      <MoleculeNetwork />
      <div className="absolute -left-32 top-10 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${TEAL}2E 0%, transparent 65%)`, filter: "blur(60px)", animation: "faqFloat 14s ease-in-out infinite, faqGlow 9s ease-in-out infinite" }} />
      <div className="absolute right-[-9rem] bottom-0 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${ORANGE}26 0%, transparent 65%)`, filter: "blur(70px)", animation: "faqDrift 18s ease-in-out infinite, faqGlow 11s ease-in-out infinite" }} />
      <div className="absolute inset-0 pointer-events-none opacity-60" style={{
        backgroundImage: `linear-gradient(rgba(12,191,206,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(12,191,206,0.035) 1px, transparent 1px)`,
        backgroundSize: "72px 72px",
        maskImage: "radial-gradient(ellipse 70% 70% at 50% 35%, black 30%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 35%, black 30%, transparent 80%)",
      }} />

      <div className="relative max-w-2xl mx-auto px-6">

        {/* Header — same eyebrow + gradient title as other pages */}
        <div className="faq-pop mb-12">
          <div className="mb-7">
            <GradientEyebrow>Get In Touch</GradientEyebrow>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-extrabold leading-tight mb-4">
            <span className="text-white">Get In</span>
            <br />
            <span style={{ background: `linear-gradient(120deg, ${TEAL}, ${ORANGE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Touch.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-4 max-w-lg">
            Whether you have questions about registration, partnerships, logistics, or the program — our team will get back to you promptly.
          </p>
        </div>

        {/* Form — floats directly on the dark background, no card wrapper */}
        <div
          ref={formRef}
          className="faq-pop"
          style={{
            animationDelay: "120ms",
            scrollMarginTop: "100px",
            outline: highlight ? `2px solid ${TEAL}55` : "none",
            outlineOffset: highlight ? "22px" : "0px",
            borderRadius: 8,
            transition: "outline 0.4s ease, outline-offset 0.4s ease",
          }}
        >
          {sent ? (
            <div className="text-center py-16">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: `${TEAL}15`, border: `2px solid ${TEAL}40` }}
              >
                <CheckCircle className="w-8 h-8" style={{ color: TEAL }} />
              </div>
              <h3 className="font-display text-3xl font-bold text-white mb-3">Message Sent.</h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                Thank you for reaching out. We'll get back to you within 48 hours.
              </p>
              <button
                className="text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: TEAL }}
                onClick={() => setSent(false)}
              >
                Send another message →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Field rows — underline style, no boxes */}
              <div className="space-y-10">
                <div className="grid sm:grid-cols-2 gap-10">
                  <div>
                    <label className="block text-xs font-mono tracking-[0.2em] uppercase mb-3" style={{ color: `${TEAL}99` }}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Ahmed Al-Rashidi"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                      className={`contact-input${highlight ? " highlight-focus" : ""}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono tracking-[0.2em] uppercase mb-3" style={{ color: `${TEAL}99` }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="ahmed@university.edu"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required
                      className="contact-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono tracking-[0.2em] uppercase mb-3" style={{ color: `${TEAL}99` }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Partnership Inquiry"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    required
                    className="contact-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono tracking-[0.2em] uppercase mb-3" style={{ color: `${TEAL}99` }}>
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us how we can help..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    required
                    className="contact-input"
                  />
                </div>
              </div>

              {/* Divider + submit row */}
              <div
                className="mt-10 pt-8 flex items-center justify-between gap-4 flex-wrap"
              >
                <CTAButton primary>
                  Send Message <ArrowRight className="w-4 h-4" />
                </CTAButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
// ─── Root App ─────────────────────────────────────────────
