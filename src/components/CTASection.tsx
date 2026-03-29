import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Orb from "./Orb";

const CTASection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" ref={ref} className="relative py-40">
      <div className="relative max-w-[1400px] mx-auto px-6 flex flex-col items-center text-center">
        {/* Orb — brighter, more particles, faster rotation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1 }}
        >
          <Orb size={180} />
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-20 flex flex-col sm:flex-row items-center gap-6"
        >
          <a
            href="#"
            className="font-mono text-sm tracking-[0.08em] uppercase bg-teal text-deep-field px-10 py-4 rounded-md hover:bg-[hsl(160_82%_70%)] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(74,237,196,0.2)]"
          >
            Request Early Access
          </a>
          <a
            href="#"
            className="font-mono text-sm tracking-[0.08em] uppercase text-teal border border-teal px-10 py-4 rounded-md hover:bg-teal/[0.08] transition-all duration-200"
          >
            Read the Whitepaper
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="font-mono text-warm-gray text-xs mt-8 font-light"
        >
          Defense-grade clinical intelligence. Now accepting government and enterprise inquiries.
        </motion.p>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2 }}
        className="mt-40 border-t border-grid-line"
      >
        <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mini orb echo */}
            <div
              className="w-8 h-8 rounded-full"
              style={{
                background: "linear-gradient(135deg, hsl(var(--teal)), hsl(var(--lilac)), hsl(var(--teal)))",
                backgroundSize: "200% 200%",
                animation: "orb-shimmer 6s ease-in-out infinite",
              }}
            />
            <div>
              <div className="font-mono text-pearl text-sm font-light">
                <span className="text-teal">[</span>CLASSIFIED<span className="text-teal">]</span>
              </div>
              <div className="font-mono text-warm-gray text-xs">
                © 2026 [Company Name TBD]. All rights reserved.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 font-mono text-warm-gray text-xs">
            <a href="#" className="hover:text-teal transition-colors">Whitepaper</a>
            <span className="text-grid-line">|</span>
            <a href="#" className="hover:text-teal transition-colors">GuideBench</a>
            <span className="text-grid-line">|</span>
            <a href="#" className="hover:text-teal transition-colors">Contact</a>
          </div>
        </div>
      </motion.footer>
    </section>
  );
};

export default CTASection;
