"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function Contact() {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

  return (
    <section id="contact" className="relative py-24 md:py-32">
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
            // Contact
          </span> */}
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#F8FAFC] mt-3">
            Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] to-[#06B6D4]">Connect</span>
          </h2>
          <p className="text-[#94A3B8] mt-4 max-w-xl mx-auto">
            Have a project in mind or just want to chat? Drop me a message!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-[#1A2332] border border-[#475569]/20 rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-heading font-bold text-[#F8FAFC]">
                Contact Information
              </h3>

              {[
                { icon: Mail, label: "Email", value: "mjbcoloma@gmail.com", href: "mailto:mjbcoloma@gmail.com" },
                { icon: Phone, label: "Phone", value: "+63 976 365 0797", href: "tel:+639763650797" },
                { icon: MapPin, label: "Location", value: "Orani, Bataan, Philippines", href: null },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="p-2 bg-[#22C55E]/10 rounded-lg">
                    <item.icon size={20} className="text-[#22C55E]" />
                  </div>
                  <div>
                    <p className="text-[#94A3B8] text-sm">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-[#F8FAFC] font-medium hover:text-[#22C55E] transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-[#F8FAFC] font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Availability */}
            <div className="bg-gradient-to-r from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-3 h-3 bg-[#22C55E] rounded-full animate-pulse" />
                <span className="text-[#22C55E] font-medium">Available for opportunities</span>
              </div>
              <p className="text-[#94A3B8] text-sm">
                Currently open to freelance projects, full-time positions, and collaborations.
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form
              action="https://formsubmit.co/7a2266e20585feb9d879a5756f3e175a"
              method="POST"
              className="bg-[#1A2332] border border-[#475569]/20 rounded-xl p-6 space-y-5"
            >
              {/* FormSubmit config - sends directly to your Gmail */}
              <input type="hidden" name="_subject" value="New Portfolio Contact!" />
              <input type="hidden" name="_captcha" value="true" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_next" value={`${baseUrl}/thank-you`} />
              {/* Honeypot field to prevent spam bots */}
              <input type="text" name="_honey" className="hidden" style={{ display: "none" }} />
              {/* Prevent spam by requiring users to click a link in email */}
              <input type="hidden" name="_autoresponse" value="Thank you for reaching out! I'll get back to you as soon as possible. - Mike Julius Coloma" />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm text-[#94A3B8] mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-[#0F172A] border border-[#475569]/30 rounded-lg text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-[#94A3B8] mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-[#0F172A] border border-[#475569]/30 rounded-lg text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm text-[#94A3B8] mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 bg-[#0F172A] border border-[#475569]/30 rounded-lg text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-colors"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm text-[#94A3B8] mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-[#0F172A] border border-[#475569]/30 rounded-lg text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-colors resize-none"
                  placeholder="Your message here..."
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#22C55E] text-[#0F172A] font-semibold rounded-lg hover:bg-[#16A34A] transition-colors duration-200"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
