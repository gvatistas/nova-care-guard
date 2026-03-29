import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const certifications = [
  { name: "SOC 2 Type II", status: "In Progress", icon: "🔒", desc: "Enterprise security controls audited annually" },
  { name: "HIPAA", status: "Compliant", icon: "🏥", desc: "Full PHI protection with BAA available" },
  { name: "FHIR R4", status: "Native", icon: "⚕️", desc: "Standard-compliant clinical data interchange" },
  { name: "FDA SaMD", status: "Pathway Active", icon: "📋", desc: "Class II Software as Medical Device clearance" },
];

const securityLayers = [
  {
    layer: "01",
    name: "Data Isolation",
    desc: "Zero patient data touches Medient infrastructure. Artifacts operate on de-identified eligibility parameters only.",
    detail: "No PHI storage. No data retention. Stateless execution.",
    accentHsl: "160 82% 61%",
  },
  {
    layer: "02",
    name: "Formal Verification",
    desc: "Every artifact verified via SMT solver before deployment — proving exhaustiveness, determinism, and safety properties.",
    detail: "Mathematically proven. Not just tested.",
    accentHsl: "210 70% 55%",
  },
  {
    layer: "03",
    name: "Audit Trail",
    desc: "Complete decision provenance — from patient input to recommendation output to source guideline paragraph.",
    detail: "Every decision fully reproducible and auditable.",
    accentHsl: "270 50% 60%",
  },
  {
    layer: "04",
    name: "Deployment Security",
    desc: "On-premises deployment options. Air-gapped network support. Classified-grade infrastructure for government clients.",
    detail: "Your data never leaves your perimeter.",
    accentHsl: "35 50% 60%",
  },
];

const SecuritySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative py-14 md:py-20 texture-facets">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(91,141,239,0.025),transparent_60%)] pointer-events-none" />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 mb-6">
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="lg:col-span-7">
            <div className="font-mono text-sm tracking-[0.25em] uppercase text-[hsl(210,70%,55%)]/70 mb-3">Security & Compliance</div>
            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-mono font-light leading-[1.15] tracking-[-0.02em]">
              Defense-grade. <span className="text-gray-500">By design.</span>
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }} className="lg:col-span-5 flex items-end">
            <p className="text-gray-300 text-lg font-light leading-relaxed">
              Built for organizations that protect lives. <span className="text-white font-normal">Zero patient data exposure. Mathematically verified outputs.</span>
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Security Layers */}
          <div>
            <div className="border-t border-white/[0.06]">
              {securityLayers.map((layer, i) => (
                <motion.div key={layer.layer} initial={{ opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.12 }}
                  className={`py-4 px-4 border-b border-white/[0.06] transition-all duration-500 cursor-default ${
                    hoveredLayer === i ? "bg-white/[0.02]" : "hover:bg-white/[0.01]"
                  }`}
                  onMouseEnter={() => setHoveredLayer(i)} onMouseLeave={() => setHoveredLayer(null)}>
                  <div className="flex items-start gap-4">
                    <span className={`font-mono text-base transition-colors duration-300 mt-0.5 ${
                      hoveredLayer === i ? `text-[hsl(${layer.accentHsl})]` : "text-gray-600"
                    }`}>{layer.layer}</span>
                    <div className="flex-1">
                      <h3 className={`font-mono text-base md:text-lg font-light transition-colors duration-300 ${
                        hoveredLayer === i ? `text-[hsl(${layer.accentHsl})]` : "text-white"
                      }`}>{layer.name}</h3>
                      <p className="text-gray-300 text-base leading-relaxed mt-1">{layer.desc}</p>
                      <motion.p initial={false} animate={{ opacity: hoveredLayer === i ? 1 : 0, height: hoveredLayer === i ? "auto" : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-500 text-sm mt-1 overflow-hidden">{layer.detail}</motion.p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications grid */}
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}>
            <div className="grid grid-cols-2 gap-px bg-white/[0.06] h-full">
              {certifications.map((cert, i) => (
                <motion.div key={cert.name} initial={{ opacity: 0, scale: 0.95 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="bg-background/80 p-6 panel-3d flex flex-col justify-between min-h-[180px] group hover:bg-white/[0.015] transition-all duration-500">
                  <div>
                    <span className="text-2xl">{cert.icon}</span>
                    <h4 className="font-mono text-lg text-white font-light mt-3 group-hover:text-accent transition-colors duration-300">{cert.name}</h4>
                    <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">{cert.desc}</p>
                  </div>
                  <div className="mt-3">
                    <span className={`inline-flex items-center gap-2 font-mono text-xs tracking-[0.15em] uppercase ${
                      cert.status === "Compliant" || cert.status === "Native"
                        ? "text-accent/70"
                        : "text-[hsl(35,50%,60%)]/70"
                    }`}>
                      <span className={`w-1.5 h-1.5 rotate-45 ${
                        cert.status === "Compliant" || cert.status === "Native"
                          ? "bg-accent/60"
                          : "bg-[hsl(35,50%,60%)]/60 animate-pulse"
                      }`} />
                      {cert.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
