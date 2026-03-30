import { useRef, useEffect, type FC } from "react";
import { motion, useInView } from "framer-motion";
import * as THREE from "three";

const TEAL = "#00d4aa";
const RED = "#cc3333";

/* ── Wireframe human figure (low-poly, Pipeline-style) ── */
const HumanWireframe: FC<{ className?: string }> = ({ className }) => {
  const mountRef = useRef<HTMLDivElement>(null);

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
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const group = new THREE.Group();
    scene.add(group);

    const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 });
    const matBright = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45 });
    const dotMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.5 });
    const tealDotMat = new THREE.PointsMaterial({ color: 0x00d4aa, size: 0.06, transparent: true, opacity: 0.6 });
    const facetMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.03, side: THREE.DoubleSide });

    // Build a low-poly human figure from simple geometry
    // Head - icosahedron
    const headGeo = new THREE.IcosahedronGeometry(0.32, 1);
    const headEdges = new THREE.EdgesGeometry(headGeo);
    const headWire = new THREE.LineSegments(headEdges, matBright);
    headWire.position.y = 1.55;
    group.add(headWire);
    const headMesh = new THREE.Mesh(headGeo, facetMat);
    headMesh.position.y = 1.55;
    group.add(headMesh);

    // Neck
    const neckPts = [new THREE.Vector3(0, 1.25, 0), new THREE.Vector3(0, 1.1, 0)];
    const neckGeo = new THREE.BufferGeometry().setFromPoints(neckPts);
    group.add(new THREE.Line(neckGeo, mat));

    // Torso - tapered box-like shape from vertices
    const torsoVerts = [
      // shoulders
      [-0.55, 1.1, 0.18], [0.55, 1.1, 0.18], [0.55, 1.1, -0.18], [-0.55, 1.1, -0.18],
      // waist
      [-0.35, 0.15, 0.14], [0.35, 0.15, 0.14], [0.35, 0.15, -0.14], [-0.35, 0.15, -0.14],
      // hips
      [-0.4, -0.05, 0.15], [0.4, -0.05, 0.15], [0.4, -0.05, -0.15], [-0.4, -0.05, -0.15],
    ];
    const torsoEdges = [
      [0,1],[1,2],[2,3],[3,0], // top
      [4,5],[5,6],[6,7],[7,4], // waist
      [8,9],[9,10],[10,11],[11,8], // hips
      [0,4],[1,5],[2,6],[3,7], // sides top
      [4,8],[5,9],[6,10],[7,11], // sides bottom
      [0,5],[1,4],[4,9],[5,8], // cross bracing
    ];
    const torsoPts: THREE.Vector3[] = [];
    torsoEdges.forEach(([a, b]) => {
      torsoPts.push(new THREE.Vector3(...torsoVerts[a] as [number, number, number]));
      torsoPts.push(new THREE.Vector3(...torsoVerts[b] as [number, number, number]));
    });
    const torsoGeo = new THREE.BufferGeometry().setFromPoints(torsoPts);
    group.add(new THREE.LineSegments(torsoGeo, mat));

    // Torso facets
    const torsoFacetGeo = new THREE.BufferGeometry();
    const tvf = new Float32Array([
      ...torsoVerts[0], ...torsoVerts[1], ...torsoVerts[5],
      ...torsoVerts[0], ...torsoVerts[5], ...torsoVerts[4],
      ...torsoVerts[1], ...torsoVerts[2], ...torsoVerts[6],
      ...torsoVerts[1], ...torsoVerts[6], ...torsoVerts[5],
    ].flat() as number[]);
    torsoFacetGeo.setAttribute("position", new THREE.BufferAttribute(tvf, 3));
    group.add(new THREE.Mesh(torsoFacetGeo, facetMat));

    // Arms
    const armJoints = {
      left: [[-0.55, 1.1, 0], [-0.72, 0.55, 0.05], [-0.62, 0.05, 0.02]],
      right: [[0.55, 1.1, 0], [0.72, 0.55, 0.05], [0.62, 0.05, 0.02]],
    };
    Object.values(armJoints).forEach((joints) => {
      const pts = joints.map((j) => new THREE.Vector3(j[0], j[1], j[2]));
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      group.add(new THREE.Line(geo, mat));
      group.add(new THREE.Points(geo, dotMat));
    });

    // Legs
    const legJoints = {
      left: [[-0.22, -0.05, 0], [-0.25, -0.75, 0.04], [-0.23, -1.45, 0], [-0.25, -1.65, 0.08]],
      right: [[0.22, -0.05, 0], [0.25, -0.75, 0.04], [0.23, -1.45, 0], [0.25, -1.65, 0.08]],
    };
    Object.values(legJoints).forEach((joints) => {
      const pts = joints.map((j) => new THREE.Vector3(j[0], j[1], j[2]));
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      group.add(new THREE.Line(geo, mat));
      group.add(new THREE.Points(geo, dotMat));
    });

    // Scanning teal dots along the body
    const scanPtsArr: number[] = [];
    for (let i = 0; i < 60; i++) {
      const y = 1.8 - Math.random() * 3.5;
      const spread = y > 1.1 ? 0.3 : y > 0 ? 0.5 : y > -0.5 ? 0.35 : 0.25;
      const x = (Math.random() - 0.5) * spread * 2;
      const z = (Math.random() - 0.5) * 0.3;
      scanPtsArr.push(x, y, z);
    }
    const scanGeo = new THREE.BufferGeometry();
    scanGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(scanPtsArr), 3));
    group.add(new THREE.Points(scanGeo, tealDotMat));

    // Center the figure
    group.position.y = -0.1;

    let animId: number;
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.003;
      group.rotation.y = Math.sin(t) * 0.15;
      // Gentle breathing
      const breathe = 1 + Math.sin(t * 2) * 0.008;
      group.scale.set(breathe, breathe, breathe);
      // Pulse scan dots
      tealDotMat.opacity = 0.35 + Math.sin(t * 3) * 0.25;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = el.clientWidth;
      const nh = el.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className} />;
};

/* ── Main Section ── */
const PatientNarrativeSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 px-6 relative overflow-hidden" style={{ background: "#1a1d21" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p
              className="text-[11px] font-medium uppercase text-white/25 mb-4"
              style={{ letterSpacing: "0.12em" }}
            >
              Clinical Decision Divergence
            </p>
            <h2
              className="text-3xl md:text-4xl font-normal text-white mb-2"
              style={{ letterSpacing: "-0.03em" }}
            >
              Jane Doe, 52
            </h2>
            <p className="text-white/35 text-sm mb-8" style={{ letterSpacing: "0.01em" }}>
              Routine visit · 3 undetected risk factors in chart
            </p>

            {/* Compact test results */}
            <div className="space-y-3 mb-10">
              {[
                { test: "LDCT Lung Screening", with: "Ordered", without: "Not flagged" },
                { test: "Colonoscopy", with: "Scheduled", without: "Deferred" },
                { test: "BP + Lipid Panel", with: "Statin pathway compiled", without: "No follow-up" },
                { test: "HbA1c", with: "Pre-diabetes detected", without: "Not tested" },
              ].map((row) => (
                <div
                  key={row.test}
                  className="flex items-center gap-3 py-2 border-b border-white/[0.05]"
                >
                  <span className="text-white/50 text-sm flex-1 min-w-0" style={{ letterSpacing: "0.01em" }}>
                    {row.test}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 shrink-0" style={{ color: TEAL, background: `${TEAL}12`, border: `1px solid ${TEAL}25` }}>
                    {row.with}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 shrink-0" style={{ color: RED, background: `${RED}12`, border: `1px solid ${RED}25` }}>
                    {row.without}
                  </span>
                </div>
              ))}
            </div>

            {/* Outcomes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-white/[0.06] p-4" style={{ background: `${TEAL}06` }}>
                <p className="text-[10px] uppercase font-medium mb-2" style={{ color: TEAL, letterSpacing: "0.1em" }}>
                  With Medient
                </p>
                <p className="text-white text-lg font-normal" style={{ letterSpacing: "-0.02em" }}>Stage IA</p>
                <p className="text-white/40 text-xs mt-1">$4,200 · 92% survival</p>
              </div>
              <div className="border border-white/[0.06] p-4" style={{ background: `${RED}06` }}>
                <p className="text-[10px] uppercase font-medium mb-2" style={{ color: RED, letterSpacing: "0.1em" }}>
                  Without
                </p>
                <p className="text-white text-lg font-normal" style={{ letterSpacing: "-0.02em" }}>Stage IIIB</p>
                <p className="text-white/40 text-xs mt-1">$288K+ · 23% survival</p>
              </div>
            </div>
          </motion.div>

          {/* Right — 3D Wireframe Figure */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* Subtle radial glow behind figure */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(0,212,170,0.04) 0%, transparent 65%)",
              }}
            />
            <HumanWireframe className="w-full h-[480px] md:h-[560px]" />
          </motion.div>
        </div>

        {/* Scale bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-px bg-white/[0.04]"
        >
          {[
            { val: "340+", label: "Early detections / year" },
            { val: "$96M", label: "Downstream costs avoided" },
            { val: "94%", label: "Screening gaps closed" },
          ].map((s) => (
            <div key={s.val} className="p-5 text-center" style={{ background: "#1a1d21" }}>
              <p className="text-xl font-normal text-white" style={{ letterSpacing: "-0.02em" }}>{s.val}</p>
              <p className="text-white/30 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PatientNarrativeSection;
