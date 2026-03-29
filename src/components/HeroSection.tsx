import { motion } from "framer-motion";
import { useState } from "react";
import medientWatermark from "@/assets/medient-watermark.png";

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
      <div className="absolute inset-0">
        <video src="/medient-hero.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ opacity: 0.4 }} />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
      </div>
      <div className="absolute inset-0 texture-crosshatch pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none transition-none"
        style={{ background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(74,237,196,0.04), transparent 50%)` }} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img src={medientWatermark} alt="" className="w-[600px] md:w-[800px] opacity-[0.02] invert" />
      </div>
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-8 w-full">
        <div className="max-w-5xl">
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-white text-[2.5rem] sm:text-5xl md:text-7xl lg:text-[5.5rem] font-mono font-light leading-[1.08] tracking-[-0.03em]">
            The Bridge Between AI and{" "}<span className="text-accent">Evidence-Based</span> Healthcare
          </motion.h1>

          {/* Visual stat badges instead of paragraph text */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-10 md:mt-12 flex flex-wrap gap-3">
            {[
              { val: "54%", label: "of recommended care delivered", color: "accent" },
              { val: "1M+", label: "preventable deaths / year", color: "[hsl(0,72%,60%)]" },
              { val: "20 yrs", label: "no improvement", color: "[hsl(210,70%,55%)]" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.15, type: "spring" }}
                className="border border-white/[0.08] bg-white/[0.02] px-5 py-3 panel-3d backdrop-blur-sm">
                <span className={`font-mono text-2xl md:text-3xl font-light text-${s.color}`}>{s.val}</span>
                <span className="text-gray-500 text-sm ml-3">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mt-8 md:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <a href="#contact" className="group font-mono text-sm tracking-[0.1em] uppercase bg-white text-black px-10 py-4 hover:bg-accent hover:shadow-[0_0_30px_rgba(74,237,196,0.3)] transition-all duration-500 panel-3d">Request Access</a>
            <a href="#pipeline" className="font-mono text-sm tracking-[0.1em] uppercase text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2">
              How it works
              <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-lg">↓</motion.span>
            </a>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
