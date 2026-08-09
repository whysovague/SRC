import { FileText, FlaskConical, Presentation, Trophy, Users } from "lucide-react";

import { TEAL, ORANGE } from "@/app/theme";

// ─── Registration Modal ───────────────────────────────────
export const REG_TYPES = [
  {
    id: "participant" as const,
    icon: <Users className="w-7 h-7" />,
    title: "Visitor",
    desc: "Attend sessions, workshops, panels, and networking events.",
    color: TEAL,
  },
  // Hidden for now — restore to re-enable competition registration.
  // {
  //   id: "team" as const,
  //   icon: <Trophy className="w-7 h-7" />,
  //   title: "Competition Participant",
  //   desc: "Register to compete in one of our flagship competitions.",
  //   color: ORANGE,
  // },
];

export const COMPETITIONS = [
  {
    id: "chem-e-car" as const,
    icon: <FlaskConical className="w-6 h-6" />,
    title: "Chem-E-Car",
    desc: "Design a car powered by a chemical energy source.",
    color: TEAL,
    formUrl: "", // Add external link if needed later
  },
  {
    id: "cheme-jeopardy" as const,
    icon: <Trophy className="w-6 h-6" />,
    title: "ChemE Jeopardy",
    desc: "Fast-paced trivia on chemical engineering topics (Teams of 4).",
    color: ORANGE,
    formUrl: "https://forms.gle/J1iAXjN98r2nNoxy6",
  },
  {
    id: "technical-presentation" as const,
    icon: <Presentation className="w-6 h-6" />,
    title: "Technical Presentation",
    desc: "Present original technical research to industry judges.",
    color: TEAL,
    formUrl: "https://forms.gle/W1LP6t2KiHFNSJ6y9",
  },
  {
    id: "poster-competition" as const,
    icon: <FileText className="w-6 h-6" />,
    title: "Poster Competition",
    desc: "Present research in a dynamic poster gallery setting.",
    color: ORANGE,
    formUrl: "https://forms.gle/vGEnWBdgs3p6mRfg7",
  },
];

export const TEAM_COMPETITIONS: Record<string, { exactMembers?: number }> = {
  "chem-e-car": {},
  "cheme-jeopardy": { exactMembers: 4 },
};
export const INDIVIDUAL_COMPETITIONS = ["technical-presentation"];

export const STEP_LABELS = ["Select Type", "Fill Information", "Review & Submit"];
