import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import FacetedCrownLogo from "./FacetedCrownLogo";

const BG = 0x0B1120;

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
    scene.fog = new THREE.FogExp2(BG, 0.005);
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
            gl_FragColor = vec4(0.15, 0.22, 0.38, vFade * 0.06);
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
            gl_FragColor = vec4(0.18, 0.30, 0.55, (core + halo) * 0.35);
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

    // ─── DECISION PATHS ON THE GRID DOTS ───
    const HALF_W = GRID_W / 2;
    const gridToWorld = (gx: number, gz: number, y: number) =>
      new THREE.Vector3(gx * SPACING, y, -gz * SPACING);

    interface PathNode { gx: number; gz: number; y: number; outcome: number; depth: number; }
    interface PathEdge { from: PathNode; to: PathNode; outcome: number; }

    const allEdges: PathEdge[] = [];
    const activeNodes = new Map<string, PathNode>();
    const nodeKey = (gx: number, gz: number, y: number) => `${gx},${gz},${y < 0 ? 'f' : 'c'}`;

    const seeded = (s: number) => {
      let h = Math.imul(s ^ 0x5bd1e995, 0x5bd1e995);
      h = ((h >>> 13) ^ h) * 0x5bd1e995;
      return ((h >>> 15) ^ h) >>> 0;
    };

    const PATH_ROOTS = [
      { gx: -10, gz: 8, y: -18 },
      { gx: 12, gz: 18, y: -18 },
      { gx: -20, gz: 35, y: -18 },
      { gx: 5, gz: 50, y: -18 },
      { gx: -15, gz: 65, y: -18 },
      { gx: 18, gz: 80, y: -18 },
      { gx: -8, gz: 95, y: -18 },
      { gx: 10, gz: 110, y: -18 },
      { gx: 8, gz: 12, y: 18 },
      { gx: -18, gz: 28, y: 18 },
      { gx: 15, gz: 45, y: 18 },
      { gx: -5, gz: 60, y: 18 },
      { gx: 20, gz: 78, y: 18 },
      { gx: -12, gz: 100, y: 18 },
    ];

    PATH_ROOTS.forEach((root, ri) => {
      const buildBranch = (gx: number, gz: number, y: number, depth: number, outcome: number, seed: number) => {
        if (depth > 8 || gx < -HALF_W || gx > HALF_W || gz < 0 || gz > GRID_D) return;
        const key = nodeKey(gx, gz, y);
        const node: PathNode = { gx, gz, y, outcome, depth };
        activeNodes.set(key, node);

        const branches = depth < 2 ? 3 : (seeded(seed + depth * 7) % 3 === 0 ? 3 : 2);
        for (let b = 0; b < branches; b++) {
          const s = seeded(seed * 31 + b * 97 + depth * 13);
          const dz = 2 + (s % 3);
          const dx = ((s >> 4) % 5) - 2;
          const ngx = gx + dx;
          const ngz = gz + dz;
          if (ngx < -HALF_W || ngx > HALF_W || ngz > GRID_D) continue;

          const rng = (s % 100) / 100;
          const childOutcome = rng > 0.82 ? 0.9 + rng * 0.1 : Math.max(0, outcome * 0.5 - depth * 0.03);
          const childNode: PathNode = { gx: ngx, gz: ngz, y, outcome: childOutcome, depth: depth + 1 };
          const childKey = nodeKey(ngx, ngz, y);
          activeNodes.set(childKey, childNode);
          allEdges.push({ from: node, to: childNode, outcome: childOutcome });
          buildBranch(ngx, ngz, y, depth + 1, childOutcome, s);
        }
      };
      buildBranch(root.gx, root.gz, root.y, 0, 0.3 + (ri % 3) * 0.15, ri * 1337 + 42);
    });

    // ─── Edge lines (decision paths) — cobalt/cyan/teal palette ───
    const pathEdgePos: number[] = [];
    const pathEdgeOutcome: number[] = [];
    allEdges.forEach(e => {
      const p1 = gridToWorld(e.from.gx, e.from.gz, e.from.y);
      const p2 = gridToWorld(e.to.gx, e.to.gz, e.to.y);
      pathEdgePos.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
      pathEdgeOutcome.push(e.outcome, e.outcome);
    });

    const pathEdgeGeo = new THREE.BufferGeometry();
    pathEdgeGeo.setAttribute("position", new THREE.Float32BufferAttribute(pathEdgePos, 3));
    pathEdgeGeo.setAttribute("outcome", new THREE.Float32BufferAttribute(pathEdgeOutcome, 1));
    const pathEdgeMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uCamZ: { value: 0 } },
      vertexShader: `
        attribute float outcome;
        varying float vOutcome;
        varying float vDist;
        uniform float uTime, uCamZ;
        void main() {
          vOutcome = outcome;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vDist = abs(wp.z - uCamZ);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        varying float vOutcome;
        varying float vDist;
        uniform float uTime;
        void main() {
          float fade = smoothstep(5.0, 25.0, vDist) * (1.0 - smoothstep(180.0, 300.0, vDist));
          float pulse = 0.6 + 0.4 * sin(uTime * 2.0 + vDist * 0.06);
          vec3 cobalt = vec3(0.145, 0.388, 0.922);
          vec3 cyan   = vec3(0.024, 0.714, 0.831);
          vec3 teal   = vec3(0.078, 0.722, 0.651);
          vec3 slate  = vec3(0.35, 0.42, 0.52);
          vec3 col;
          if (vOutcome < 0.33) col = mix(cobalt, cyan, vOutcome * 3.0);
          else if (vOutcome < 0.66) col = mix(cyan, teal, (vOutcome - 0.33) * 3.0);
          else col = mix(teal, slate, (vOutcome - 0.66) * 3.0);
          gl_FragColor = vec4(col, fade * pulse * 0.18);
        }
      `,
    });
    scene.add(new THREE.LineSegments(pathEdgeGeo, pathEdgeMat));
    disposables.push(pathEdgeGeo, pathEdgeMat);

    // ─── Active decision nodes — cobalt/cyan/teal ───
    const activeNodePos: number[] = [];
    const activeNodeOutcome: number[] = [];
    const activeNodeDepth: number[] = [];
    activeNodes.forEach(n => {
      const wp = gridToWorld(n.gx, n.gz, n.y);
      activeNodePos.push(wp.x, wp.y, wp.z);
      activeNodeOutcome.push(n.outcome);
      activeNodeDepth.push(n.depth);
    });

    const activeNodeGeo = new THREE.BufferGeometry();
    activeNodeGeo.setAttribute("position", new THREE.Float32BufferAttribute(activeNodePos, 3));
    activeNodeGeo.setAttribute("outcome", new THREE.Float32BufferAttribute(activeNodeOutcome, 1));
    activeNodeGeo.setAttribute("depth", new THREE.Float32BufferAttribute(activeNodeDepth, 1));
    const activeNodeMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uCamZ: { value: 0 } },
      vertexShader: `
        attribute float outcome;
        attribute float depth;
        varying float vOutcome;
        varying float vAlpha;
        uniform float uTime, uCamZ;
        void main() {
          vOutcome = outcome;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          float d = abs(wp.z - uCamZ);
          float df = smoothstep(5.0, 20.0, d) * (1.0 - smoothstep(150.0, 250.0, d));
          float pulse = 0.5 + 0.5 * sin(uTime * 2.5 + depth * 1.8 + position.x * 0.4);
          float sizeBase = mix(8.0, 4.0, depth / 8.0);
          vAlpha = df * pulse;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = max(2.0, sizeBase * df * (160.0 / -mv.z));
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying float vOutcome;
        varying float vAlpha;
        uniform float uTime;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          if (d > 1.0) discard;
          float core = exp(-d * d * 4.0);
          float halo = exp(-d * d * 1.2) * 0.35;
          float glow = exp(-d * 0.6) * 0.2;
          vec3 cobalt = vec3(0.145, 0.388, 0.922);
          vec3 cyan   = vec3(0.024, 0.714, 0.831);
          vec3 teal   = vec3(0.078, 0.722, 0.651);
          vec3 slate  = vec3(0.4, 0.48, 0.55);
          vec3 col;
          if (vOutcome < 0.33) col = mix(cobalt, cyan, vOutcome * 3.0);
          else if (vOutcome < 0.66) col = mix(cyan, teal, (vOutcome - 0.33) * 3.0);
          else col = mix(teal, slate, (vOutcome - 0.66) * 3.0);
          vec3 color = col * (core + halo * 0.7 + glow * 0.4);
          gl_FragColor = vec4(color, (core + halo + glow) * vAlpha * 0.65);
        }
      `,
    });
    scene.add(new THREE.Points(activeNodeGeo, activeNodeMat));
    disposables.push(activeNodeGeo, activeNodeMat);

    // ─── PULSE PARTICLES — cobalt/cyan/teal only ───
    const PULSE_COUNT = 400;
    const pulsePos = new Float32Array(PULSE_COUNT * 3);
    const pulseProgress = new Float32Array(PULSE_COUNT);
    const pulseEdge = new Int32Array(PULSE_COUNT);
    const pulseSpeed = new Float32Array(PULSE_COUNT);
    const pulseOutcomeArr = new Float32Array(PULSE_COUNT);
    const totalPathEdges = pathEdgePos.length / 6;

    for (let i = 0; i < PULSE_COUNT; i++) {
      pulseEdge[i] = Math.floor(Math.random() * totalPathEdges);
      pulseProgress[i] = Math.random();
      pulseSpeed[i] = 0.006 + Math.random() * 0.018;
      pulseOutcomeArr[i] = pathEdgeOutcome[pulseEdge[i] * 2];
      const ei = pulseEdge[i] * 6;
      const t = pulseProgress[i];
      pulsePos[i * 3]     = pathEdgePos[ei]     + (pathEdgePos[ei + 3] - pathEdgePos[ei]) * t;
      pulsePos[i * 3 + 1] = pathEdgePos[ei + 1] + (pathEdgePos[ei + 4] - pathEdgePos[ei + 1]) * t;
      pulsePos[i * 3 + 2] = pathEdgePos[ei + 2] + (pathEdgePos[ei + 5] - pathEdgePos[ei + 2]) * t;
    }
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePos, 3));
    pulseGeo.setAttribute("outcome", new THREE.Float32BufferAttribute(pulseOutcomeArr, 1));
    const pulseMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uCamZ: { value: 0 } },
      vertexShader: `
        attribute float outcome;
        varying float vAlpha;
        varying float vOutcome;
        uniform float uTime, uCamZ;
        void main() {
          vOutcome = outcome;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          float d = abs(wp.z - uCamZ);
          vAlpha = smoothstep(5.0, 15.0, d) * (1.0 - smoothstep(160.0, 280.0, d));
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = max(3.0, 9.0 * vAlpha * (140.0 / -mv.z));
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        varying float vOutcome;
        uniform float uTime;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          if (d > 1.0) discard;
          float core = exp(-d * d * 2.5);
          float glow = exp(-d * 0.8) * 0.6;
          float outer = exp(-d * 0.4) * 0.2;
          vec3 cobalt = vec3(0.145, 0.388, 0.922);
          vec3 cyan   = vec3(0.024, 0.714, 0.831);
          vec3 teal   = vec3(0.078, 0.722, 0.651);
          vec3 slate  = vec3(0.45, 0.52, 0.58);
          vec3 col;
          if (vOutcome < 0.33) col = mix(cobalt, cyan, vOutcome * 3.0);
          else if (vOutcome < 0.66) col = mix(cyan, teal, (vOutcome - 0.33) * 3.0);
          else col = mix(teal, slate, (vOutcome - 0.66) * 3.0);
          float bright = core + glow + outer;
          gl_FragColor = vec4(col * bright, bright * vAlpha * 0.8);
        }
      `,
    });
    scene.add(new THREE.Points(pulseGeo, pulseMat));
    disposables.push(pulseGeo, pulseMat);

    // ─── RIPPLE RINGS — cobalt/cyan/teal ───
    const RING_COUNT = 8;
    const radarRings: THREE.Mesh[] = [];
    const radarMats: THREE.ShaderMaterial[] = [];
    PATH_ROOTS.slice(0, RING_COUNT).forEach((root, i) => {
      const ringGeo = new THREE.RingGeometry(0.3, 0.8, 48);
      const ringMat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: { uTime: { value: 0 }, uPhase: { value: i * 0.9 } },
        vertexShader: `
          varying vec2 vUv;
          uniform float uTime, uPhase;
          void main() {
            vUv = uv;
            float t = mod(uTime * 0.5 + uPhase, 6.0);
            float scale = t * 4.0;
            vec3 scaled = position * scale;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(scaled, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform float uTime, uPhase;
          void main() {
            float t = mod(uTime * 0.5 + uPhase, 6.0);
            float fade = (1.0 - t / 6.0);
            float ring = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
            vec3 cobalt = vec3(0.145, 0.388, 0.922);
            vec3 cyan   = vec3(0.024, 0.714, 0.831);
            vec3 teal   = vec3(0.078, 0.722, 0.651);
            float cycle = fract(uPhase * 0.33);
            vec3 col = cycle < 0.33 ? mix(cobalt, cyan, cycle * 3.0) : cycle < 0.66 ? mix(cyan, teal, (cycle - 0.33) * 3.0) : mix(teal, cobalt, (cycle - 0.66) * 3.0);
            gl_FragColor = vec4(col, ring * fade * fade * 0.08);
          }
        `,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      const wp = gridToWorld(root.gx, root.gz, root.y);
      ring.position.copy(wp);
      ring.lookAt(camera.position);
      scene.add(ring);
      radarRings.push(ring);
      radarMats.push(ringMat);
      disposables.push(ringGeo, ringMat);
    });

    // ─── SCAN WAVE ───
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
          gl_FragColor = vec4(0.12, 0.2, 0.42, xF * yF * 0.012);
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
          gl_FragColor = vec4(0.1, 0.22, 0.55, xF * yF * 0.07 * pulse);
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
      size: 0.1, color: 0x2563EB, transparent: true, opacity: 0.03,
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

      [floor.lineMat, floor.dotMat, ceiling.lineMat, ceiling.dotMat].forEach(m => {
        (m.uniforms as any).uTime.value = time;
        (m.uniforms as any).uCamZ.value = camZ;
      });

      (pathEdgeMat.uniforms as any).uTime.value = time;
      (pathEdgeMat.uniforms as any).uCamZ.value = camZ;
      (activeNodeMat.uniforms as any).uTime.value = time;
      (activeNodeMat.uniforms as any).uCamZ.value = camZ;

      radarMats.forEach((m, i) => {
        m.uniforms.uTime.value = time;
        radarRings[i].lookAt(camera.position);
      });

      const pArr = pulseGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < PULSE_COUNT; i++) {
        pulseProgress[i] += pulseSpeed[i];
        if (pulseProgress[i] > 1) {
          pulseProgress[i] = 0;
          pulseEdge[i] = Math.floor(Math.random() * totalPathEdges);
          const oArr = pulseGeo.attributes.outcome.array as Float32Array;
          oArr[i] = pathEdgeOutcome[pulseEdge[i] * 2];
          pulseGeo.attributes.outcome.needsUpdate = true;
        }
        const ei = pulseEdge[i] * 6;
        const pr = pulseProgress[i];
        pArr[i * 3]     = pathEdgePos[ei]     + (pathEdgePos[ei + 3] - pathEdgePos[ei]) * pr;
        pArr[i * 3 + 1] = pathEdgePos[ei + 1] + (pathEdgePos[ei + 4] - pathEdgePos[ei + 1]) * pr;
        pArr[i * 3 + 2] = pathEdgePos[ei + 2] + (pathEdgePos[ei + 5] - pathEdgePos[ei + 2]) * pr;
      }
      pulseGeo.attributes.position.needsUpdate = true;
      (pulseMat.uniforms as any).uTime.value = time;
      (pulseMat.uniforms as any).uCamZ.value = camZ;

      (scanMat.uniforms as any).uTime.value = t;
      const scanZ = camZ - 40 - Math.sin(t * 0.6) * 80;
      scanPlane.position.set(0, 0, scanZ);
      scanPlane.rotation.y = Math.sin(t * 0.3) * 0.15;

      (horizonMat.uniforms as any).uTime.value = time;
      horizonPlane.position.z = camZ - 300;

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
        background: "radial-gradient(ellipse 55% 50% at 50% 48%, rgba(11,17,32,0.88) 0%, rgba(11,17,32,0.75) 35%, rgba(11,17,32,0.45) 65%, rgba(11,17,32,0.15) 85%, transparent 100%)",
      }} />

      {/* Film grain */}
      <div className="absolute inset-0 z-[6] pointer-events-none opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }} />

      {/* Hero content */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div className="max-w-3xl flex flex-col items-center text-center px-6">

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="font-light"
             style={{
               fontSize: "clamp(2.5rem, 5vw, 4rem)",
               lineHeight: 1.08,
               letterSpacing: "-0.03em",
               color: "#E2E8F0",
               textShadow: "0 0 60px rgba(11,17,32,1), 0 0 120px rgba(11,17,32,0.95), 0 2px 40px rgba(11,17,32,0.9)",
             }}
          >
            Unlocking proactive healthcare for all.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 text-lg"
            style={{
              maxWidth: 1280,
              lineHeight: 1.7,
              letterSpacing: "-0.01em",
              color: "#94A3B8",
              textShadow: "0 0 30px rgba(11,17,32,1), 0 0 60px rgba(11,17,32,0.95)",
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
              className="group relative text-[13px] font-semibold uppercase text-white px-8 py-3.5 transition-all duration-500 overflow-hidden"
              style={{ letterSpacing: "0.08em", backgroundColor: "#2563EB" }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10">Request Demo</span>
            </a>
            <a
              href="#pipeline"
              className="group relative text-[13px] font-medium uppercase px-8 py-3.5 transition-all duration-500 overflow-hidden border"
              style={{ letterSpacing: "0.08em", color: "#E2E8F0", borderColor: "#2563EB" }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2563EB]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
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
        <span className="text-[10px] font-medium uppercase" style={{ letterSpacing: "0.3em", color: "rgba(148,163,184,0.3)" }}>
          Scroll to explore
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ color: "rgba(148,163,184,0.3)" }}
          className="text-sm"
        >
          ▾
        </motion.span>
      </motion.div>
    </section>
  );
};

export default HeroSection;
