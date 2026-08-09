import { Instagram, Linkedin, Mail, MapPin, Twitter, Youtube } from "lucide-react";

import { TEAL } from "@/app/theme";
import type { Section } from "@/app/types";
import { SRCLogo } from "@/app/components/common";

// ─── Footer ───────────────────────────────────────────────────────────────────
export function Footer({ setSection }: { setSection: (s: Section) => void }) {
  const links: { label: string; section: Section }[] = [
    { label: "Home", section: "home" },
    { label: "Competitions", section: "competitions" },
  //  { label: "Partnership", section: "partnership" },
    { label: "FAQ", section: "faq" },
    { label: "Contact", section: "contact" },
  ];

  return (
    <footer className="border-t" style={{ background: "#050D18", borderColor: `${TEAL}15` }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-start md:justify-between gap-12 mb-12">
          <div className="max-w-lg ml-6">
            <SRCLogo size={70} />
            <p className="text-muted-foreground text-sm mt-4 mb-6 max-w-sm leading-relaxed">
              The first AIChE Student Regional Conference in the GCC — bringing together the brightest chemical engineering minds across the region.
            </p>
            <div className="flex justify-start gap-3">
  {[
    {
      icon: <Instagram className="w-4 h-4" />,
      color: "#E1306C",
      href: "https://www.instagram.com/kfupm_aiche/",
    },
    {
      icon: <Twitter className="w-4 h-4" />,
      color: "#1DA1F2",
      href: "https://x.com/KFUPMAIChE?lang=ar",
    },
    {
      icon: <Linkedin className="w-4 h-4" />,
      color: "#0A66C2",
      href: "https://sa.linkedin.com/company/kfupm-aiche",
    },
    {
      icon: <Youtube className="w-4 h-4" />,
      color: "#FF0000",
      href: "https://youtube.com/@kfupmaiche?si=FpLHkciIUcAnlXAZ",
    },
  ].map((s, i) => (
    <a
      key={i}
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-xl flex items-center justify-center border hover:border-white/30 transition-colors"
      style={{
        background: "#0D1E30",
        borderColor: `${TEAL}20`,
        color: s.color,
      }}
    >
      {s.icon}
    </a>
  ))}
</div>

<div className="space-y-2 mt-6">
  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <Mail className="w-4 h-4" style={{ color: TEAL }} />
    aiche@kfupm.edu.sa
  </div>

  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <MapPin className="w-4 h-4" style={{ color: TEAL }} />
    KFUPM, Dhahran, Saudi Arabia
  </div>

</div>
          </div>

          {/* Quick links — mirrors the top navigation plus About */}
          <nav className="ml-6 md:ml-0 md:mr-6">
            <h3 className="font-display text-sm font-bold text-white mb-4 tracking-wide">Quick Links</h3>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.section}>
                  <button
                    onClick={() => setSection(link.section)}
                    className="text-sm text-muted-foreground hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: `${TEAL}15` }}>
          <p className="text-xs text-muted-foreground">
            © 2026 SRC KFUPM · AIChE Student Chapter · All rights reserved
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Powered by <span className="font-semibold" style={{ color: TEAL }}>AIChE</span> · Hosted by <span className="font-semibold text-white">KFUPM</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
