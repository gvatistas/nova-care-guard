import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import hospitalLevel1 from "@/assets/pixel-hospital-level1.png";
import gameOver from "@/assets/pixel-game-over.png";

const terminalLines = [
  { text: "> Patient arrives. Intake form: 4 pages, handwritten.", color: "glow-green" },
  { text: "> Waiting room: 47 minutes. Vitals taken.", color: "glow-green" },
  { text: "> Exam room: blood pressure, weight, basic history.", color: "glow-green" },
  { text: "> Doctor checks EHR. No decision support loaded.", color: "glow-green" },
  { text: "> Guideline PDF last opened: 14 months ago.", color: "coral" },
  { text: "> Doctor relies on memory. Memory is probabilistic.", color: "glow-green" },
  { text: "> SCREENING MISSED.", color: "coral" },
];

const Level1Section = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* CRT overlay */}
      <div className="absolute inset-0 crt-heavy z-10 pointer-events-none" />

      {/* Pixel border frame */}
      <div className="absolute inset-0 border-2 border-grid-line/40 z-10 pointer-events-none m-2" />

      {/* Level label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        className="relative z-20 text-center py-8"
      >
        <span className="font-pixel text-gold text-xs tracking-widest">
          LEVEL 1
        </span>
        <h2 className="font-pixel text-pearl text-lg md:text-xl mt-2">
          THE WAITING GAME
        </h2>
      </motion.div>

      {/* Hospital scene */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3 }}
        className="relative z-20 px-4 md:px-8"
      >
        <img
          src={hospitalLevel1}
          alt="Isometric pixel art hospital floor plan showing a patient navigating through reception, waiting room, and exam rooms"
          loading="lazy"
          width={1920}
          height={1024}
          className="pixel-render w-full max-w-[1200px] mx-auto rounded-sm"
        />
      </motion.div>

      {/* Terminal narration overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
        className="relative z-20 max-w-[700px] mx-auto px-6 mt-8 mb-4"
      >
        <div className="bg-deep-field/90 border border-grid-line p-5 rounded-sm">
          {terminalLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1 + i * 0.3 }}
              className={`font-mono text-xs md:text-sm font-normal leading-relaxed ${
                line.color === "coral" ? "text-coral" : "text-[#00FF88]"
              }`}
            >
              {line.text}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* GAME OVER */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 3.5 }}
        className="relative z-20"
      >
        <img
          src={gameOver}
          alt="GAME OVER screen with devastating healthcare statistics"
          loading="lazy"
          width={1024}
          height={1024}
          className="w-full max-w-[800px] mx-auto"
        />
      </motion.div>

      {/* Statistics that hit hard */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 4.5 }}
        className="relative z-20 text-center py-20 space-y-8 max-w-3xl mx-auto px-6"
      >
        {[
          "54% of guideline-recommended care is actually delivered.",
          "This number hasn't moved in 20 years.",
          "~1,000,000 preventable deaths per year in North America.",
        ].map((stat, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 5 + i * 0.5 }}
            className="font-mono text-pearl text-lg md:text-2xl font-light"
          >
            {stat}
          </motion.p>
        ))}
      </motion.div>
    </section>
  );
};

export default Level1Section;
