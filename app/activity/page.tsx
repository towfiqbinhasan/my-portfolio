"use client";
import { motion } from "framer-motion";
import { FiUsers, FiCalendar, FiAward } from "react-icons/fi";

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

export default function ActivityPage() {
  return (
    <section className="py-16 px-6 max-w-4xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-4 text-center"
      >
        My <span className="text-purple-400">Activities</span>
      </motion.h1>
      <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
        Extracurricular involvements, clubs, and activities beyond academics and technical work.
      </p>

      <div className="space-y-6">
        {activities.map((activity, i) => (
          <motion.div
            key={activity.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 flex gap-4 items-start hover:border-purple-400 transition"
          >
            <FiUsers className="text-purple-400 text-2xl mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold mb-1">{activity.title}</h3>
              <p className="text-purple-300 text-sm mb-1">{activity.organization}</p>
              <p className="text-gray-500 text-xs flex items-center gap-1 mb-3">
                <FiCalendar /> {activity.date}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                {activity.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}