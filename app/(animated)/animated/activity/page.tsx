"use client";
import { FiUsers, FiCalendar } from "react-icons/fi";
import { PageBackdrop, PageHeader, GlowCard } from "@/components/PageShell";

type ActivityItem = {
  title: string;
  organization: string;
  date: string;
  description: string;
};

const activities: ActivityItem[] = [
  {
    title: "TH Team - Content Creation Group",
    organization: "TH Team",
    date: "2024 - Present",
    description:
      "Co-founded and actively contribute to the TH Team, a group focused on travel filmmaking, photography, and content creation, producing short films and vlogs from trips across Bangladesh.",
  },
  {
    title: "Robotics Camp 2022",
    organization: "Roboment R&D Lab",
    date: "2022",
    description:
      "Completed the Easier Stage of a one-month online Robotics Camp, covering digital electronics, automation, DC motor control, sensor applications, and Arduino programming.",
  },
];

// Accent per card, cycled by position so the grid keeps some colour rhythm.
const accents = [
  "from-sky-500 to-cyan-400",
  "from-cyan-500 to-blue-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
];

export default function ActivityPage() {
  return (
    <section className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <PageBackdrop />

      <PageHeader
        eyebrow="Community"
        title="My"
        accent="Activities"
        description={
          <p>
            Extracurricular involvements, clubs, and activities beyond academics and technical work.
          </p>
        }
      />

      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        {activities.map((activity, i) => (
          <GlowCard key={activity.title} delay={i * 0.08} className="h-full">
            <span
              aria-hidden
              className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${accents[i % accents.length]} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20`}
            />
            <span aria-hidden className="carousel-sheen pointer-events-none absolute inset-0" />

            <div className="relative flex h-full flex-col p-5 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <span
                  className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accents[i % accents.length]} text-xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 sm:h-12 sm:w-12`}
                >
                  <FiUsers />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold leading-snug text-white sm:text-lg">
                    {activity.title}
                  </h3>
                  <p className="mt-1 text-xs text-sky-300 sm:text-sm">{activity.organization}</p>
                </div>
              </div>

              <p className="btn-press mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-gray-400 hover:border-sky-400/40 hover:bg-sky-500/10 hover:text-sky-200">
                <FiCalendar className="text-sky-400/80 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />{" "}
                {activity.date}
              </p>

              <p className="mt-4 text-xs leading-relaxed text-gray-400 sm:text-sm">
                {activity.description}
              </p>

              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-sky-400 to-transparent transition-transform duration-500 group-hover:scale-x-100"
              />
            </div>
          </GlowCard>
        ))}
      </div>
    </section>
  );
}
