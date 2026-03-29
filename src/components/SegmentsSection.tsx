import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const segments = [
  { name: "Health Systems & Networks", accentHsl: "160 82% 61%", tagline: "Deploy once. Cover your whole population.", description: "Health systems struggle with inconsistent guideline adherence across departments, shifts, and facilities. Medient compiles every clinical guideline into a verified decision artifact that integrates directly into your existing EHR through FHIR.", useCase: "A 12-hospital network deploys Medient's lung cancer screening artifact. Within 90 days, every eligible patient across all facilities is automatically flagged.", metrics: [{ value: "45%", label: "reduction in missed screenings" }, { value: "$0", label: "marginal cost per encounter" }] },
  { name: "Government & Defense", accentHsl: "210 70% 55%", tagline: "The prevention mandate is funded. The tools aren't built.", description: "Government health agencies have clear mandates and dedicated funding for evidence-based prevention but lack the infrastructure to operationalize clinical guidelines at population scale.", useCase: "A federal agency deploys compiled USPSTF screening guidelines across 200+ community health centers. Every recommendation is traceable. Every decision is auditable.", metrics: [{ value: "$2.1B", label: "RHTP funding available" }, { value: "100%", label: "audit traceability" }] },
  { name: "Medicare & Medicaid", accentHsl: "160 82% 61%", tagline: "Auditable artifacts mapped to CMS quality measures.", description: "CMS quality programs require precise alignment between clinical actions and reporting measures. Medient's compiled artifacts map directly to CMS quality measures — enabling automated compliance.", useCase: "A Medicaid managed care organization integrates Medient artifacts to automate HEDIS measure compliance. Guideline adherence data flows directly into quality reporting.", metrics: [{ value: "100%", label: "CMS measure alignment" }, { value: "80%", label: "reduction in manual abstraction" }] },
  { name: "Payers & Insurance", accentHsl: "35 30% 55%", tagline: "Early detection is cheaper than late treatment. Always.", description: "For payers, every missed screening is a future catastrophic claim. Medient enables population-level guideline deployment on a per-member-per-month basis.", useCase: "A regional health plan deploys Medient's colorectal cancer screening artifact across 800K members. Within one year, screening rates increase 38%.", metrics: [{ value: "$100K+", label: "saved per prevented late-stage case" }, { value: "38%", label: "screening rate improvement" }] },
  { name: "Clinical AI Products", accentHsl: "210 70% 55%", tagline: "Clinical reasoning without the liability.", description: "Frontier labs, medical scribes, and AI wrappers need clinical decision logic but can't afford the liability of probabilistic inference. Medient provides a verified clinical logic layer through an MCP API.", useCase: "A medical AI scribe integrates Medient's API. When a physician dictates a patient encounter, the scribe automatically surfaces relevant screening recommendations from formally verified artifacts.", metrics: [{ value: "0ms", label: "inference latency" }, { value: "0%", label: "hallucination rate" }] },
  { name: "Guideline Societies", accentHsl: "160 82% 61%", tagline: "Your guidelines, actually followed.", description: "Medical societies spend years developing evidence-based guidelines that languish as PDFs. Medient compiles your narrative guidelines into verified, deployable decision artifacts.", useCase: "A major cardiology society partners with Medient to compile their hypertension guidelines. Within 6 months, participating health systems report near-universal adherence.", metrics: [{ value: "~100%", label: "guideline adherence rate" }, { value: "10x", label: "faster guideline adoption" }] },
];

const SegmentsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [expanded, setExpanded] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleSectionMouse = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section ref={ref} className="relative py-20 md:py-32" onMouseMove={handleSectionMouse}>
      {/* Top separator */}
      <div className="absolute top-0 left-6 md:left-8 right-6 md:right-8 h-px bg-white/[0.06]" />

      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: hoveredIdx !== null
            ? `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, hsla(${segments[hoveredIdx].accentHsl} / 0.04), transparent 50%)`
            : "none",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="mb-10 md:mb-14">
          <div className="font-mono text-sm tracking-[0.25em] uppercase text-gray-500 mb-4">Markets</div>
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-mono font-light leading-[1.1] tracking-[-0.02em] max-w-3xl">
            One artifact. <span className="text-gray-500">Six markets.</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg font-light mt-5 max-w-2xl leading-relaxed">
            A single compiled clinical decision artifact serves every stakeholder in the healthcare
            ecosystem — from the bedside to the boardroom to the legislature.
          </p>
        </motion.div>

        <div className="border-t border-white/[0.06]">
          {segments.map((seg, i) => (
            <motion.div
              key={seg.name}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="border-b border-white/[0.06] cursor-pointer transition-all duration-500"
              style={{
                background: expanded === i
                  ? `linear-gradient(135deg, hsla(${seg.accentHsl} / 0.04), transparent 60%)`
                  : hoveredIdx === i
                    ? `linear-gradient(135deg, hsla(${seg.accentHsl} / 0.02), transparent 60%)`
                    : "transparent",
                boxShadow: hoveredIdx === i ? `inset 0 0 80px hsla(${seg.accentHsl} / 0.03)` : "none",
              }}
              onClick={() => setExpanded(expanded === i ? null : i)}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="py-5 md:py-6 px-3 md:px-6 grid grid-cols-12 gap-4 md:gap-6 items-center">
                <div className="col-span-1">
                  <motion.div animate={{ rotate: expanded === i ? 90 : 0 }} transition={{ duration: 0.3 }} className="font-mono text-lg" style={{ color: `hsl(${seg.accentHsl})` }}>→</motion.div>
                </div>
                <div className="col-span-5 md:col-span-4">
                  <h3 className="font-mono text-base md:text-lg font-light transition-colors duration-300" style={{ color: expanded === i || hoveredIdx === i ? `hsl(${seg.accentHsl})` : "white" }}>{seg.name}</h3>
                </div>
                <div className="col-span-5 md:col-span-6">
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed">{seg.tagline}</p>
                </div>
                <div className="col-span-1 text-right">
                  <motion.span animate={{ rotate: expanded === i ? 45 : 0 }} transition={{ duration: 0.3 }} className="inline-block text-gray-500 text-lg font-light">+</motion.span>
                </div>
              </div>

              <motion.div
                initial={false}
                animate={{ height: expanded === i ? "auto" : 0, opacity: expanded === i ? 1 : 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-3 md:px-6 pb-6 md:pb-8">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pl-0 md:pl-[calc(8.333%+1.5rem)]">
                    <div className="md:col-span-6">
                      <p className="text-gray-300 text-sm md:text-base leading-[1.8] mb-4">{seg.description}</p>
                      <div className="pl-5 py-2" style={{ borderLeft: `2px solid hsla(${seg.accentHsl} / 0.3)` }}>
                        <div className="font-mono text-xs tracking-[0.2em] uppercase text-gray-500 mb-1">Use Case</div>
                        <p className="text-gray-400 text-sm md:text-base leading-[1.8] italic">{seg.useCase}</p>
                      </div>
                    </div>
                    <div className="md:col-span-6">
                      <div className="grid grid-cols-2 gap-px bg-white/[0.06]">
                        {seg.metrics.map((m, mi) => (
                          <div key={mi} className="bg-background p-5 md:p-6">
                            <div className="font-mono text-2xl md:text-3xl font-light" style={{ color: `hsl(${seg.accentHsl})` }}>{m.value}</div>
                            <div className="text-gray-500 text-xs md:text-sm mt-1">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SegmentsSection;
