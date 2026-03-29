import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import FacetedCrownLogo from "./FacetedCrownLogo";

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: { x: number; y: number; vy: number; size: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      resize();
      particles.length = 0;
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vy: -(Math.random() * 0.3 + 0.1),
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.2 + 0.1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.vy;
        if (p.y < -5) {
          p.y = canvas.height + 5;
          p.x = Math.random() * canvas.width;
        }
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animationId = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-mono font-bold text-white"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1.1 }}
          >
            Unlocking the proactive healthcare patients deserve.
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-6 font-sans text-lg text-white/50"
            style={{ maxWidth: 640, lineHeight: 1.7 }}
          >
            The healthcare system was not built for prevention. We are changing that — replacing outdated, reactive workflows with intelligent clinical infrastructure that catches what matters before it is too late.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="mt-8 flex flex-row gap-4"
          >
            <a
              href="#contact"
              className="font-mono text-xs uppercase tracking-[0.15em] text-white border border-white/40 bg-transparent px-8 py-3.5 transition-all duration-300 hover:bg-white hover:text-[#1a1d21]"
            >
              Request Demo
            </a>
            <a
              href="#pipeline"
              className="font-mono text-xs uppercase tracking-[0.15em] text-white border border-white/40 bg-transparent px-8 py-3.5 transition-all duration-300 hover:bg-white hover:text-[#1a1d21]"
            >
              Read White Paper
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/20 uppercase">
          Scroll to explore
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-white/20 text-sm"
        >
          ▾
        </motion.span>
      </motion.div>
    </section>
  );
};

export default HeroSection;
