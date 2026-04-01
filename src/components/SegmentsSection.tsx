import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, type FC } from "react";
import * as THREE from "three";

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
    name: "Insurers",
    short: "Preventive ROI",
    value: "Reduce downstream claims through upstream detection",
    stat: "68x",
    statLabel: "Cost reduction",
    desc: "Early detection at $4,200 vs. late-stage treatment at $288K+. Preventive infrastructure that bends the claims curve before patients become expensive.",
  },
];

/* ── Helper: build a brain-like shape from layered icospheres ── */
function createBrainGeo(): THREE.Group {
  const g = new THREE.Group();
  // Left hemisphere
  const leftGeo = new THREE.SphereGeometry(0.55, 10, 8, 0, Math.PI);
  leftGeo.translate(-0.15, 0, 0);
  // Right hemisphere
  const rightGeo = new THREE.SphereGeometry(0.55, 10, 8, 0, Math.PI);
  rightGeo.translate(0.15, 0, 0);
  rightGeo.rotateY(Math.PI);
  // Cerebellum
  const cerebGeo = new THREE.SphereGeometry(0.3, 8, 6);
  cerebGeo.translate(0, -0.35, -0.2);
  // Folds (torus wraps)
  const fold1 = new THREE.TorusGeometry(0.5, 0.06, 6, 16);
  fold1.rotateX(Math.PI / 2);
  const fold2 = new THREE.TorusGeometry(0.45, 0.05, 6, 16);
  fold2.rotateZ(Math.PI / 3);
  fold2.rotateX(Math.PI / 2.5);
  return g; // we'll merge below
}

/* ── Helper: build a hospital-like structure ── */
function createHospitalGeo(): THREE.BufferGeometry {
  // Main building
  const main = new THREE.BoxGeometry(0.9, 1.2, 0.6);
  main.translate(0, 0, 0);
  // Wing left
  const wingL = new THREE.BoxGeometry(0.5, 0.8, 0.5);
  wingL.translate(-0.6, -0.2, 0);
  // Wing right
  const wingR = new THREE.BoxGeometry(0.5, 0.8, 0.5);
  wingR.translate(0.6, -0.2, 0);
  // Tower
  const tower = new THREE.BoxGeometry(0.3, 0.5, 0.3);
  tower.translate(0, 0.85, 0);
  // Cross on top
  const crossV = new THREE.BoxGeometry(0.06, 0.25, 0.06);
  crossV.translate(0, 1.22, 0);
  const crossH = new THREE.BoxGeometry(0.18, 0.06, 0.06);
  crossH.translate(0, 1.28, 0);

  // Merge into one
  const merged = mergeGeometries([main, wingL, wingR, tower, crossV, crossH]);
  return merged;
}

/* ── Helper: merge BufferGeometries manually ── */
function mergeGeometries(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  let totalVerts = 0;
  let totalIdx = 0;
  geos.forEach(g => {
    totalVerts += g.attributes.position!.count;
    if (g.index) totalIdx += g.index.count;
    else totalIdx += g.attributes.position!.count;
  });
  const pos = new Float32Array(totalVerts * 3);
  const indices: number[] = [];
  let vOffset = 0;
  let iOffset = 0;
  geos.forEach(g => {
    const p = g.attributes.position!;
    for (let i = 0; i < p.count; i++) {
      pos[(vOffset + i) * 3] = p.getX(i);
      pos[(vOffset + i) * 3 + 1] = p.getY(i);
      pos[(vOffset + i) * 3 + 2] = p.getZ(i);
    }
    if (g.index) {
      for (let i = 0; i < g.index.count; i++) {
        indices.push(g.index.array[i]! + vOffset);
      }
    } else {
      for (let i = 0; i < p.count; i++) {
        indices.push(vOffset + i);
      }
    }
    vOffset += p.count;
  });
  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  merged.setIndex(indices);
  merged.computeVertexNormals();
  return merged;
}

/* ── Helper: create a person/human silhouette shape ── */
function createPersonGeo(): THREE.BufferGeometry {
  // Head
  const head = new THREE.SphereGeometry(0.25, 10, 8);
  head.translate(0, 0.75, 0);
  // Body (tapered cylinder)
  const body = new THREE.CylinderGeometry(0.2, 0.35, 0.7, 8);
  body.translate(0, 0.15, 0);
  // Arms
  const armL = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 6);
  armL.rotateZ(Math.PI / 6);
  armL.translate(-0.4, 0.2, 0);
  const armR = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 6);
  armR.rotateZ(-Math.PI / 6);
  armR.translate(0.4, 0.2, 0);
  // Heart indicator
  const heart = new THREE.SphereGeometry(0.1, 8, 6);
  heart.translate(0.08, 0.35, 0.2);
  return mergeGeometries([head, body, armL, armR, heart]);
}

/* ── Helper: create a shield shape for insurers ── */
function createShieldGeo(): THREE.BufferGeometry {
  // Shield body using lathe
  const pts: THREE.Vector2[] = [];
  pts.push(new THREE.Vector2(0, -0.9));
  pts.push(new THREE.Vector2(0.5, -0.5));
  pts.push(new THREE.Vector2(0.6, 0));
  pts.push(new THREE.Vector2(0.55, 0.4));
  pts.push(new THREE.Vector2(0.3, 0.7));
  pts.push(new THREE.Vector2(0, 0.95));
  const shield = new THREE.LatheGeometry(pts, 12);
  shield.scale(1, 1, 0.4);
  // Dollar sign approximation — a vertical bar
  const bar = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 6);
  bar.translate(0, 0, 0.22);
  // S-curve approximation with torus arcs
  const sTop = new THREE.TorusGeometry(0.15, 0.035, 6, 8, Math.PI);
  sTop.translate(0, 0.15, 0.22);
  const sBot = new THREE.TorusGeometry(0.15, 0.035, 6, 8, Math.PI);
  sBot.rotateY(Math.PI);
  sBot.translate(0, -0.15, 0.22);
  return mergeGeometries([shield, bar, sTop, sBot]);
}

/* ── Build segment-specific geometry ── */
function buildSegmentGeo(index: number): THREE.BufferGeometry {
  switch (index) {
    case 0: {
      // Frontier Labs — Brain
      const leftHemi = new THREE.SphereGeometry(0.55, 12, 10, 0, Math.PI);
      leftHemi.translate(-0.12, 0, 0);
      const rightHemi = new THREE.SphereGeometry(0.55, 12, 10, 0, Math.PI);
      rightHemi.rotateY(Math.PI);
      rightHemi.translate(0.12, 0, 0);
      const cerebellum = new THREE.SphereGeometry(0.28, 8, 6);
      cerebellum.translate(0, -0.38, -0.18);
      const stem = new THREE.CylinderGeometry(0.08, 0.06, 0.35, 6);
      stem.translate(0, -0.62, -0.1);
      const fold1 = new THREE.TorusGeometry(0.48, 0.04, 6, 20);
      fold1.rotateX(Math.PI / 2);
      fold1.translate(0, 0.05, 0);
      const fold2 = new THREE.TorusGeometry(0.42, 0.035, 6, 18);
      fold2.rotateX(Math.PI / 2);
      fold2.rotateZ(Math.PI / 4);
      fold2.translate(0, -0.05, 0);
      return mergeGeometries([leftHemi, rightHemi, cerebellum, stem, fold1, fold2]);
    }
    case 1: {
      // Clinical AI Products — Circuit board / chip
      const chip = new THREE.BoxGeometry(1, 0.12, 1);
      const core = new THREE.BoxGeometry(0.4, 0.25, 0.4);
      core.translate(0, 0.1, 0);
      // Pins
      const pins: THREE.BufferGeometry[] = [chip, core];
      for (let i = -2; i <= 2; i++) {
        const pin = new THREE.BoxGeometry(0.05, 0.08, 0.3);
        pin.translate(i * 0.18, -0.1, 0.65);
        pins.push(pin);
        const pin2 = pin.clone();
        pin2.translate(0, 0, -1.3);
        pins.push(pin2);
        const pin3 = new THREE.BoxGeometry(0.3, 0.08, 0.05);
        pin3.translate(0.65, -0.1, i * 0.18);
        pins.push(pin3);
        const pin4 = pin3.clone();
        pin4.translate(-1.3, 0, 0);
        pins.push(pin4);
      }
      return mergeGeometries(pins);
    }
    case 2: {
      // Clinical Networks — Connected nodes / network graph
      const nodes: THREE.BufferGeometry[] = [];
      const positions = [
        [0, 0.6, 0], [-0.5, 0.1, 0.3], [0.5, 0.1, 0.3],
        [-0.3, -0.5, -0.2], [0.3, -0.5, -0.2], [0, 0, -0.5],
      ];
      positions.forEach(([x, y, z]) => {
        const node = new THREE.SphereGeometry(0.12, 8, 6);
        node.translate(x!, y!, z!);
        nodes.push(node);
      });
      // Edges as thin cylinders
      const pairs = [[0,1],[0,2],[1,2],[1,3],[2,4],[3,4],[0,5],[3,5],[4,5]];
      pairs.forEach(([a, b]) => {
        const pa = positions[a!]!;
        const pb = positions[b!]!;
        const mid = [(pa[0]!+pb[0]!)/2, (pa[1]!+pb[1]!)/2, (pa[2]!+pb[2]!)/2];
        const dx = pb[0]!-pa[0]!, dy = pb[1]!-pa[1]!, dz = pb[2]!-pa[2]!;
        const len = Math.sqrt(dx*dx + dy*dy + dz*dz);
        const edge = new THREE.CylinderGeometry(0.02, 0.02, len, 4);
        // Orient along the connection
        const dir = new THREE.Vector3(dx, dy, dz).normalize();
        const up = new THREE.Vector3(0, 1, 0);
        const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
        edge.applyQuaternion(quat);
        edge.translate(mid[0]!, mid[1]!, mid[2]!);
        nodes.push(edge);
      });
      return mergeGeometries(nodes);
    }
    case 3: {
      // Clinics — Hospital building
      return createHospitalGeo();
    }
    case 4: {
      // Patients — Person/human figure
      return createPersonGeo();
    }
    case 5: {
      // Insurers — Shield with dollar sign
      return createShieldGeo();
    }
    default:
      return new THREE.IcosahedronGeometry(1, 1);
  }
}

/* ── 3D Hologram for each segment — GRAYSCALE ── */
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

    // Grayscale materials — machined steel look
    const wireMat = new THREE.LineBasicMaterial({ color: 0x6B7280, transparent: true, opacity: 0.5 });
    const wireMatDim = new THREE.LineBasicMaterial({ color: 0x9CA3AF, transparent: true, opacity: 0.15 });
    const facetMat = new THREE.MeshBasicMaterial({ color: 0x374151, transparent: true, opacity: 0.06, side: THREE.DoubleSide });
    const pointMat = new THREE.PointsMaterial({ color: 0x6B7280, size: 0.03, transparent: true, opacity: 0.5 });

    const geo = buildSegmentGeo(index);

    const edges = new THREE.EdgesGeometry(geo);
    const wireframe = new THREE.LineSegments(edges, wireMat);
    group.add(wireframe);

    const mesh = new THREE.Mesh(geo, facetMat);
    group.add(mesh);

    const points = new THREE.Points(geo, pointMat);
    group.add(points);

    const innerGeo = geo.clone();
    innerGeo.scale(0.6, 0.6, 0.6);
    const innerEdges = new THREE.EdgesGeometry(innerGeo);
    const innerWire = new THREE.LineSegments(innerEdges, wireMatDim);
    group.add(innerWire);

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
    const pMat = new THREE.PointsMaterial({ color: 0x9CA3AF, size: 0.02, transparent: true, opacity: 0.3 });
    group.add(new THREE.Points(pGeo, pMat));

    let t = 0;
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.004;
      group.rotation.y = t * 0.5;
      group.rotation.x = Math.sin(t * 0.3) * 0.15;
      const s = 1 + Math.sin(t * 1.5) * 0.03;
      group.scale.set(s, s, s);
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
    <section ref={ref} className="relative py-24 md:py-32" style={{ background: "#FFFFFF" }}>
      <div className="relative max-w-[1440px] mx-auto px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-[11px] font-medium uppercase mb-3" style={{ letterSpacing: "0.12em", color: "#6B7280" }}>
            Deployment Architecture
          </p>
          <h2 className="font-semibold text-3xl md:text-4xl" style={{ letterSpacing: "-0.03em", color: "#111827" }}>
            Market Architecture
          </h2>
          <p className="mt-3 text-base max-w-2xl" style={{ color: "#374151" }}>
            One compiled artifact. Six deployment surfaces.
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
                    background: isActive ? "rgba(17,24,39,0.03)" : "transparent",
                    borderLeft: isActive ? "2px solid #111827" : "2px solid transparent",
                  }}
                >
                  <p className="text-[10px] uppercase tracking-[0.12em] mb-1"
                    style={{ color: isActive ? "#111827" : "#6B7280" }}
                  >
                    {seg.short}
                  </p>
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
                      <p className="text-[10px] uppercase tracking-[0.15em] mb-2" style={{ color: "#6B7280" }}>
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

                      {/* Key metric — color used here because it's DATA */}
                      <div className="border p-5 inline-block" style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }}>
                        <p className="text-3xl font-light" style={{ letterSpacing: "-0.02em", color: "#059669" }}>
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
