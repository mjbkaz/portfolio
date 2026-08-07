"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import GlassCard from "@/components/GlassCard";

const experiences = [
  {
    company: "Eversun Software Philippines Corporation",
    role: "Web Developer",
    location: "Davao City",
    period: "December 2024 – Present",
    points: [
      "Developed and maintained web applications using Laravel (MVC Architecture), React.js, Inertia.js, JavaScript, PHP, and TailwindCSS.",
      "Built and enhanced system features: Domain Lifecycle Management, System Email History, Domain History Tracking, Client Activity Logging.",
      "Utilized Logging Systems and Error Handling to monitor application behavior and improve debugging efficiency.",
      "Implemented Job Queues (Laravel Queues) for handling background tasks like email processing and system notifications.",
      "Optimized application performance through Database Indexing, Query Optimization, and Efficient Data Handling.",
      "Ensured scalability and maintainability by following Clean Code Principles and Modular Architecture practices.",
    ],
  },
  {
    company: "Bitshares Labs INC.",
    role: "Web Developer",
    location: "Baguio City",
    period: "June – August 2024",
    points: [
      "Developed and enhanced internal tracking systems to monitor activities, records, and environment-related data.",
      "Implemented UI improvements and ensured responsive design across different screen sizes using HTML, CSS, and JavaScript.",
      "Assisted in building and maintaining web application features, focusing on usability and performance.",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-[#22C55E]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 left-0 w-72 h-72 bg-[#06B6D4]/5 rounded-full blur-[100px]" />
      </div>

      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#22C55E]/20 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {/* <span className="text-[#22C55E] font-mono text-sm tracking-widest uppercase">
            // Experience
          </span> */}
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#F8FAFC] mt-3">
            Work <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] to-[#06B6D4]">History</span>
          </h2>
          <p className="text-[#94A3B8] mt-4 max-w-xl mx-auto">
            Professional experience building web applications and solving real-world problems.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative pl-8 md:pl-12"
            >
              {/* Timeline Line Node */}
              <div className="absolute left-0 top-0 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[#22C55E] border-4 border-[#0F172A] z-10" />
              </div>

              {/* Card */}
              <GlassCard noReveal className="p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-[#F8FAFC]">
                      {exp.role}
                    </h3>
                    <p className="text-[#22C55E] font-medium">{exp.company}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#94A3B8]">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={14} />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Points */}
                <ul className="space-y-3">
                  {exp.points.map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 + i * 0.05 }}
                      className="flex items-start gap-3 text-[#94A3B8] text-sm leading-relaxed"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#22C55E] flex-shrink-0" />
                      {point}
                    </motion.li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
