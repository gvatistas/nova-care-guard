import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import FacetedCrownLogo from "@/components/FacetedCrownLogo";

const CTASection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02),transparent_60%)] pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <h2 className="text-white font-mono font-light leading-[1.15] tracking-[-0.02em] mb-4" style={{ fontSize: "2.5rem" }}>
            Unlocking the proactive healthcare patients deserve.
          </h2>
          <p className="font-light leading-relaxed mb-8 max-w-3xl" style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.125rem", lineHeight: 1.7 }}>
            The healthcare system wasn't built for prevention. We're changing that — replacing outdated, reactive workflows with intelligent clinical infrastructure that catches what matters before it's too late.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <a href="#" className="font-mono uppercase transition-all duration-300 bg-white text-black hover:bg-gray-200"
              style={{ fontSize: "1rem", letterSpacing: "0.15em", padding: "16px 48px" }}>
              Request Demo
            </a>
            <a href="#" className="font-mono uppercase transition-all duration-300 text-white border border-white/30 hover:bg-white hover:text-black"
              style={{ fontSize: "1rem", letterSpacing: "0.15em", padding: "16px 48px" }}>
              Read White Paper
            </a>
          </div>
        </motion.div>
      </div>

      {/* Static faceted crown logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 1.2 }}
        className="mt-24 flex flex-col items-center px-8"
      >
        <FacetedCrownLogo size={160} color="rgba(255,255,255,0.5)" />
        <div
          className="mt-5 font-mono tracking-[0.3em] uppercase"
          style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.25)" }}
        >
          Medient Health
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
        className="mt-16 border-t border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>© 2026 Medient Health. All rights reserved.</div>
          <div className="flex items-center gap-8 font-mono tracking-[0.1em] uppercase" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>
            <a href="#" className="hover:text-white transition-colors duration-300">Whitepaper</a>
            <a href="#" className="hover:text-white transition-colors duration-300">GuideBench</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Contact</a>
          </div>
        </div>
      </motion.footer>
    </section>
  );
};

export default CTASection;
