import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const AnimatedCounter = ({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) => {
  const [display, setDisplay] = useState("0");
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2.2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v).toString()),
      onComplete: () => {
        const t = setTimeout(() => {
          setDisplay("0");
          setCycle(c => c + 1);
        }, 5000);
        return () => clearTimeout(t);
      },
    });
    return () => controls.stop();
  }, [inView, value, cycle]);
  return (
    <span className="font-mono">
      {display}
      <span className="ml-0.5 opacity-60" style={{ fontSize: "1.5rem" }}>{suffix}</span>
    </span>
  );
};

const PATIENT_DATA = [
  { label: "AGE", value: "62", x: "8%", y: "18%" },
  { label: "BMI", value: "31.4", x: "78%", y: "14%" },
  { label: "A1C", value: "6.1%", x: "82%", y: "42%" },
  { label: "SMOKING", value: "30 pack-yr", x: "6%", y: "55%" },
  { label: "FAMILY HX", value: "CRC+", x: "76%", y: "70%" },
  { label: "LAST SCREEN", value: "2019", x: "10%", y: "82%" },
];

const SCREENINGS = [
  { name: "Colonoscopy", detail: "USPSTF Grade A · Age 45–75" },
  { name: "Low-dose CT Lung", detail: "USPSTF Grade B · ≥20 pack-yr" },
  { name: "Diabetes Prevention", detail: "USPSTF Grade B · BMI ≥25, A1C 5.7–6.4" },
];

const MACRO_STATS = [
  { value: 136, suffix: "M", desc: "Americans missing preventive screenings" },
  { value: 260, suffix: "B", desc: "in preventable healthcare costs", prefix: "$" },
  { value: 45, suffix: "%", desc: "guideline adherence gap nationwide" },
];

const PatientNarrativeSection = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const forkRef = useRef(null);
  const forkInView = useInView(forkRef, { once: true, margin: "-60px" });
  const macroRef = useRef(null);
  const macroInView = useInView(macroRef, { once: true, margin: "-60px" });

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(255,255,255,0.02),transparent_70%)] pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-8">

        {/* TOP: Patient Scan Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto max-w-lg"
        >
          <div className="relative border border-white/[0.08] bg-background/60 backdrop-blur-sm p-8 md:p-10">
            <motion.div
              initial={{ top: 0 }}
              animate={inView ? { top: ["0%", "100%", "0%"] } : {}}
              transition={{ duration: 3, ease: "linear", repeat: Infinity, repeatDelay: 1 }}
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60"
              style={{ zIndex: 10 }}
            />

            <div className="flex justify-center mb-2">
              <svg width="64" height="100" viewBox="0 0 64 100" fill="none" className="opacity-30">
                <ellipse cx="32" cy="16" rx="12" ry="14" stroke="white" strokeWidth="1" />
                <path d="M12 44 C12 30 52 30 52 44 L56 90 H8 L12 44Z" stroke="white" strokeWidth="1" fill="none" />
              </svg>
            </div>

            <div className="text-center mb-1">
              <span className="font-mono tracking-[0.2em] uppercase" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)" }}>Patient Profile · Scanning</span>
            </div>

            {PATIENT_DATA.map((pt, i) => (
              <motion.div
                key={pt.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.8 + i * 0.25, duration: 0.4 }}
                className="absolute font-mono"
                style={{ left: pt.x, top: pt.y, fontSize: "0.875rem" }}
              >
                <span className="tracking-[0.12em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>{pt.label}</span>
                <br />
                <span style={{ color: "rgba(255,255,255,0.7)" }}>{pt.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Connecting line down */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ delay: 2, duration: 0.6, ease: "easeOut" }}
            className="w-px h-16 bg-gradient-to-b from-white/20 to-white/[0.06] origin-top"
          />
        </div>

        {/* Fork indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 2.5, duration: 0.5 }}
          className="flex justify-center mb-1"
        >
          <svg width="200" height="30" viewBox="0 0 200 30" className="text-white/10">
            <line x1="100" y1="0" x2="40" y2="30" stroke="currentColor" strokeWidth="1" />
            <line x1="100" y1="0" x2="160" y2="30" stroke="currentColor" strokeWidth="1" />
          </svg>
        </motion.div>

        {/* Two-track comparison */}
        <div ref={forkRef} className="grid grid-cols-1 md:grid-cols-2 gap-px mt-2">
          {/* WITHOUT MEDIENT */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={forkInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="border border-white/[0.06] bg-background/50 p-6 md:p-8"
          >
            <h3 className="font-mono tracking-[0.18em] uppercase mb-6 flex items-center gap-2" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-70" />
              Without Medient
            </h3>
            <p className="font-mono tracking-[0.1em] uppercase mb-4" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.35)" }}>
              Screenings identified: 1 of 3
            </p>
            <ul className="space-y-4">
              {SCREENINGS.map((s, i) => {
                const found = i === 0;
                return (
                  <motion.li
                    key={s.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={forkInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.2 }}
                    className="flex items-start gap-3"
                  >
                    <span className={`mt-0.5 w-4 h-4 flex-shrink-0 border ${found ? "border-gray-500 bg-gray-500/20" : "border-white/[0.08] bg-transparent"} flex items-center justify-center`}>
                      {found && <span className="text-gray-400" style={{ fontSize: "0.875rem" }}>✓</span>}
                      {!found && <span className="text-red-500/40" style={{ fontSize: "0.75rem" }}>✕</span>}
                    </span>
                    <div className={found ? "opacity-50" : "opacity-25"}>
                      <div className={`font-mono ${found ? "text-gray-400" : "text-gray-600 line-through"}`} style={{ fontSize: "1rem" }}>{s.name}</div>
                      <div className="text-gray-600 mt-0.5" style={{ fontSize: "0.875rem" }}>{s.detail}</div>
                      {!found && (
                        <span className="inline-block mt-1 font-mono tracking-[0.15em] uppercase text-red-500/50" style={{ fontSize: "0.75rem" }}>missed</span>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          {/* WITH MEDIENT */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={forkInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="border border-white/[0.08] bg-background/50 p-6 md:p-8"
          >
            <h3 className="font-mono tracking-[0.18em] uppercase mb-6 flex items-center gap-2" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>
              <span className="w-1.5 h-1.5 rounded-full opacity-80" style={{ backgroundColor: "#10b981" }} />
              With Medient
            </h3>
            <p className="font-mono tracking-[0.1em] uppercase mb-4" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)" }}>
              Screenings identified: 3 of 3
            </p>
            <ul className="space-y-4">
              {SCREENINGS.map((s, i) => (
                <motion.li
                  key={s.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={forkInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.2 }}
                  className="flex items-start gap-3"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={forkInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.6 + i * 0.25, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mt-0.5 w-4 h-4 flex-shrink-0 border border-white/20 bg-white/5 flex items-center justify-center"
                  >
                    <span style={{ color: "#10b981", fontSize: "0.875rem" }}>✓</span>
                  </motion.span>
                  <div>
                    <div className="font-mono text-white/90" style={{ fontSize: "1rem" }}>{s.name}</div>
                    <div className="text-gray-500 mt-0.5" style={{ fontSize: "0.875rem" }}>{s.detail}</div>
                    <motion.span
                      initial={{ width: 0 }}
                      animate={forkInView ? { width: "100%" } : {}}
                      transition={{ delay: 0.8 + i * 0.25, duration: 0.6 }}
                      className="inline-block mt-1.5 h-px bg-gradient-to-r from-white/20 to-transparent"
                      style={{ maxWidth: 120 }}
                    />
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Connecting line to macro */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-px h-20 bg-gradient-to-b from-white/[0.06] to-white/20 origin-top"
          />
        </div>

        {/* BOTTOM: Zoom-out to macro stats */}
        <div ref={macroRef}>
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={macroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="flex justify-center gap-1 mb-8"
          >
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={macroInView ? { opacity: [0, 0.5, 0.15 + Math.random() * 0.15], scale: 1, y: 0 } : {}}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="w-3 h-4 md:w-4 md:h-5 border border-white/[0.08] bg-white/[0.02]"
              />
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={macroInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="text-center font-mono tracking-[0.2em] uppercase mb-8"
            style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.35)" }}
          >
            One patient → Population scale
          </motion.p>

          {/* Macro statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.04]">
            {MACRO_STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={macroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1 + i * 0.2, duration: 0.6 }}
                className="bg-background/80 p-6 md:p-8 text-center md:text-left"
              >
                <div className="text-white font-mono font-light tracking-[-0.03em]" style={{ fontSize: "3rem" }}>
                  {stat.prefix || ""}
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={macroInView} />
                </div>
                <div className="font-light mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.125rem" }}>{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PatientNarrativeSection;
