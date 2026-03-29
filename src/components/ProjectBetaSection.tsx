import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const networks = [
  { name: "Réseau Santé Montérégie", pop: "1.6M", metric: "+41%", status: "ACTIVE" },
  { name: "CIUSSS de la Capitale-Nationale", pop: "740K", metric: "+38%", status: "ACTIVE" },
  { name: "CISSS de Laval", pop: "440K", metric: "+52%", status: "ACTIVE" },
  { name: "CIUSSS du Centre-Sud", pop: "1.1M", metric: "+47%", status: "ACTIVE" },
  { name: "CISSS des Laurentides", pop: "620K", metric: "+35%", status: "ACTIVE" },
];

const ProjectBetaSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="project-beta" ref={ref} className="relative py-20 md:py-32">
      {/* Top separator */}
      <div className="absolute top-0 left-6 md:left-8 right-6 md:right-8 h-px bg-white/[0.06]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(74,237,196,0.03)_0%,transparent_50%)]" />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 mb-10 md:mb-14">
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-accent/60 animate-pulse" />
              <span className="font-mono text-sm tracking-[0.25em] uppercase text-gray-500">Case Study — Classified</span>
            </div>
            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-mono font-light leading-[1.1] tracking-[-0.02em]">Project Beta</h2>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }} className="lg:col-span-5 flex items-end">
            <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed">
              Five health networks across the province of Quebec. 4.5 million patients.
              The largest deployment of compiled clinical decision artifacts in North America.
            </p>
          </motion.div>
        </div>

        <div className="border-t border-white/[0.06]">
          <div className="hidden md:grid grid-cols-12 gap-4 py-3 px-4 border-b border-white/[0.06]">
            <div className="col-span-1 font-mono text-gray-500 text-xs tracking-[0.2em] uppercase">#</div>
            <div className="col-span-4 font-mono text-gray-500 text-xs tracking-[0.2em] uppercase">Network</div>
            <div className="col-span-2 font-mono text-gray-500 text-xs tracking-[0.2em] uppercase">Population</div>
            <div className="col-span-3 font-mono text-gray-500 text-xs tracking-[0.2em] uppercase">Adherence Δ</div>
            <div className="col-span-2 font-mono text-gray-500 text-xs tracking-[0.2em] uppercase text-right">Status</div>
          </div>

          {networks.map((network, i) => (
            <motion.div
              key={network.name}
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.12 }}
              className="grid grid-cols-12 gap-4 py-4 md:py-5 px-4 border-b border-white/[0.06] hover:bg-white/[0.015] transition-all duration-300 group"
            >
              <div className="col-span-1 font-mono text-gray-500 text-sm md:text-base">{String(i + 1).padStart(2, "0")}</div>
              <div className="col-span-11 md:col-span-4 font-mono text-white text-sm md:text-base font-light group-hover:text-accent transition-colors duration-300">{network.name}</div>
              <div className="hidden md:block col-span-2 text-gray-400 text-base">{network.pop}</div>
              <div className="hidden md:block col-span-3 font-mono text-accent text-base">{network.metric}</div>
              <div className="hidden md:block col-span-2 text-right">
                <span className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.15em] uppercase text-accent/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-pulse" />
                  {network.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
          className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06]"
        >
          {[
            { num: "4.5M", label: "Patients covered across all networks" },
            { num: "+42%", label: "Average guideline adherence increase" },
            { num: "5", label: "Provincial health networks deployed" },
          ].map((stat, i) => (
            <div key={i} className="bg-background p-6 md:p-10">
              <div className="font-mono text-white text-4xl md:text-5xl font-light tracking-[-0.03em]">{stat.num}</div>
              <div className="text-gray-400 text-sm md:text-base mt-2">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectBetaSection;
