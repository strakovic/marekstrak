"use client";

import LetterGlitch from "@/components/magicui/letter-glitch";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function EnterpriseSecuritySection() {
  return (
    <section id="enterprise-security" className="relative bg-background py-20 md:py-32 overflow-hidden">
      {/* LetterGlitch background with ellipse fade mask */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <LetterGlitch
            glitchColors={['#F9620C', '#ff8c42', '#ffd166']} // Brand orange colors
            glitchSpeed={60}
            smooth={true}
            centerVignette={false}
            outerVignette={false}
            className="absolute inset-0"
          />
          
          {/* Ellipse gradient mask to fade the glitch effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(
                  ellipse 600px 400px at center,
                  transparent 0%,
                  transparent 20%,
                  rgba(249, 249, 250, 0.2) 30%,
                  rgba(249, 249, 250, 0.5) 40%,
                  rgba(249, 249, 250, 0.8) 50%,
                  rgba(249, 249, 250, 0.95) 60%,
                  #FAFAFA 70%
                )
              `,
            }}
          />
          
          {/* Dark mode ellipse gradient */}
          <div 
            className="absolute inset-0 pointer-events-none hidden dark:block"
            style={{
              background: `
                radial-gradient(
                  ellipse 600px 400px at center,
                  transparent 0%,
                  transparent 20%,
                  rgba(9, 13, 20, 0.2) 30%,
                  rgba(9, 13, 20, 0.5) 40%,
                  rgba(9, 13, 20, 0.8) 50%,
                  rgba(9, 13, 20, 0.95) 60%,
                  #090D14 70%
                )
              `,
            }}
          />
        </div>
      </div>

      {/* Content container */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 xl:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Main headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-neue-montreal-bold text-foreground mb-6">
            Enterprise Security
          </h2>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground font-neue-montreal-book max-w-2xl mx-auto mb-12">
            Military-grade encryption and compliance standards to protect your most sensitive billing data.
          </p>

          {/* Security features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/80 dark:bg-[#090D14]/80 backdrop-blur-sm rounded-2xl p-6 border border-foreground/5"
            >
              <div className="w-12 h-12 bg-[#F9620C]/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-[#F9620C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-neue-montreal-medium mb-2">End-to-End Encryption</h3>
              <p className="text-sm text-muted-foreground font-neue-montreal-book">
                AES-256 encryption for all data at rest and in transit
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/80 dark:bg-[#090D14]/80 backdrop-blur-sm rounded-2xl p-6 border border-foreground/5"
            >
              <div className="w-12 h-12 bg-[#F9620C]/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-[#F9620C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-neue-montreal-medium mb-2">SOC 2 Type II Certified</h3>
              <p className="text-sm text-muted-foreground font-neue-montreal-book">
                Independently audited security controls and processes
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/80 dark:bg-[#090D14]/80 backdrop-blur-sm rounded-2xl p-6 border border-foreground/5"
            >
              <div className="w-12 h-12 bg-[#F9620C]/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-[#F9620C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-lg font-neue-montreal-medium mb-2">99.99% Uptime SLA</h3>
              <p className="text-sm text-muted-foreground font-neue-montreal-book">
                Multi-region architecture with automatic failover
              </p>
            </motion.div>
          </div>

          {/* Compliance badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-6 mt-12"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-[#090D14]/60 backdrop-blur-sm rounded-full border border-foreground/5">
              <span className="text-sm font-neue-montreal-medium">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-[#090D14]/60 backdrop-blur-sm rounded-full border border-foreground/5">
              <span className="text-sm font-neue-montreal-medium">HIPAA Ready</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-[#090D14]/60 backdrop-blur-sm rounded-full border border-foreground/5">
              <span className="text-sm font-neue-montreal-medium">PCI DSS Level 1</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-[#090D14]/60 backdrop-blur-sm rounded-full border border-foreground/5">
              <span className="text-sm font-neue-montreal-medium">ISO 27001</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}