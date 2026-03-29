import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const withoutSteps = [
  { step: "01", title: "Patient visits clinic", desc: "Sarah, 52, visits her PCP for a routine checkup. She's a 30-pack-year smoker." },
  { step: "02", title: "Doctor relies on memory", desc: "The physician can't recall the exact USPSTF lung screening criteria." },
  { step: "03", title: "Screening not ordered", desc: "No LDCT scan ordered. The visit ends with routine bloodwork." },
  { step: "04", title: "18 months later", desc: "Stage IIIB non-small cell lung cancer. 5-year survival: 8%." },
  { step: "05", title: "Catastrophic cost", desc: "Treatment exceeds $280,000. Financial ruin." },
];

const withSteps = [
  { step: "01", title: "Patient visits clinic", desc: "Same patient. Same clinic. But this clinic runs on Medient." },
  { step: "02", title: "Medient flags screening", desc: "USPSTF artifact identifies Sarah as eligible. Zero inference. Pure logic." },
  { step: "03", title: "LDCT scan ordered", desc: "Verified recommendation with full traceability. Ordered in <30 seconds." },
  { step: "04", title: "Early detection", desc: "9mm pulmonary nodule. Stage IA. 5-year survival: 92%." },
  { step: "05", title: "Better outcomes for all", desc: "CMS quality bonuses. Higher adherence score. Better reimbursement." },
];

const Level1Section = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [activeView, setActiveView] = useState<"without" | "with">("without");

  const steps = activeView === "without" ? withoutSteps : withSteps;
  const isWithout = activeView === "without";

  return (
    <section ref={ref} className="relative py-14 md:py-20 texture-diamonds">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(74,237,196,0.02),transparent_60%)] pointer-events-none" />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="mb-6">
          <div className="font-mono text-sm tracking-[0.25em] uppercase text-accent/70 mb-3">Two Paths — One Patient</div>
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-mono font-light leading-[1.15] tracking-[-0.02em] max-w-4xl">
            Same patient. Same clinic. <span className="text-gray-500">Different outcome.</span>
          </h2>
        </motion.div>

        {/* Toggle */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}
          className="flex items-center gap-1 mb-5 bg-white/[0.03] border border-white/[0.06] p-1.5 w-fit">
          <button onClick={() => setActiveView("without")}
            className={`font-mono text-sm tracking-[0.1em] uppercase px-6 md:px-8 py-3 transition-all duration-300 ${
              activeView === "without"
                ? "bg-[hsl(0,72%,60%)]/10 text-[hsl(0,72%,60%)] border border-[hsl(0,72%,60%)]/20"
                : "text-gray-500 hover:text-gray-300 border border-transparent"
            }`}>Without Medient</button>
          <button onClick={() => setActiveView("with")}
            className={`font-mono text-sm tracking-[0.1em] uppercase px-6 md:px-8 py-3 transition-all duration-300 ${
              activeView === "with"
                ? "bg-accent/10 text-accent border border-accent/20"
                : "text-gray-500 hover:text-gray-300 border border-transparent"
            }`}>With Medient</button>
        </motion.div>

        {/* Video */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-5 relative overflow-hidden border border-white/[0.06] panel-3d">
          <video src="/medient-patient-journey.mp4" autoPlay loop muted playsInline className="w-full" style={{ aspectRatio: "16/9" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8">
          {/* Outcome card */}
          <motion.div key={activeView} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }} className="lg:col-span-3 flex flex-col items-center justify-start">
            <div className={`w-full max-w-[260px] border p-6 text-center panel-3d ${
              isWithout ? "border-[hsl(0,72%,60%)]/20 bg-[hsl(0,72%,60%)]/[0.04]" : "border-accent/20 bg-accent/[0.04]"
            }`}>
              <div className={`font-mono text-5xl font-light ${isWithout ? "text-[hsl(0,72%,60%)]" : "text-accent"}`}>
                {isWithout ? "8%" : "92%"}
              </div>
              <div className="text-gray-400 text-base mt-2">{isWithout ? "5-yr survival — late-stage" : "5-yr survival — early detection"}</div>
            </div>
          </motion.div>

          {/* Journey steps */}
          <div className="lg:col-span-9">
            <div className="border-t border-white/[0.06]">
              {steps.map((step, i) => (
                <motion.div key={activeView + i} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  className="border-b border-white/[0.06] py-3.5 md:py-4 px-2 md:px-4 hover:bg-white/[0.015] transition-colors duration-300 group">
                  <div className="grid grid-cols-12 gap-3 items-start">
                    <div className="col-span-1">
                      <span className={`font-mono text-sm transition-colors duration-300 ${
                        isWithout ? "text-[hsl(0,72%,60%)]/50 group-hover:text-[hsl(0,72%,60%)]" : "text-accent/50 group-hover:text-accent"
                      }`}>{step.step}</span>
                    </div>
                    <div className="col-span-3">
                      <h4 className="font-mono text-white text-base font-light group-hover:text-accent transition-colors duration-300">{step.title}</h4>
                    </div>
                    <div className="col-span-8">
                      <p className="text-gray-300 text-base leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom metrics */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06]">
          {(isWithout
            ? [
                { val: "$280K+", label: "Treatment cost" },
                { val: "18 mo", label: "Delayed diagnosis" },
                { val: "8%", label: "Survival rate" },
                { val: "0", label: "Screenings ordered" },
              ]
            : [
                { val: "$4,200", label: "Screening cost" },
                { val: "0 days", label: "Time to screening" },
                { val: "92%", label: "Survival rate" },
                { val: "+$8K", label: "Quality bonus" },
              ]
          ).map((stat, i) => (
            <motion.div key={activeView + stat.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.06 }} className="bg-background/80 p-4 panel-3d">
              <div className={`font-mono text-2xl md:text-3xl font-light ${isWithout ? "text-[hsl(0,72%,60%)]/80" : "text-accent"}`}>{stat.val}</div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Level1Section;
