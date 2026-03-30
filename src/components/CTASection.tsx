import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const CTASection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02),transparent_60%)] pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}>
          <h2 className="text-white font-semibold text-3xl md:text-4xl mb-4" style={{ letterSpacing: "-0.03em" }}>
            Unlocking proactive healthcare for all.
          </h2>
          <p className="text-white/50 text-lg mb-8 max-w-3xl" style={{ lineHeight: 1.7, letterSpacing: "-0.01em" }}>
            Our healthcare system wasn't built for prevention. We're changing that: replacing outdated, reactive workflows with intelligent clinical infrastructure that catches what matters before it's too late.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <a href="#" className="text-[13px] font-medium uppercase bg-white text-black px-12 py-4 hover:bg-gray-200 transition-all duration-300"
              style={{ letterSpacing: "0.05em" }}>
              Request Demo
            </a>
            <a href="#" className="text-[13px] font-medium uppercase text-white border border-white/30 px-12 py-4 hover:bg-white hover:text-black transition-all duration-300"
              style={{ letterSpacing: "0.05em" }}>
              Read White Paper
            </a>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
        className="mt-16 border-t border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-white/40">© 2026 Medient Health. All rights reserved.</div>
          <div className="flex items-center gap-8 text-[13px] font-medium uppercase text-white/40" style={{ letterSpacing: "0.05em" }}>
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