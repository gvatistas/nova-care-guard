import { motion } from "framer-motion";
import arcadeCabinet from "@/assets/pixel-arcade-cabinet.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background — the arcade cabinet as a cinematic backdrop */}
      <div className="absolute inset-0">
        <img
          src={arcadeCabinet}
          alt=""
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] opacity-[0.08] blur-[1px]"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-8 w-full">
        <div className="max-w-4xl">
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-mono text-[11px] tracking-[0.3em] uppercase text-gray-500 mb-8"
          >
            Clinical Decision Infrastructure
          </motion.div>

          {/* Headline — massive, confident */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-white text-[clamp(2.5rem,7vw,6rem)] font-mono font-light leading-[1.05] tracking-[-0.03em]"
          >
            The Clinical
            <br />
            Decision Compiler
          </motion.h1>

          {/* Sub — restrained */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-gray-500 text-lg md:text-xl font-light mt-10 max-w-xl leading-relaxed"
          >
            We compile clinical guidelines into formally verified,
            deterministic decision artifacts. No inference at runtime.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-14 flex items-center gap-6"
          >
            <a
              href="#contact"
              className="font-mono text-[11px] tracking-[0.15em] uppercase bg-white text-black px-8 py-4 hover:bg-gray-200 transition-colors duration-300"
            >
              Request Access
            </a>
            <a
              href="#pipeline"
              className="font-mono text-[11px] tracking-[0.15em] uppercase text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              How it works
              <span className="text-lg">↓</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
};

export default HeroSection;
