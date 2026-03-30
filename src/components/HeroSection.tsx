import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import FacetedCrownLogo from "./FacetedCrownLogo";

const BG = 0x0a0c0f;
const TEAL = 0x00d4aa;

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
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 200);
    camera.position.set(0, 0, 30);

    const meshGroup = new THREE.Group();
    scene.add(meshGroup);

    // Generate a massive spherical/toroidal neural mesh
    const NODE_COUNT = 400;
    const nodePositions: THREE.Vector3[] = [];
    const edgePairs: [number, number][] = [];

    // Create nodes on a toroidal surface with some randomization
    for (let i = 0; i < NODE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      const R = 12 + Math.sin(phi * 3) * 2; // Major radius with variation
      const r = 5 + Math.random() * 2; // Minor radius
      const x = (R + r * Math.cos(phi)) * Math.cos(theta) + (Math.random() - 0.5) * 2;
      const y = r * Math.sin(phi) + (Math.random() - 0.5) * 2;
      const z = (R + r * Math.cos(phi)) * Math.sin(theta) + (Math.random() - 0.5) * 2;
      nodePositions.push(new THREE.Vector3(x, y, z));
    }

    // Connect nearby nodes
    const CONNECTION_DIST = 6;
    for (let i = 0; i < NODE_COUNT; i++) {
      let connections = 0;
      for (let j = i + 1; j < NODE_COUNT && connections < 4; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < CONNECTION_DIST) {
          edgePairs.push([i, j]);
          connections++;
        }
      }
    }

    // Node points
    const nodeGeoPos = new Float32Array(NODE_COUNT * 3);
    const nodeSizes = new Float32Array(NODE_COUNT);
    for (let i = 0; i < NODE_COUNT; i++) {
      nodeGeoPos[i * 3] = nodePositions[i].x;
      nodeGeoPos[i * 3 + 1] = nodePositions[i].y;
      nodeGeoPos[i * 3 + 2] = nodePositions[i].z;
      nodeSizes[i] = 0.06 + Math.random() * 0.08;
    }
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodeGeoPos, 3));
    nodeGeo.setAttribute("size", new THREE.BufferAttribute(nodeSizes, 1));

    // Custom shader for depth-based brightness
    const nodeMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uCameraPos: { value: camera.position },
        uColor: { value: new THREE.Color(0xccdddd) },
        uTeal: { value: new THREE.Color(TEAL) },
        uTime: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        varying float vDist;
        varying vec3 vWorldPos;
        void main() {
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vDist = -mvPos.z;
          vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_PointSize = size * (200.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vDist;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          if (d > 1.0) discard;
          float brightness = clamp(1.0 - (vDist - 10.0) / 40.0, 0.15, 1.0);
          float alpha = (1.0 - d * d) * brightness * 0.7;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });
    meshGroup.add(new THREE.Points(nodeGeo, nodeMat));

    // Edges as line segments with low opacity
    const edgePositions = new Float32Array(edgePairs.length * 6);
    for (let i = 0; i < edgePairs.length; i++) {
      const [a, b] = edgePairs[i];
      edgePositions[i * 6] = nodePositions[a].x;
      edgePositions[i * 6 + 1] = nodePositions[a].y;
      edgePositions[i * 6 + 2] = nodePositions[a].z;
      edgePositions[i * 6 + 3] = nodePositions[b].x;
      edgePositions[i * 6 + 4] = nodePositions[b].y;
      edgePositions[i * 6 + 5] = nodePositions[b].z;
    }
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(edgePositions, 3));
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x334455, transparent: true, opacity: 0.08 });
    meshGroup.add(new THREE.LineSegments(edgeGeo, edgeMat));

    // Pulse system — teal ripples from random nodes
    const PULSE_COUNT = 12;
    interface PulseInfo { origin: THREE.Vector3; radius: number; life: number; maxLife: number; }
    const activePulses: PulseInfo[] = [];
    const pulseEdgeColors = new Float32Array(edgePairs.length * 6);
    const pulseEdgeGeo = new THREE.BufferGeometry();
    pulseEdgeGeo.setAttribute("position", new THREE.BufferAttribute(edgePositions.slice(), 3));
    pulseEdgeGeo.setAttribute("color", new THREE.BufferAttribute(pulseEdgeColors, 3));
    const pulseEdgeMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.5 });
    meshGroup.add(new THREE.LineSegments(pulseEdgeGeo, pulseEdgeMat));

    // Ambient micro-particles
    const AMBIENT_COUNT = 350;
    const ambPos = new Float32Array(AMBIENT_COUNT * 3);
    const ambVel = new Float32Array(AMBIENT_COUNT * 3);
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      ambPos[i * 3] = (Math.random() - 0.5) * 60;
      ambPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      ambPos[i * 3 + 2] = (Math.random() - 0.5) * 30;
      ambVel[i * 3] = (Math.random() - 0.5) * 0.003;
      ambVel[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      ambVel[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }
    const ambGeo = new THREE.BufferGeometry();
    ambGeo.setAttribute("position", new THREE.BufferAttribute(ambPos, 3));
    const ambMat = new THREE.PointsMaterial({ size: 0.04, color: 0x556677, transparent: true, opacity: 0.15, sizeAttenuation: true });
    meshGroup.add(new THREE.Points(ambGeo, ambMat));

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
    const tealColor = new THREE.Color(TEAL);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      frame++;

      // Slow rotation + breathing
      meshGroup.rotation.y += 0.0005;
      const breathe = 0.98 + Math.sin(frame * 0.001) * 0.02;
      meshGroup.scale.setScalar(breathe);

      // Spawn pulses
      if (frame % 60 === 0 && activePulses.length < PULSE_COUNT) {
        const originIdx = Math.floor(Math.random() * NODE_COUNT);
        activePulses.push({
          origin: nodePositions[originIdx].clone(),
          radius: 0,
          life: 0,
          maxLife: 120 + Math.random() * 60,
        });
      }

      // Reset pulse edge colors
      pulseEdgeColors.fill(0);

      // Update pulses and illuminate edges
      for (let pi = activePulses.length - 1; pi >= 0; pi--) {
        const pulse = activePulses[pi];
        pulse.life++;
        pulse.radius += 0.15;
        const intensity = Math.max(0, 1 - pulse.life / pulse.maxLife);

        if (pulse.life > pulse.maxLife) {
          activePulses.splice(pi, 1);
          continue;
        }

        for (let ei = 0; ei < edgePairs.length; ei++) {
          const [a, b] = edgePairs[ei];
          const midX = (nodePositions[a].x + nodePositions[b].x) * 0.5;
          const midY = (nodePositions[a].y + nodePositions[b].y) * 0.5;
          const midZ = (nodePositions[a].z + nodePositions[b].z) * 0.5;
          const dx = midX - pulse.origin.x;
          const dy = midY - pulse.origin.y;
          const dz = midZ - pulse.origin.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const ringDist = Math.abs(dist - pulse.radius);
          if (ringDist < 2) {
            const glow = intensity * Math.max(0, 1 - ringDist / 2) * 0.6;
            for (let v = 0; v < 2; v++) {
              const ci = ei * 6 + v * 3;
              pulseEdgeColors[ci] = Math.min(1, pulseEdgeColors[ci] + tealColor.r * glow);
              pulseEdgeColors[ci + 1] = Math.min(1, pulseEdgeColors[ci + 1] + tealColor.g * glow);
              pulseEdgeColors[ci + 2] = Math.min(1, pulseEdgeColors[ci + 2] + tealColor.b * glow);
            }
          }
        }
      }
      pulseEdgeGeo.attributes.color.needsUpdate = true;

      // Ambient drift
      const aArr = ambGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < AMBIENT_COUNT; i++) {
        aArr[i * 3] += ambVel[i * 3];
        aArr[i * 3 + 1] += ambVel[i * 3 + 1];
        aArr[i * 3 + 2] += ambVel[i * 3 + 2];
        if (Math.abs(aArr[i * 3]) > 30) ambVel[i * 3] *= -1;
        if (Math.abs(aArr[i * 3 + 1]) > 20) ambVel[i * 3 + 1] *= -1;
        if (Math.abs(aArr[i * 3 + 2]) > 15) ambVel[i * 3 + 2] *= -1;
      }
      ambGeo.attributes.position.needsUpdate = true;

      // Camera parallax
      camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.02;
      camera.position.y += (-mouse.y * 1 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      nodeGeo.dispose(); edgeGeo.dispose(); pulseEdgeGeo.dispose(); ambGeo.dispose();
      nodeMat.dispose(); edgeMat.dispose(); pulseEdgeMat.dispose(); ambMat.dispose();
    };
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* 3D canvas — absolute background */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Radial vignette */}
      <div className="absolute inset-0 z-[5] pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 60% at 50% 50%, transparent 0%, #0a0c0f 100%)",
      }} />

      {/* Film grain */}
      <div className="absolute inset-0 z-[6] pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }} />

      {/* Hero content — centered overlay */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div className="max-w-3xl flex flex-col items-center text-center px-6">
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8"
          >
            <FacetedCrownLogo size={72} />
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
              textShadow: "0 0 60px rgba(0,0,0,0.9), 0 0 120px rgba(0,0,0,0.5)",
            }}
          >
            The Clinical Logic Engine.
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
              textShadow: "0 0 30px rgba(0,0,0,0.8)",
            }}
          >
            Medient compiles every clinical guideline into deterministic,
            formally verified decision infrastructure — bridging AI and
            evidence-based care across every data source, every EHR, every
            patient encounter. Zero hallucination. Zero inference. Total
            clinical authority.
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
