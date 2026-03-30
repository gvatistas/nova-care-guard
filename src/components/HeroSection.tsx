import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import FacetedCrownLogo from "./FacetedCrownLogo";

const BG = 0x060809;
const TEAL = 0x00d4aa;
const DEEP_TEAL = 0x007a60;
const LILAC = 0x6a5acd;
const COLD_BLUE = 0x1a2a4a;

const HeroSection = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(BG, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(BG, 0.008);
    const camera = new THREE.PerspectiveCamera(65, container.clientWidth / container.clientHeight, 0.1, 500);
    camera.position.set(0, 0, 55);

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    const aspect = container.clientWidth / container.clientHeight;

    // ─── LAYER 0: Deep nebula fog planes — atmospheric depth ───
    const nebulaGroup = new THREE.Group();
    worldGroup.add(nebulaGroup);
    const nebulaMats: THREE.ShaderMaterial[] = [];

    for (let i = 0; i < 4; i++) {
      const planeGeo = new THREE.PlaneGeometry(200, 120, 1, 1);
      const nebMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uLayer: { value: i },
          uTeal: { value: new THREE.Color(DEEP_TEAL) },
          uBlue: { value: new THREE.Color(COLD_BLUE) },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform float uLayer;
          uniform vec3 uTeal;
          uniform vec3 uBlue;
          varying vec2 vUv;
          
          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
          }
          float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.5;
            for (int i = 0; i < 5; i++) {
              v += a * noise(p);
              p *= 2.0;
              a *= 0.5;
            }
            return v;
          }
          
          void main() {
            float speed = 0.02 + uLayer * 0.008;
            vec2 p = vUv * (2.0 + uLayer * 0.5) + vec2(uTime * speed, uTime * speed * 0.3);
            float n = fbm(p + fbm(p + uTime * 0.01));
            
            float edgeFade = smoothstep(0.0, 0.3, vUv.x) * smoothstep(0.0, 0.3, 1.0 - vUv.x)
                           * smoothstep(0.0, 0.25, vUv.y) * smoothstep(0.0, 0.25, 1.0 - vUv.y);
            
            vec3 col = mix(uBlue, uTeal, n * 0.4);
            float alpha = n * 0.035 * edgeFade * (1.0 - uLayer * 0.15);
            gl_FragColor = vec4(col, alpha);
          }
        `,
      });
      nebulaMats.push(nebMat);
      const plane = new THREE.Mesh(planeGeo, nebMat);
      plane.position.z = -30 - i * 15;
      plane.position.y = (i - 1.5) * 3;
      nebulaGroup.add(plane);
    }

    // ─── LAYER 1: Central sentient core — breathing entity ───
    const coreGroup = new THREE.Group();
    worldGroup.add(coreGroup);

    // Inner dodecahedron — the "brain"
    const dodGeo = new THREE.DodecahedronGeometry(3.5, 0);
    const dodWire = new THREE.WireframeGeometry(dodGeo);
    const dodMat = new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0.06 });
    const dodMesh = new THREE.LineSegments(dodWire, dodMat);
    coreGroup.add(dodMesh);

    const icoGeo = new THREE.IcosahedronGeometry(5, 1);
    const icoWire = new THREE.WireframeGeometry(icoGeo);
    const icoMat = new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0.04 });
    const icoMesh = new THREE.LineSegments(icoWire, icoMat);
    coreGroup.add(icoMesh);

    // Core glow sphere
    const glowGeo = new THREE.SphereGeometry(2, 32, 32);
    const glowMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(TEAL) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
          float rim = 1.0 - abs(dot(vNormal, normalize(-vPos)));
          float pulse = 0.5 + 0.5 * sin(uTime * 0.8);
          float alpha = pow(rim, 3.0) * (0.08 + pulse * 0.04);
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });
    const glowSphere = new THREE.Mesh(glowGeo, glowMat);
    coreGroup.add(glowSphere);

    // ─── LAYER 2: Neural network — vast, mysterious ───
    const NODE_COUNT = 1200;
    const nodePositions: THREE.Vector3[] = [];
    const nodeRoles: number[] = [];
    const edgePairs: [number, number][] = [];

    const spreadX = 65 * aspect;
    const spreadY = 55;

    // Corner clusters — dense
    const corners = [
      { x: -spreadX * 0.75, y: spreadY * 0.65 },
      { x: spreadX * 0.75, y: spreadY * 0.65 },
      { x: -spreadX * 0.75, y: -spreadY * 0.65 },
      { x: spreadX * 0.75, y: -spreadY * 0.65 },
      { x: -spreadX * 0.9, y: 0 },
      { x: spreadX * 0.9, y: 0 },
      { x: 0, y: spreadY * 0.8 },
      { x: 0, y: -spreadY * 0.8 },
    ];

    for (let ci = 0; ci < corners.length; ci++) {
      const c = corners[ci];
      const count = ci < 4 ? 60 : 35;
      for (let i = 0; i < count; i++) {
        const r = 5 + Math.random() * 10;
        const a = Math.random() * Math.PI * 2;
        const z = (Math.random() - 0.5) * 18;
        nodePositions.push(new THREE.Vector3(c.x + Math.cos(a) * r, c.y + Math.sin(a) * r, z));
        nodeRoles.push(0);
      }
    }

    // Edge nodes
    for (let i = 0; i < 350; i++) {
      const side = Math.random();
      let x: number, y: number;
      if (side < 0.25) { x = (Math.random() - 0.5) * spreadX * 1.8; y = spreadY * (0.3 + Math.random() * 0.55); }
      else if (side < 0.5) { x = (Math.random() - 0.5) * spreadX * 1.8; y = -spreadY * (0.3 + Math.random() * 0.55); }
      else if (side < 0.75) { x = -spreadX * (0.3 + Math.random() * 0.65); y = (Math.random() - 0.5) * spreadY * 1.5; }
      else { x = spreadX * (0.3 + Math.random() * 0.65); y = (Math.random() - 0.5) * spreadY * 1.5; }
      nodePositions.push(new THREE.Vector3(x, y, (Math.random() - 0.5) * 25));
      nodeRoles.push(1);
    }

    // Mid-field ring
    for (let i = 0; i < 220; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 12 + Math.random() * 25;
      nodePositions.push(new THREE.Vector3(Math.cos(angle) * r, Math.sin(angle) * r * 0.7, (Math.random() - 0.5) * 18));
      nodeRoles.push(1);
    }

    // Far sentinels
    for (let i = nodePositions.length; i < NODE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 45 + Math.random() * 30;
      nodePositions.push(new THREE.Vector3(Math.cos(angle) * r * aspect, Math.sin(angle) * r * 0.85, (Math.random() - 0.5) * 35));
      nodeRoles.push(2);
    }

    // Connect nearby
    for (let i = 0; i < NODE_COUNT; i++) {
      let connections = 0;
      const maxConn = nodeRoles[i] === 0 ? 6 : nodeRoles[i] === 1 ? 4 : 2;
      const maxDist = nodeRoles[i] === 0 ? 11 : nodeRoles[i] === 1 ? 13 : 20;
      for (let j = i + 1; j < NODE_COUNT && connections < maxConn; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < maxDist) {
          edgePairs.push([i, j]);
          connections++;
        }
      }
    }

    // Cross-cluster tendrils
    for (let ci = 0; ci < corners.length; ci++) {
      const cStart = ci < 4 ? ci * 60 : 240 + (ci - 4) * 35;
      const cEnd = ci < 4 ? cStart + 60 : cStart + 35;
      for (let i = cStart; i < cEnd; i += 4) {
        let best = -1, bestDist = 999;
        for (let j = 380; j < 700; j++) {
          const d = nodePositions[i].distanceTo(nodePositions[j]);
          if (d < bestDist) { bestDist = d; best = j; }
        }
        if (best >= 0 && bestDist < 45) edgePairs.push([i, best]);
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
      nodeSizes[i] = nodeRoles[i] === 0 ? 0.12 + Math.random() * 0.08 : nodeRoles[i] === 1 ? 0.07 + Math.random() * 0.05 : 0.04 + Math.random() * 0.03;
      nodeIntensity[i] = nodeRoles[i] === 0 ? 1.0 : nodeRoles[i] === 1 ? 0.5 : 0.15;
    }
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodeGeoPos, 3));
    nodeGeo.setAttribute("size", new THREE.BufferAttribute(nodeSizes, 1));
    nodeGeo.setAttribute("intensity", new THREE.BufferAttribute(nodeIntensity, 1));

    const nodeMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uTeal: { value: new THREE.Color(TEAL) },
        uWhite: { value: new THREE.Color(0x88aacc) },
      },
      vertexShader: `
        attribute float size;
        attribute float intensity;
        varying float vDist;
        varying float vIntensity;
        uniform float uTime;
        void main() {
          vIntensity = intensity;
          float pulse = 1.0 + sin(uTime * 1.2 + position.x * 0.2 + position.y * 0.15) * 0.25 * intensity;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vDist = -mvPos.z;
          gl_PointSize = size * pulse * (300.0 / -mvPos.z);
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
          float brightness = clamp(1.0 - (vDist - 10.0) / 70.0, 0.05, 1.0);
          vec3 col = mix(uWhite, uTeal, vIntensity);
          float core = exp(-d * d * 4.0) * brightness * vIntensity * 0.8;
          float halo = (1.0 - d) * brightness * 0.15;
          gl_FragColor = vec4(col, core + halo);
        }
      `,
    });
    worldGroup.add(new THREE.Points(nodeGeo, nodeMat));

    // Edges — darker, more mysterious
    const edgePositions = new Float32Array(edgePairs.length * 6);
    for (let i = 0; i < edgePairs.length; i++) {
      const [a, b] = edgePairs[i];
      edgePositions[i * 6] = nodePositions[a].x; edgePositions[i * 6 + 1] = nodePositions[a].y; edgePositions[i * 6 + 2] = nodePositions[a].z;
      edgePositions[i * 6 + 3] = nodePositions[b].x; edgePositions[i * 6 + 4] = nodePositions[b].y; edgePositions[i * 6 + 5] = nodePositions[b].z;
    }
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(edgePositions, 3));
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x0d1a25, transparent: true, opacity: 0.12 });
    worldGroup.add(new THREE.LineSegments(edgeGeo, edgeMat));

    // Pulse illumination
    const PULSE_COUNT = 35;
    interface PulseInfo { origin: THREE.Vector3; radius: number; life: number; maxLife: number; color: THREE.Color; speed: number; }
    const activePulses: PulseInfo[] = [];
    const pulseEdgeColors = new Float32Array(edgePairs.length * 6);
    const pulseEdgeGeo = new THREE.BufferGeometry();
    pulseEdgeGeo.setAttribute("position", new THREE.BufferAttribute(edgePositions.slice(), 3));
    pulseEdgeGeo.setAttribute("color", new THREE.BufferAttribute(pulseEdgeColors, 3));
    const pulseEdgeMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
    worldGroup.add(new THREE.LineSegments(pulseEdgeGeo, pulseEdgeMat));

    // Data-flow particles — more, slower, moodier
    const FLOW_COUNT = 500;
    interface FlowParticle { edgeIdx: number; t: number; speed: number; }
    const flows: FlowParticle[] = [];
    for (let i = 0; i < FLOW_COUNT; i++) {
      flows.push({ edgeIdx: Math.floor(Math.random() * edgePairs.length), t: Math.random(), speed: 0.002 + Math.random() * 0.006 });
    }
    const flowPos = new Float32Array(FLOW_COUNT * 3);
    const flowGeo = new THREE.BufferGeometry();
    flowGeo.setAttribute("position", new THREE.BufferAttribute(flowPos, 3));
    const flowMat = new THREE.PointsMaterial({ size: 0.06, color: TEAL, transparent: true, opacity: 0.45, sizeAttenuation: true, blending: THREE.AdditiveBlending });
    worldGroup.add(new THREE.Points(flowGeo, flowMat));

    // ─── LAYER 3: Scanning awareness plane ───
    const gridSize = 140;
    const gridDiv = 50;
    const gridGeo = new THREE.PlaneGeometry(gridSize, gridSize * 0.6, gridDiv, Math.floor(gridDiv * 0.6));
    const gridMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      wireframe: true,
      uniforms: { uTime: { value: 0 }, uScanPos: { value: 0 }, uScanPos2: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPos;
        void main() { vUv = uv; vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uScanPos;
        uniform float uScanPos2;
        varying vec2 vUv;
        varying vec3 vPos;
        void main() {
          float scan1 = 1.0 - smoothstep(0.0, 6.0, abs(vPos.x - uScanPos));
          float scan2 = 1.0 - smoothstep(0.0, 4.0, abs(vPos.y * 1.67 - uScanPos2));
          float base = 0.008;
          float edgeFade = smoothstep(0.0, 0.12, vUv.x) * smoothstep(0.0, 0.12, 1.0 - vUv.x) * smoothstep(0.0, 0.18, vUv.y) * smoothstep(0.0, 0.18, 1.0 - vUv.y);
          float alpha = (base + scan1 * 0.05 + scan2 * 0.03) * edgeFade;
          vec3 col = mix(vec3(0.06, 0.12, 0.18), vec3(0.0, 0.83, 0.67), (scan1 + scan2) * 0.3);
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    gridMesh.rotation.x = -Math.PI * 0.42;
    gridMesh.position.y = -10;
    gridMesh.position.z = -15;
    worldGroup.add(gridMesh);

    // ─── Orbital rings — ghostly ───
    const ringRadii = [15, 25, 38, 55];
    const ringMeshes: THREE.Line[] = [];
    ringRadii.forEach((r, ri) => {
      const pts: THREE.Vector3[] = [];
      const segs = 120 + ri * 20;
      for (let j = 0; j <= segs; j++) {
        const angle = (j / segs) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(angle) * r, 0, Math.sin(angle) * r));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color: ri === 0 ? TEAL : ri === 1 ? DEEP_TEAL : COLD_BLUE, transparent: true, opacity: 0.025 - ri * 0.004 });
      const line = new THREE.Line(geo, mat);
      line.rotation.x = Math.PI * 0.33 + ri * 0.07;
      line.rotation.z = ri * 0.2;
      worldGroup.add(line);
      ringMeshes.push(line);
    });

    // ─── Ambient particle field — deep space dust ───
    const AMBIENT_COUNT = 900;
    const ambPos = new Float32Array(AMBIENT_COUNT * 3);
    const ambVel = new Float32Array(AMBIENT_COUNT * 3);
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      ambPos[i * 3] = (Math.random() - 0.5) * 160;
      ambPos[i * 3 + 1] = (Math.random() - 0.5) * 90;
      ambPos[i * 3 + 2] = (Math.random() - 0.5) * 60;
      ambVel[i * 3] = (Math.random() - 0.5) * 0.003;
      ambVel[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      ambVel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    const ambGeo = new THREE.BufferGeometry();
    ambGeo.setAttribute("position", new THREE.BufferAttribute(ambPos, 3));
    const ambMat = new THREE.PointsMaterial({ size: 0.035, color: 0x2a3a4a, transparent: true, opacity: 0.12, sizeAttenuation: true, blending: THREE.AdditiveBlending });
    worldGroup.add(new THREE.Points(ambGeo, ambMat));

    // ─── Mouse + resize ───
    const mouse = { x: 0, y: 0, target: { x: 0, y: 0 } };
    const onMouseMove = (e: MouseEvent) => {
      mouse.target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.target.y = (e.clientY / window.innerHeight - 0.5) * 2;
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
    const deepTealColor = new THREE.Color(DEEP_TEAL);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      frame++;
      const t = frame * 0.001;

      // Smooth mouse
      mouse.x += (mouse.target.x - mouse.x) * 0.02;
      mouse.y += (mouse.target.y - mouse.y) * 0.02;

      // Core — slow, breathing, alive
      coreGroup.rotation.y += 0.0006;
      coreGroup.rotation.x = Math.sin(t * 0.3) * 0.08;
      dodMesh.rotation.x += 0.0012;
      dodMesh.rotation.z -= 0.0008;
      const breathe = 1 + Math.sin(t * 0.6) * 0.06;
      dodMesh.scale.setScalar(breathe);
      icoMesh.scale.setScalar(1 + Math.sin(t * 0.4 + 1) * 0.04);
      icoMesh.rotation.y -= 0.0005;
      (glowMat.uniforms as any).uTime.value = t * 3;

      // Nebula time
      nebulaMats.forEach((m) => { (m.uniforms as any).uTime.value = t * 3; });

      // Scanning grid — dual sweep
      const scanX = Math.sin(t * 0.3) * 70;
      const scanY = Math.cos(t * 0.22) * 40;
      (gridMat.uniforms as any).uScanPos.value = scanX;
      (gridMat.uniforms as any).uScanPos2.value = scanY;
      (gridMat.uniforms as any).uTime.value = t;

      // Rings — slow ethereal rotation
      ringMeshes.forEach((r, i) => {
        r.rotation.y += 0.0002 * (i + 1) * (i % 2 === 0 ? 1 : -1);
      });

      // Spawn pulses — from network edges, rippling outward
      if (frame % 18 === 0 && activePulses.length < PULSE_COUNT) {
        const originIdx = Math.floor(Math.random() * NODE_COUNT);
        const colorChoice = Math.random();
        activePulses.push({
          origin: nodePositions[originIdx].clone(),
          radius: 0,
          life: 0,
          maxLife: 100 + Math.random() * 120,
          color: colorChoice < 0.5 ? tealColor : colorChoice < 0.75 ? deepTealColor : lilacColor,
          speed: 0.12 + Math.random() * 0.18,
        });
      }

      // Illuminate edges
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
          if (ringDist < 3.5) {
            const glow = intensity * Math.max(0, 1 - ringDist / 3.5) * 0.5;
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
        if (f.t > 1) { f.t = 0; f.edgeIdx = Math.floor(Math.random() * edgePairs.length); f.speed = 0.002 + Math.random() * 0.006; }
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
        if (Math.abs(aArr[i * 3]) > 80) ambVel[i * 3] *= -1;
        if (Math.abs(aArr[i * 3 + 1]) > 45) ambVel[i * 3 + 1] *= -1;
        if (Math.abs(aArr[i * 3 + 2]) > 30) ambVel[i * 3 + 2] *= -1;
      }
      ambGeo.attributes.position.needsUpdate = true;

      // Node shader
      (nodeMat.uniforms as any).uTime.value = t * 3;

      // Camera — slow, cinematic parallax
      camera.position.x += (mouse.x * 4 - camera.position.x) * 0.008;
      camera.position.y += (-mouse.y * 2.5 - camera.position.y) * 0.008;
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
      dodGeo.dispose(); dodMat.dispose(); icoGeo.dispose(); icoMat.dispose();
      glowGeo.dispose(); glowMat.dispose();
      gridGeo.dispose(); gridMat.dispose();
      nebulaMats.forEach(m => m.dispose());
      ringMeshes.forEach(r => { r.geometry.dispose(); (r.material as THREE.Material).dispose(); });
    };
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Deep vignette — tighter, darker */}
      <div className="absolute inset-0 z-[5] pointer-events-none" style={{
        background: "radial-gradient(ellipse 55% 55% at 50% 48%, transparent 0%, rgba(6,8,9,0.7) 60%, #060809 100%)",
      }} />

      {/* Top/bottom darkness bands */}
      <div className="absolute inset-0 z-[5] pointer-events-none" style={{
        background: "linear-gradient(180deg, rgba(6,8,9,0.5) 0%, transparent 20%, transparent 80%, rgba(6,8,9,0.6) 100%)",
      }} />

      {/* Subtle film grain */}
      <div className="absolute inset-0 z-[6] pointer-events-none opacity-[0.025]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }} />

      {/* Hero content */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div className="max-w-3xl flex flex-col items-center text-center px-6">
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="mb-12"
          >
            <FacetedCrownLogo size={72} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-white font-light"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              textShadow: "0 0 80px rgba(0,0,0,0.95), 0 0 160px rgba(6,8,9,0.8)",
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
              textShadow: "0 0 40px rgba(6,8,9,0.9)",
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
            className="mt-12 flex flex-row gap-6"
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
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-medium uppercase text-white/15" style={{ letterSpacing: "0.3em" }}>
          Scroll to explore
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-white/15 text-sm"
        >
          ▾
        </motion.span>
      </motion.div>
    </section>
  );
};

export default HeroSection;
