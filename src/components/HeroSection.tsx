import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import FacetedCrownLogo from "./FacetedCrownLogo";

const BG = 0x060809;
const TEAL = 0x00d4aa;
const DEEP_TEAL = 0x007a60;
const LILAC = 0x6a5acd;
const COLD_BLUE = 0x1a2a4a;

interface TreeNode {
  pos: THREE.Vector3;
  depth: number;
  parent: number;
  children: number[];
  active: boolean;
  activatedAt: number;
}

interface PathParticle {
  nodeFrom: number;
  nodeTo: number;
  t: number;
  speed: number;
  color: THREE.Color;
  born: number;
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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(BG, 0.006);
    const camera = new THREE.PerspectiveCamera(65, container.clientWidth / container.clientHeight, 0.1, 500);
    camera.position.set(0, 0, 60);

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    const aspect = container.clientWidth / container.clientHeight;

    // ─── LAYER 0: Deep nebula fog planes ───
    const nebulaMats: THREE.ShaderMaterial[] = [];
    for (let i = 0; i < 3; i++) {
      const planeGeo = new THREE.PlaneGeometry(220, 140, 1, 1);
      const nebMat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, side: THREE.DoubleSide,
        uniforms: { uTime: { value: 0 }, uLayer: { value: i }, uTeal: { value: new THREE.Color(DEEP_TEAL) }, uBlue: { value: new THREE.Color(COLD_BLUE) } },
        vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `
          uniform float uTime, uLayer;
          uniform vec3 uTeal, uBlue;
          varying vec2 vUv;
          float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          float noise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
          float fbm(vec2 p) { float v=0.0, a=0.5; for(int i=0;i<5;i++){v+=a*noise(p);p*=2.0;a*=0.5;} return v; }
          void main() {
            float speed = 0.02 + uLayer * 0.008;
            vec2 p = vUv * (2.0 + uLayer * 0.5) + vec2(uTime * speed, uTime * speed * 0.3);
            float n = fbm(p + fbm(p + uTime * 0.01));
            float edgeFade = smoothstep(0.0,0.3,vUv.x)*smoothstep(0.0,0.3,1.0-vUv.x)*smoothstep(0.0,0.25,vUv.y)*smoothstep(0.0,0.25,1.0-vUv.y);
            vec3 col = mix(uBlue, uTeal, n * 0.3);
            gl_FragColor = vec4(col, n * 0.025 * edgeFade * (1.0 - uLayer * 0.2));
          }`,
      });
      nebulaMats.push(nebMat);
      const plane = new THREE.Mesh(planeGeo, nebMat);
      plane.position.z = -35 - i * 18;
      worldGroup.add(plane);
    }

    // ─── DECISION TREE — branching structure ───
    const MAX_DEPTH = 8;
    const nodes: TreeNode[] = [];
    const spreadX = 50 * aspect;
    const spreadY = 48;

    // Build tree procedurally — starts from left, branches right & up/down
    const buildTree = (parentIdx: number, depth: number, y: number, x: number, ySpread: number) => {
      if (depth > MAX_DEPTH) return;
      // 2-3 branches per node at early depths, fewer later
      const branchCount = depth < 3 ? 2 + Math.floor(Math.random() * 2) : depth < 5 ? 2 : (Math.random() < 0.6 ? 2 : 1);
      const stepX = (spreadX * 2) / (MAX_DEPTH + 2);

      for (let b = 0; b < branchCount; b++) {
        const angle = ((b / (branchCount - 1 || 1)) - 0.5) * ySpread;
        const newY = y + angle + (Math.random() - 0.5) * 2;
        const newX = x + stepX * (0.7 + Math.random() * 0.6);
        const z = (Math.random() - 0.5) * 12;
        const idx = nodes.length;
        nodes.push({
          pos: new THREE.Vector3(newX, newY, z),
          depth,
          parent: parentIdx,
          children: [],
          active: false,
          activatedAt: -1,
        });
        nodes[parentIdx].children.push(idx);

        // Recurse with diminishing spread
        if (depth < MAX_DEPTH) {
          buildTree(idx, depth + 1, newY, newX, ySpread * (0.5 + Math.random() * 0.2));
        }
      }
    };

    // Root node — far left
    nodes.push({
      pos: new THREE.Vector3(-spreadX * 0.85, 0, 0),
      depth: 0,
      parent: -1,
      children: [],
      active: true,
      activatedAt: 0,
    });
    buildTree(0, 1, 0, -spreadX * 0.85, spreadY * 0.8);

    // Build a second tree mirrored/offset for density
    const secondRootIdx = nodes.length;
    nodes.push({
      pos: new THREE.Vector3(-spreadX * 0.7, spreadY * 0.3, -5),
      depth: 0,
      parent: -1,
      children: [],
      active: true,
      activatedAt: 0,
    });
    buildTree(secondRootIdx, 1, spreadY * 0.3, -spreadX * 0.7, spreadY * 0.5);

    const thirdRootIdx = nodes.length;
    nodes.push({
      pos: new THREE.Vector3(-spreadX * 0.75, -spreadY * 0.35, -3),
      depth: 0,
      parent: -1,
      children: [],
      active: true,
      activatedAt: 0,
    });
    buildTree(thirdRootIdx, 1, -spreadY * 0.35, -spreadX * 0.75, spreadY * 0.45);

    // Collect all edges
    const edges: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (const c of nodes[i].children) {
        edges.push([i, c]);
      }
    }

    // ── Node points geometry ──
    const nodeGeoPos = new Float32Array(nodes.length * 3);
    const nodeSizes = new Float32Array(nodes.length);
    const nodeAlphas = new Float32Array(nodes.length);
    for (let i = 0; i < nodes.length; i++) {
      nodeGeoPos[i * 3] = nodes[i].pos.x;
      nodeGeoPos[i * 3 + 1] = nodes[i].pos.y;
      nodeGeoPos[i * 3 + 2] = nodes[i].pos.z;
      const depthFade = 1 - nodes[i].depth / (MAX_DEPTH + 1);
      nodeSizes[i] = (0.04 + depthFade * 0.12);
      nodeAlphas[i] = 0;
    }
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodeGeoPos, 3));
    nodeGeo.setAttribute("size", new THREE.BufferAttribute(nodeSizes, 1));
    nodeGeo.setAttribute("alpha", new THREE.BufferAttribute(nodeAlphas, 1));

    const nodeMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uTeal: { value: new THREE.Color(TEAL) } },
      vertexShader: `
        attribute float size, alpha;
        varying float vAlpha;
        uniform float uTime;
        void main() {
          vAlpha = alpha;
          float pulse = 1.0 + sin(uTime * 2.0 + position.x * 0.3) * 0.15 * alpha;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * pulse * (320.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }`,
      fragmentShader: `
        uniform vec3 uTeal;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          if (d > 1.0) discard;
          float core = exp(-d*d*4.0) * vAlpha * 0.9;
          float halo = (1.0 - d) * vAlpha * 0.15;
          gl_FragColor = vec4(uTeal, core + halo);
        }`,
    });
    const nodePoints = new THREE.Points(nodeGeo, nodeMat);
    worldGroup.add(nodePoints);

    // ── Edge lines ──
    const edgePositions = new Float32Array(edges.length * 6);
    const edgeColors = new Float32Array(edges.length * 6);
    for (let i = 0; i < edges.length; i++) {
      const [a, b] = edges[i];
      edgePositions[i * 6] = nodes[a].pos.x; edgePositions[i * 6 + 1] = nodes[a].pos.y; edgePositions[i * 6 + 2] = nodes[a].pos.z;
      edgePositions[i * 6 + 3] = nodes[b].pos.x; edgePositions[i * 6 + 4] = nodes[b].pos.y; edgePositions[i * 6 + 5] = nodes[b].pos.z;
    }
    edgeColors.fill(0);
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(edgePositions, 3));
    edgeGeo.setAttribute("color", new THREE.BufferAttribute(edgeColors, 3));
    const edgeMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
    worldGroup.add(new THREE.LineSegments(edgeGeo, edgeMat));

    // ── Dim base edges (always visible, very faint) ──
    const baseEdgeMat = new THREE.LineBasicMaterial({ color: 0x0d1a25, transparent: true, opacity: 0.06 });
    worldGroup.add(new THREE.LineSegments(edgeGeo.clone(), baseEdgeMat));

    // ── Path particles — data flowing through the tree ──
    const MAX_PARTICLES = 800;
    const particles: PathParticle[] = [];
    const particlePos = new Float32Array(MAX_PARTICLES * 3);
    const particleAlphas = new Float32Array(MAX_PARTICLES);
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute("alpha", new THREE.BufferAttribute(particleAlphas, 1));
    const particleMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTeal: { value: new THREE.Color(TEAL) }, uLilac: { value: new THREE.Color(LILAC) } },
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = (0.06 + alpha * 0.06) * (300.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }`,
      fragmentShader: `
        uniform vec3 uTeal, uLilac;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          if (d > 1.0) discard;
          float glow = exp(-d*d*3.0) * vAlpha;
          gl_FragColor = vec4(uTeal, glow * 0.7);
        }`,
    });
    worldGroup.add(new THREE.Points(particleGeo, particleMat));

    // ── Scanning grid plane ──
    const gridGeo = new THREE.PlaneGeometry(160, 100, 55, 35);
    const gridMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.DoubleSide, wireframe: true,
      uniforms: { uTime: { value: 0 }, uScanPos: { value: 0 } },
      vertexShader: `varying vec2 vUv; varying vec3 vPos; void main() { vUv = uv; vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `
        uniform float uTime, uScanPos;
        varying vec2 vUv; varying vec3 vPos;
        void main() {
          float scan = 1.0 - smoothstep(0.0, 8.0, abs(vPos.x - uScanPos));
          float base = 0.006;
          float edgeFade = smoothstep(0.0,0.12,vUv.x)*smoothstep(0.0,0.12,1.0-vUv.x)*smoothstep(0.0,0.18,vUv.y)*smoothstep(0.0,0.18,1.0-vUv.y);
          float alpha = (base + scan * 0.04) * edgeFade;
          vec3 col = mix(vec3(0.05,0.1,0.15), vec3(0.0,0.83,0.67), scan * 0.3);
          gl_FragColor = vec4(col, alpha);
        }`,
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    gridMesh.rotation.x = -Math.PI * 0.42;
    gridMesh.position.set(0, -12, -18);
    worldGroup.add(gridMesh);

    // ── Orbital rings ──
    const ringMeshes: THREE.Line[] = [];
    [15, 28, 45].forEach((r, ri) => {
      const pts: THREE.Vector3[] = [];
      const segs = 120 + ri * 20;
      for (let j = 0; j <= segs; j++) {
        const a = (j / segs) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color: ri === 0 ? TEAL : COLD_BLUE, transparent: true, opacity: 0.02 - ri * 0.004 });
      const line = new THREE.Line(geo, mat);
      line.rotation.x = Math.PI * 0.33 + ri * 0.07;
      line.rotation.z = ri * 0.2;
      worldGroup.add(line);
      ringMeshes.push(line);
    });

    // ── Ambient dust ──
    const AMBIENT_COUNT = 700;
    const ambPos = new Float32Array(AMBIENT_COUNT * 3);
    const ambVel = new Float32Array(AMBIENT_COUNT * 3);
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      ambPos[i*3] = (Math.random()-0.5)*180; ambPos[i*3+1] = (Math.random()-0.5)*100; ambPos[i*3+2] = (Math.random()-0.5)*60;
      ambVel[i*3] = (Math.random()-0.5)*0.003; ambVel[i*3+1] = (Math.random()-0.5)*0.003; ambVel[i*3+2] = (Math.random()-0.5)*0.002;
    }
    const ambGeo = new THREE.BufferGeometry();
    ambGeo.setAttribute("position", new THREE.BufferAttribute(ambPos, 3));
    const ambMat = new THREE.PointsMaterial({ size: 0.03, color: 0x2a3a4a, transparent: true, opacity: 0.10, sizeAttenuation: true, blending: THREE.AdditiveBlending });
    worldGroup.add(new THREE.Points(ambGeo, ambMat));

    // ─── Mouse + resize ───
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouseMove = (e: MouseEvent) => { mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2; mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2; };
    window.addEventListener("mousemove", onMouseMove);
    const onResize = () => { const w = container.clientWidth, h = container.clientHeight; camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h); };
    window.addEventListener("resize", onResize);

    // ─── ANIMATION STATE ───
    let raf = 0;
    let frame = 0;
    const tealColor = new THREE.Color(TEAL);

    // Wave activation — tree lights up in waves from roots
    let waveTimer = 0;
    const WAVE_SPEED = 0.35; // how fast activation ripples through the tree
    const WAVE_INTERVAL = 280; // frames between waves
    let waveCount = 0;

    const spawnParticlesFromNode = (nodeIdx: number, time: number) => {
      const node = nodes[nodeIdx];
      for (const childIdx of node.children) {
        if (particles.length < MAX_PARTICLES) {
          particles.push({
            nodeFrom: nodeIdx,
            nodeTo: childIdx,
            t: 0,
            speed: 0.008 + Math.random() * 0.012,
            color: tealColor,
            born: time,
          });
        }
      }
    };

    const animate = () => {
      raf = requestAnimationFrame(animate);
      frame++;
      const t = frame * 0.001;

      // Smooth mouse
      mouse.x += (mouse.tx - mouse.x) * 0.02;
      mouse.y += (mouse.ty - mouse.y) * 0.02;

      // ── Wave activation ──
      waveTimer++;
      if (waveTimer >= WAVE_INTERVAL) {
        waveTimer = 0;
        waveCount++;
        // Reset all nodes
        for (const n of nodes) { n.active = false; n.activatedAt = -1; }
        // Activate roots
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].parent === -1) {
            nodes[i].active = true;
            nodes[i].activatedAt = frame;
            spawnParticlesFromNode(i, frame);
          }
        }
      }

      // Propagate activation through tree
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.active && node.activatedAt > 0) {
          const elapsed = (frame - node.activatedAt) * 0.001;
          if (elapsed > WAVE_SPEED) {
            for (const childIdx of node.children) {
              if (!nodes[childIdx].active) {
                nodes[childIdx].active = true;
                nodes[childIdx].activatedAt = frame;
                spawnParticlesFromNode(childIdx, frame);
              }
            }
          }
        }
      }

      // Update node alphas
      const alphaArr = nodeGeo.attributes.alpha.array as Float32Array;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.active && node.activatedAt > 0) {
          const elapsed = (frame - node.activatedAt) * 0.003;
          const fadeIn = Math.min(1, elapsed);
          const fadeOut = Math.max(0, 1 - (elapsed - 2) * 0.15);
          const depthFade = 1 - node.depth / (MAX_DEPTH + 2);
          alphaArr[i] = fadeIn * fadeOut * depthFade * 0.8;
        } else {
          alphaArr[i] = Math.max(0, alphaArr[i] - 0.005);
        }
      }
      nodeGeo.attributes.alpha.needsUpdate = true;

      // Update edge colors based on active nodes
      const ecArr = edgeGeo.attributes.color.array as Float32Array;
      for (let i = 0; i < edges.length; i++) {
        const [a, b] = edges[i];
        const aAlpha = alphaArr[a];
        const bAlpha = alphaArr[b];
        const intensity = Math.min(aAlpha, bAlpha) * 0.4;
        const c = tealColor;
        ecArr[i*6] = c.r * intensity; ecArr[i*6+1] = c.g * intensity; ecArr[i*6+2] = c.b * intensity;
        ecArr[i*6+3] = c.r * intensity; ecArr[i*6+4] = c.g * intensity; ecArr[i*6+5] = c.b * intensity;
      }
      edgeGeo.attributes.color.needsUpdate = true;

      // Update path particles
      const pArr = particleGeo.attributes.position.array as Float32Array;
      const paArr = particleGeo.attributes.alpha.array as Float32Array;
      // Clear all first
      paArr.fill(0);
      pArr.fill(0);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.t += p.speed;
        if (p.t > 1) {
          // At destination — spawn new particles down children
          const destNode = nodes[p.nodeTo];
          if (destNode.children.length > 0) {
            for (const childIdx of destNode.children) {
              if (particles.length < MAX_PARTICLES) {
                particles.push({
                  nodeFrom: p.nodeTo,
                  nodeTo: childIdx,
                  t: 0,
                  speed: 0.006 + Math.random() * 0.014,
                  color: tealColor,
                  born: frame,
                });
              }
            }
          }
          particles.splice(i, 1);
          continue;
        }

        if (i < MAX_PARTICLES) {
          const fromPos = nodes[p.nodeFrom].pos;
          const toPos = nodes[p.nodeTo].pos;
          // Slight curve via midpoint offset
          const mid = new THREE.Vector3().lerpVectors(fromPos, toPos, 0.5);
          mid.y += (Math.sin(p.born * 0.01) * 1.5);
          // Quadratic bezier
          const oneMinusT = 1 - p.t;
          pArr[i*3] = oneMinusT*oneMinusT*fromPos.x + 2*oneMinusT*p.t*mid.x + p.t*p.t*toPos.x;
          pArr[i*3+1] = oneMinusT*oneMinusT*fromPos.y + 2*oneMinusT*p.t*mid.y + p.t*p.t*toPos.y;
          pArr[i*3+2] = oneMinusT*oneMinusT*fromPos.z + 2*oneMinusT*p.t*mid.z + p.t*p.t*toPos.z;
          const fadeEdge = Math.min(p.t * 5, 1) * Math.min((1 - p.t) * 5, 1);
          const depthFade = 1 - nodes[p.nodeTo].depth / (MAX_DEPTH + 2);
          paArr[i] = fadeEdge * depthFade * 0.8;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;
      particleGeo.attributes.alpha.needsUpdate = true;

      // Nebula time
      nebulaMats.forEach(m => { (m.uniforms as any).uTime.value = t * 3; });

      // Grid scan
      (gridMat.uniforms as any).uScanPos.value = Math.sin(t * 0.3) * 80;
      (gridMat.uniforms as any).uTime.value = t;

      // Rings
      ringMeshes.forEach((r, i) => { r.rotation.y += 0.0002 * (i + 1) * (i % 2 === 0 ? 1 : -1); });

      // Node shader time
      (nodeMat.uniforms as any).uTime.value = t * 3;

      // Ambient drift
      const aArr = ambGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < AMBIENT_COUNT; i++) {
        aArr[i*3] += ambVel[i*3]; aArr[i*3+1] += ambVel[i*3+1]; aArr[i*3+2] += ambVel[i*3+2];
        if (Math.abs(aArr[i*3]) > 90) ambVel[i*3] *= -1;
        if (Math.abs(aArr[i*3+1]) > 50) ambVel[i*3+1] *= -1;
        if (Math.abs(aArr[i*3+2]) > 30) ambVel[i*3+2] *= -1;
      }
      ambGeo.attributes.position.needsUpdate = true;

      // Camera
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
      nodeGeo.dispose(); edgeGeo.dispose(); particleGeo.dispose(); ambGeo.dispose();
      nodeMat.dispose(); edgeMat.dispose(); baseEdgeMat.dispose(); particleMat.dispose(); ambMat.dispose();
      gridGeo.dispose(); gridMat.dispose();
      nebulaMats.forEach(m => m.dispose());
      ringMeshes.forEach(r => { r.geometry.dispose(); (r.material as THREE.Material).dispose(); });
    };
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Deep vignette */}
      <div className="absolute inset-0 z-[5] pointer-events-none" style={{
        background: "radial-gradient(ellipse 55% 55% at 50% 48%, transparent 0%, rgba(6,8,9,0.7) 60%, #060809 100%)",
      }} />

      {/* Top/bottom bands */}
      <div className="absolute inset-0 z-[5] pointer-events-none" style={{
        background: "linear-gradient(180deg, rgba(6,8,9,0.5) 0%, transparent 20%, transparent 80%, rgba(6,8,9,0.6) 100%)",
      }} />

      {/* Film grain */}
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
              maxWidth: 1280,
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
            <div className="flex flex-row flex-wrap items-center justify-center gap-5 mt-10">
              {["Zero hallucination.", "Zero inference.", "Total clinical authority."].map((text) => (
                <span key={text} className="inline-flex items-center gap-2 text-white/60">
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                    style={{ background: "#00ff6a", boxShadow: "0 0 8px rgba(0,255,106,0.7)" }}
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
              <span className="absolute inset-0 border border-[#00d4aa]/[0.30] bg-gradient-to-b from-[#00d4aa]/[0.12] to-[#00d4aa]/[0.04] transition-all duration-500 group-hover:border-[#00d4aa]/50 group-hover:from-[#00d4aa]/[0.20] group-hover:to-[#00d4aa]/[0.08]" style={{ boxShadow: '0 0 20px rgba(0,212,170,0.08)' }} />
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.04] to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">Request Demo</span>
            </a>
            <a
              href="#pipeline"
              className="group relative text-[13px] font-medium uppercase text-white/80 px-8 py-3.5 transition-all duration-500 overflow-hidden"
              style={{ letterSpacing: "0.08em" }}
            >
              <span className="absolute inset-0 border border-[#00d4aa]/[0.22] bg-gradient-to-b from-[#00d4aa]/[0.08] to-[#00d4aa]/[0.03] transition-all duration-500 group-hover:border-[#00d4aa]/40 group-hover:from-[#00d4aa]/[0.15] group-hover:to-[#00d4aa]/[0.06]" style={{ boxShadow: '0 0 15px rgba(0,212,170,0.06)' }} />
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
