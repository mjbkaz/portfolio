"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const projects = [
  {
    title: "Cosplayer Portfolio Blog",
    company: "Personal Project",
    description: "A dynamic blog page for a cosplayer website featuring portfolio showcases, event updates, and community engagement with modern UI/UX design.",
    image: "/project1.png",
    tags: ["HTML/CSS", "JavaScript", "PHP", "Responsive Design"],
  },
  {
    title: "Strange Domains Platform",
    company: "Current Work",
    description: "Main project focusing on domain management and unusual domain tracking system with advanced search capabilities and domain analytics dashboard.",
    image: "/project2.png",
    tags: ["PHP", "Laravel", "MySQL", "Domain Management"],
  },
  {
    title: "Inventory Management System",
    company: "Enterprise Solution",
    description: "Comprehensive inventory system with real-time stock tracking, automated reordering, barcode scanning, and detailed reporting features.",
    image: "/project3.png",
    tags: ["PHP", "JavaScript", "MySQL", "Inventory Management"],
  },
  {
    title: "Domain Lifecycle Management",
    company: "Eversun Software",
    description: "Built a comprehensive domain lifecycle management system with tracking, history logging, and client activity monitoring using Laravel and React.js.",
    tags: ["Laravel", "React", "Inertia.js", "TailwindCSS", "MySQL"],
  },
  {
    title: "System Email History",
    company: "Eversun Software",
    description: "Developed an email history tracking system with search, filtering, and detailed audit logs for all system communications.",
    tags: ["PHP", "JavaScript", "Laravel", "Job Queues"],
  },
  {
    title: "Internal Tracking System",
    company: "Bitshares Labs",
    description: "Built internal tracking systems for monitoring activities, records, and environment-related data with responsive UI design.",
    tags: ["HTML/CSS", "JavaScript", "PHP", "MySQL"],
  },
  {
    title: "Client Activity Logger",
    company: "Eversun Software",
    description: "Implemented comprehensive client activity logging with real-time monitoring, error handling, and performance optimization.",
    tags: ["Laravel", "React", "Database Indexing", "Query Optimization"],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {/* <span className="text-[#22C55E] font-mono text-sm tracking-widest uppercase">
            // Projects
          </span> */}
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#F8FAFC] mt-3">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] to-[#06B6D4]">Projects</span>
          </h2>
          <p className="text-[#94A3B8] mt-4 max-w-xl mx-auto">
            Real-world applications I've built and contributed to.
          </p>
        </motion.div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-[#1A2332] border border-[#475569]/20 rounded-xl p-6 hover:border-[#22C55E]/30 transition-all duration-300 relative overflow-hidden"
            >
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                {/* Project Image with Animation */}
                {project.image && (
                  <div className="relative mb-4 overflow-hidden rounded-lg group/image">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E]/20 to-[#06B6D4]/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 z-10" />
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-lg transform group-hover/image:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-[#0F172A]/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center">
                      <div className="flex gap-3 transform translate-y-4 group-hover/image:translate-y-0 transition-transform duration-300">
                        <a
                          href="https://github.com/mjbkaz"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-[#22C55E] text-white rounded-lg hover:bg-[#16A34A] transition-colors shadow-lg hover:shadow-[#22C55E]/50"
                          aria-label="View on GitHub"
                        >
                          <GithubIcon size={20} />
                        </a>
                        <a
                          href="#"
                          className="p-3 bg-[#06B6D4] text-white rounded-lg hover:bg-[#0891B2] transition-colors shadow-lg hover:shadow-[#06B6D4]/50"
                          aria-label="External link"
                        >
                          <ExternalLink size={20} />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Project Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-heading font-bold text-[#F8FAFC] group-hover:text-[#22C55E] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[#64748B]">{project.company}</p>
                </div>

                {/* Description */}
                <p className="text-[#94A3B8] text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium text-[#22C55E] bg-[#22C55E]/10 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
