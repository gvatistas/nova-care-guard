import { motion } from "framer-motion";
import Orb from "./Orb";
import arcadeCabinet from "@/assets/pixel-arcade-cabinet.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* CRT overlay */}
      <div className="absolute inset-0 crt-overlay z-10" />

      {/* Vignette */}
      <div className="absolute inset-0 z-[5]" style={{
        background: "radial-gradient(ellipse at center, transparent 50%, hsl(var(--void) / 0.6) 100%)"
      }} />

      {/* Pixel dust particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-px h-px bg-pearl/20 z-[2]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `pixel-dust ${4 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 6}s`,
          }}
        />
      ))}

      <div className="relative z-20 flex flex-col items-center text-center px-6">
        {/* Arcade cabinet image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative mb-8"
        >
          {/* The Orb floating above the cabinet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="absolute -top-20 left-1/2 -translate-x-1/2 z-30"
          >
            <Orb size={100} />
          </motion.div>

          <img
            src={arcadeCabinet}
            alt="Isometric pixel art arcade cabinet displaying The Clinical Decision Compiler"
            width={480}
            height={480}
            className="pixel-render max-w-[320px] md:max-w-[420px] lg:max-w-[480px]"
          />
        </motion.div>

        {/* INSERT COIN prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex flex-col items-center gap-3"
        >
          <span
            className="font-pixel text-gold text-sm md:text-base tracking-wider"
            style={{ animation: "coin-blink 1.2s ease-in-out infinite" }}
          >
            INSERT COIN ▼
          </span>
          <div
            className="text-gold/60 text-lg"
            style={{ animation: "bounce-arrow 1s ease-in-out infinite" }}
          >
            ⌄
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
