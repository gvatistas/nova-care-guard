import { motion } from "framer-motion";
import { useState, lazy, Suspense } from "react";

const HeroVisualization = lazy(() => import("./HeroVisualization"));

const HeroSection = () => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouse = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" onMouseMove={handleMouse}>
      {/* Video background */}
      <div className="absolute inset-0">
        <video src="/medient-hero.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ opacity: 0.75 }} />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/20" />
      </div>

      {/* Crosshatch texture */}
      <div className="absolute inset-0 texture-crosshatch pointer-events-none" />

      {/* Mouse-follow glow */}
      <div className="absolute inset-0 pointer-events-none transition-none"
        style={{ background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.03), transparent 50%)` }} />

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 items-center">
        <div className="lg:col-span-5">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-white font-mono font-light leading-[1.1] tracking-[-0.03em]"
            style={{ fontSize: "4rem" }}
          >
            The Bridge Between AI and <span style={{ color: "#10b981" }}>Evidence-Based</span> Healthcare
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-5 font-mono max-w-2xl leading-relaxed"
            style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.125rem" }}
          >
            AI-powered clinical intelligence that analyzes patient data in real-time, identifies eligible screenings, and executes evidence-based prevention at scale.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
          >
            <a href="#contact" className="group font-mono tracking-[0.15em] uppercase bg-white text-black px-10 py-4 hover:bg-gray-200 transition-all duration-300" style={{ fontSize: "1rem" }}>
              Request Access
            </a>
            <a href="#pipeline" className="font-mono tracking-[0.15em] uppercase hover:text-white transition-colors duration-300 flex items-center gap-2 border border-white/20 text-white px-10 py-4" style={{ fontSize: "1rem" }}>
              How it works
              <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-lg">↓</motion.span>
            </a>
          </motion.div>
        </div>

        {/* Right: 3D Visualization */}
        <div className="hidden lg:block lg:col-span-7 h-[600px]">
          <Suspense fallback={null}>
            <HeroVisualization />
          </Suspense>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
