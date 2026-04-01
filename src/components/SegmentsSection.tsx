import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, type FC } from "react";
import * as THREE from "three";

const SEGMENT_COLORS = [
  { accent: "#7C3AED", bg: "rgba(124,58,237,0.04)", border: "rgba(124,58,237,0.15)" },  // Purple — Labs
  { accent: "#2563EB", bg: "rgba(37,99,235,0.04)", border: "rgba(37,99,235,0.15)" },     // Blue — AI Products
  { accent: "#059669", bg: "rgba(5,150,105,0.04)", border: "rgba(5,150,105,0.15)" },     // Green — Clinics
  { accent: "#0891B2", bg: "rgba(8,145,178,0.04)", border: "rgba(8,145,178,0.15)" },     // Cyan — Patients
  { accent: "#D97706", bg: "rgba(217,119,6,0.04)", border: "rgba(217,119,6,0.15)" },     // Amber — Pharmacies
  { accent: "#374151", bg: "rgba(55,65,81,0.04)", border: "rgba(55,65,81,0.15)" },       // Dark grey — Insurers
];

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
    name: "Clinical Networks & Clinics",
    short: "Point of Care",
    value: "Unified screening protocol from network-level down to the bedside",
    stat: "94%",
    statLabel: "Adherence rate",
    desc: "One compiled artifact enforces consistent preventive care across hundreds of clinics. 23 guideline pathways evaluated in under 0.3 seconds at every visit — network-wide visibility with automated escalation.",
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
    name: "Pharmacies",
    short: "Rx Intelligence",
    value: "Guideline-driven medication review and dispensing support",
    stat: "23",
    statLabel: "Guideline pathways",
    desc: "Automated medication interaction checks and preventive screening prompts at the point of dispensing. Pharmacists get real-time, guideline-backed alerts that catch gaps before patients leave the counter.",
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

/* ── Helper: merge BufferGeometries ── */
function mergeGeos(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  let totalVerts = 0, totalIdx = 0;
  geos.forEach(g => {
    totalVerts += g.attributes.position!.count;
    totalIdx += g.index ? g.index.count : g.attributes.position!.count;
  });
  const pos = new Float32Array(totalVerts * 3);
  const indices: number[] = [];
  let vOff = 0;
  geos.forEach(g => {
    const p = g.attributes.position!;
    for (let i = 0; i < p.count; i++) {
      pos[(vOff + i) * 3] = p.getX(i);
      pos[(vOff + i) * 3 + 1] = p.getY(i);
      pos[(vOff + i) * 3 + 2] = p.getZ(i);
    }
    if (g.index) { for (let i = 0; i < g.index.count; i++) indices.push(g.index.array[i]! + vOff); }
    else { for (let i = 0; i < p.count; i++) indices.push(vOff + i); }
    vOff += p.count;
  });
  const m = new THREE.BufferGeometry();
  m.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  m.setIndex(indices);
  m.computeVertexNormals();
  return m;
}

/* ── Build segment-specific geometry — single clean shapes ── */
function buildSegmentGeo(index: number): THREE.BufferGeometry {
  switch (index) {
    case 0: {
      return new THREE.IcosahedronGeometry(1, 1);
    }
    case 1: {
      return new THREE.OctahedronGeometry(1, 0);
    }
    case 2: {
      return new THREE.DodecahedronGeometry(1, 0);
    }
    case 3: {
      // Patients — Low-poly wireframe human body (vertex + edge mesh)
      // We return a dummy geo; the actual rendering is custom in SegmentHologram
      return null as unknown as THREE.BufferGeometry;
    }
    case 4: {
      return new THREE.TorusGeometry(0.7, 0.3, 16, 32);
    }
    case 5: {
      return new THREE.TetrahedronGeometry(1, 1);
    }
    default:
      return new THREE.IcosahedronGeometry(1, 1);
  }
}

/* ── 3D Hologram for each segment ── */
const SegmentHologram: FC<{ index: number; isActive: boolean }> = ({ index, isActive }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{ renderer: THREE.WebGLRenderer; animId: number } | null>(null);

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
    camera.position.set(0, 0, 5);

    const group = new THREE.Group();
    scene.add(group);

    const accent = SEGMENT_COLORS[index].accent;
    const accentColor = new THREE.Color(accent);
    const dimColor = new THREE.Color(0x6B7280);

    const geo = buildSegmentGeo(index);

    // Auto-scale
    geo.computeBoundingBox();
    const size = new THREE.Vector3();
    geo.boundingBox!.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const sf = 1.6 / maxDim;
    geo.scale(sf, sf, sf);
    geo.computeBoundingBox();
    const center = new THREE.Vector3();
    geo.boundingBox!.getCenter(center);
    geo.translate(-center.x, -center.y, -center.z);

    // Wireframe edges with accent color
    const edges = new THREE.EdgesGeometry(geo);
    const wireMat = new THREE.LineBasicMaterial({ color: accentColor, transparent: true, opacity: 0.6 });
    group.add(new THREE.LineSegments(edges, wireMat));

    // Semi-transparent face fill
    const facetMat = new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: 0.04, side: THREE.DoubleSide });
    group.add(new THREE.Mesh(geo, facetMat));

    // Vertex dots
    const pointMat = new THREE.PointsMaterial({ color: accentColor, size: 0.05, transparent: true, opacity: 0.7 });
    group.add(new THREE.Points(geo, pointMat));

    // Orbit ring
    const ringGeo = new THREE.RingGeometry(1.15, 1.17, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: dimColor, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    // Scanning line (horizontal plane)
    const scanGeo = new THREE.PlaneGeometry(3, 0.01);
    const scanMat = new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: 0.0, side: THREE.DoubleSide });
    const scanLine = new THREE.Mesh(scanGeo, scanMat);
    group.add(scanLine);

    // Orbiting particle
    const orbGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const orbMat = new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: 0.9 });
    const orbiter = new THREE.Mesh(orbGeo, orbMat);
    group.add(orbiter);

    let t = 0;
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.008;

      // Per-segment animation style
      switch (index) {
        case 0: // Icosahedron — steady spin + breathe
          group.rotation.y = t * 0.4;
          group.rotation.x = t * 0.2;
          break;
        case 1: // Octahedron — snap rotation
          group.rotation.y = t * 0.3;
          group.rotation.z = Math.sin(t * 0.5) * 0.3;
          break;
        case 2: // Dodecahedron — tumble
          group.rotation.y = t * 0.35;
          group.rotation.x = Math.sin(t * 0.25) * 0.4;
          break;
        case 3: // Head — slow majestic rotation
          group.rotation.y = t * 0.25;
          group.rotation.x = Math.sin(t * 0.15) * 0.1;
          break;
        case 4: // Torus — tilt + spin
          group.rotation.x = Math.PI / 5 + Math.sin(t * 0.3) * 0.15;
          group.rotation.y = t * 0.5;
          break;
        case 5: // Tetrahedron — wobble
          group.rotation.y = t * 0.4;
          group.rotation.x = t * 0.15;
          group.rotation.z = Math.sin(t * 0.4) * 0.2;
          break;
      }

      // Breathe scale
      const s = 1 + Math.sin(t * 1.2) * 0.025;
      group.scale.set(s, s, s);

      // Scan line sweeps up and down
      const scanY = Math.sin(t * 0.8) * 1.0;
      scanLine.position.y = scanY;
      scanMat.opacity = 0.12 + Math.sin(t * 1.6) * 0.08;

      // Orbit ring subtle tilt
      ring.rotation.x = Math.PI / 2 + Math.sin(t * 0.2) * 0.1;

      // Orbiting particle
      orbiter.position.x = Math.cos(t * 1.5) * 1.15;
      orbiter.position.z = Math.sin(t * 1.5) * 1.15;
      orbiter.position.y = Math.sin(t * 0.8) * 0.2;

      // Pulse wireframe opacity
      wireMat.opacity = 0.4 + Math.sin(t * 2) * 0.2;
      pointMat.opacity = 0.5 + Math.sin(t * 2.5) * 0.2;

      renderer.render(scene, camera);
    };
    animate();

    sceneRef.current = { renderer, animId };

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [index]);

  return <div ref={mountRef} className="w-full h-full" />;
};

/* ── Main Section ── */
const SegmentsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState<number>(0);

  return (
    <section ref={ref} className="relative py-16 md:py-24" style={{ background: "#FFFFFF" }}>
      <div className="relative max-w-[1440px] mx-auto px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="font-semibold text-3xl md:text-4xl" style={{ letterSpacing: "-0.03em", color: "#111827" }}>
            Value propositions across our customer base.
          </h2>
          <p className="mt-3 text-base max-w-2xl" style={{ color: "#374151" }}>
            One pipeline. Six deployment surfaces.
          </p>
        </motion.div>

        {/* Main content: selector + detail */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-0">

          {/* Left — Segment list */}
          <div className="border-r" style={{ borderColor: "#E5E7EB" }}>
            {segments.map((seg, i) => {
              const isActive = selected === i;
              return (
                <motion.button
                  key={seg.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                  onClick={() => setSelected(i)}
                   className="w-full text-left px-6 py-5 border-b transition-all duration-300 cursor-pointer"
                   style={{
                     borderColor: "#E5E7EB",
                     background: isActive ? SEGMENT_COLORS[i].bg : "transparent",
                     borderLeft: isActive ? `2px solid ${SEGMENT_COLORS[i].accent}` : "2px solid transparent",
                   }}
                 >
                   <p className="text-sm font-medium"
                     style={{ color: isActive ? "#111827" : "#374151", letterSpacing: "-0.01em" }}
                   >
                     {seg.name}
                   </p>
                </motion.button>
              );
            })}
          </div>

          {/* Right — 3D hologram + detail */}
          <div className="relative min-h-[400px]">
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
                    <div className="absolute inset-0 pointer-events-none" style={{
                      background: "radial-gradient(ellipse at center, rgba(107,114,128,0.04) 0%, transparent 60%)",
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
                       <p className="text-[10px] uppercase tracking-[0.15em] mb-2" style={{ color: SEGMENT_COLORS[i].accent }}>
                         {seg.short}
                       </p>
                       <h3 className="text-2xl font-semibold mb-3" style={{ letterSpacing: "-0.02em", color: "#111827" }}>
                         {seg.name}
                       </h3>
                       <p className="text-sm leading-relaxed mb-6" style={{ color: "#374151" }}>
                         {seg.value}
                       </p>
                       <p className="text-[13px] leading-relaxed mb-8" style={{ color: "#6B7280" }}>
                         {seg.desc}
                       </p>

                       {/* Key metric */}
                       <div className="border p-5 inline-block" style={{ borderColor: SEGMENT_COLORS[i].border, background: SEGMENT_COLORS[i].bg }}>
                         <p className="text-3xl font-light" style={{ letterSpacing: "-0.02em", color: SEGMENT_COLORS[i].accent }}>
                          {seg.stat}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.1em] mt-1" style={{ color: "#6B7280" }}>
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
