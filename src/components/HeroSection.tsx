import { motion } from "framer-motion";
import medientWatermark from "@/assets/medient-watermark.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Watermark logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src={medientWatermark}
          alt=""
          className="w-[600px] md:w-[800px] opacity-[0.03] invert"
        />
      </div>

      {/* Radial gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]" />

      {/* Horizontal scan line animation */}
      <motion.div
        initial={{ y: "-100%" }}
        animate={{ y: "200%" }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-8 w-full">
        <div className="max-w-5xl">
          {/* Status indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-gray-500">
              Clinical Decision Infrastructure
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-white text-[clamp(2.5rem,7vw,6.5rem)] font-mono font-light leading-[1.02] tracking-[-0.03em]"
          >
            The Clinical
            <br />
            Decision
            <br />
            <span className="text-gray-600">Compiler</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-gray-500 text-lg md:text-xl font-light mt-12 max-w-xl leading-relaxed"
          >
            We compile clinical guidelines into formally verified,
            deterministic decision artifacts. No inference at runtime.
            No hallucination. Ever.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-14 flex items-center gap-6"
          >
            <a
              href="#contact"
              className="group font-mono text-[11px] tracking-[0.15em] uppercase bg-white text-black px-8 py-4 hover:bg-gray-200 transition-all duration-300 relative overflow-hidden"
            >
              <span className="relative z-10">Request Access</span>
            </a>
            <a
              href="#pipeline"
              className="font-mono text-[11px] tracking-[0.15em] uppercase text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              How it works
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-lg"
              >
                ↓
              </motion.span>
            </a>
          </motion.div>

          {/* Trust markers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="mt-24 flex items-center gap-12 border-t border-white/[0.06] pt-10"
          >
            {[
              { num: "4.5M", label: "Patients Covered" },
              { num: "100%", label: "Deterministic" },
              { num: "0", label: "Runtime Inference" },
            ].map((item) => (
              <div key={item.label}>
                <div className="font-mono text-white text-xl md:text-2xl font-light tracking-tight">
                  {item.num}
                </div>
                <div className="text-gray-600 text-[11px] font-mono tracking-[0.1em] uppercase mt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
