import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import FacetedCrownLogo from "./FacetedCrownLogo";

/* ─── helpers ─── */
function fibonacci(i: number, total: number, radius: number): [number, number, number] {
  const phi = Math.acos(1 - (2 * (i + 0.5)) / total);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  return [
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi),
  ];
}

function distSq(a: THREE.Vector3, b: THREE.Vector3) {
  return a.distanceToSquared(b);
}

/* ─── constants ─── */
const NODE_COUNT = 100;
const HUB_COUNT = 15;
const DATA_PARTICLE_COUNT = 300;
const AMBIENT_COUNT = 150;
const BG = 0x0a0c0f;
const TEAL = 0x00d4aa;

const HeroSection = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    /* ── renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(BG, 1);
    container.appendChild(renderer.domElement);

    /* ── scene & camera ── */
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(BG, 0.035);
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 20);

    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    /* ── node positions ── */
    const positions: THREE.Vector3[] = [];
    const isHub: boolean[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const [x, y, z] = fibonacci(i, NODE_COUNT, 8);
      positions.push(new THREE.Vector3(x, y, z));
      isHub.push(i < HUB_COUNT);
    }

    /* ── node meshes ── */
    const nodeMeshes: THREE.Mesh[] = [];
    const hubGlows: THREE.Mesh[] = [];
    const sphereGeo = new THREE.SphereGeometry(1, 8, 8);
    const circleGeo = new THREE.CircleGeometry(1, 16);

    for (let i = 0; i < NODE_COUNT; i++) {
      const hub = isHub[i];
      const size = hub ? 0.15 + Math.random() * 0.1 : 0.03 + Math.random() * 0.09;
      const opacity = hub ? 1.0 : 0.3 + Math.random() * 0.6;
      const mat = new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.scale.setScalar(size);
      mesh.position.copy(positions[i]);
      networkGroup.add(mesh);
      nodeMeshes.push(mesh);

      if (hub) {
        const gMat = new THREE.MeshBasicMaterial({
          color: TEAL, transparent: true, opacity: 0.15, side: THREE.DoubleSide,
        });
        const glow = new THREE.Mesh(circleGeo, gMat);
        glow.scale.setScalar(size * 3);
        glow.position.copy(positions[i]);
        networkGroup.add(glow);
        hubGlows.push(glow);
      }
    }

    /* ── edges (nearest neighbours) ── */
    type Edge = [number, number];
    const edges: Edge[] = [];
    const adjacency: number[][] = Array.from({ length: NODE_COUNT }, () => []);

    for (let i = 0; i < NODE_COUNT; i++) {
      const dists: { j: number; d: number }[] = [];
      for (let j = 0; j < NODE_COUNT; j++) {
        if (j === i) continue;
        dists.push({ j, d: distSq(positions[i], positions[j]) });
      }
      dists.sort((a, b) => a.d - b.d);
      const k = 2 + Math.floor(Math.random() * 3); // 2-4 neighbours
      for (let n = 0; n < k; n++) {
        const j = dists[n].j;
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!edges.some(([a, b]) => (a < b ? `${a}-${b}` : `${b}-${a}`) === key)) {
          edges.push([i, j]);
          adjacency[i].push(j);
          adjacency[j].push(i);
        } else {
          if (!adjacency[i].includes(j)) adjacency[i].push(j);
          if (!adjacency[j].includes(i)) adjacency[j].push(i);
        }
      }
    }

    const edgePositions = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], idx) => {
      edgePositions[idx * 6] = positions[a].x;
      edgePositions[idx * 6 + 1] = positions[a].y;
      edgePositions[idx * 6 + 2] = positions[a].z;
      edgePositions[idx * 6 + 3] = positions[b].x;
      edgePositions[idx * 6 + 4] = positions[b].y;
      edgePositions[idx * 6 + 5] = positions[b].z;
    });
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(edgePositions, 3));
    const edgeMat = new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0.08 });
    networkGroup.add(new THREE.LineSegments(edgeGeo, edgeMat));

    /* ── data particles flowing along edges ── */
    const dpPos = new Float32Array(DATA_PARTICLE_COUNT * 3);
    const dpColors = new Float32Array(DATA_PARTICLE_COUNT * 3);
    const tealC = new THREE.Color(TEAL);
    const whiteC = new THREE.Color(0xffffff);

    interface FlowParticle { edge: Edge; t: number; speed: number; }
    const flows: FlowParticle[] = [];
    for (let i = 0; i < DATA_PARTICLE_COUNT; i++) {
      const e = edges[Math.floor(Math.random() * edges.length)];
      flows.push({ edge: e, t: Math.random(), speed: 0.002 + Math.random() * 0.004 });
      const isWhite = Math.random() < 0.25;
      const c = isWhite ? whiteC : tealC;
      dpColors[i * 3] = c.r; dpColors[i * 3 + 1] = c.g; dpColors[i * 3 + 2] = c.b;
    }
    const dpGeo = new THREE.BufferGeometry();
    dpGeo.setAttribute("position", new THREE.BufferAttribute(dpPos, 3));
    dpGeo.setAttribute("color", new THREE.BufferAttribute(dpColors, 3));
    const dpMat = new THREE.PointsMaterial({
      size: 0.04, transparent: true, opacity: 0.7, vertexColors: true, sizeAttenuation: true,
    });
    networkGroup.add(new THREE.Points(dpGeo, dpMat));

    /* ── ambient particles ── */
    const ambPos = new Float32Array(AMBIENT_COUNT * 3);
    const ambVel = new Float32Array(AMBIENT_COUNT * 3);
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      const r = 15;
      ambPos[i * 3] = (Math.random() - 0.5) * r * 2;
      ambPos[i * 3 + 1] = (Math.random() - 0.5) * r * 2;
      ambPos[i * 3 + 2] = (Math.random() - 0.5) * r * 2;
      ambVel[i * 3] = (Math.random() - 0.5) * 0.002;
      ambVel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      ambVel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    const ambGeo = new THREE.BufferGeometry();
    ambGeo.setAttribute("position", new THREE.BufferAttribute(ambPos, 3));
    const ambMat = new THREE.PointsMaterial({
      size: 0.02, color: 0x334455, transparent: true, opacity: 0.15, sizeAttenuation: true,
    });
    networkGroup.add(new THREE.Points(ambGeo, ambMat));

    /* ── mouse parallax ── */
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    /* ── resize ── */
    const onResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    /* ── animation loop ── */
    let raf = 0;
    let frame = 0;
    const lookTarget = new THREE.Vector3();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      frame++;

      // network rotation
      networkGroup.rotation.y += 0.0003;
      networkGroup.rotation.x = Math.sin(frame * 0.0001) * 0.15;

      // hub pulse
      let hubIdx = 0;
      for (let i = 0; i < HUB_COUNT; i++) {
        const s = 1 + Math.sin(frame * 0.002 + i) * 0.1;
        const baseSize = 0.15 + (i % 3) * 0.05;
        nodeMeshes[i].scale.setScalar(baseSize * s);
      }

      // data particles
      const dpArr = dpGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < DATA_PARTICLE_COUNT; i++) {
        const f = flows[i];
        f.t += f.speed;
        if (f.t >= 1) {
          f.t = 0;
          const current = f.edge[1];
          const neighbours = adjacency[current];
          if (neighbours.length > 0) {
            const next = neighbours[Math.floor(Math.random() * neighbours.length)];
            f.edge = [current, next];
          }
        }
        const a = positions[f.edge[0]], b = positions[f.edge[1]];
        dpArr[i * 3] = a.x + (b.x - a.x) * f.t;
        dpArr[i * 3 + 1] = a.y + (b.y - a.y) * f.t;
        dpArr[i * 3 + 2] = a.z + (b.z - a.z) * f.t;
      }
      dpGeo.attributes.position.needsUpdate = true;

      // ambient drift
      const ambArr = ambGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < AMBIENT_COUNT; i++) {
        ambArr[i * 3] += ambVel[i * 3];
        ambArr[i * 3 + 1] += ambVel[i * 3 + 1];
        ambArr[i * 3 + 2] += ambVel[i * 3 + 2];
        if (Math.abs(ambArr[i * 3]) > 15) ambVel[i * 3] *= -1;
        if (Math.abs(ambArr[i * 3 + 1]) > 15) ambVel[i * 3 + 1] *= -1;
        if (Math.abs(ambArr[i * 3 + 2]) > 15) ambVel[i * 3 + 2] *= -1;
      }
      ambGeo.attributes.position.needsUpdate = true;

      // parallax
      lookTarget.x += (mouse.x * 1.5 - lookTarget.x) * 0.02;
      lookTarget.y += (-mouse.y * 1.0 - lookTarget.y) * 0.02;
      camera.lookAt(lookTarget);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      container.removeChild(renderer.domElement);
      // dispose geometries & materials
      sphereGeo.dispose();
      circleGeo.dispose();
      edgeGeo.dispose();
      dpGeo.dispose();
      ambGeo.dispose();
      edgeMat.dispose();
      dpMat.dispose();
      ambMat.dispose();
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* THREE.js mount */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* radial vignette for text readability */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 30% 50%, transparent 0%, #0a0c0f 100%)",
        }}
      />

      {/* hero content */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-24">
        <div className="max-w-3xl flex flex-col">
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8"
          >
            <FacetedCrownLogo size={80} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-mono font-bold text-white"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1.1 }}
          >
            Unlocking the proactive healthcare patients deserve.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-6 font-sans text-lg text-white/50"
            style={{ maxWidth: 640, lineHeight: 1.7 }}
          >
            The healthcare system was not built for prevention. We are changing
            that — replacing outdated, reactive workflows with intelligent
            clinical infrastructure that catches what matters before it is too
            late.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-8 flex flex-row gap-4"
          >
            <a
              href="#contact"
              className="font-mono text-xs uppercase tracking-[0.15em] text-white border border-white/40 bg-transparent px-8 py-3.5 transition-all duration-300 hover:bg-white hover:text-[#1a1d21]"
            >
              Request Demo
            </a>
            <a
              href="#pipeline"
              className="font-mono text-xs uppercase tracking-[0.15em] text-white border border-white/20 bg-transparent px-8 py-3.5 transition-all duration-300 hover:bg-white hover:text-[#1a1d21]"
            >
              Read White Paper
            </a>
          </motion.div>
        </div>
      </div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/20 uppercase">
          Scroll to explore
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-white/20 text-sm"
        >
          ▾
        </motion.span>
      </motion.div>
    </section>
  );
};

export default HeroSection;
