import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, type FC } from "react";
import * as THREE from "three";

const ACCENT = "#2563EB";

const segments = [
  {
    name: "Frontier Labs",
    short: "Training Data",
    value: "Zero-hallucination clinical schemas for LLM fine-tuning",
    stat: "0.0%",
    statLabel: "Hallucination rate",
    desc: "Structured, formally verified decision trees that serve as ground-truth training data. Every branch is deterministic, every output traceable to a source guideline paragraph.",
  },
  {
    name: "Clinical AI Products",
    short: "Drop-in Logic",
    value: "Pre-compiled guideline engine as an embeddable module",
    stat: "< 50ms",
    statLabel: "Integration time",
    desc: "Ship clinical decision support inside your product without building it. FHIR-native artifact drops into any EHR workflow. No inference, no hallucination, no liability.",
  },
  {
    name: "Clinical Networks",
    short: "Network Adherence",
    value: "Unified screening protocol across every site",
    stat: "94%",
    statLabel: "Adherence rate",
    desc: "One compiled artifact enforces consistent preventive care across hundreds of clinics. Network-wide visibility into screening gaps, with automated escalation.",
  },
  {
    name: "Clinics",
    short: "Point of Care",
    value: "Real-time clinical decision support at the bedside",
    stat: "90%",
    statLabel: "Intake time reduction",
    desc: "23 guideline pathways evaluated in under 0.3 seconds. Surfaces the right screening at the right visit — no physician memorization required.",
  },
  {
    name: "Patients",
    short: "Consumer AI",
    value: "Guideline-backed AI health companion for consumers",
    stat: "100%",
    statLabel: "Guideline-backed",
    desc: "Consumer-facing preventive health AI that never hallucinates. Every recommendation traces to a verified clinical guideline, reviewed by a physician network.",
  },
  {
    name: "Insurers",
    short: "Preventive ROI",
    value: "Reduce downstream claims through upstream detection",
    stat: "68x",
    statLabel: "Cost reduction",
    desc: "Early detection at $4,200 vs. late-stage treatment at $288K+. Preventive infrastructure that bends the claims curve before patients become expensive.",
  },
];

/* ── 3D Hologram for each segment ── */
const SegmentHologram: FC<{ index: number; isActive: boolean }> = ({ index, isActive }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{ renderer: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.PerspectiveCamera; group: THREE.Group; animId: number } | null>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const w = el.clientWidth;
    const h = el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const group = new THREE.Group();
    scene.add(group);

    const wireMat = new THREE.LineBasicMaterial({ color: 0x2563EB, transparent: true, opacity: 0.4 });
    const wireMatDim = new THREE.LineBasicMaterial({ color: 0x2563EB, transparent: true, opacity: 0.12 });
    const facetMat = new THREE.MeshBasicMaterial({ color: 0x2563EB, transparent: true, opacity: 0.04, side: THREE.DoubleSide });
    const pointMat = new THREE.PointsMaterial({ color: 0x2563EB, size: 0.03, transparent: true, opacity: 0.5 });

    // Each segment gets a unique geometry
    let geo: THREE.BufferGeometry;
    switch (index) {
      case 0: // Frontier Labs — Icosahedron (data/knowledge)
        geo = new THREE.IcosahedronGeometry(1.1, 1);
        break;
      case 1: // Clinical AI — Octahedron (precision/module)
        geo = new THREE.OctahedronGeometry(1.1, 0);
        break;
      case 2: // Networks — Torus (connectivity)
        geo = new THREE.TorusGeometry(0.8, 0.3, 8, 12);
        break;
      case 3: // Clinics — Dodecahedron (complexity/care)
        geo = new THREE.DodecahedronGeometry(1, 0);
        break;
      case 4: // Patients — Sphere (wholeness/consumer)
        geo = new THREE.SphereGeometry(1, 8, 6);
        break;
      case 5: // Insurers — Tetrahedron (stability/ROI)
        geo = new THREE.TetrahedronGeometry(1.2, 1);
        break;
      default:
        geo = new THREE.IcosahedronGeometry(1, 1);
    }

    // Wireframe edges
    const edges = new THREE.EdgesGeometry(geo);
    const wireframe = new THREE.LineSegments(edges, wireMat);
    group.add(wireframe);

    // Faceted mesh fill
    const mesh = new THREE.Mesh(geo, facetMat);
    group.add(mesh);

    // Vertex points
    const points = new THREE.Points(geo, pointMat);
    group.add(points);

    // Secondary inner wireframe (smaller, dimmer)
    const innerGeo = geo.clone();
    innerGeo.scale(0.6, 0.6, 0.6);
    const innerEdges = new THREE.EdgesGeometry(innerGeo);
    const innerWire = new THREE.LineSegments(innerEdges, wireMatDim);
    group.add(innerWire);

    // Floating particles around the shape
    const particleCount = 40;
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 1.3 + Math.random() * 0.6;
      pPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x2563EB, size: 0.02, transparent: true, opacity: 0.3 });
    group.add(new THREE.Points(pGeo, pMat));

    let t = 0;
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.004;
      group.rotation.y = t * 0.5;
      group.rotation.x = Math.sin(t * 0.3) * 0.15;
      // Breathe
      const s = 1 + Math.sin(t * 1.5) * 0.03;
      group.scale.set(s, s, s);
      // Pulse opacity
      wireMat.opacity = 0.3 + Math.sin(t * 2) * 0.15;
      pointMat.opacity = 0.3 + Math.sin(t * 2.5) * 0.2;
      renderer.render(scene, camera);
    };
    animate();

    sceneRef.current = { renderer, scene, camera, group, animId };

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, [index]);

  // Update intensity based on active state
  useEffect(() => {
    if (!sceneRef.current) return;
    const { group } = sceneRef.current;
    group.traverse((child) => {
      if (child instanceof THREE.LineSegments) {
        const mat = child.material as THREE.LineBasicMaterial;
        mat.opacity = isActive ? mat.opacity : mat.opacity * 0.6;
      }
    });
  }, [isActive]);

  return <div ref={mountRef} className="w-full h-full" />;
};

/* ── Main Section ── */
const SegmentsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState<number>(0);

  return (
    <section ref={ref} className="relative py-24 md:py-32">
      <div className="relative max-w-[1440px] mx-auto px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-[11px] font-medium uppercase text-white/25 mb-3" style={{ letterSpacing: "0.12em" }}>
            Deployment Architecture
          </p>
          <h2 className="text-white font-semibold text-3xl md:text-4xl" style={{ letterSpacing: "-0.03em" }}>
            Market Architecture
          </h2>
          <p className="text-white/40 mt-3 text-base max-w-2xl">
            One compiled artifact. Six deployment surfaces.
          </p>
        </motion.div>

        {/* Main content: selector + detail */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-0">

          {/* Left — Segment list */}
          <div className="border-r border-white/[0.06]">
            {segments.map((seg, i) => {
              const isActive = selected === i;
              return (
                <motion.button
                  key={seg.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                  onClick={() => setSelected(i)}
                  className="w-full text-left px-6 py-5 border-b border-white/[0.04] transition-all duration-300 cursor-pointer"
                  style={{
                    background: isActive ? "rgba(200,214,229,0.04)" : "transparent",
                    borderLeft: isActive ? `2px solid ${ACCENT}` : "2px solid transparent",
                  }}
                >
                  <p className="text-[10px] uppercase tracking-[0.12em] mb-1"
                    style={{ color: isActive ? ACCENT : "rgba(255,255,255,0.3)" }}
                  >
                    {seg.short}
                  </p>
                  <p className="text-sm font-medium"
                    style={{ color: isActive ? "white" : "rgba(255,255,255,0.5)", letterSpacing: "-0.01em" }}
                  >
                    {seg.name}
                  </p>
                </motion.button>
              );
            })}
          </div>

          {/* Right — 3D hologram + detail */}
          <div className="relative min-h-[480px]">
            {segments.map((seg, i) => {
              const isActive = selected === i;
              return (
                <motion.div
                  key={seg.name}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    scale: isActive ? 1 : 0.95,
                    pointerEvents: isActive ? "auto" as const : "none" as const,
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 gap-0"
                >
                  {/* 3D Hologram */}
                  <div className="relative flex items-center justify-center p-8" style={{ minHeight: 320 }}>
                    {/* Radial glow behind shape */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                      background: "radial-gradient(ellipse at center, rgba(37,99,235,0.06) 0%, transparent 60%)",
                    }} />
                    {/* Scan lines overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
                      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(37,99,235,0.15) 3px, rgba(37,99,235,0.15) 4px)",
                    }} />
                    {isActive && <SegmentHologram index={i} isActive={isActive} />}
                  </div>

                  {/* Detail panel */}
                  <div className="flex flex-col justify-center p-8 md:p-12">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={isActive ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.15 }}
                    >
                      <p className="text-[10px] uppercase tracking-[0.15em] mb-2" style={{ color: ACCENT }}>
                        {seg.short}
                      </p>
                      <h3 className="text-white text-2xl font-semibold mb-3" style={{ letterSpacing: "-0.02em" }}>
                        {seg.name}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed mb-6">
                        {seg.value}
                      </p>
                      <p className="text-white/35 text-[13px] leading-relaxed mb-8">
                        {seg.desc}
                      </p>

                      {/* Key metric */}
                      <div className="border p-5 inline-block" style={{ borderColor: "#1E293B", background: "rgba(37,99,235,0.03)" }}>
                        <p className="text-3xl font-light" style={{ letterSpacing: "-0.02em", color: "#06B6D4" }}>
                          {seg.stat}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.1em] text-white/30 mt-1">
                          {seg.statLabel}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SegmentsSection;
