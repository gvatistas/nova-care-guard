import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Orb from "./Orb";

const TheBreakSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-200px" });

  // Generate shatter fragments
  const fragments = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    tx: (Math.random() - 0.5) * 800,
    ty: (Math.random() - 0.5) * 600,
    rot: (Math.random() - 0.5) * 360,
    delay: Math.random() * 0.8,
    size: 20 + Math.random() * 60,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Shattering pixel fragments */}
      {fragments.map((f) => (
        <motion.div
          key={f.id}
          initial={{ opacity: 0.8, x: 0, y: 0, rotate: 0, scale: 1 }}
          animate={inView ? {
            opacity: 0,
            x: f.tx,
            y: f.ty,
            rotate: f.rot,
            scale: 1.3,
          } : {}}
          transition={{ delay: f.delay, duration: 1.5, ease: "easeOut" }}
          className="absolute bg-deep-field border border-grid-line/30"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: f.size,
            height: f.size,
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          }}
        />
      ))}

      {/* Central void opening */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 1.5 }}
        className="relative z-20 flex flex-col items-center"
      >
        {/* Radial glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1, duration: 2 }}
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--teal) / 0.08) 0%, transparent 70%)",
          }}
        />

        {/* Orb emergence */}
        <motion.div
          initial={{ opacity: 0, scale: 0.2 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
        >
          <Orb size={180} />
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 3 }}
          className="mt-16 text-center"
        >
          <h2 className="font-mono text-2xl md:text-4xl font-light tracking-[-0.02em]">
            <span className="text-warm-gray">Probabilistic once.</span>
            {" "}
            <span className="text-pearl">Deterministic forever.</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 4, duration: 0.6, ease: "easeOut" }}
            className="h-px bg-teal mt-4 origin-left max-w-[280px] mx-auto"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TheBreakSection;
