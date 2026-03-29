import { lazy, Suspense } from "react";
import { motion } from "framer-motion";

const DataMeshVisualization = lazy(() => import("./DataMeshVisualization"));

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
          <DataMeshVisualization />
        </Suspense>
      </div>
      <div className="absolute inset-0 z-10 bg-black/60" />
      <div className="relative z-20 mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-24">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "4rem", fontWeight: 700, lineHeight: 1.1, color: "#ffffff" }}
          >
            Unlocking the proactive healthcare patients deserve.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.125rem", color: "rgba(255,255,255,0.7)", maxWidth: 640, marginTop: "1.5rem", lineHeight: 1.7 }}
          >
            The healthcare system was not built for prevention. We are changing that — replacing outdated, reactive workflows with intelligent clinical infrastructure that catches what matters before it is too late.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-8 flex flex-row gap-4"
          >
            <a
              href="#contact"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, backgroundColor: "#ffffff", color: "#000000", padding: "14px 32px" }}
            >
              Request Demo
            </a>
            <a
              href="#pipeline"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, backgroundColor: "transparent", color: "#ffffff", border: "1px solid rgba(255,255,255,0.4)", padding: "14px 32px" }}
            >
              Read White Paper
            </a>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-20" />
    </section>
  );
};

export default HeroSection;
