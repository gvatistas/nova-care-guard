import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const networks = [
  { name: "Réseau Santé Montérégie", pop: "1.6M", metric: "+41%" },
  { name: "CIUSSS de la Capitale-Nationale", pop: "740K", metric: "+38%" },
  { name: "CISSS de Laval", pop: "440K", metric: "+52%" },
  { name: "CIUSSS du Centre-Sud", pop: "1.1M", metric: "+47%" },
  { name: "CISSS des Laurentides", pop: "620K", metric: "+35%" },
];

const ProjectBetaSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="project-beta" ref={ref} className="relative py-40 md:py-56">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="lg:col-span-7"
          >
            <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-gray-600 mb-8">
              Case Study
            </div>
            <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-mono font-light leading-[1.15] tracking-[-0.02em]">
              Project Beta
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5 flex items-end"
          >
            <p className="text-gray-500 text-base font-light leading-relaxed">
              Five health networks across Quebec. 4.5 million patients. 
              The largest deployment of compiled clinical decision artifacts 
              in North America.
            </p>
          </motion.div>
        </div>

        {/* Network table */}
        <div className="border-t border-white/[0.06]">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-4 py-5 px-2 border-b border-white/[0.06]">
            <div className="col-span-1 font-mono text-gray-600 text-[10px] tracking-[0.2em] uppercase">#</div>
            <div className="col-span-5 font-mono text-gray-600 text-[10px] tracking-[0.2em] uppercase">Network</div>
            <div className="col-span-3 font-mono text-gray-600 text-[10px] tracking-[0.2em] uppercase">Population</div>
            <div className="col-span-3 font-mono text-gray-600 text-[10px] tracking-[0.2em] uppercase text-right">Impact</div>
          </div>

          {networks.map((network, i) => (
            <motion.div
              key={network.name}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="grid grid-cols-12 gap-4 py-8 px-2 border-b border-white/[0.06] hover:bg-white/[0.01] transition-colors duration-300"
            >
              <div className="col-span-1 font-mono text-gray-600 text-sm">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="col-span-5 font-mono text-white text-sm font-light">
                {network.name}
              </div>
              <div className="col-span-3 text-gray-500 text-sm font-light">
                {network.pop} patients
              </div>
              <div className="col-span-3 font-mono text-white text-sm font-light text-right">
                {network.metric}
                <span className="text-gray-600 ml-1">adherence</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Aggregate */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-20 flex items-baseline gap-4"
        >
          <span className="font-mono text-white text-6xl md:text-8xl font-light tracking-[-0.03em]">
            4.5M
          </span>
          <span className="text-gray-500 text-lg font-light">
            patients covered
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectBetaSection;
