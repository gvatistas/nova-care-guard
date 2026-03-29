import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import journeyWithout from "@/assets/journey-without.png";
import journeyWith from "@/assets/journey-with.png";

const withoutSteps = [
  { step: "01", title: "Patient visits clinic", desc: "Sarah, 52, visits her primary care physician for a routine checkup. She's a 30-pack-year smoker.", icon: "→" },
  { step: "02", title: "Doctor relies on memory", desc: "The physician is busy. He remembers some screening guidelines but can't recall the exact USPSTF criteria for lung cancer screening eligibility.", icon: "?" },
  { step: "03", title: "Screening not ordered", desc: "No low-dose CT scan is ordered. The visit ends with routine bloodwork. The screening that could have saved her life was never even considered.", icon: "✕" },
  { step: "04", title: "18 months later", desc: "Sarah returns with persistent cough and weight loss. Imaging reveals stage IIIB non-small cell lung cancer. 5-year survival rate: 8%.", icon: "▼" },
  { step: "05", title: "Catastrophic cost", desc: "Treatment costs exceed $280,000. Sarah loses her ability to work. Her family faces financial ruin alongside the emotional devastation.", icon: "▼" },
];

const withSteps = [
  { step: "01", title: "Patient visits clinic", desc: "Same patient. Same clinic. Same physician. But this clinic runs on Medient's compiled clinical decision artifacts.", icon: "→" },
  { step: "02", title: "Medient flags screening", desc: "Before the physician even opens the chart, Medient's USPSTF lung cancer screening artifact has identified Sarah as eligible. Zero inference. Pure logic.", icon: "◆" },
  { step: "03", title: "LDCT scan ordered", desc: "The physician sees the verified recommendation with full guideline traceability. Orders the low-dose CT in under 30 seconds. No ambiguity.", icon: "✓" },
  { step: "04", title: "Early detection", desc: "The scan reveals a 9mm pulmonary nodule. Stage IA lung cancer. 5-year survival rate: 92%. Caught 18 months before symptoms would have appeared.", icon: "▲" },
  { step: "05", title: "Physician earns more", desc: "The clinic qualifies for CMS quality bonuses. The physician's adherence score rises. Better outcomes, better reimbursement, better medicine.", icon: "$" },
];

const Level1Section = () => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [activeView, setActiveView] = useState<"without" | "with">("without");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  const steps = activeView === "without" ? withoutSteps : withSteps;
  const isWithout = activeView === "without";

  return (
    <section ref={ref} className="relative py-24 md:py-40">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="mb-16 md:mb-20"
        >
          <div className="font-mono text-sm tracking-[0.25em] uppercase text-gray-500 mb-6">
            Two Paths — One Patient
          </div>
          <h2 className="text-white text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-mono font-light leading-[1.1] tracking-[-0.02em] max-w-4xl">
            Same patient. Same clinic.
            <br />
            <span className="text-gray-500">Different outcome.</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg font-light mt-6 md:mt-8 max-w-2xl leading-relaxed">
            Follow Sarah — a 52-year-old smoker visiting her primary care physician.
            In one world, her doctor relies on memory. In the other, the clinic runs on
            compiled clinical decision artifacts.
          </p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-1 mb-12 bg-white/[0.03] border border-white/[0.06] p-1.5 w-fit"
        >
          <button
            onClick={() => setActiveView("without")}
            className={`font-mono text-sm tracking-[0.1em] uppercase px-6 md:px-8 py-3 transition-all duration-300 ${
              activeView === "without"
                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Without Medient
          </button>
          <button
            onClick={() => setActiveView("with")}
            className={`font-mono text-sm tracking-[0.1em] uppercase px-6 md:px-8 py-3 transition-all duration-300 ${
              activeView === "with"
                ? "bg-accent/10 text-accent border border-accent/20"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            With Medient
          </button>
        </motion.div>

        {/* Main content */}
        <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/[0.06]">
          {/* Pixel art scene */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="bg-background relative overflow-hidden"
          >
            <motion.div style={{ y: imageY }} className="relative aspect-[4/3]">
              <motion.img
                key={activeView}
                src={isWithout ? journeyWithout : journeyWith}
                alt={isWithout ? "Chaotic clinic without Medient" : "Efficient clinic with Medient"}
                loading="lazy"
                width={1024}
                height={768}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: isWithout ? 0.75 : 0.85, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/30 pointer-events-none" />

            {/* Status badge */}
            <div className="absolute top-6 left-6">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`font-mono text-xs tracking-[0.15em] uppercase px-4 py-2 backdrop-blur-sm ${
                  isWithout
                    ? "bg-red-500/20 text-red-400 border border-red-500/20"
                    : "bg-accent/20 text-accent border border-accent/20"
                }`}
              >
                {isWithout ? "● Uncompiled" : "● Compiled"}
              </motion.div>
            </div>

            {/* Outcome badge */}
            <div className="absolute bottom-8 left-6 right-6">
              <motion.div
                key={activeView + "-outcome"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {isWithout ? (
                  <div className="bg-black/60 backdrop-blur-sm border border-red-500/20 p-5">
                    <div className="font-mono text-red-400 text-3xl md:text-4xl font-light">8%</div>
                    <div className="text-gray-400 text-sm mt-1">5-year survival — stage IIIB diagnosis</div>
                  </div>
                ) : (
                  <div className="bg-black/60 backdrop-blur-sm border border-accent/20 p-5">
                    <div className="font-mono text-accent text-3xl md:text-4xl font-light">92%</div>
                    <div className="text-gray-400 text-sm mt-1">5-year survival — stage IA early detection</div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Journey steps */}
          <div className="bg-background">
            {steps.map((step, i) => (
              <motion.div
                key={activeView + i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                className="border-b border-white/[0.06] p-5 md:p-7 hover:bg-white/[0.015] transition-colors duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                    <span className={`font-mono text-lg ${
                      isWithout ? "text-red-400/70" : "text-accent/70"
                    }`}>
                      {step.icon}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs text-gray-600">{step.step}</span>
                      <h4 className="font-mono text-white text-base font-light">{step.title}</h4>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom comparison bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-px grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06]"
        >
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
                { val: "+$8K", label: "Physician quality bonus" },
              ]
          ).map((stat, i) => (
            <motion.div
              key={activeView + stat.label}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="bg-background p-5 md:p-7"
            >
              <div className={`font-mono text-xl md:text-2xl font-light ${isWithout ? "text-red-400/80" : "text-accent"}`}>
                {stat.val}
              </div>
              <div className="text-gray-500 text-xs md:text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Level1Section;
