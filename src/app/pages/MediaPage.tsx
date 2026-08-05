import { Download, FileText, Instagram, Layers, Linkedin, Twitter, Youtube, Zap } from "lucide-react";

import { ORANGE } from "@/app/theme";
import { SectionTag, SectionTitle, Divider, ComingSoonBadge } from "@/app/components/common";

export function MediaPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTag>News & Resources</SectionTag>
        <SectionTitle>Media Center</SectionTitle>
        <Divider />

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Announcements */}
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5" style={{ color: ORANGE }} /> Latest Announcements
            </h3>
            <div className="rounded-xl border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="p-8 text-center">
                <ComingSoonBadge />
                <p className="text-muted-foreground text-sm mt-4">Conference announcements and news will appear here.</p>
              </div>
            </div>
          </div>

          {/* Social media */}
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-6">Follow SRC 2026</h3>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: <Instagram className="w-5 h-5" />, label: "@src2026kfupm", platform: "Instagram", color: "#E1306C" },
                { icon: <Twitter className="w-5 h-5" />, label: "@SRC2026KFUPM", platform: "X (Twitter)", color: "#1DA1F2" },
                { icon: <Linkedin className="w-5 h-5" />, label: "SRC 2026 KFUPM", platform: "LinkedIn", color: "#0A66C2" },
                { icon: <Youtube className="w-5 h-5" />, label: "SRC 2026", platform: "YouTube", color: "#FF0000" },
              ].map((s) => (
                <div key={s.platform} className="rounded-lg border p-4 flex items-center gap-3 hover:border-white/20 transition-colors cursor-pointer" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <span style={{ color: s.color }}>{s.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-white">{s.platform}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-display text-xl font-bold text-white mb-4">Press & Brand Kit</h3>
            <div className="space-y-3">
              {[
                { label: "Download Conference Brief", icon: <Download className="w-4 h-4" /> },
                { label: "Brand Kit / Logos", icon: <Layers className="w-4 h-4" /> },
                { label: "Press Kit", icon: <FileText className="w-4 h-4" /> },
              ].map((item) => (
                <button key={item.label} className="w-full flex items-center justify-between p-4 rounded-xl border text-sm font-medium text-foreground hover:border-[#0CBFCE]/40 hover:text-white transition-all" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <span className="flex items-center gap-2">{item.icon}{item.label}</span>
                  <ComingSoonBadge />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Photo gallery placeholder */}
        <div>
          <h3 className="font-display text-xl font-bold text-white mb-6">Photo Gallery</h3>
          <div className="rounded-xl border p-12 text-center" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <ComingSoonBadge />
            <p className="text-muted-foreground text-sm mt-4">Conference photos and highlights will be shared here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Page ───────────────────────────────────────────────────────────────
