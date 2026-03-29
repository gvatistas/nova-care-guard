import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const CTASection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" ref={ref} className="relative py-40 md:py-56">
      <div className="max-w-[1400px] mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="max-w-3xl"
        >
          <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-mono font-light leading-[1.15] tracking-[-0.02em] mb-10">
            Probabilistic once.
            <br />
            <span className="text-gray-600">Deterministic forever.</span>
          </h2>

          <p className="text-gray-500 text-lg font-light leading-relaxed mb-14 max-w-xl">
            Now accepting government and enterprise inquiries.
            Defense-grade clinical infrastructure for organizations
            that protect lives.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <a
              href="#"
              className="font-mono text-[11px] tracking-[0.15em] uppercase bg-white text-black px-10 py-4 hover:bg-gray-200 transition-colors duration-300"
            >
              Request Early Access
            </a>
            <a
              href="#"
              className="font-mono text-[11px] tracking-[0.15em] uppercase text-gray-400 border border-white/20 px-10 py-4 hover:bg-white/[0.04] transition-colors duration-300"
            >
              Read the Whitepaper
            </a>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
        className="mt-40 border-t border-white/[0.06]"
      >
        <div className="max-w-[1400px] mx-auto px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="font-mono text-gray-600 text-xs">
            © 2026 [Company Name TBD]. All rights reserved.
          </div>
          <div className="flex items-center gap-8 font-mono text-gray-600 text-[11px] tracking-[0.15em] uppercase">
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
