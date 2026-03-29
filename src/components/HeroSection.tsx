import { motion } from "framer-motion";
import Orb from "./Orb";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* CRT overlay */}
      <div className="absolute inset-0 crt-overlay z-10" />
      
      {/* Subtle grid */}
      <div className="absolute inset-0 dot-grid opacity-[0.03]" />

      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-teal/[0.03] blur-[120px]" />

      <div className="relative z-20 flex flex-col items-center text-center px-6">
        {/* Classification badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-mono text-xs tracking-[0.2em] uppercase text-warm-gray mb-12 border border-grid-line px-4 py-1.5 rounded-sm"
        >
          Clearance Level: Unrestricted
        </motion.div>

        {/* Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
          className="mb-16"
        >
          <Orb size={180} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-pearl text-4xl md:text-6xl lg:text-7xl font-mono font-light tracking-[-0.02em] leading-[1.1] max-w-4xl"
        >
          The Clinical Decision
          <br />
          <span className="text-teal">Compiler</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="font-mono text-warm-gray text-lg md:text-xl font-light mt-8 max-w-2xl tracking-[-0.01em]"
        >
          Probabilistic once.{" "}
          <span className="text-pearl">Deterministic forever.</span>
        </motion.p>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="mt-16 flex items-center gap-8 md:gap-12"
        >
          {[
            { value: "143+", label: "Guidelines Compiled" },
            { value: "1,200+", label: "Formal Proofs" },
            { value: "0", label: "Inference at Runtime" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-mono text-2xl md:text-3xl text-teal font-light">{stat.value}</div>
              <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-warm-gray mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-warm-gray">Scroll</div>
          <div className="w-px h-8 bg-gradient-to-b from-warm-gray to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
