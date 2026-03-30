import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import FacetedCrownLogo from "./FacetedCrownLogo";

const BG = 0x0a0c0f;
const TEAL = 0x00d4aa;
const LILAC = 0x8a7cc8;

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
    scene.fog = new THREE.FogExp2(BG, 0.012);
    const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 400);
    camera.position.set(0, 0, 50);

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // ─── LAYER 1: Small morphing core (off-center, subtle) ───
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0, 0);
    worldGroup.add(coreGroup);

    const icoGeo = new THREE.IcosahedronGeometry(4, 1);
    const icoWire = new THREE.WireframeGeometry(icoGeo);
    const icoMat = new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0.08 });
    const icoMesh = new THREE.LineSegments(icoWire, icoMat);
    coreGroup.add(icoMesh);

    const octGeo = new THREE.OctahedronGeometry(2.5, 0);
    const octWire = new THREE.WireframeGeometry(octGeo);
    const octMat = new THREE.LineBasicMaterial({ color: LILAC, transparent: true, opacity: 0.06 });
    const octMesh = new THREE.LineSegments(octWire, octMat);
    coreGroup.add(octMesh);

    // ─── LAYER 2: Wide-spread network — fills viewport corners ───
    const NODE_COUNT = 900;
    const nodePositions: THREE.Vector3[] = [];
    const nodeRoles: number[] = [];
    const edgePairs: [number, number][] = [];

    // Aspect-aware spread
    const aspect = container.clientWidth / container.clientHeight;
    const spreadX = 55 * aspect;
    const spreadY = 45;

    // Corner clusters — dense groups at 4 corners + edges
    const corners = [
      { x: -spreadX * 0.7, y: spreadY * 0.6 },   // top-left
      { x: spreadX * 0.7, y: spreadY * 0.6 },    // top-right
      { x: -spreadX * 0.7, y: -spreadY * 0.6 },  // bottom-left
      { x: spreadX * 0.7, y: -spreadY * 0.6 },   // bottom-right
      { x: -spreadX * 0.85, y: 0 },               // mid-left
      { x: spreadX * 0.85, y: 0 },                // mid-right
      { x: 0, y: spreadY * 0.75 },                // top-center
      { x: 0, y: -spreadY * 0.75 },               // bottom-center
    ];

    // 320 nodes in corner clusters
    for (let ci = 0; ci < corners.length; ci++) {
      const c = corners[ci];
      const count = ci < 4 ? 50 : 30;
      for (let i = 0; i < count; i++) {
        const r = 6 + Math.random() * 8;
        const a = Math.random() * Math.PI * 2;
        const z = (Math.random() - 0.5) * 12;
        nodePositions.push(new THREE.Vector3(
          c.x + Math.cos(a) * r,
          c.y + Math.sin(a) * r,
          z
        ));
        nodeRoles.push(0);
      }
    }

    // 300 nodes along edges/periphery — rectangular distribution biased outward
    for (let i = 0; i < 300; i++) {
      const side = Math.random();
      let x: number, y: number;
      if (side < 0.25) { // top edge
        x = (Math.random() - 0.5) * spreadX * 1.6;
        y = spreadY * (0.3 + Math.random() * 0.5);
      } else if (side < 0.5) { // bottom edge
        x = (Math.random() - 0.5) * spreadX * 1.6;
        y = -spreadY * (0.3 + Math.random() * 0.5);
      } else if (side < 0.75) { // left edge
        x = -spreadX * (0.3 + Math.random() * 0.6);
        y = (Math.random() - 0.5) * spreadY * 1.4;
      } else { // right edge
        x = spreadX * (0.3 + Math.random() * 0.6);
        y = (Math.random() - 0.5) * spreadY * 1.4;
      }
      const z = (Math.random() - 0.5) * 20;
      nodePositions.push(new THREE.Vector3(x, y, z));
      nodeRoles.push(1);
    }

    // 180 mid-field nodes — ring around center (not IN center)
    for (let i = 0; i < 180; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 15 + Math.random() * 20;
      const z = (Math.random() - 0.5) * 15;
      nodePositions.push(new THREE.Vector3(
        Math.cos(angle) * r,
        Math.sin(angle) * r * 0.7,
        z
      ));
      nodeRoles.push(1);
    }

    // 100 sparse sentinel nodes — very far out, faint
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 40 + Math.random() * 25;
      nodePositions.push(new THREE.Vector3(
        Math.cos(angle) * r * aspect,
        Math.sin(angle) * r * 0.8,
        (Math.random() - 0.5) * 30
      ));
      nodeRoles.push(2);
    }

    // Connect nearby nodes
    for (let i = 0; i < NODE_COUNT; i++) {
      let connections = 0;
      const maxConn = nodeRoles[i] === 0 ? 5 : nodeRoles[i] === 1 ? 4 : 2;
      const maxDist = nodeRoles[i] === 0 ? 10 : nodeRoles[i] === 1 ? 12 : 18;
      for (let j = i + 1; j < NODE_COUNT && connections < maxConn; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < maxDist) {
          edgePairs.push([i, j]);
          connections++;
        }
      }
    }

    // Long-range cross-cluster tendrils
    for (let ci = 0; ci < corners.length; ci++) {
      const clusterStart = ci < 4 ? ci * 50 : 200 + (ci - 4) * 30;
      const clusterEnd = ci < 4 ? clusterStart + 50 : clusterStart + 30;
      for (let i = clusterStart; i < clusterEnd; i += 5) {
        let best = -1, bestDist = 999;
        for (let j = 320; j < 620; j++) {
          const d = nodePositions[i].distanceTo(nodePositions[j]);
          if (d < bestDist) { bestDist = d; best = j; }
        }
        if (best >= 0 && bestDist < 40) edgePairs.push([i, best]);
      }
    }

    // Node points
    const nodeGeoPos = new Float32Array(NODE_COUNT * 3);
    const nodeSizes = new Float32Array(NODE_COUNT);
    const nodeIntensity = new Float32Array(NODE_COUNT);
    for (let i = 0; i < NODE_COUNT; i++) {
      nodeGeoPos[i * 3] = nodePositions[i].x;
      nodeGeoPos[i * 3 + 1] = nodePositions[i].y;
      nodeGeoPos[i * 3 + 2] = nodePositions[i].z;
      nodeSizes[i] = nodeRoles[i] === 0 ? 0.10 + Math.random() * 0.08 : nodeRoles[i] === 1 ? 0.06 + Math.random() * 0.06 : 0.04 + Math.random() * 0.04;
      nodeIntensity[i] = nodeRoles[i] === 0 ? 0.9 : nodeRoles[i] === 1 ? 0.5 : 0.2;
    }
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodeGeoPos, 3));
    nodeGeo.setAttribute("size", new THREE.BufferAttribute(nodeSizes, 1));
    nodeGeo.setAttribute("intensity", new THREE.BufferAttribute(nodeIntensity, 1));

    const nodeMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uTeal: { value: new THREE.Color(TEAL) },
        uWhite: { value: new THREE.Color(0xccddee) },
      },
      vertexShader: `
        attribute float size;
        attribute float intensity;
        varying float vDist;
        varying float vIntensity;
        uniform float uTime;
        void main() {
          vIntensity = intensity;
          float pulse = 1.0 + sin(uTime * 1.5 + position.x * 0.3 + position.y * 0.2) * 0.2 * intensity;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vDist = -mvPos.z;
          gl_PointSize = size * pulse * (280.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uTeal;
        uniform vec3 uWhite;
        varying float vDist;
        varying float vIntensity;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          if (d > 1.0) discard;
          float brightness = clamp(1.0 - (vDist - 10.0) / 60.0, 0.08, 1.0);
          vec3 col = mix(uWhite, uTeal, vIntensity);
          float glow = (1.0 - d * d) * brightness * (0.3 + vIntensity * 0.5);
          gl_FragColor = vec4(col, glow);
        }
      `,
    });
    worldGroup.add(new THREE.Points(nodeGeo, nodeMat));

    // Edges
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
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x1a3040, transparent: true, opacity: 0.10 });
    worldGroup.add(new THREE.LineSegments(edgeGeo, edgeMat));

    // Pulse illumination
    const PULSE_COUNT = 25;
    interface PulseInfo { origin: THREE.Vector3; radius: number; life: number; maxLife: number; color: THREE.Color; speed: number; }
    const activePulses: PulseInfo[] = [];
    const pulseEdgeColors = new Float32Array(edgePairs.length * 6);
    const pulseEdgeGeo = new THREE.BufferGeometry();
    pulseEdgeGeo.setAttribute("position", new THREE.BufferAttribute(edgePositions.slice(), 3));
    pulseEdgeGeo.setAttribute("color", new THREE.BufferAttribute(pulseEdgeColors, 3));
    const pulseEdgeMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.65 });
    worldGroup.add(new THREE.LineSegments(pulseEdgeGeo, pulseEdgeMat));

    // Data-flow particles
    const FLOW_COUNT = 300;
    interface FlowParticle { edgeIdx: number; t: number; speed: number; }
    const flows: FlowParticle[] = [];
    for (let i = 0; i < FLOW_COUNT; i++) {
      flows.push({
        edgeIdx: Math.floor(Math.random() * edgePairs.length),
        t: Math.random(),
        speed: 0.004 + Math.random() * 0.01,
      });
    }
    const flowPos = new Float32Array(FLOW_COUNT * 3);
    const flowGeo = new THREE.BufferGeometry();
    flowGeo.setAttribute("position", new THREE.BufferAttribute(flowPos, 3));
    const flowMat = new THREE.PointsMaterial({
      size: 0.07, color: TEAL, transparent: true, opacity: 0.5,
      sizeAttenuation: true, blending: THREE.AdditiveBlending,
    });
    worldGroup.add(new THREE.Points(flowGeo, flowMat));

    // ─── LAYER 3: Scanning grid plane — sentient awareness ───
    const gridGroup = new THREE.Group();
    worldGroup.add(gridGroup);
    const gridSize = 120;
    const gridDiv = 40;
    const gridGeo = new THREE.PlaneGeometry(gridSize, gridSize * 0.6, gridDiv, Math.floor(gridDiv * 0.6));
    const gridMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      wireframe: true,
      uniforms: {
        uTime: { value: 0 },
        uScanPos: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPos;
        void main() {
          vUv = uv;
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uScanPos;
        varying vec2 vUv;
        varying vec3 vPos;
        void main() {
          float scanLine = 1.0 - smoothstep(0.0, 8.0, abs(vPos.x - uScanPos));
          float base = 0.012;
          float edgeFade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(0.0, 0.15, 1.0 - vUv.x) * smoothstep(0.0, 0.2, vUv.y) * smoothstep(0.0, 0.2, 1.0 - vUv.y);
          float alpha = (base + scanLine * 0.06) * edgeFade;
          vec3 col = mix(vec3(0.15, 0.25, 0.3), vec3(0.0, 0.83, 0.67), scanLine * 0.5);
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    gridMesh.rotation.x = -Math.PI * 0.42;
    gridMesh.position.y = -8;
    gridMesh.position.z = -10;
    gridGroup.add(gridMesh);

    // ─── Orbital rings — wider ───
    const ringGroup = new THREE.Group();
    worldGroup.add(ringGroup);
    const ringRadii = [18, 28, 42];
    const ringMeshes: THREE.Line[] = [];
    ringRadii.forEach((r, ri) => {
      const pts: THREE.Vector3[] = [];
      const segs = 96 + ri * 16;
      for (let j = 0; j <= segs; j++) {
        const angle = (j / segs) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(angle) * r, 0, Math.sin(angle) * r));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color: ri === 0 ? TEAL : 0x334455, transparent: true, opacity: 0.04 - ri * 0.008 });
      const line = new THREE.Line(geo, mat);
      line.rotation.x = Math.PI * 0.35 + ri * 0.08;
      line.rotation.z = ri * 0.25;
      ringGroup.add(line);
      ringMeshes.push(line);
    });

    // ─── Ambient particles ───
    const AMBIENT_COUNT = 600;
    const ambPos = new Float32Array(AMBIENT_COUNT * 3);
    const ambVel = new Float32Array(AMBIENT_COUNT * 3);
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      ambPos[i * 3] = (Math.random() - 0.5) * 120;
      ambPos[i * 3 + 1] = (Math.random() - 0.5) * 70;
      ambPos[i * 3 + 2] = (Math.random() - 0.5) * 50;
      ambVel[i * 3] = (Math.random() - 0.5) * 0.005;
      ambVel[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      ambVel[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }
    const ambGeo = new THREE.BufferGeometry();
    ambGeo.setAttribute("position", new THREE.BufferAttribute(ambPos, 3));
    const ambMat = new THREE.PointsMaterial({ size: 0.04, color: 0x445566, transparent: true, opacity: 0.15, sizeAttenuation: true });
    worldGroup.add(new THREE.Points(ambGeo, ambMat));

    // ─── Mouse + resize ───
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

    // ─── ANIMATION ───
    let raf = 0;
    let frame = 0;
    const tealColor = new THREE.Color(TEAL);
    const lilacColor = new THREE.Color(LILAC);
    const whiteColor = new THREE.Color(0xffffff);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      frame++;
      const t = frame * 0.001;

      // Core morph — subtle, not distracting
      coreGroup.rotation.y += 0.001;
      coreGroup.rotation.x = Math.sin(t * 0.5) * 0.12;
      icoMesh.scale.setScalar(1 + Math.sin(t * 1.5) * 0.05);
      octMesh.rotation.x += 0.0018;
      octMesh.rotation.z -= 0.001;
      octMesh.scale.setScalar(1 + Math.sin(t * 2 + 1) * 0.08);

      // Scanning grid sweep
      const scanX = Math.sin(t * 0.4) * 60;
      (gridMat.uniforms as any).uScanPos.value = scanX;
      (gridMat.uniforms as any).uTime.value = t;

      // Rings
      ringMeshes.forEach((r, i) => {
        r.rotation.y += 0.0004 * (i + 1) * (i % 2 === 0 ? 1 : -1);
      });

      // Spawn pulses from corners
      if (frame % 25 === 0 && activePulses.length < PULSE_COUNT) {
        const originIdx = Math.floor(Math.random() * NODE_COUNT);
        const colorChoice = Math.random();
        activePulses.push({
          origin: nodePositions[originIdx].clone(),
          radius: 0,
          life: 0,
          maxLife: 80 + Math.random() * 100,
          color: colorChoice < 0.55 ? tealColor : colorChoice < 0.8 ? whiteColor : lilacColor,
          speed: 0.15 + Math.random() * 0.2,
        });
      }

      // Pulse edge illumination
      pulseEdgeColors.fill(0);
      for (let pi = activePulses.length - 1; pi >= 0; pi--) {
        const pulse = activePulses[pi];
        pulse.life++;
        pulse.radius += pulse.speed;
        const intensity = Math.max(0, 1 - pulse.life / pulse.maxLife);
        if (pulse.life > pulse.maxLife) { activePulses.splice(pi, 1); continue; }

        for (let ei = 0; ei < edgePairs.length; ei++) {
          const [a, b] = edgePairs[ei];
          const midX = (nodePositions[a].x + nodePositions[b].x) * 0.5;
          const midY = (nodePositions[a].y + nodePositions[b].y) * 0.5;
          const midZ = (nodePositions[a].z + nodePositions[b].z) * 0.5;
          const dx = midX - pulse.origin.x, dy = midY - pulse.origin.y, dz = midZ - pulse.origin.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const ringDist = Math.abs(dist - pulse.radius);
          if (ringDist < 3) {
            const glow = intensity * Math.max(0, 1 - ringDist / 3) * 0.6;
            for (let v = 0; v < 2; v++) {
              const ci = ei * 6 + v * 3;
              pulseEdgeColors[ci] = Math.min(1, pulseEdgeColors[ci] + pulse.color.r * glow);
              pulseEdgeColors[ci + 1] = Math.min(1, pulseEdgeColors[ci + 1] + pulse.color.g * glow);
              pulseEdgeColors[ci + 2] = Math.min(1, pulseEdgeColors[ci + 2] + pulse.color.b * glow);
            }
          }
        }
      }
      pulseEdgeGeo.attributes.color.needsUpdate = true;

      // Data-flow particles
      const fArr = flowGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < FLOW_COUNT; i++) {
        const f = flows[i];
        f.t += f.speed;
        if (f.t > 1) {
          f.t = 0;
          f.edgeIdx = Math.floor(Math.random() * edgePairs.length);
          f.speed = 0.004 + Math.random() * 0.01;
        }
        const [a, b] = edgePairs[f.edgeIdx];
        const pa = nodePositions[a], pb = nodePositions[b];
        fArr[i * 3] = pa.x + (pb.x - pa.x) * f.t;
        fArr[i * 3 + 1] = pa.y + (pb.y - pa.y) * f.t;
        fArr[i * 3 + 2] = pa.z + (pb.z - pa.z) * f.t;
      }
      flowGeo.attributes.position.needsUpdate = true;

      // Ambient drift
      const aArr = ambGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < AMBIENT_COUNT; i++) {
        aArr[i * 3] += ambVel[i * 3];
        aArr[i * 3 + 1] += ambVel[i * 3 + 1];
        aArr[i * 3 + 2] += ambVel[i * 3 + 2];
        if (Math.abs(aArr[i * 3]) > 60) ambVel[i * 3] *= -1;
        if (Math.abs(aArr[i * 3 + 1]) > 35) ambVel[i * 3 + 1] *= -1;
        if (Math.abs(aArr[i * 3 + 2]) > 25) ambVel[i * 3 + 2] *= -1;
      }
      ambGeo.attributes.position.needsUpdate = true;

      // Node shader time
      (nodeMat.uniforms as any).uTime.value = t * 3;

      // Camera parallax — wider range
      camera.position.x += (mouse.x * 3 - camera.position.x) * 0.012;
      camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.012;
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
      nodeGeo.dispose(); edgeGeo.dispose(); pulseEdgeGeo.dispose(); ambGeo.dispose(); flowGeo.dispose();
      nodeMat.dispose(); edgeMat.dispose(); pulseEdgeMat.dispose(); ambMat.dispose(); flowMat.dispose();
      icoGeo.dispose(); icoMat.dispose(); octGeo.dispose(); octMat.dispose();
      gridGeo.dispose(); gridMat.dispose();
      ringMeshes.forEach(r => { r.geometry.dispose(); (r.material as THREE.Material).dispose(); });
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
            className="mb-12"
          >
            <FacetedCrownLogo size={72} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-white font-light"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              textShadow: "0 0 60px rgba(0,0,0,0.9), 0 0 120px rgba(0,0,0,0.5)",
            }}
          >
            Unlocking proactive healthcare for all.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 text-lg text-white/50"
            style={{
              maxWidth: 960,
              lineHeight: 1.7,
              letterSpacing: "-0.01em",
              textShadow: "0 0 30px rgba(0,0,0,0.8)",
            }}
          >
            <p>
              Medient compiles every clinical guideline into deterministic,
              formally verified decision infrastructure; bridging AI and
              evidence-based care across every data source, every EHR, every
              patient encounter.
            </p>
            <div className="flex flex-row flex-wrap items-center justify-center gap-5 mt-6">
              {["Zero hallucination.", "Zero inference.", "Total clinical authority."].map((text) => (
                <span key={text} className="inline-flex items-center gap-2 text-white/60">
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                    style={{ background: "#00d4aa", boxShadow: "0 0 6px rgba(0,212,170,0.6)" }}
                  />
                  {text}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-10 flex flex-row gap-6"
          >
            <a
              href="#contact"
              className="group relative text-[13px] font-medium uppercase text-white/80 px-8 py-3.5 transition-all duration-500 overflow-hidden"
              style={{ letterSpacing: "0.08em" }}
            >
              <span className="absolute inset-0 border border-[#00d4aa]/[0.15] bg-gradient-to-b from-[#00d4aa]/[0.06] to-[#00d4aa]/[0.02] transition-all duration-500 group-hover:border-[#00d4aa]/30 group-hover:from-[#00d4aa]/[0.12] group-hover:to-[#00d4aa]/[0.04]" />
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.04] to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">Request Demo</span>
            </a>
            <a
              href="#pipeline"
              className="group relative text-[13px] font-medium uppercase text-white/80 px-8 py-3.5 transition-all duration-500 overflow-hidden"
              style={{ letterSpacing: "0.08em" }}
            >
              <span className="absolute inset-0 border border-[#00d4aa]/[0.10] bg-gradient-to-b from-[#00d4aa]/[0.04] to-[#00d4aa]/[0.01] transition-all duration-500 group-hover:border-[#00d4aa]/20 group-hover:from-[#00d4aa]/[0.08] group-hover:to-[#00d4aa]/[0.03]" />
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.04] to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">Read White Paper</span>
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
