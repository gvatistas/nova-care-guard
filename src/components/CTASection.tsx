import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import medientWatermark from "@/assets/medient-watermark.png";

const CTASection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" ref={ref} className="relative py-20 md:py-32 overflow-hidden">
      {/* Top separator */}
      <div className="absolute top-0 left-6 md:left-8 right-6 md:right-8 h-px bg-white/[0.06]" />

      <div className="absolute inset-0 flex items-center justify-end pointer-events-none">
        <img src={medientWatermark} alt="" className="w-[500px] opacity-[0.02] invert translate-x-1/4" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="max-w-3xl">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-mono font-light leading-[1.1] tracking-[-0.02em] mb-6">
            Probabilistic once. <span className="text-accent">Deterministic forever.</span>
          </h2>

          <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed mb-8 md:mb-10 max-w-xl">
            Now accepting government and enterprise inquiries.
            Defense-grade clinical infrastructure for organizations that protect lives.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <a href="#" className="font-mono text-sm tracking-[0.1em] uppercase bg-white text-black px-10 py-4 hover:bg-accent transition-all duration-500">
              Request Early Access
            </a>
            <a href="#" className="font-mono text-sm tracking-[0.1em] uppercase text-gray-400 border border-white/20 px-10 py-4 hover:bg-white/[0.04] transition-colors duration-300">
              Read the Whitepaper
            </a>
          </div>
        </motion.div>
      </div>

      <motion.footer initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }} className="mt-20 md:mt-28 border-t border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="font-mono text-gray-500 text-sm">© 2026 Medient Health. All rights reserved.</div>
          <div className="flex items-center gap-8 font-mono text-gray-500 text-sm tracking-[0.1em] uppercase">
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
