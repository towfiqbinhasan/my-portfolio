import { portfolioKnowledge } from "@/lib/portfolioKnowledge";

/*
 * Backup brain for the chat: answers straight from portfolioKnowledge when the
 * AI service isn't available (no GROQ_API_KEY, or Groq is down). It matches the
 * question to a section of the knowledge text, so it only ever repeats facts
 * that are already written there.
 */

type Section = { title: string; body: string };

// "## TITLE" blocks of the knowledge text (the closing instruction line is dropped).
const SECTIONS: Section[] = portfolioKnowledge
  .split(/^## /m)
  .slice(1)
  .map((block) => {
    const [title, ...rest] = block.split("\n");
    const body = rest
      .join("\n")
      .split(/\n\s*\nAlways answer/)[0]
      .trim();
    return { title: title.trim(), body };
  });

const section = (title: string) => SECTIONS.find((s) => s.title === title);

/** Topic → which sections answer it, how to introduce them, and the words that point to it. */
const TOPICS: { sections: string[]; intro: string; words: string[] }[] = [
  {
    sections: ["SKILLS"],
    intro: "Here's what Towfiq works with:",
    words: ["skill", "strong", "good at", "language", "tech", "stack", "tool", "know", "framework", "expert", "programming", "react", "python", "next"],
  },
  {
    sections: ["PROJECTS (CSE)", "PROJECTS (EEE)"],
    intro: "Here are Towfiq's projects:",
    words: ["project", "built", "build", "made", "app", "website", "portfolio work", "robot", "arduino", "skillswap", "petadopt"],
  },
  {
    sections: ["RESEARCH & CONFERENCE PAPERS"],
    intro: "Towfiq's research and conference papers:",
    words: ["research", "paper", "publication", "publish", "conference", "ieee", "journal", "thesis"],
  },
  {
    sections: ["WORK EXPERIENCE"],
    intro: "Towfiq's work experience:",
    words: ["experience", "job", "work", "intern", "company", "career", "employ", "role"],
  },
  {
    sections: ["EDUCATION"],
    intro: "Towfiq's education:",
    words: ["education", "study", "studies", "university", "degree", "aiub", "school", "college", "cgpa", "bsc", "hsc", "ssc"],
  },
  {
    sections: ["CERTIFICATES"],
    intro: "Towfiq's certificates:",
    words: ["certificate", "certification", "course", "award"],
  },
  {
    sections: ["CONTACT"],
    intro: "You can reach Towfiq like this:",
    words: ["contact", "email", "mail", "hire", "reach", "whatsapp", "linkedin", "github", "connect", "talk"],
  },
  {
    sections: ["OTHER INTERESTS"],
    intro: "Outside of code:",
    words: ["hobby", "hobbies", "travel", "photo", "film", "video", "interest", "free time", "th team"],
  },
  {
    sections: ["GADGETS"],
    intro: "The gadgets Towfiq uses:",
    words: ["gadget", "laptop", "phone", "device", "setup", "keyboard"],
  },
  {
    sections: ["BASIC INFO"],
    intro: "A quick introduction:",
    words: ["who", "about", "yourself", "himself", "introduce", "name", "background", "tell me"],
  },
];

const GREETING = /^(hi+|hello|hey|hlw|helo|salam|assalamu?alaikum|yo|good (morning|afternoon|evening))\b/i;
const THANKS = /\b(thanks?|thank you|thx|tnx)\b/i;

const STOP = new Set(["what", "which", "when", "where", "does", "have", "with", "about", "your", "this", "that", "they", "there", "their", "would", "could", "should", "favourite", "favorite"]);

const SUGGEST =
  "You can ask me about his skills, projects, research papers, experience, education, certificates, or how to contact him.";

export function offlineAnswer(question: string): string {
  const q = question.toLowerCase().trim();

  if (GREETING.test(q) && q.split(/\s+/).length <= 3) {
    return `Hi! 👋 I'm Towfiq's assistant. ${SUGGEST}`;
  }
  if (THANKS.test(q)) return "You're welcome! Anything else you'd like to know about Towfiq?";

  // Pick the topic whose words appear most in the question.
  let best: (typeof TOPICS)[number] | null = null;
  let bestScore = 0;
  for (const t of TOPICS) {
    // "Tell me about…" phrasing is generic, so the intro only wins when nothing else matches.
    const weight = t.sections[0] === "BASIC INFO" ? 0.4 : 1;
    const score = t.words.reduce((n, w) => n + (q.includes(w) ? weight : 0), 0);
    if (score > bestScore) {
      best = t;
      bestScore = score;
    }
  }

  if (best) {
    const body = best.sections
      .map((title) => section(title))
      .filter((s): s is Section => !!s)
      .map((s, i, all) => (all.length > 1 ? `${s.title}\n${s.body}` : s.body))
      .join("\n\n");
    return `${best.intro}\n\n${body}`;
  }

  // No topic word: look for a line of the knowledge text that shares words with the question.
  const terms = q.split(/[^a-z0-9+#.]+/).filter((w) => w.length > 3 && !STOP.has(w));
  const lines = SECTIONS.flatMap((s) => s.body.split("\n")).filter(Boolean);
  const hits = lines
    .map((line) => ({ line, n: terms.filter((t) => line.toLowerCase().includes(t)).length }))
    .filter((h) => h.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, 4)
    .map((h) => h.line);
  if (hits.length) return `Here's what I found:\n\n${hits.join("\n")}`;

  return `I don't have that specific information. ${SUGGEST} For anything else, the Contact page reaches Towfiq directly.`;
}
