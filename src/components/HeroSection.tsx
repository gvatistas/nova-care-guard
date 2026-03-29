import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import FacetedCrownLogo from "./FacetedCrownLogo";

/* ─── Tree topology ─── */
const PATHWAYS = [
  { color: 0x00d4ff, nodes: 3 }, // Lung — cyan
  { color: 0xffaa00, nodes: 3 }, // Colorectal — amber
  { color: 0xff4444, nodes: 3 }, // Cardiovascular — red
  { color: 0xaa44ff, nodes: 3 }, // Diabetes — purple
];

const BG = 0x0a0c0f;
const TEAL = 0x00ffd4;

interface NodeInfo {
  pos: THREE.Vector3;
  color: THREE.Color;
  isHub: boolean;
  pathwayIdx: number;
  nodeIdx: number; // -1 = root, -2 = bottom
}

interface EdgeInfo {
  from: number;
  to: number;
  color: THREE.Color;
}

const HeroSection = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(BG, 1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(BG, 0.025);
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 18);

    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

    /* ── build nodes ── */
    const nodes: NodeInfo[] = [];
    const edges: EdgeInfo[] = [];

    // Root node (top center)
    const rootPos = new THREE.Vector3(0, 5, 0);
    nodes.push({ pos: rootPos, color: new THREE.Color(TEAL), isHub: true, pathwayIdx: -1, nodeIdx: -1 });
    const rootIdx = 0;

    // 4 pathway branches spreading out
    const spread = 3.5;
    PATHWAYS.forEach((pw, pi) => {
      const xBase = (pi - 1.5) * spread;
      const pwColor = new THREE.Color(pw.color);

      for (let ni = 0; ni < pw.nodes; ni++) {
        const y = 5 - (ni + 1) * 2.5;
        const x = xBase + (Math.random() - 0.5) * 0.6;
        const z = (Math.random() - 0.5) * 1.5;
        const idx = nodes.length;
        nodes.push({ pos: new THREE.Vector3(x, y, z), color: pwColor, isHub: false, pathwayIdx: pi, nodeIdx: ni });

        // Edge from previous node or root
        const fromIdx = ni === 0 ? rootIdx : idx - 1;
        edges.push({ from: fromIdx, to: idx, color: pwColor });
      }
    });

    // Bottom convergence node
    const bottomPos = new THREE.Vector3(0, -4, 0);
    const bottomIdx = nodes.length;
    nodes.push({ pos: bottomPos, color: new THREE.Color(TEAL), isHub: true, pathwayIdx: -1, nodeIdx: -2 });

    // Connect last node of each pathway to bottom
    PATHWAYS.forEach((pw, pi) => {
      const lastNodeIdx = rootIdx + 1 + pi * pw.nodes + (pw.nodes - 1);
      edges.push({ from: lastNodeIdx, to: bottomIdx, color: new THREE.Color(pw.color) });
    });

    /* ── render nodes as meshes ── */
    const sphereGeo = new THREE.SphereGeometry(1, 12, 12);
    const diamondGeo = new THREE.OctahedronGeometry(1, 0);
    const glowCircleGeo = new THREE.CircleGeometry(1, 24);
    const nodeMeshes: THREE.Mesh[] = [];
    const hubMeshes: THREE.Mesh[] = [];

    nodes.forEach((n) => {
      if (n.isHub) {
        // Hub spheres (root & bottom)
        const mat = new THREE.MeshBasicMaterial({ color: n.color, transparent: true, opacity: 0.9 });
        const mesh = new THREE.Mesh(sphereGeo, mat);
        mesh.scale.setScalar(0.25);
        mesh.position.copy(n.pos);
        treeGroup.add(mesh);
        nodeMeshes.push(mesh);
        hubMeshes.push(mesh);

        // Glow ring
        const gMat = new THREE.MeshBasicMaterial({ color: n.color, transparent: true, opacity: 0.12, side: THREE.DoubleSide });
        const glow = new THREE.Mesh(glowCircleGeo, gMat);
        glow.scale.setScalar(0.7);
        glow.position.copy(n.pos);
        treeGroup.add(glow);
      } else {
        // Diamond decision nodes
        const mat = new THREE.MeshBasicMaterial({ color: n.color, transparent: true, opacity: 0.6 });
        const mesh = new THREE.Mesh(diamondGeo, mat);
        mesh.scale.setScalar(0.15);
        mesh.position.copy(n.pos);
        treeGroup.add(mesh);
        nodeMeshes.push(mesh);
      }
    });

    /* ── render edges as glowing lines ── */
    edges.forEach((e) => {
      const positions = new Float32Array([
        nodes[e.from].pos.x, nodes[e.from].pos.y, nodes[e.from].pos.z,
        nodes[e.to].pos.x, nodes[e.to].pos.y, nodes[e.to].pos.z,
      ]);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.LineBasicMaterial({ color: e.color, transparent: true, opacity: 0.2 });
      treeGroup.add(new THREE.LineSegments(geo, mat));
    });

    /* ── patient pulses flowing along edges ── */
    const PULSE_COUNT = 40;
    const pulsePos = new Float32Array(PULSE_COUNT * 3);
    const pulseColors = new Float32Array(PULSE_COUNT * 3);
    interface Pulse { edgeIdx: number; t: number; speed: number; }
    const pulses: Pulse[] = [];

    for (let i = 0; i < PULSE_COUNT; i++) {
      const edgeIdx = Math.floor(Math.random() * edges.length);
      pulses.push({ edgeIdx, t: Math.random(), speed: 0.003 + Math.random() * 0.005 });
      const isWhite = Math.random() < 0.3;
      const c = isWhite ? new THREE.Color(0xffffff) : new THREE.Color(edges[edgeIdx].color);
      pulseColors[i * 3] = c.r;
      pulseColors[i * 3 + 1] = c.g;
      pulseColors[i * 3 + 2] = c.b;
    }
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePos, 3));
    pulseGeo.setAttribute("color", new THREE.BufferAttribute(pulseColors, 3));
    const pulseMat = new THREE.PointsMaterial({
      size: 0.08, transparent: true, opacity: 0.8, vertexColors: true, sizeAttenuation: true,
    });
    treeGroup.add(new THREE.Points(pulseGeo, pulseMat));

    /* ── ambient particles ── */
    const AMB_COUNT = 120;
    const ambPos = new Float32Array(AMB_COUNT * 3);
    const ambVel = new Float32Array(AMB_COUNT * 3);
    for (let i = 0; i < AMB_COUNT; i++) {
      ambPos[i * 3] = (Math.random() - 0.5) * 30;
      ambPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      ambPos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      ambVel[i * 3] = (Math.random() - 0.5) * 0.002;
      ambVel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      ambVel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    const ambGeo = new THREE.BufferGeometry();
    ambGeo.setAttribute("position", new THREE.BufferAttribute(ambPos, 3));
    const ambMat = new THREE.PointsMaterial({ size: 0.03, color: 0x334455, transparent: true, opacity: 0.15, sizeAttenuation: true });
    treeGroup.add(new THREE.Points(ambGeo, ambMat));

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

      // Slow rotation
      treeGroup.rotation.y += 0.001;
      treeGroup.rotation.x = Math.sin(frame * 0.0003) * 0.08;

      // Hub pulse
      hubMeshes.forEach((mesh, i) => {
        const s = 0.25 * (1 + Math.sin(frame * 0.003 + i * 2) * 0.15);
        mesh.scale.setScalar(s);
      });

      // Diamond node pulse
      nodeMeshes.forEach((mesh, i) => {
        if (nodes[i] && !nodes[i].isHub) {
          const s = 0.15 * (1 + Math.sin(frame * 0.004 + i) * 0.1);
          mesh.scale.setScalar(s);
        }
      });

      // Pulse particles along edges
      const pArr = pulseGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < PULSE_COUNT; i++) {
        const p = pulses[i];
        p.t += p.speed;
        if (p.t >= 1) {
          p.t = 0;
          p.edgeIdx = Math.floor(Math.random() * edges.length);
          // Update color
          const isWhite = Math.random() < 0.3;
          const c = isWhite ? new THREE.Color(0xffffff) : new THREE.Color(edges[p.edgeIdx].color);
          pulseColors[i * 3] = c.r;
          pulseColors[i * 3 + 1] = c.g;
          pulseColors[i * 3 + 2] = c.b;
        }
        const e = edges[p.edgeIdx];
        const a = nodes[e.from].pos, b = nodes[e.to].pos;
        pArr[i * 3] = a.x + (b.x - a.x) * p.t;
        pArr[i * 3 + 1] = a.y + (b.y - a.y) * p.t;
        pArr[i * 3 + 2] = a.z + (b.z - a.z) * p.t;
      }
      pulseGeo.attributes.position.needsUpdate = true;
      pulseGeo.attributes.color.needsUpdate = true;

      // Ambient drift
      const aArr = ambGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < AMB_COUNT; i++) {
        aArr[i * 3] += ambVel[i * 3];
        aArr[i * 3 + 1] += ambVel[i * 3 + 1];
        aArr[i * 3 + 2] += ambVel[i * 3 + 2];
        if (Math.abs(aArr[i * 3]) > 15) ambVel[i * 3] *= -1;
        if (Math.abs(aArr[i * 3 + 1]) > 10) ambVel[i * 3 + 1] *= -1;
        if (Math.abs(aArr[i * 3 + 2]) > 8) ambVel[i * 3 + 2] *= -1;
      }
      ambGeo.attributes.position.needsUpdate = true;

      // Parallax
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
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sphereGeo.dispose();
      diamondGeo.dispose();
      glowCircleGeo.dispose();
      pulseGeo.dispose();
      ambGeo.dispose();
      pulseMat.dispose();
      ambMat.dispose();
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Radial vignette */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 60% at 30% 50%, transparent 0%, #0a0c0f 100%)",
        }}
      />

      {/* Hero content */}
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
            className="font-heading font-extrabold text-white"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1.1, textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
          >
            Unlocking the proactive healthcare patients deserve.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-6 font-sans text-lg text-white/50"
            style={{ maxWidth: 640, lineHeight: 1.7, textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
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
              className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-white border border-white/40 bg-transparent px-8 py-3.5 transition-all duration-300 hover:bg-white hover:text-[#1a1d21]"
            >
              Request Demo
            </a>
            <a
              href="#pipeline"
              className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-white border border-white/20 bg-transparent px-8 py-3.5 transition-all duration-300 hover:bg-white hover:text-[#1a1d21]"
            >
              Read White Paper
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-heading text-[10px] font-medium tracking-[0.3em] text-white/20 uppercase">
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
