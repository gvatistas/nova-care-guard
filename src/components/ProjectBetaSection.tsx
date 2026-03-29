import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ProjectBetaSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const networks = [
    { name: "Réseau Santé Montérégie", pop: "1.6M", metric: "+41% screening adherence" },
    { name: "CIUSSS de la Capitale-Nationale", pop: "740K", metric: "+38% preventive capture" },
    { name: "CISSS de Laval", pop: "440K", metric: "+52% guideline compliance" },
    { name: "CIUSSS du Centre-Sud", pop: "1.1M", metric: "+47% early detection" },
    { name: "CISSS des Laurentides", pop: "620K", metric: "+35% care pathway completion" },
  ];

  return (
    <section id="project-beta" ref={ref} className="relative py-40 overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-[0.03]" />
      
      <div className="relative max-w-[1400px] mx-auto px-6">
        {/* Classification header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-teal">
              Case Study · Classified
            </span>
          </div>
          <h2 className="font-mono text-4xl md:text-5xl font-light text-pearl tracking-[-0.02em]">
            Project Beta
          </h2>
          <p className="font-mono text-warm-gray text-base font-light mt-4 max-w-xl">
            Five health networks. One province. The largest deployment of compiled clinical 
            decision artifacts in North America.
          </p>
        </motion.div>

        {/* Quebec network grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {networks.map((network, i) => (
            <motion.div
              key={network.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="group border border-grid-line bg-deep-field p-6 hover:border-teal/40 transition-all duration-300 hover:-translate-y-1"
              style={{ borderRadius: "8px" }}
            >
              <div className="font-mono text-xs tracking-[0.15em] uppercase text-teal mb-3">
                Network {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-mono text-pearl text-sm font-light mb-4 leading-relaxed">
                {network.name}
              </h3>
              <div className="flex justify-between items-end">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-warm-gray">
                    Population
                  </div>
                  <div className="font-mono text-pearl text-lg">{network.pop}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-teal text-sm font-light">{network.metric}</div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Summary card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.1 }}
            className="border border-teal/30 bg-teal/[0.04] p-6 flex flex-col justify-center"
            style={{ borderRadius: "8px" }}
          >
            <div className="font-mono text-xs tracking-[0.15em] uppercase text-teal mb-3">
              Aggregate Impact
            </div>
            <div className="font-mono text-3xl text-pearl font-light mb-2">4.5M+</div>
            <p className="font-mono text-warm-gray text-xs font-light">
              Patients covered across Quebec's provincial health infrastructure. 
              Zero inference cost. Formally verified outputs.
            </p>
          </motion.div>
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.4 }}
          className="mt-16 text-center"
        >
          <p className="font-mono text-warm-gray text-sm font-light italic">
            "The prevention mandate is funded. The tools weren't built — until now."
          </p>
          <p className="font-mono text-teal text-xs mt-2 tracking-[0.1em] uppercase">
            — Project Beta Internal Brief
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectBetaSection;
