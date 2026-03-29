import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import hospitalLevel2 from "@/assets/pixel-hospital-level2.png";

const terminalLines = [
  { text: "> AI assistant receives patient context.", color: "teal" },
  { text: "> MCP tool call: compiled_artifact.check_eligibility()", color: "teal" },
  { text: "> Artifact returns: 3 eligible screenings, evidence-grade A.", color: "teal" },
  { text: "> Zero inference. Zero hallucination. Deterministic.", color: "teal" },
  { text: "> Doctor reviews. Orders screening. 14 seconds.", color: "teal" },
  { text: "> Guideline adherence: 100%.", color: "teal" },
  { text: "> SCREENING ORDERED ✓", color: "teal-bright" },
];

const Level2Section = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* CRT overlay */}
      <div className="absolute inset-0 crt-heavy z-10 pointer-events-none" />

      {/* Iridescent border frame */}
      <div
        className="absolute inset-0 z-10 pointer-events-none m-2"
        style={{
          border: "2px solid",
          animation: "iridescent-border 4s linear infinite",
        }}
      />

      {/* Level label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        className="relative z-20 text-center py-8"
      >
        <span className="font-pixel text-teal text-xs tracking-widest">
          LEVEL 2
        </span>
        <h2 className="font-pixel text-pearl text-lg md:text-xl mt-2">
          COMPILER ACTIVATED
        </h2>
      </motion.div>

      {/* Transformed hospital scene */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3 }}
        className="relative z-20 px-4 md:px-8"
      >
        <img
          src={hospitalLevel2}
          alt="Transformed pixel art hospital with iridescent glow, modernized equipment, and AI-assisted clinical decisions"
          loading="lazy"
          width={1920}
          height={1024}
          className="pixel-render w-full max-w-[1200px] mx-auto rounded-sm"
        />
      </motion.div>

      {/* Terminal narration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
        className="relative z-20 max-w-[700px] mx-auto px-6 mt-8"
      >
        <div className="bg-deep-field/90 border border-teal/20 p-5 rounded-sm">
          {terminalLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1 + i * 0.25 }}
              className={`font-mono text-xs md:text-sm font-normal leading-relaxed ${
                line.color === "teal-bright"
                  ? "text-teal font-medium"
                  : "text-teal/80"
              }`}
            >
              {line.text}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stage labels */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 3.5 }}
        className="relative z-20 text-center py-12 space-y-6 max-w-2xl mx-auto px-6"
      >
        <p className="font-mono text-warm-gray text-sm font-light">
          Any AI — ChatGPT, Claude, Gemini — calls the compiled artifact as a tool.
          <br />
          <span className="text-pearl">The model handles conversation. The artifact handles clinical correctness.</span>
        </p>

        {/* Divider for direct channel */}
        <div className="flex items-center gap-4 py-6">
          <div className="flex-1 h-px bg-grid-line" />
          <span className="font-pixel text-gold text-[10px] tracking-wider">
            OR — THE PATIENT DRIVES IT
          </span>
          <div className="flex-1 h-px bg-grid-line" />
        </div>

        <p className="font-mono text-warm-gray text-sm font-light">
          Patient opens an app on their phone. Fills a 2-minute intake. Gets back:
          <br />
          <span className="text-teal">"3 eligible preventive services at $0 copay."</span>
        </p>
      </motion.div>

      {/* LEVEL COMPLETE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 4.5 }}
        className="relative z-20 text-center pb-16"
      >
        <span className="font-pixel text-teal text-2xl md:text-3xl tracking-wider">
          LEVEL COMPLETE
        </span>
      </motion.div>
    </section>
  );
};

export default Level2Section;
