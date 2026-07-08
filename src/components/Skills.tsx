"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Database,
  Globe,
  Wrench,
  Gamepad2,
  Star,
} from "lucide-react";

const skillCategories = [
  {
    title: "Frontend",
    icon: Globe,
    color: "#06B6D4",
    skills: [
      { name: "React.js", level: 90 },
      { name: "Vue.js", level: 75 },
      { name: "TailwindCSS", level: 95 },
      { name: "Bootstrap", level: 85 },
      { name: "Shadcn/ui", level: 85 },
      { name: "CSS5/SASS", level: 80 },
      { name: "Foundation", level: 70 },
    ],
  },
  {
    title: "Backend",
    icon: Code2,
    color: "#22C55E",
    skills: [
      { name: "Laravel", level: 90 },
      { name: "PHP", level: 85 },
      { name: "Inertia.js", level: 85 },
      { name: "REST APIs", level: 80 },
      { name: "Authentication & Auth", level: 80 },
      { name: "CRUD Operations", level: 90 },
    ],
  },
  {
    title: "Database & Tools",
    icon: Database,
    color: "#EAB308",
    skills: [
      { name: "MySQL", level: 85 },
      { name: "PostgreSQL", level: 75 },
      { name: "Git", level: 85 },
      { name: "JavaScript", level: 90 },
      { name: "HTML/CSS", level: 95 },
    ],
  },
  {
    title: "Workspace & Others",
    icon: Wrench,
    color: "#A855F7",
    skills: [
      { name: "Slack", level: 85 },
      { name: "Teams", level: 80 },
      { name: "Zoom", level: 80 },
      { name: "Google Workspace", level: 85 },
      { name: "Problem Solving", level: 90 },
      { name: "Team Collaboration", level: 90 },
    ],
  },
];

const certifications = [
  "Computer System Servicing NC II",
  "BLINC Technologies Internship Program",
];

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-80 h-80 bg-[#22C55E]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-[#06B6D4]/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {/* <span className="text-[#22C55E] font-mono text-sm tracking-widest uppercase">
            // Skills & Stats
          </span> */}
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#F8FAFC] mt-3">
            Skill <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] to-[#06B6D4]">Tree</span>
          </h2>
          <p className="text-[#94A3B8] mt-4 max-w-xl mx-auto">
            Leveled up through real-world projects and continuous learning.
          </p>
        </motion.div>

        {/* Skill Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              className="bg-[#1A2332] border border-[#475569]/20 rounded-xl p-6 hover:border-[#22C55E]/30 transition-all duration-300"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${category.color}15` }}
                >
                  <category.icon size={20} style={{ color: category.color }} />
                </div>
                <h3 className="text-lg font-heading font-bold text-[#F8FAFC]">
                  {category.title}
                </h3>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-[#94A3B8]">{skill.name}</span>
                      <span className="text-xs font-mono text-[#64748B]">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: catIndex * 0.1 + skillIndex * 0.05,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: category.color,
                          boxShadow: `0 0 8px ${category.color}40`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certifications & Gaming Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[#1A2332] border border-[#475569]/20 rounded-xl p-6"
          >
            <h3 className="text-lg font-heading font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
              <Star size={20} className="text-[#EAB308]" />
              Certifications
            </h3>
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div
                  key={cert}
                  className="flex items-center gap-3 p-3 bg-[#0F172A] rounded-lg"
                >
                  <div className="w-2 h-2 rounded-full bg-[#EAB308]" />
                  <span className="text-[#94A3B8] text-sm">{cert}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Gaming Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-r from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 rounded-xl p-6"
          >
            <h3 className="text-lg font-heading font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
              <Gamepad2 size={20} className="text-[#22C55E]" />
              Gamer Profile
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Gamer Tag", value: "Kaz" },
                { label: "Role", value: "Support / Flex" },
                { label: "Playstyle", value: "Strategic" },
                { label: "Achievement", value: "Problem Solver" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-3 bg-[#0F172A]/50 rounded-lg"
                >
                  <p className="text-[#64748B] text-xs">{stat.label}</p>
                  <p className="text-[#F8FAFC] font-medium text-sm">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
