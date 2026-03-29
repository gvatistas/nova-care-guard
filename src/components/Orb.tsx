import { useEffect, useRef } from "react";

interface OrbProps {
  size?: number;
  className?: string;
}

const Orb = ({ size = 160, className = "" }: OrbProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30;
      container.style.setProperty("--mouse-x", `${x}deg`);
      container.style.setProperty("--mouse-y", `${y}deg`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    delay: i * 0.8,
    duration: 4 + Math.random() * 4,
    radius: size * 0.45 + Math.random() * size * 0.25,
    orbSize: 2 + Math.random() * 2,
  }));

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        width: size,
        height: size,
        ["--mouse-x" as string]: "0deg",
        ["--mouse-y" as string]: "0deg",
      }}
    >
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 rounded-full blur-[60px] opacity-30"
        style={{
          background: "radial-gradient(circle, hsl(var(--teal)), hsl(var(--lilac) / 0.5), transparent)",
        }}
      />

      {/* Main orb */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `
            radial-gradient(circle at 35% 35%, hsl(var(--pearl) / 0.9), transparent 50%),
            radial-gradient(circle at 65% 65%, hsl(var(--lilac) / 0.6), transparent 50%),
            linear-gradient(135deg, hsl(var(--teal)), hsl(var(--lilac)), hsl(var(--teal)))
          `,
          backgroundSize: "100% 100%, 100% 100%, 200% 200%",
          animation: "orb-shimmer 6s ease-in-out infinite, orb-float 4s ease-in-out infinite",
          boxShadow: `
            inset 0 0 ${size * 0.3}px hsl(var(--teal) / 0.3),
            0 0 ${size * 0.4}px hsl(var(--teal) / 0.15),
            0 0 ${size * 0.8}px hsl(var(--lilac) / 0.1)
          `,
          transform: "perspective(600px) rotateX(var(--mouse-y)) rotateY(var(--mouse-x))",
          transition: "transform 200ms ease-out",
        }}
      >
        {/* Fresnel rim */}
        <div
          className="absolute inset-[2px] rounded-full"
          style={{
            background: "radial-gradient(circle, transparent 60%, hsl(var(--pearl) / 0.25) 100%)",
          }}
        />
      </div>

      {/* Orbital ring */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: size * 1.15,
          height: size * 0.35,
          border: "1px solid hsl(var(--teal) / 0.4)",
          animation: "orb-rotate 8s linear infinite",
          transformStyle: "preserve-3d",
        }}
      />

      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute left-1/2 top-1/2"
          style={{
            ["--orbit-radius" as string]: `${p.radius}px`,
            width: p.orbSize,
            height: p.orbSize,
            borderRadius: "50%",
            background: p.id % 2 === 0 ? "hsl(var(--teal))" : "hsl(var(--lilac))",
            animation: `particle-orbit ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            boxShadow: `0 0 4px ${p.id % 2 === 0 ? "hsl(var(--teal))" : "hsl(var(--lilac))"}`,
          }}
        />
      ))}
    </div>
  );
};

export default Orb;
