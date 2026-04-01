import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const mono = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";

const HeroSection = () => {
  return (
    <>
      <section className="min-h-screen flex items-center" style={{ background: "#E5E7EB" }}>
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT COLUMN */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex flex-col gap-6"
          >
            <p
              style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", color: "#6B7280" }}
              className="uppercase"
            >
              Built on Palantir Infrastructure
            </p>

            <h1
              style={{
                fontFamily: mono,
                fontSize: "clamp(1.75rem, 3.2vw, 2.75rem)",
                lineHeight: 1.15,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              The clinical decision compiler.
            </h1>

            <p
              style={{
                fontFamily: mono,
                fontSize: "clamp(0.85rem, 1.1vw, 1rem)",
                lineHeight: 1.7,
                color: "#374151",
              }}
            >
              Zero hallucination. Zero inference. Every recommendation traceable to source evidence.
            </p>

            <div className="flex flex-row gap-4 mt-2">
              <a
                href="#contact"
                style={{
                  fontFamily: mono,
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  backgroundColor: "#111827",
                  color: "#FFFFFF",
                }}
                className="uppercase font-semibold px-7 py-3 transition-colors duration-300 hover:bg-[#374151]"
              >
                Request Demo
              </a>
              <a
                href="#whitepaper"
                style={{
                  fontFamily: mono,
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  color: "#374151",
                  border: "1px solid #374151",
                  backgroundColor: "#FFFFFF",
                }}
                className="uppercase font-medium px-7 py-3 transition-colors duration-300 hover:bg-[#F3F4F6]"
              >
                Read White Paper
              </a>
            </div>
          </motion.div>

          {/* RIGHT COLUMN — Patient comparison */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex flex-col items-center"
          >
            {/* Patient card */}
            <div
              className="w-full max-w-md rounded px-5 py-4"
              style={{
                background: "#FFFFFF",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "#E5E7EB", color: "#374151", fontFamily: mono }}
                >
                  JD
                </div>
                <div>
                  <p style={{ fontFamily: mono, fontSize: 13, fontWeight: 600, color: "#111827" }}>
                    Jane Doe, 58
                  </p>
                  <p style={{ fontFamily: mono, fontSize: 11, color: "#6B7280" }}>
                    32 pack-year smoking history · BMI 27.4
                  </p>
                </div>
              </div>
            </div>

            {/* Dashed connector lines */}
            <div className="relative w-full max-w-md h-10">
              {/* Vertical center line */}
              <div
                className="absolute left-1/2 top-0 h-4"
                style={{ borderLeft: "1px dashed #D1D5DB", transform: "translateX(-0.5px)" }}
              />
              {/* Horizontal connector */}
              <div
                className="absolute top-4 left-[25%] right-[25%]"
                style={{ borderTop: "1px dashed #D1D5DB" }}
              />
              {/* Left vertical */}
              <div
                className="absolute left-[25%] top-4 h-6"
                style={{ borderLeft: "1px dashed #D1D5DB", transform: "translateX(-0.5px)" }}
              />
              {/* Right vertical */}
              <div
                className="absolute right-[25%] top-4 h-6"
                style={{ borderLeft: "1px dashed #D1D5DB", transform: "translateX(-0.5px)" }}
              />
            </div>

            {/* Outcome cards */}
            <div className="w-full max-w-md grid grid-cols-2 gap-3">
              {/* WITHOUT MEDIENT */}
              <div
                className="rounded px-4 py-4"
                style={{
                  background: "#FFFFFF",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  borderLeft: "3px solid #DC2626",
                }}
              >
                <p
                  className="uppercase"
                  style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.08em", color: "#DC2626" }}
                >
                  Without Medient
                </p>
                <p
                  className="mt-3"
                  style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: "#111827" }}
                >
                  LDCT Scan
                </p>
                <span
                  className="inline-block mt-1.5 rounded-sm px-2 py-0.5 text-white uppercase"
                  style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.05em", background: "#DC2626" }}
                >
                  Missed
                </span>
                <p className="mt-4" style={{ fontFamily: mono, fontSize: 24, fontWeight: 700, color: "#92400E" }}>
                  $288K+
                </p>
                <p
                  className="uppercase mt-1"
                  style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.06em", color: "#6B7280" }}
                >
                  Late-stage treatment
                </p>
              </div>

              {/* WITH MEDIENT */}
              <div
                className="rounded px-4 py-4"
                style={{
                  background: "#FFFFFF",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  borderLeft: "3px solid #059669",
                }}
              >
                <p
                  className="uppercase"
                  style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.08em", color: "#059669" }}
                >
                  With Medient
                </p>
                <p
                  className="mt-3"
                  style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: "#111827" }}
                >
                  LDCT Scan
                </p>
                <span
                  className="inline-block mt-1.5 rounded-sm px-2 py-0.5 text-white uppercase"
                  style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.05em", background: "#0D9488" }}
                >
                  Ordered
                </span>
                <p className="mt-4" style={{ fontFamily: mono, fontSize: 24, fontWeight: 700, color: "#059669" }}>
                  $4,200
                </p>
                <p
                  className="uppercase mt-1"
                  style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.06em", color: "#6B7280" }}
                >
                  Early detection
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Separator + Scroll to explore */}
      <div style={{ background: "#E5E7EB" }}>
        <div className="mx-6 md:mx-12" style={{ borderTop: "1px solid #374151" }} />
        <div className="flex flex-col items-center py-6 gap-2">
          <p
            className="uppercase"
            style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.16em", color: "#6B7280" }}
          >
            Scroll to explore
          </p>
          <ChevronDown size={16} style={{ color: "#9CA3AF" }} />
        </div>
      </div>
    </>
  );
};

export default HeroSection;
