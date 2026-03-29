import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const withoutSteps = [
  { step: "01", title: "Patient visits clinic", desc: "Sarah, 52, visits her primary care physician for a routine checkup. She's a 30-pack-year smoker." },
  { step: "02", title: "Doctor relies on memory", desc: "The physician is busy. He remembers some screening guidelines but can't recall the exact USPSTF criteria for lung cancer screening." },
  { step: "03", title: "Screening not ordered", desc: "No low-dose CT scan is ordered. The visit ends with routine bloodwork. The screening that could have saved her life was never considered." },
  { step: "04", title: "18 months later", desc: "Sarah returns with persistent cough and weight loss. Imaging reveals stage IIIB non-small cell lung cancer. 5-year survival rate: 8%." },
  { step: "05", title: "Catastrophic cost", desc: "Treatment costs exceed $280,000. Sarah loses her ability to work. Her family faces financial ruin." },
];

const withSteps = [
  { step: "01", title: "Patient visits clinic", desc: "Same patient. Same clinic. Same physician. But this clinic runs on Medient's compiled clinical decision artifacts." },
  { step: "02", title: "Medient flags screening", desc: "Before the physician opens the chart, Medient's USPSTF artifact identifies Sarah as eligible. Zero inference. Pure logic." },
  { step: "03", title: "LDCT scan ordered", desc: "The physician sees the verified recommendation with full guideline traceability. Orders the low-dose CT in under 30 seconds." },
  { step: "04", title: "Early detection", desc: "The scan reveals a 9mm pulmonary nodule. Stage IA lung cancer. 5-year survival rate: 92%. Caught 18 months before symptoms." },
  { step: "05", title: "Better outcomes for all", desc: "The clinic qualifies for CMS quality bonuses. The physician's adherence score rises. Better outcomes, better reimbursement." },
];

const Level1Section = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [activeView, setActiveView] = useState<"without" | "with">("without");
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const steps = activeView === "without" ? withoutSteps : withSteps;
  const isWithout = activeView === "without";

  const handleSectionMouse = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-40"
      onMouseMove={handleSectionMouse}
    >
      {/* Mouse-following ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-700"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, ${
            isWithout ? "rgba(239,68,68,0.04)" : "rgba(74,237,196,0.04)"
          }, transparent 60%)`,
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
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
                : "text-gray-500 hover:text-gray-300 border border-transparent"
            }`}
          >
            Without Medient
          </button>
          <button
            onClick={() => setActiveView("with")}
            className={`font-mono text-sm tracking-[0.1em] uppercase px-6 md:px-8 py-3 transition-all duration-300 ${
              activeView === "with"
                ? "bg-accent/10 text-accent border border-accent/20"
                : "text-gray-500 hover:text-gray-300 border border-transparent"
            }`}
          >
            With Medient
          </button>
        </motion.div>

        {/* Video + Journey */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-12 relative overflow-hidden border border-white/[0.06]"
        >
          <video
            src="/medient-patient-journey.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full"
            style={{ aspectRatio: "16/9" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Outcome card */}
          <motion.div
            key={activeView}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="lg:col-span-4 flex flex-col items-center justify-start pt-4"
          >
            <motion.div
              key={activeView + "-card"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`w-full max-w-[280px] border p-6 text-center ${
                isWithout
                  ? "border-red-500/20 bg-red-500/[0.03]"
                  : "border-accent/20 bg-accent/[0.03]"
              }`}
            >
              <div className={`font-mono text-4xl font-light ${isWithout ? "text-red-400" : "text-accent"}`}>
                {isWithout ? "8%" : "92%"}
              </div>
              <div className="text-gray-500 text-sm mt-2">
                {isWithout ? "5-year survival — late-stage" : "5-year survival — early detection"}
              </div>
            </motion.div>
          </motion.div>

          {/* Journey steps */}
          <div className="lg:col-span-8">
            <div className="border-t border-white/[0.06]">
              {steps.map((step, i) => (
                <motion.div
                  key={activeView + i}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  className="border-b border-white/[0.06] py-6 md:py-7 px-2 md:px-4 hover:bg-white/[0.015] transition-colors duration-300 group"
                >
                  <div className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-1">
                      <span className={`font-mono text-sm transition-colors duration-300 ${
                        isWithout ? "text-red-400/50 group-hover:text-red-400" : "text-accent/50 group-hover:text-accent"
                      }`}>
                        {step.step}
                      </span>
                    </div>
                    <div className="col-span-3">
                      <h4 className="font-mono text-white text-sm md:text-base font-light group-hover:text-accent transition-colors duration-300">
                        {step.title}
                      </h4>
                    </div>
                    <div className="col-span-8">
                      <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06]"
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
