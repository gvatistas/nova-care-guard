import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import FacetedCrownLogo from "./FacetedCrownLogo";

const BG = 0x050708;

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
    scene.fog = new THREE.FogExp2(BG, 0.004);
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 800);
    camera.position.set(0, 0, 0);
    camera.lookAt(0, 0, -100);

    const disposables: { dispose: () => void }[] = [];

    // ─── Infinite corridor mesh — floor + ceiling ───
    const GRID_W = 80;
    const GRID_D = 140;
    const SPACING = 2.2;

    const createGridPlane = (yOffset: number, flip: boolean) => {
      const group = new THREE.Group();
      const linePositions: number[] = [];
      for (let x = -GRID_W / 2; x <= GRID_W / 2; x++) {
        const xp = x * SPACING;
        linePositions.push(xp, 0, 0, xp, 0, -GRID_D * SPACING);
      }
      for (let z = 0; z <= GRID_D; z++) {
        const zp = -z * SPACING;
        linePositions.push(-GRID_W / 2 * SPACING, 0, zp, GRID_W / 2 * SPACING, 0, zp);
      }
      for (let x = -GRID_W / 2; x < GRID_W / 2; x++) {
        for (let z = 0; z < GRID_D; z += 2) {
          const x1 = x * SPACING, x2 = (x + 1) * SPACING;
          const z1 = -z * SPACING, z2 = -(z + 1) * SPACING;
          linePositions.push(x1, 0, z1, x2, 0, z2);
          linePositions.push(x2, 0, z1, x1, 0, z2);
        }
      }
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
      const lineMat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false,
        uniforms: { uCamZ: { value: 0 }, uTime: { value: 0 } },
        vertexShader: `
          varying float vFade;
          uniform float uCamZ;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            float d = abs(wp.z - uCamZ);
            vFade = smoothstep(0.0, 30.0, d) * (1.0 - smoothstep(200.0, 300.0, d));
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `,
        fragmentShader: `
          varying float vFade;
          void main() {
            gl_FragColor = vec4(0.55, 0.65, 0.75, vFade * 0.07);
          }
        `,
      });
      group.add(new THREE.LineSegments(lineGeo, lineMat));
      disposables.push(lineGeo, lineMat);

      const dotPositions: number[] = [];
      const dotAlphas: number[] = [];
      for (let x = -GRID_W / 2; x <= GRID_W / 2; x++) {
        for (let z = 0; z <= GRID_D; z++) {
          dotPositions.push(x * SPACING, 0, -z * SPACING);
          dotAlphas.push(1 - Math.abs(x) / (GRID_W / 2) * 0.6);
        }
      }
      const dotGeo = new THREE.BufferGeometry();
      dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(dotPositions, 3));
      dotGeo.setAttribute("alpha", new THREE.Float32BufferAttribute(dotAlphas, 1));
      const dotMat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uCamZ: { value: 0 } },
        vertexShader: `
          attribute float alpha;
          varying float vAlpha;
          uniform float uTime, uCamZ;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            float d = abs(wp.z - uCamZ);
            float df = smoothstep(0.0, 20.0, d) * (1.0 - smoothstep(160.0, 280.0, d));
            float pulse = 1.0 + sin(uTime * 1.5 + position.x * 0.8 + position.z * 0.3) * 0.25;
            vAlpha = alpha * df * pulse;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = max(1.0, (3.5 * alpha * df) * (120.0 / -mv.z));
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5) * 2.0;
            if (d > 1.0) discard;
            float core = exp(-d * d * 5.0) * vAlpha;
            float halo = (1.0 - d * d) * vAlpha * 0.15;
            gl_FragColor = vec4(0.85, 0.9, 1.0, (core + halo) * 0.5);
          }
        `,
      });
      group.add(new THREE.Points(dotGeo, dotMat));
      disposables.push(dotGeo, dotMat);
      group.position.y = yOffset;
      if (flip) group.scale.y = -1;
      return { group, lineMat, dotMat };
    };

    const floor = createGridPlane(-18, false);
    const ceiling = createGridPlane(18, true);
    scene.add(floor.group);
    scene.add(ceiling.group);

    // ─── 3D DECISION TREE — branching paths in space ───
    interface TreeNode {
      pos: THREE.Vector3;
      children: TreeNode[];
      depth: number;
      id: number;
    }

    let nodeIdCounter = 0;
    const buildTree = (origin: THREE.Vector3, depth: number, maxDepth: number, spreadX: number, spreadY: number): TreeNode => {
      const node: TreeNode = { pos: origin.clone(), children: [], depth, id: nodeIdCounter++ };
      if (depth >= maxDepth) return node;
      const branches = depth === 0 ? 3 : (Math.random() > 0.3 ? 2 : 3);
      for (let i = 0; i < branches; i++) {
        const angle = ((i / branches) - 0.5) * Math.PI * 0.8 + (Math.random() - 0.5) * 0.4;
        const childPos = new THREE.Vector3(
          origin.x + Math.sin(angle) * spreadX * (0.7 + Math.random() * 0.6),
          origin.y + (Math.random() - 0.5) * spreadY,
          origin.z - (8 + Math.random() * 6)
        );
        node.children.push(buildTree(childPos, depth + 1, maxDepth, spreadX * 0.65, spreadY * 0.8));
      }
      return node;
    };

    // Create multiple decision trees scattered in the corridor
    const trees: TreeNode[] = [];
    const treeRoots: THREE.Vector3[] = [
      new THREE.Vector3(-25, -4, -40),
      new THREE.Vector3(28, 5, -80),
      new THREE.Vector3(-15, 6, -130),
      new THREE.Vector3(20, -5, -180),
      new THREE.Vector3(-30, 3, -220),
      new THREE.Vector3(15, -3, -270),
    ];
    treeRoots.forEach(root => trees.push(buildTree(root, 0, 5, 12, 5)));

    // Collect all edges and nodes from trees
    const edgePositions: number[] = [];
    const nodePositions: number[] = [];
    const nodeDepths: number[] = [];
    const edgeIds: number[] = [];
    let edgeIdx = 0;

    const traverseTree = (node: TreeNode) => {
      nodePositions.push(node.pos.x, node.pos.y, node.pos.z);
      nodeDepths.push(node.depth);
      node.children.forEach(child => {
        edgePositions.push(node.pos.x, node.pos.y, node.pos.z);
        edgePositions.push(child.pos.x, child.pos.y, child.pos.z);
        edgeIds.push(edgeIdx, edgeIdx);
        edgeIdx++;
        traverseTree(child);
      });
    };
    trees.forEach(t => traverseTree(t));

    // Decision tree edges
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.Float32BufferAttribute(edgePositions, 3));
    edgeGeo.setAttribute("edgeId", new THREE.Float32BufferAttribute(edgeIds, 1));
    const edgeMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uCamZ: { value: 0 } },
      vertexShader: `
        attribute float edgeId;
        varying float vPulse;
        varying float vDist;
        uniform float uTime, uCamZ;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vDist = abs(wp.z - uCamZ);
          float wave = sin(uTime * 2.0 + edgeId * 0.7) * 0.5 + 0.5;
          vPulse = wave;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        varying float vPulse;
        varying float vDist;
        void main() {
          float fade = smoothstep(5.0, 30.0, vDist) * (1.0 - smoothstep(180.0, 280.0, vDist));
          float intensity = mix(0.06, 0.25, vPulse) * fade;
          vec3 col = mix(vec3(0.3, 0.6, 0.9), vec3(0.0, 0.9, 0.6), vPulse);
          gl_FragColor = vec4(col, intensity);
        }
      `,
    });
    const edgeMesh = new THREE.LineSegments(edgeGeo, edgeMat);
    scene.add(edgeMesh);
    disposables.push(edgeGeo, edgeMat);

    // Decision tree nodes — glowing spheres
    const treeNodeGeo = new THREE.BufferGeometry();
    treeNodeGeo.setAttribute("position", new THREE.Float32BufferAttribute(nodePositions, 3));
    treeNodeGeo.setAttribute("depth", new THREE.Float32BufferAttribute(nodeDepths, 1));
    const treeNodeMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uCamZ: { value: 0 } },
      vertexShader: `
        attribute float depth;
        varying float vAlpha;
        varying float vDepth;
        uniform float uTime, uCamZ;
        void main() {
          vDepth = depth;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          float d = abs(wp.z - uCamZ);
          float df = smoothstep(5.0, 25.0, d) * (1.0 - smoothstep(160.0, 260.0, d));
          float pulse = 0.6 + 0.4 * sin(uTime * 3.0 + depth * 1.5 + position.x * 0.3);
          float sizeBase = mix(6.0, 2.5, depth / 5.0);
          vAlpha = df * pulse;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = max(2.0, sizeBase * df * (150.0 / -mv.z));
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        varying float vDepth;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          if (d > 1.0) discard;
          float core = exp(-d * d * 4.0);
          float halo = exp(-d * d * 1.5) * 0.3;
          float glow = exp(-d * 0.8) * 0.15;
          vec3 coreCol = mix(vec3(0.0, 0.85, 0.55), vec3(0.3, 0.5, 1.0), vDepth / 5.0);
          vec3 haloCol = mix(vec3(0.0, 0.6, 0.4), vec3(0.2, 0.3, 0.8), vDepth / 5.0);
          vec3 color = coreCol * core + haloCol * (halo + glow);
          gl_FragColor = vec4(color, (core + halo + glow) * vAlpha * 0.7);
        }
      `,
    });
    scene.add(new THREE.Points(treeNodeGeo, treeNodeMat));
    disposables.push(treeNodeGeo, treeNodeMat);

    // ─── RADAR RINGS — expanding from root nodes ───
    const RING_COUNT = 6;
    const radarRings: THREE.Mesh[] = [];
    const radarMats: THREE.ShaderMaterial[] = [];
    for (let i = 0; i < RING_COUNT; i++) {
      const ringGeo = new THREE.RingGeometry(0.5, 1.0, 64);
      const ringMat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: { uTime: { value: 0 }, uPhase: { value: i * 1.2 } },
        vertexShader: `
          varying vec2 vUv;
          uniform float uTime, uPhase;
          void main() {
            vUv = uv;
            float t = mod(uTime * 0.6 + uPhase, 7.0);
            float scale = t * 5.0;
            vec3 scaled = position * scale;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(scaled, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform float uTime, uPhase;
          void main() {
            float t = mod(uTime * 0.6 + uPhase, 7.0);
            float fade = (1.0 - t / 7.0);
            float ring = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
            vec3 col = mix(vec3(0.0, 0.8, 0.5), vec3(0.2, 0.4, 1.0), t / 7.0);
            gl_FragColor = vec4(col, ring * fade * fade * 0.12);
          }
        `,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      const rootIdx = i % treeRoots.length;
      ring.position.copy(treeRoots[rootIdx]);
      ring.lookAt(camera.position);
      scene.add(ring);
      radarRings.push(ring);
      radarMats.push(ringMat);
      disposables.push(ringGeo, ringMat);
    }

    // ─── PULSE PARTICLES — traveling along tree edges ───
    const PULSE_COUNT = 120;
    const pulsePos = new Float32Array(PULSE_COUNT * 3);
    const pulseProgress = new Float32Array(PULSE_COUNT);
    const pulseEdge = new Int32Array(PULSE_COUNT);
    const pulseSpeed = new Float32Array(PULSE_COUNT);
    const totalEdges = edgePositions.length / 6;

    for (let i = 0; i < PULSE_COUNT; i++) {
      pulseEdge[i] = Math.floor(Math.random() * totalEdges);
      pulseProgress[i] = Math.random();
      pulseSpeed[i] = 0.003 + Math.random() * 0.008;
      const ei = pulseEdge[i] * 6;
      const t = pulseProgress[i];
      pulsePos[i * 3] = edgePositions[ei] + (edgePositions[ei + 3] - edgePositions[ei]) * t;
      pulsePos[i * 3 + 1] = edgePositions[ei + 1] + (edgePositions[ei + 4] - edgePositions[ei + 1]) * t;
      pulsePos[i * 3 + 2] = edgePositions[ei + 2] + (edgePositions[ei + 5] - edgePositions[ei + 2]) * t;
    }
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePos, 3));
    const pulseMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uCamZ: { value: 0 } },
      vertexShader: `
        varying float vAlpha;
        uniform float uTime, uCamZ;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          float d = abs(wp.z - uCamZ);
          vAlpha = smoothstep(5.0, 20.0, d) * (1.0 - smoothstep(150.0, 250.0, d));
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = max(2.0, 5.0 * vAlpha * (100.0 / -mv.z));
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          if (d > 1.0) discard;
          float core = exp(-d * d * 3.0);
          float glow = exp(-d * 1.2) * 0.4;
          vec3 col = vec3(0.0, 1.0, 0.6);
          gl_FragColor = vec4(col * (core + glow), (core + glow) * vAlpha * 0.6);
        }
      `,
    });
    scene.add(new THREE.Points(pulseGeo, pulseMat));
    disposables.push(pulseGeo, pulseMat);

    // ─── SCAN WAVE — vertical plane sweeping through corridor ───
    const scanGeo = new THREE.PlaneGeometry(200, 50, 1, 1);
    const scanMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `
        varying vec2 vUv;
        void main() {
          float xF = exp(-pow((vUv.x - 0.5) * 2.0, 2.0) * 2.5);
          float yF = exp(-pow((vUv.y - 0.5) * 2.0, 2.0) * 1.5);
          gl_FragColor = vec4(0.15, 0.5, 0.8, xF * yF * 0.025);
        }
      `,
    });
    const scanPlane = new THREE.Mesh(scanGeo, scanMat);
    scene.add(scanPlane);
    disposables.push(scanGeo, scanMat);

    // ─── Horizon glow ───
    const horizonGeo = new THREE.PlaneGeometry(400, 12, 1, 1);
    const horizonMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          float xF = exp(-pow((vUv.x - 0.5) * 2.0, 2.0) * 1.2);
          float yF = exp(-pow((vUv.y - 0.5) * 2.0, 2.0) * 6.0);
          float pulse = 0.8 + 0.2 * sin(uTime * 0.5);
          gl_FragColor = vec4(0.55, 0.75, 0.95, xF * yF * 0.15 * pulse);
        }
      `,
    });
    const horizonPlane = new THREE.Mesh(horizonGeo, horizonMat);
    horizonPlane.position.set(0, 0, -300);
    scene.add(horizonPlane);
    disposables.push(horizonGeo, horizonMat);

    // ─── Ambient dust ───
    const DUST_COUNT = 600;
    const dustPos = new Float32Array(DUST_COUNT * 3);
    const dustVel = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 120;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      dustPos[i * 3 + 2] = -Math.random() * 250;
      dustVel[i * 3] = (Math.random() - 0.5) * 0.004;
      dustVel[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      dustVel[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.1, color: 0x446688, transparent: true, opacity: 0.06,
      sizeAttenuation: true, blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(dustGeo, dustMat));
    disposables.push(dustGeo, dustMat);

    // ─── Mouse + resize ───
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
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

    const animate = () => {
      raf = requestAnimationFrame(animate);
      frame++;
      const t = frame * 0.001;

      mouse.x += (mouse.tx - mouse.x) * 0.015;
      mouse.y += (mouse.ty - mouse.y) * 0.015;

      const camZ = -t * 3;
      camera.position.z = camZ;
      camera.position.x = mouse.x * 4;
      camera.position.y = mouse.y * -2;
      camera.lookAt(camera.position.x * 0.3, 0, camZ - 100);

      const time = t * 3;

      // Grid uniforms
      [floor.lineMat, floor.dotMat, ceiling.lineMat, ceiling.dotMat].forEach(m => {
        (m.uniforms as any).uTime.value = time;
        (m.uniforms as any).uCamZ.value = camZ;
      });

      // Decision tree uniforms
      (edgeMat.uniforms as any).uTime.value = time;
      (edgeMat.uniforms as any).uCamZ.value = camZ;
      (treeNodeMat.uniforms as any).uTime.value = time;
      (treeNodeMat.uniforms as any).uCamZ.value = camZ;

      // Radar rings
      radarMats.forEach((m, i) => {
        m.uniforms.uTime.value = time;
        radarRings[i].lookAt(camera.position);
      });

      // Pulse particles — travel along edges
      const pArr = pulseGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < PULSE_COUNT; i++) {
        pulseProgress[i] += pulseSpeed[i];
        if (pulseProgress[i] > 1) {
          pulseProgress[i] = 0;
          pulseEdge[i] = Math.floor(Math.random() * totalEdges);
        }
        const ei = pulseEdge[i] * 6;
        const pr = pulseProgress[i];
        pArr[i * 3] = edgePositions[ei] + (edgePositions[ei + 3] - edgePositions[ei]) * pr;
        pArr[i * 3 + 1] = edgePositions[ei + 1] + (edgePositions[ei + 4] - edgePositions[ei + 1]) * pr;
        pArr[i * 3 + 2] = edgePositions[ei + 2] + (edgePositions[ei + 5] - edgePositions[ei + 2]) * pr;
      }
      pulseGeo.attributes.position.needsUpdate = true;
      (pulseMat.uniforms as any).uTime.value = time;
      (pulseMat.uniforms as any).uCamZ.value = camZ;

      // Scan wave
      (scanMat.uniforms as any).uTime.value = t;
      const scanZ = camZ - 40 - Math.sin(t * 0.6) * 80;
      scanPlane.position.set(0, 0, scanZ);
      scanPlane.rotation.y = Math.sin(t * 0.3) * 0.15;

      // Horizon
      (horizonMat.uniforms as any).uTime.value = time;
      horizonPlane.position.z = camZ - 300;

      // Dust
      const dArr = dustGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < DUST_COUNT; i++) {
        dArr[i * 3] += dustVel[i * 3];
        dArr[i * 3 + 1] += dustVel[i * 3 + 1];
        dArr[i * 3 + 2] += dustVel[i * 3 + 2];
        if (dArr[i * 3 + 2] > camZ + 10) {
          dArr[i * 3] = (Math.random() - 0.5) * 120;
          dArr[i * 3 + 1] = (Math.random() - 0.5) * 35;
          dArr[i * 3 + 2] = camZ - 180 - Math.random() * 70;
        }
      }
      dustGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      disposables.forEach(d => d.dispose());
    };
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Deep vignette */}
      <div className="absolute inset-0 z-[5] pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, transparent 0%, rgba(5,7,8,0.6) 55%, #050708 100%)",
      }} />

      {/* Film grain */}
      <div className="absolute inset-0 z-[6] pointer-events-none opacity-[0.02]" style={{
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
            <FacetedCrownLogo size={180} />
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
              textShadow: "0 0 80px rgba(0,0,0,0.95), 0 0 160px rgba(5,7,8,0.8)",
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
              textShadow: "0 0 40px rgba(5,7,8,0.9)",
            }}
          >
            <p>
              Medient compiles all clinical guidelines into deterministic,
              verified decision infrastructure; bridging AI and
              evidence-based care across all data sources, EHRs and
              patient encounters.
            </p>
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
