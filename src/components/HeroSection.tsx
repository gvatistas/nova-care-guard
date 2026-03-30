import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import FacetedCrownLogo from "./FacetedCrownLogo";

const BG = 0x0a0c0f;
const TEAL = 0x00ffd4;

const PATHWAYS = [
  { color: 0x00d4ff, label: "LUNG CANCER\nSCREENING", nodes: 3 },
  { color: 0xffaa00, label: "COLORECTAL\nDETECTION", nodes: 3 },
  { color: 0xff4444, label: "CARDIOVASCULAR\nRISK", nodes: 3 },
  { color: 0xaa44ff, label: "DIABETES\nMANAGEMENT", nodes: 3 },
];

interface NodeInfo { pos: THREE.Vector3; color: THREE.Color; isHub: boolean; }
interface EdgeInfo { from: number; to: number; color: THREE.Color; }

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
    scene.fog = new THREE.FogExp2(BG, 0.018);
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 200);
    camera.position.set(0, 2, 28);

    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

    const nodes: NodeInfo[] = [];
    const edges: EdgeInfo[] = [];

    // Root node — large
    const rootPos = new THREE.Vector3(0, 8, 0);
    nodes.push({ pos: rootPos, color: new THREE.Color(TEAL), isHub: true });
    const rootIdx = 0;

    // 4 pathways
    const spread = 5.5;
    PATHWAYS.forEach((pw, pi) => {
      const xBase = (pi - 1.5) * spread;
      const pwColor = new THREE.Color(pw.color);
      for (let ni = 0; ni < pw.nodes; ni++) {
        const y = 8 - (ni + 1) * 3.5;
        const x = xBase + (Math.random() - 0.5) * 0.8;
        const z = (Math.random() - 0.5) * 2;
        const idx = nodes.length;
        nodes.push({ pos: new THREE.Vector3(x, y, z), color: pwColor, isHub: false });
        const fromIdx = ni === 0 ? rootIdx : idx - 1;
        edges.push({ from: fromIdx, to: idx, color: pwColor });
      }
    });

    // Bottom convergence
    const bottomPos = new THREE.Vector3(0, -6, 0);
    const bottomIdx = nodes.length;
    nodes.push({ pos: bottomPos, color: new THREE.Color(TEAL), isHub: true });
    PATHWAYS.forEach((pw, pi) => {
      const lastNodeIdx = rootIdx + 1 + pi * pw.nodes + (pw.nodes - 1);
      edges.push({ from: lastNodeIdx, to: bottomIdx, color: new THREE.Color(pw.color) });
    });

    // Render nodes
    const sphereGeo = new THREE.SphereGeometry(1, 16, 16);
    const diamondGeo = new THREE.OctahedronGeometry(1, 0);
    const glowCircleGeo = new THREE.RingGeometry(0.8, 1.2, 32);
    const hubMeshes: THREE.Mesh[] = [];
    const diamondMeshes: THREE.Mesh[] = [];

    nodes.forEach((n) => {
      if (n.isHub) {
        const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });
        const mesh = new THREE.Mesh(sphereGeo, mat);
        mesh.scale.setScalar(0.5);
        mesh.position.copy(n.pos);
        treeGroup.add(mesh);
        hubMeshes.push(mesh);

        // Outer glow
        const gMat = new THREE.MeshBasicMaterial({ color: n.color, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
        const glow = new THREE.Mesh(glowCircleGeo, gMat);
        glow.scale.setScalar(1.5);
        glow.position.copy(n.pos);
        treeGroup.add(glow);

        // Second glow ring
        const g2Mat = new THREE.MeshBasicMaterial({ color: n.color, transparent: true, opacity: 0.08, side: THREE.DoubleSide });
        const g2 = new THREE.Mesh(glowCircleGeo, g2Mat);
        g2.scale.setScalar(2.5);
        g2.position.copy(n.pos);
        treeGroup.add(g2);
      } else {
        const mat = new THREE.MeshBasicMaterial({ color: n.color, transparent: true, opacity: 0.7 });
        const mesh = new THREE.Mesh(diamondGeo, mat);
        mesh.scale.setScalar(0.3);
        mesh.position.copy(n.pos);
        treeGroup.add(mesh);
        diamondMeshes.push(mesh);

        // Halo
        const hMat = new THREE.MeshBasicMaterial({ color: n.color, transparent: true, opacity: 0.1, side: THREE.DoubleSide });
        const halo = new THREE.Mesh(glowCircleGeo, hMat);
        halo.scale.setScalar(0.6);
        halo.position.copy(n.pos);
        treeGroup.add(halo);
      }
    });

    // Edges as thicker glowing lines
    edges.forEach((e) => {
      const positions = new Float32Array([
        nodes[e.from].pos.x, nodes[e.from].pos.y, nodes[e.from].pos.z,
        nodes[e.to].pos.x, nodes[e.to].pos.y, nodes[e.to].pos.z,
      ]);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      // Main line
      const mat = new THREE.LineBasicMaterial({ color: e.color, transparent: true, opacity: 0.3 });
      treeGroup.add(new THREE.LineSegments(geo, mat));

      // Glow line
      const gMat = new THREE.LineBasicMaterial({ color: e.color, transparent: true, opacity: 0.1, linewidth: 2 });
      treeGroup.add(new THREE.LineSegments(geo.clone(), gMat));
    });

    // Patient pulses
    const PULSE_COUNT = 60;
    const pulsePos = new Float32Array(PULSE_COUNT * 3);
    const pulseColors = new Float32Array(PULSE_COUNT * 3);
    interface Pulse { edgeIdx: number; t: number; speed: number; }
    const pulses: Pulse[] = [];

    for (let i = 0; i < PULSE_COUNT; i++) {
      const edgeIdx = Math.floor(Math.random() * edges.length);
      pulses.push({ edgeIdx, t: Math.random(), speed: 0.002 + Math.random() * 0.005 });
      const isWhite = Math.random() < 0.25;
      const c = isWhite ? new THREE.Color(0xffffff) : new THREE.Color(edges[edgeIdx].color);
      pulseColors[i * 3] = c.r;
      pulseColors[i * 3 + 1] = c.g;
      pulseColors[i * 3 + 2] = c.b;
    }
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePos, 3));
    pulseGeo.setAttribute("color", new THREE.BufferAttribute(pulseColors, 3));
    const pulseMat = new THREE.PointsMaterial({ size: 0.12, transparent: true, opacity: 0.85, vertexColors: true, sizeAttenuation: true });
    treeGroup.add(new THREE.Points(pulseGeo, pulseMat));

    // Trail particles (afterglow)
    const TRAIL_COUNT = 180;
    const trailPos = new Float32Array(TRAIL_COUNT * 3);
    const trailColors = new Float32Array(TRAIL_COUNT * 3);
    const trailOpacities = new Float32Array(TRAIL_COUNT);
    let trailIdx = 0;
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
    trailGeo.setAttribute("color", new THREE.BufferAttribute(trailColors, 3));
    const trailMat = new THREE.PointsMaterial({ size: 0.06, transparent: true, opacity: 0.4, vertexColors: true, sizeAttenuation: true });
    treeGroup.add(new THREE.Points(trailGeo, trailMat));

    // Ambient particles
    const AMB_COUNT = 300;
    const ambPos = new Float32Array(AMB_COUNT * 3);
    const ambVel = new Float32Array(AMB_COUNT * 3);
    for (let i = 0; i < AMB_COUNT; i++) {
      ambPos[i * 3] = (Math.random() - 0.5) * 50;
      ambPos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      ambPos[i * 3 + 2] = (Math.random() - 0.5) * 25;
      ambVel[i * 3] = (Math.random() - 0.5) * 0.001;
      ambVel[i * 3 + 1] = (Math.random() - 0.5) * 0.001;
      ambVel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    const ambGeo = new THREE.BufferGeometry();
    ambGeo.setAttribute("position", new THREE.BufferAttribute(ambPos, 3));
    const ambMat = new THREE.PointsMaterial({ size: 0.03, color: 0x334455, transparent: true, opacity: 0.2, sizeAttenuation: true });
    treeGroup.add(new THREE.Points(ambGeo, ambMat));

    // Pathway label sprites
    PATHWAYS.forEach((pw, pi) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = `#${new THREE.Color(pw.color).getHexString()}`;
      ctx.font = "bold 20px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      const lines = pw.label.split("\n");
      lines.forEach((line, li) => ctx.fillText(line, 128, 50 + li * 28));

      const tex = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.5 });
      const sprite = new THREE.Sprite(spriteMat);
      const xBase = (pi - 1.5) * spread;
      sprite.position.set(xBase, 8 - 2.2 * 3.5 - 2, 0);
      sprite.scale.set(4, 2, 1);
      treeGroup.add(sprite);
    });

    // Mouse parallax
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    let frame = 0;
    const lookTarget = new THREE.Vector3(0, 2, 0);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      frame++;

      treeGroup.rotation.y += 0.0005;
      treeGroup.rotation.x = Math.sin(frame * 0.0002) * 0.06;

      // Hub pulse
      hubMeshes.forEach((mesh, i) => {
        const s = 0.5 * (1 + Math.sin(frame * 0.003 + i * 2) * 0.15);
        mesh.scale.setScalar(s);
      });

      // Diamond rotation + pulse
      diamondMeshes.forEach((mesh, i) => {
        mesh.rotation.y += 0.005;
        const s = 0.3 * (1 + Math.sin(frame * 0.004 + i) * 0.15);
        mesh.scale.setScalar(s);
      });

      // Pulses
      const pArr = pulseGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < PULSE_COUNT; i++) {
        const p = pulses[i];
        p.t += p.speed;
        if (p.t >= 1) {
          p.t = 0;
          p.edgeIdx = Math.floor(Math.random() * edges.length);
          const isWhite = Math.random() < 0.25;
          const c = isWhite ? new THREE.Color(0xffffff) : new THREE.Color(edges[p.edgeIdx].color);
          pulseColors[i * 3] = c.r;
          pulseColors[i * 3 + 1] = c.g;
          pulseColors[i * 3 + 2] = c.b;
        }
        const e = edges[p.edgeIdx];
        const a = nodes[e.from].pos, b = nodes[e.to].pos;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const z = a.z + (b.z - a.z) * p.t;
        pArr[i * 3] = x;
        pArr[i * 3 + 1] = y;
        pArr[i * 3 + 2] = z;

        // Trail
        if (frame % 3 === 0 && i < 20) {
          const ti = trailIdx % TRAIL_COUNT;
          trailPos[ti * 3] = x;
          trailPos[ti * 3 + 1] = y;
          trailPos[ti * 3 + 2] = z;
          trailColors[ti * 3] = pulseColors[i * 3];
          trailColors[ti * 3 + 1] = pulseColors[i * 3 + 1];
          trailColors[ti * 3 + 2] = pulseColors[i * 3 + 2];
          trailOpacities[ti] = 1;
          trailIdx++;
        }
      }
      pulseGeo.attributes.position.needsUpdate = true;
      pulseGeo.attributes.color.needsUpdate = true;

      // Fade trails
      for (let i = 0; i < TRAIL_COUNT; i++) {
        trailOpacities[i] *= 0.97;
      }
      trailGeo.attributes.position.needsUpdate = true;
      trailGeo.attributes.color.needsUpdate = true;

      // Ambient drift
      const aArr = ambGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < AMB_COUNT; i++) {
        aArr[i * 3] += ambVel[i * 3];
        aArr[i * 3 + 1] += ambVel[i * 3 + 1];
        aArr[i * 3 + 2] += ambVel[i * 3 + 2];
        if (Math.abs(aArr[i * 3]) > 25) ambVel[i * 3] *= -1;
        if (Math.abs(aArr[i * 3 + 1]) > 15) ambVel[i * 3 + 1] *= -1;
        if (Math.abs(aArr[i * 3 + 2]) > 12) ambVel[i * 3 + 2] *= -1;
      }
      ambGeo.attributes.position.needsUpdate = true;

      // Parallax
      lookTarget.x += (mouse.x * 2 - lookTarget.x) * 0.015;
      lookTarget.y += (-mouse.y * 1.5 + 2 - lookTarget.y) * 0.015;
      camera.lookAt(lookTarget);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      sphereGeo.dispose(); diamondGeo.dispose(); glowCircleGeo.dispose();
      pulseGeo.dispose(); trailGeo.dispose(); ambGeo.dispose();
      pulseMat.dispose(); trailMat.dispose(); ambMat.dispose();
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Radial vignette */}
      <div className="absolute inset-0 z-[5] pointer-events-none" style={{
        background: "radial-gradient(ellipse 50% 50% at 50% 50%, transparent 0%, #0a0c0f 100%)",
      }} />

      {/* Film grain overlay */}
      <div className="absolute inset-0 z-[6] pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }} />

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-24">
        <div className="max-w-3xl flex flex-col">
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8"
          >
            <FacetedCrownLogo size={80} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-white font-semibold"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              textShadow: "0 0 40px rgba(0,0,0,0.8)",
            }}
          >
            Unlocking the proactive healthcare patients deserve.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-6 text-lg text-white/50"
            style={{
              maxWidth: 640,
              lineHeight: 1.7,
              letterSpacing: "-0.01em",
              textShadow: "0 0 20px rgba(0,0,0,0.6)",
            }}
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
              className="text-[13px] font-medium uppercase text-white border border-white/40 bg-transparent px-8 py-3.5 transition-all duration-300 hover:bg-white hover:text-[#1a1d21]"
              style={{ letterSpacing: "0.05em" }}
            >
              Request Demo
            </a>
            <a
              href="#pipeline"
              className="text-[13px] font-medium uppercase text-white border border-white/20 bg-transparent px-8 py-3.5 transition-all duration-300 hover:bg-white hover:text-[#1a1d21]"
              style={{ letterSpacing: "0.05em" }}
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
        <span className="text-[10px] font-medium uppercase text-white/20" style={{ letterSpacing: "0.3em" }}>
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