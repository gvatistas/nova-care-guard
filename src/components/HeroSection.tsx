import { motion } from "framer-motion";
import { lazy, Suspense } from "react";

const DataMeshVisualization = lazy(() => import("./DataMeshVisualization"));

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-screen Three.js data mesh background */}
      <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
        <DataMeshVisualization />
      </Suspense>

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 items-center">
        <div className="lg:col-span-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-white font-mono font-light leading-[1.1] tracking-[-0.03em]"
            style={{ fontSize: "3rem" }}
          >
            Unlocking the proactive healthcare patients deserve.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-5 font-mono max-w-2xl leading-relaxed"
            style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.125rem" }}
          >
            The healthcare system was not built for prevention. We are changing that — replacing outdated, reactive workflows with intelligent clinical infrastructure that catches what matters before it is too late.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
          >
            <a href="#contact" className="group font-mono tracking-[0.15em] uppercase bg-white text-black px-10 py-4 hover:bg-gray-200 transition-all duration-300" style={{ fontSize: "1rem" }}>
              Request Demo
            </a>
            <a href="#pipeline" className="font-mono tracking-[0.15em] uppercase hover:text-white transition-colors duration-300 flex items-center gap-2 border border-white/30 text-white px-10 py-4" style={{ fontSize: "1rem" }}>
              How it works
              <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="text-lg">↓</motion.span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
};

export default HeroSection;
