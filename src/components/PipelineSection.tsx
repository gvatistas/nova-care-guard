import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const stages = [
  { num: "01", name: "Ingestion", desc: "Clinical guideline PDF is parsed into structured clinical logic with full source fidelity verification.", detail: "Every assertion traced to its original page and paragraph. Nothing is inferred — everything is extracted." },
  { num: "02", name: "Schema Generation", desc: "Structured logic is transformed into a typed decision schema with explicit constraint types and branching rules.", detail: "No ambiguity survives this stage. Every branch is explicitly typed. Every condition formally bounded." },
  { num: "03", name: "Formal Verification", desc: "An SMT solver mathematically proves exhaustiveness, determinism, and reachability across infinite input space.", detail: "Proof across infinite input space. Every reachable state verified. No edge case left unconsidered." },
  { num: "04", name: "Structural Analysis", desc: "Graph analysis validates the topology — no orphan nodes, unreachable states, or infinite loops exist.", detail: "Complete structural integrity guaranteed before any artifact reaches production." },
  { num: "05", name: "Composition", desc: "The verified artifact is compiled into a deployable FHIR PlanDefinition bundle — deterministic at runtime.", detail: "Production-ready. Zero inference required. Zero hallucination possible. Fully auditable." },
];

const TiltCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const [transform, setTransform] = useState("");
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouse = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTransform(`perspective(800px) rotateX(${(0.5 - y) * 4}deg) rotateY(${(x - 0.5) * 4}deg)`);
    setGlowPos({ x: x * 100, y: y * 100 });
  };

  return (
    <div
      ref={cardRef}
      className={`relative transition-transform duration-300 ease-out ${className}`}
      style={{ transform }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { setTransform(""); setGlowPos({ x: 50, y: 50 }); }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-inherit"
        style={{ background: `radial-gradient(300px circle at ${glowPos.x}% ${glowPos.y}%, rgba(74,237,196,0.06), transparent 60%)` }}
      />
      {children}
    </div>
  );
};

const PipelineSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  const [sectionMouse, setSectionMouse] = useState({ x: 50, y: 50 });

  const handleSectionMouse = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSectionMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section id="pipeline" ref={ref} className="relative py-20 md:py-32" onMouseMove={handleSectionMouse}>
      {/* Top separator */}
      <div className="absolute top-0 left-6 md:left-8 right-6 md:right-8 h-px bg-white/[0.06]" />

      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{ background: `radial-gradient(800px circle at ${sectionMouse.x}% ${sectionMouse.y}%, rgba(74,237,196,0.03), transparent 50%)` }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 mb-12 md:mb-16">
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="lg:col-span-7">
            <div className="font-mono text-sm tracking-[0.25em] uppercase text-gray-500 mb-4">Architecture</div>
            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-mono font-light leading-[1.1] tracking-[-0.02em]">
              Five stages. <span className="text-gray-500">Verified at every gate.</span>
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }} className="lg:col-span-5 flex items-end">
            <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed">
              No inference at runtime. No probabilistic output. The artifact is compiled once,
              verified exhaustively, then deployed as deterministic infrastructure.
            </p>
          </motion.div>
        </div>

        {/* Visual pipeline nodes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="hidden md:flex items-center justify-between mb-12 relative"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-accent/30 via-accent/10 to-accent/30 origin-left"
          />
          {stages.map((stage, i) => (
            <TiltCard key={i} className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.6 + i * 0.15, type: "spring" }}
                className="flex flex-col items-center cursor-pointer"
                onMouseEnter={() => setHoveredStage(i)}
                onMouseLeave={() => setHoveredStage(null)}
              >
                <div className={`w-14 h-14 border flex items-center justify-center transition-all duration-500 ${
                  hoveredStage === i
                    ? "border-accent bg-accent/10 shadow-[0_0_30px_rgba(74,237,196,0.2)] scale-110"
                    : "border-white/10 bg-background hover:border-white/20"
                }`}>
                  <span className={`font-mono text-sm transition-colors duration-300 ${hoveredStage === i ? "text-accent" : "text-gray-500"}`}>{stage.num}</span>
                </div>
                <span className={`font-mono text-xs mt-2 tracking-wide transition-colors duration-300 ${hoveredStage === i ? "text-accent" : "text-gray-400"}`}>{stage.name}</span>
              </motion.div>
            </TiltCard>
          ))}
        </motion.div>

        {/* Stages detail rows */}
        <div className="border-t border-white/[0.06]">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.num}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.12 }}
              onMouseEnter={() => setHoveredStage(i)}
              onMouseLeave={() => setHoveredStage(null)}
              className={`group border-b border-white/[0.06] py-6 md:py-8 grid grid-cols-12 gap-4 md:gap-8 items-start px-2 md:px-4 cursor-default transition-all duration-500 ${
                hoveredStage === i ? "bg-accent/[0.02] shadow-[inset_0_0_60px_rgba(74,237,196,0.02)]" : "hover:bg-white/[0.01]"
              }`}
            >
              <div className="col-span-2 md:col-span-1">
                <span className={`font-mono text-base transition-colors duration-500 ${hoveredStage === i ? "text-accent" : "text-gray-600"}`}>{stage.num}</span>
              </div>
              <div className="col-span-10 md:col-span-3">
                <h3 className={`font-mono text-base md:text-lg font-light transition-colors duration-500 ${hoveredStage === i ? "text-accent" : "text-white"}`}>{stage.name}</h3>
              </div>
              <div className="col-span-12 md:col-span-5">
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">{stage.desc}</p>
              </div>
              <div className="col-span-12 md:col-span-3">
                <motion.p
                  initial={false}
                  animate={{ opacity: hoveredStage === i ? 1 : 0, y: hoveredStage === i ? 0 : 5 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-500 text-sm leading-relaxed"
                >{stage.detail}</motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PipelineSection;
