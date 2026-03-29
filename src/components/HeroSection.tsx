import { motion } from "framer-motion";
import medientLogo from "@/assets/medient-watermark.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Watermark logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img src={medientLogo} alt="" className="w-[600px] md:w-[800px] opacity-[0.03] invert" />
      </div>

      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(74,237,196,0.04)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(74,237,196,0.02)_0%,transparent_50%)]" />

      {/* Horizontal scan line */}
      <motion.div
        initial={{ y: "-100%" }}
        animate={{ y: "200%" }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent pointer-events-none"
      />

      {/* Vertical accent line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 2, delay: 1, ease: "easeOut" }}
        className="absolute left-[10%] top-[15%] w-px h-[70%] bg-gradient-to-b from-transparent via-accent/10 to-transparent origin-top pointer-events-none"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-8 w-full">
        <div className="max-w-5xl">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-white text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-mono font-light leading-[1.08] tracking-[-0.03em]"
          >
            The Bridge Between
            <br />
            <span className="text-white">AI</span> and{" "}
            <span className="text-accent">Evidence-Based</span>
            <br />
            Healthcare
          </motion.h1>

          {/* Subtext — the new messaging */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-10 md:mt-14 max-w-2xl space-y-6"
          >
            <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed">
              Medical knowledge has never been more advanced.
            </p>
            <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed">
              That knowledge is trapped in medical guidelines that clinicians
              are unable to apply in practice.
            </p>
            <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed">
              We've built an AI-enabled pipeline that converts medical guidelines
              into <span className="text-accent font-normal">deterministic clinical logic</span>.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mt-12 md:mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
          >
            <a
              href="#contact"
              className="group font-mono text-sm tracking-[0.1em] uppercase bg-white text-black px-10 py-4 hover:bg-accent hover:text-black transition-all duration-500 relative overflow-hidden"
            >
              <span className="relative z-10">Request Access</span>
            </a>
            <a
              href="#pipeline"
              className="font-mono text-sm tracking-[0.1em] uppercase text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
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
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
