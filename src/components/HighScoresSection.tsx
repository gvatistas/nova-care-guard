import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import highScoresImg from "@/assets/pixel-high-scores.png";

const scores = [
  { rank: "1", metric: "Clinical guidelines compiled", value: "143+", source: "Internal pipeline data" },
  { rank: "2", metric: "Formal verification proofs", value: "1,200+", source: "SMT solver verification logs" },
  { rank: "3", metric: "Current compliance to beat", value: "54%", source: "McGlynn et al., NEJM 2003" },
  { rank: "4", metric: "Preventable deaths addressable", value: "1,000,000/yr", source: "AHRQ, CDC estimates" },
  { rank: "5", metric: "$0-copay eligible Americans", value: "150–180M", source: "ACA §2713, USPSTF coverage" },
  { rank: "6", metric: "Annual US healthcare spend", value: "$5T", source: "CMS National Health Expenditure Data" },
];

const HighScoresSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-20 overflow-hidden">
      {/* CRT overlay */}
      <div className="absolute inset-0 crt-overlay z-[1]" />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal/[0.03] blur-[120px]" />

      <div className="relative z-20 max-w-[900px] mx-auto px-6">
        {/* Scoreboard header image as background texture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="font-pixel text-gold text-2xl md:text-3xl tracking-wider">
            HIGH SCORES
          </span>
        </motion.div>

        {/* Score rows */}
        <div className="space-y-3">
          {scores.map((score, i) => (
            <motion.div
              key={score.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.2 }}
              className="group flex items-center gap-4 p-4 border border-grid-line/50 hover:border-teal/30 hover:bg-teal/[0.03] transition-all duration-200 rounded-sm"
            >
              <span className="font-pixel text-gold text-sm w-8">{score.rank}</span>
              <span className="font-mono text-pearl text-sm flex-1 font-light">{score.metric}</span>
              <span className="font-mono text-teal text-lg md:text-xl font-light">{score.value}</span>
              {/* Hover tooltip */}
              <div className="absolute right-0 -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="font-mono text-warm-gray text-[10px]">Source: {score.source}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 2 }}
          className="text-center font-mono text-pearl text-lg md:text-xl font-light mt-12"
        >
          These are the scores that matter.
        </motion.p>
      </div>
    </section>
  );
};

export default HighScoresSection;
