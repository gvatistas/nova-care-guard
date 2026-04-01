import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const CTASection = () => {
  const ref = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
    };
    resize();
    window.addEventListener("resize", resize);

    const nodes: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    for (let i = 0; i < 60; i++) {
      nodes.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0004,
        vy: (Math.random() - 0.5) * 0.0004,
        size: Math.random() * 2 + 1,
      });
    }

    const draw = () => {
      time += 0.005;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Update nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;

        // Subtle mouse attraction
        const dx = mousePos.x - n.x;
        const dy = mousePos.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.3) {
          n.vx += dx * 0.00003;
          n.vy += dy * 0.00003;
        }
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.15) {
            const alpha = (1 - dist / 0.15) * 0.15;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
            ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
            ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        const pulse = Math.sin(time * 2 + n.x * 10) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(n.x * w, n.y * h, n.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${0.2 + pulse * 0.3})`;
        ctx.fill();
      });

      // Draw scanning line
      const scanY = ((Math.sin(time * 0.8) + 1) / 2) * h;
      const gradient = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      gradient.addColorStop(0, "rgba(96, 165, 250, 0)");
      gradient.addColorStop(0.5, "rgba(96, 165, 250, 0.04)");
      gradient.addColorStop(1, "rgba(96, 165, 250, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY - 40, w, 80);

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <section
      id="contact"
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: "#1C1C1C" }}
    >
      {/* Animated network canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.8 }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 30% 50%, rgba(96,165,250,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-[1440px] mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Overline */}
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 48 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-px mb-6"
            style={{ backgroundColor: "rgba(96,165,250,0.5)" }}
          />

          <h2
            className="font-normal text-3xl md:text-4xl mb-4"
            style={{ letterSpacing: "-0.03em", color: "#F9FAFB" }}
          >
            Bridging the gap between AI and evidence-based care.
          </h2>
          <p
            className="text-lg mb-10 max-w-3xl"
            style={{ lineHeight: 1.7, letterSpacing: "-0.01em", color: "rgba(156,163,175,0.9)" }}
          >
            Replacing outdated, reactive workflows with intelligent clinical
            infrastructure that catches what matters before it's too late.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <motion.a
              href="#"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative text-[13px] font-medium uppercase px-12 py-4 overflow-hidden transition-all duration-300"
              style={{
                letterSpacing: "0.05em",
                color: "#F9FAFB",
                background: "linear-gradient(135deg, rgba(156,163,175,0.2), rgba(156,163,175,0.08))",
                border: "1px solid rgba(156,163,175,0.25)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span className="relative z-10">Request Demo</span>
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-[13px] font-medium uppercase px-12 py-4 transition-all duration-300"
              style={{
                letterSpacing: "0.05em",
                color: "rgba(156,163,175,0.8)",
                border: "1px solid rgba(156,163,175,0.15)",
                backdropFilter: "blur(12px)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              Read White Paper
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
        className="mt-16 border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-[1440px] mx-auto px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm" style={{ color: "rgba(107,114,128,0.7)" }}>
            © 2026 Medient Health. All rights reserved.
          </div>
          <div
            className="flex items-center gap-8 text-[13px] font-medium uppercase"
            style={{ letterSpacing: "0.05em", color: "rgba(107,114,128,0.7)" }}
          >
            <a href="#" className="hover:text-white/60 transition-colors duration-300">
              Whitepaper
            </a>
            <a href="#" className="hover:text-white/60 transition-colors duration-300">
              GuideBench
            </a>
            <a href="#" className="hover:text-white/60 transition-colors duration-300">
              Contact
            </a>
          </div>
        </div>
      </motion.footer>
    </section>
  );
};

export default CTASection;
