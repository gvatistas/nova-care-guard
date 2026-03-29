import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const AnimCounter = ({ target, inView, suffix = "" }: { target: number; inView: boolean; suffix?: string }) => {
  const [val, setVal] = useState("0");
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, target, { duration: 2, ease: "easeOut", onUpdate: (v) => setVal(Math.round(v).toString()) });
    return () => c.stop();
  }, [inView, target]);
  return <>{val}{suffix}</>;
};

const milestones = [
  { date: "2024 Q1", event: "Founded", desc: "Clinical decision infrastructure concept validated", status: "complete" },
  { date: "2024 Q3", event: "First Artifact Compiled", desc: "USPSTF lung cancer screening — fully verified", status: "complete" },
  { date: "2024 Q4", event: "Project Beta Initiated", desc: "Partnership with 5 Quebec health networks", status: "complete" },
  { date: "2025 Q1", event: "GuideBench Published", desc: "Open-source evaluation framework released", status: "complete" },
  { date: "2025 Q2", event: "10 Guidelines Compiled", desc: "USPSTF, ACS, ADA core screening artifacts", status: "complete" },
  { date: "2025 Q3", event: "Government Pilot", desc: "Federal prevention infrastructure deployment", status: "active" },
  { date: "2025 Q4", event: "FDA Submission", desc: "SaMD Class II regulatory pathway", status: "upcoming" },
  { date: "2026 Q1", event: "Enterprise GA", desc: "General availability for health systems", status: "upcoming" },
];

const partners = [
  { name: "CIUSSS de la Capitale-Nationale", type: "Health Network" },
  { name: "CISSS de Laval", type: "Health Network" },
  { name: "Réseau Santé Montérégie", type: "Health Network" },
  { name: "CIUSSS du Centre-Sud", type: "Health Network" },
  { name: "CISSS des Laurentides", type: "Health Network" },
];

const TractionSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredMilestone, setHoveredMilestone] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative py-14 md:py-20 texture-crosshatch">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(74,237,196,0.02),transparent_50%)] pointer-events-none" />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 mb-6">
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="lg:col-span-7">
            <div className="font-mono text-sm tracking-[0.25em] uppercase text-accent/70 mb-3">Momentum</div>
            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-mono font-light leading-[1.15] tracking-[-0.02em]">
              Built fast. <span className="text-gray-500">Deployed faster.</span>
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }} className="lg:col-span-5 flex items-end">
            <p className="text-gray-300 text-lg font-light leading-relaxed">
              From concept to <span className="text-white font-normal">4.5 million patients covered</span> in under 18 months.
            </p>
          </motion.div>
        </div>

        {/* Key metrics row */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] mb-5">
          {[
            { value: 10, suffix: "+", label: "Guidelines compiled", color: "text-accent" },
            { value: 4, suffix: ".5M", label: "Patients in deployment", color: "text-[hsl(210,70%,55%)]" },
            { value: 750, suffix: "+", label: "Synthetic test patients", color: "text-[hsl(270,50%,60%)]" },
            { value: 98, suffix: ".8%", label: "GuideBench score", color: "text-accent" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-background/80 p-5 panel-3d">
              <div className={`font-mono text-3xl md:text-4xl font-light tracking-[-0.02em] ${stat.color}`}>
                <AnimCounter target={stat.value} inView={inView} suffix={stat.suffix} />
              </div>
              <div className="text-gray-400 text-sm mt-1.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Timeline */}
          <div>
            <div className="border-t border-white/[0.06]">
              {milestones.map((m, i) => {
                const isActive = m.status === "active";
                const isUpcoming = m.status === "upcoming";
                return (
                  <motion.div key={m.date} initial={{ opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className={`py-3 px-4 border-b border-white/[0.06] transition-all duration-300 cursor-default ${
                      hoveredMilestone === i ? "bg-white/[0.02]" : "hover:bg-white/[0.01]"
                    } ${isUpcoming ? "opacity-50" : ""}`}
                    onMouseEnter={() => setHoveredMilestone(i)} onMouseLeave={() => setHoveredMilestone(null)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-sm text-gray-600 w-16">{m.date}</span>
                        <span className={`font-mono text-base font-light transition-colors duration-300 ${
                          hoveredMilestone === i ? "text-accent" : "text-white"
                        }`}>{m.event}</span>
                      </div>
                      <span className={`inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] uppercase ${
                        isActive ? "text-accent/80" : isUpcoming ? "text-gray-600" : "text-gray-500"
                      }`}>
                        <span className={`w-1.5 h-1.5 rotate-45 ${
                          isActive ? "bg-accent/60 animate-pulse" : isUpcoming ? "bg-gray-700" : "bg-gray-600"
                        }`} />
                        {m.status === "complete" ? "Done" : m.status === "active" ? "Active" : "Planned"}
                      </span>
                    </div>
                    <motion.div initial={false} animate={{ opacity: hoveredMilestone === i ? 1 : 0, height: hoveredMilestone === i ? "auto" : 0 }}
                      className="overflow-hidden">
                      <p className="text-gray-400 text-sm mt-1.5 pl-20">{m.desc}</p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Network partners */}
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}
            className="border border-white/[0.06] bg-white/[0.01] p-6 md:p-8 panel-3d texture-diamonds">
            <div className="font-mono text-xs tracking-[0.2em] uppercase text-gray-500 mb-5">Active Deployments</div>
            <div className="space-y-4">
              {partners.map((p, i) => (
                <motion.div key={p.name} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rotate-45 bg-accent/50" />
                    <span className="text-white text-base font-light">{p.name}</span>
                  </div>
                  <span className="font-mono text-xs tracking-[0.1em] uppercase text-gray-500">{p.type}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-base">Total coverage</span>
                <span className="font-mono text-accent text-2xl font-light">4.5M patients</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TractionSection;
