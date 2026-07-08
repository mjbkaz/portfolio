"use client";

import { motion } from "framer-motion";
import { Code2, Gamepad2, GraduationCap, MapPin } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#22C55E]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#06B6D4]/5 rounded-full blur-[100px]" />
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
            // About Me
          </span> */}
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#F8FAFC] mt-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] to-[#06B6D4]">Developer</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: MapPin, label: "Location", value: "Orani, Bataan" },
                { icon: GraduationCap, label: "Education", value: "BS IT - Web Tech" },
                { icon: Code2, label: "Experience", value: "2+ Years" },
                { icon: Gamepad2, label: "Gamer Tag", value: "Kaz" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="p-4 bg-[#1A2332] border border-[#475569]/20 rounded-xl hover:border-[#22C55E]/30 transition-all duration-300 group"
                >
                  <item.icon size={20} className="text-[#22C55E] mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-[#94A3B8] text-xs">{item.label}</p>
                  <p className="text-[#F8FAFC] font-medium text-sm">{item.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Bio */}
            <div className="bg-[#1A2332] border border-[#475569]/20 rounded-xl p-6 space-y-4">
              <p className="text-[#94A3B8] leading-relaxed">
                A <span className="text-[#F8FAFC] font-medium">Web Developer</span> with hands-on experience in
                Laravel, React.js, Inertia.js, PHP, JavaScript, and Tailwind CSS.
                I build responsive web applications, integrate APIs, and implement
                secure, scalable back-end systems.
              </p>
              <p className="text-[#94A3B8] leading-relaxed">
                When I'm not coding, you'll find me gaming. Being a gamer
                has sharpened my problem-solving skills, taught me the value of
                continuous learning, and given me a unique perspective on creating
                engaging user experiences.
              </p>
              <div className="flex items-center gap-2 text-[#22C55E] text-sm font-medium">
                <span className="w-2 h-2 bg-[#22C55E] rounded-full" />
                <span>Strong team collaborator · Clean code advocate · Performance focused</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Quote / Personality */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            {/* Terminal Window */}
            <div className="bg-[#1A2332] border border-[#475569]/20 rounded-xl overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#0F172A] border-b border-[#475569]/20">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <div className="w-3 h-3 rounded-full bg-[#EAB308]" />
                <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
                <span className="ml-2 text-[#94A3B8] text-xs font-mono">about-mike.sh</span>
              </div>

              {/* Terminal Content */}
              <div className="p-6 font-mono text-sm space-y-3">
                <p className="text-[#22C55E]">$ <span className="text-[#F8FAFC]">cat about-mike.json</span></p>
                <div className="text-[#94A3B8] space-y-1">
                  <p>&#123;</p>
                  <p className="pl-4">
                    <span className="text-[#06B6D4]">"name"</span>: <span className="text-[#F8FAFC]">"Mike Julius Coloma"</span>,
                  </p>
                  <p className="pl-4">
                    <span className="text-[#06B6D4]">"role"</span>: <span className="text-[#F8FAFC]">"Web Developer"</span>,
                  </p>
                  <p className="pl-4">
                    <span className="text-[#06B6D4]">"location"</span>: <span className="text-[#F8FAFC]">"Orani, Bataan"</span>,
                  </p>
                  <p className="pl-4">
                    <span className="text-[#06B6D4]">"email"</span>: <span className="text-[#22C55E]">"mjbcoloma@gmail.com"</span>,
                  </p>
                  <p className="pl-4">
                    <span className="text-[#06B6D4]">"passion"</span>: <span className="text-[#F8FAFC]">[<span className="text-[#EAB308]">"Web Dev"</span>, <span className="text-[#EF4444]">"Gaming"</span>, <span className="text-[#06B6D4]">"Tech"</span>]</span>,
                  </p>
                  <p className="pl-4">
                    <span className="text-[#06B6D4]">"motto"</span>: <span className="text-[#F8FAFC]">"Clean code, clean kills."</span>
                  </p>
                  <p>&#125;</p>
                </div>
                <div className="pt-2">
                  <p className="text-[#22C55E]">$ <span className="text-[#F8FAFC]">npm run build --portfolio</span></p>
                  <p className="text-[#94A3B8] animate-pulse">▊ Building amazing things...</p>
                </div>
              </div>
            </div>

            {/* Gaming Quote Card */}
            <div className="mt-6 p-6 bg-gradient-to-r from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 rounded-xl">
              <p className="text-[#F8FAFC] text-lg font-heading italic">
                &ldquo;In coding, as in gaming — every challenge is just a boss battle waiting to be defeated.&rdquo;
              </p>
              <p className="text-[#22C55E] text-sm mt-2 font-medium">
                ~ MJC
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
