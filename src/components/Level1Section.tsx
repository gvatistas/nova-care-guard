import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import hospitalLevel1 from "@/assets/pixel-hospital-level1.png";
import hospitalLevel2 from "@/assets/pixel-hospital-level2.png";

const Level1Section = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Before / After — cinematic presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/[0.06]">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="bg-background"
          >
            <div className="relative overflow-hidden">
              <img
                src={hospitalLevel1}
                alt="Hospital floor plan — before compilation"
                loading="lazy"
                width={1920}
                height={1024}
                className="w-full opacity-70 hover:opacity-90 transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
            <div className="p-10">
              <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-gray-600 mb-4">
                Before
              </div>
              <h3 className="font-mono text-white text-2xl md:text-3xl font-light tracking-[-0.02em] mb-4">
                The Waiting Game
              </h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed max-w-md">
                Patient navigates seven touchpoints. Doctor relies on memory. 
                Guideline PDF last opened 14 months ago. Screening missed.
              </p>
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="bg-background"
          >
            <div className="relative overflow-hidden">
              <img
                src={hospitalLevel2}
                alt="Hospital floor plan — after compilation"
                loading="lazy"
                width={1920}
                height={1024}
                className="w-full opacity-70 hover:opacity-90 transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
            <div className="p-10">
              <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-teal/80 mb-4">
                After
              </div>
              <h3 className="font-mono text-white text-2xl md:text-3xl font-light tracking-[-0.02em] mb-4">
                Compiler Activated
              </h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed max-w-md">
                AI calls verified artifact. Three eligible screenings returned in 14 seconds. 
                Zero inference. Zero hallucination. Deterministic.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Level1Section;
