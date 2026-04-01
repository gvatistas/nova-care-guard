import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

const BG = 0xe5e7eb;

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

    // ─── Grid floor + ceiling ───
    const GRID_W = 60;
    const GRID_D = 120;
    const SPACING = 2.5;

    const createGridPlane = (yOffset: number, flip: boolean) => {
      const group = new THREE.Group();
      const positions: number[] = [];
      // Longitudinal lines
      for (let x = -GRID_W / 2; x <= GRID_W / 2; x += 2) {
        const xp = x * SPACING;
        positions.push(xp, 0, 0, xp, 0, -GRID_D * SPACING);
      }
      // Lateral lines
      for (let z = 0; z <= GRID_D; z += 2) {
        const zp = -z * SPACING;
        positions.push((-GRID_W / 2) * SPACING, 0, zp, (GRID_W / 2) * SPACING, 0, zp);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uCamZ: { value: 0 } },
        vertexShader: `
          varying float vFade;
          uniform float uCamZ;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            float d = abs(wp.z - uCamZ);
            vFade = smoothstep(0.0, 30.0, d) * (1.0 - smoothstep(180.0, 280.0, d));
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `,
        fragmentShader: `
          varying float vFade;
          void main() {
            gl_FragColor = vec4(0.42, 0.44, 0.50, vFade * 0.05);
          }
        `,
      });
      group.add(new THREE.LineSegments(geo, mat));
      disposables.push(geo, mat);
      group.position.y = yOffset;
      if (flip) group.scale.y = -1;
      return { group, mat };
    };

    const floor = createGridPlane(-16, false);
    const ceiling = createGridPlane(16, true);
    scene.add(floor.group, ceiling.group);

    // ─── Decision tree generation ───
    const HALF_W = GRID_W / 2;
    const gridToWorld = (gx: number, gz: number, y: number) =>
      new THREE.Vector3(gx * SPACING, y, -gz * SPACING);

    interface Edge { from: number[]; to: number[]; outcome: number }
    interface Node { pos: number[]; outcome: number; depth: number }

    const allEdges: Edge[] = [];
    const allNodes: Node[] = [];

    const seeded = (s: number) => {
      let h = Math.imul(s ^ 0x5bd1e995, 0x5bd1e995);
      h = ((h >>> 13) ^ h) * 0x5bd1e995;
      return ((h >>> 15) ^ h) >>> 0;
    };

    const ROOTS = [
      { gx: -8, gz: 6, y: -16 },
      { gx: 10, gz: 14, y: -16 },
      { gx: -18, gz: 30, y: -16 },
      { gx: 4, gz: 45, y: -16 },
      { gx: -14, gz: 60, y: -16 },
      { gx: 16, gz: 75, y: -16 },
      { gx: -6, gz: 90, y: -16 },
      { gx: 6, gz: 10, y: 16 },
      { gx: -16, gz: 25, y: 16 },
      { gx: 14, gz: 42, y: 16 },
      { gx: -4, gz: 58, y: 16 },
      { gx: 18, gz: 72, y: 16 },
    ];

    ROOTS.forEach((root, ri) => {
      const build = (gx: number, gz: number, y: number, depth: number, outcome: number, seed: number) => {
        if (depth > 6 || gx < -HALF_W || gx > HALF_W || gz > GRID_D) return;
        const pos = [gx * SPACING, y, -gz * SPACING];
        allNodes.push({ pos, outcome, depth });
        const branches = depth < 2 ? 3 : seeded(seed + depth) % 3 === 0 ? 3 : 2;
        for (let b = 0; b < branches; b++) {
          const s = seeded(seed * 31 + b * 97 + depth * 13);
          const dz = 2 + (s % 3);
          const dx = ((s >> 4) % 5) - 2;
          const ngx = gx + dx;
          const ngz = gz + dz;
          if (ngx < -HALF_W || ngx > HALF_W || ngz > GRID_D) continue;
          const childOutcome = (s % 100) / 100 > 0.8 ? 0.9 : Math.max(0, outcome * 0.5);
          const childPos = [ngx * SPACING, y, -ngz * SPACING];
          allEdges.push({ from: pos, to: childPos, outcome: childOutcome });
          allNodes.push({ pos: childPos, outcome: childOutcome, depth: depth + 1 });
          build(ngx, ngz, y, depth + 1, childOutcome, s);
        }
      };
      build(root.gx, root.gz, root.y, 0, 0.3 + (ri % 3) * 0.15, ri * 1337 + 42);
    });

    // ─── Edge lines ───
    const edgePos: number[] = [];
    const edgeOut: number[] = [];
    allEdges.forEach((e) => {
      edgePos.push(...e.from, ...e.to);
      edgeOut.push(e.outcome, e.outcome);
    });
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.Float32BufferAttribute(edgePos, 3));
    edgeGeo.setAttribute("outcome", new THREE.Float32BufferAttribute(edgeOut, 1));
    const edgeMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: { value: 0 }, uCamZ: { value: 0 } },
      vertexShader: `
        varying float vDist;
        uniform float uCamZ;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vDist = abs(wp.z - uCamZ);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        varying float vDist;
        void main() {
          float fade = smoothstep(5.0, 25.0, vDist) * (1.0 - smoothstep(160.0, 280.0, vDist));
          gl_FragColor = vec4(0.72, 0.74, 0.78, fade * 0.1);
        }
      `,
    });
    scene.add(new THREE.LineSegments(edgeGeo, edgeMat));
    disposables.push(edgeGeo, edgeMat);

    // ─── Decision nodes ───
    const nodePos: number[] = [];
    const nodeOut: number[] = [];
    const nodeDepth: number[] = [];
    allNodes.forEach((n) => {
      nodePos.push(...n.pos);
      nodeOut.push(n.outcome);
      nodeDepth.push(n.depth);
    });
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.Float32BufferAttribute(nodePos, 3));
    nodeGeo.setAttribute("outcome", new THREE.Float32BufferAttribute(nodeOut, 1));
    nodeGeo.setAttribute("depth", new THREE.Float32BufferAttribute(nodeDepth, 1));
    const nodeMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: { value: 0 }, uCamZ: { value: 0 } },
      vertexShader: `
        attribute float outcome, depth;
        varying float vOut, vAlpha;
        uniform float uTime, uCamZ;
        void main() {
          vOut = outcome;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          float d = abs(wp.z - uCamZ);
          float df = smoothstep(5.0, 20.0, d) * (1.0 - smoothstep(140.0, 240.0, d));
          float pulse = 0.5 + 0.5 * sin(uTime * 3.0 + depth * 2.0 + position.x * 0.5);
          vAlpha = df * pulse;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float sz = mix(8.0, 4.0, depth / 6.0);
          gl_PointSize = max(2.0, sz * df * (140.0 / -mv.z));
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying float vOut, vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          if (d > 1.0) discard;
          float core = exp(-d * d * 3.0);
          float halo = exp(-d * d * 0.8) * 0.4;
          float glow = exp(-d * 0.5) * 0.15;
          vec3 red = vec3(0.88, 0.15, 0.15);
          vec3 amber = vec3(0.85, 0.55, 0.1);
          vec3 green = vec3(0.02, 0.59, 0.42);
          vec3 col;
          if (vOut < 0.5) col = mix(red, amber, vOut * 2.0);
          else col = mix(amber, green, (vOut - 0.5) * 2.0);
          float bright = core + halo + glow;
          gl_FragColor = vec4(col * bright, bright * vAlpha * 0.7);
        }
      `,
    });
    scene.add(new THREE.Points(nodeGeo, nodeMat));
    disposables.push(nodeGeo, nodeMat);

    // ─── Traveling pulses along edges — red→green transition ───
    const PULSE_COUNT = 400;
    const pulsePositions = new Float32Array(PULSE_COUNT * 3);
    const pulseProgressAttr = new Float32Array(PULSE_COUNT);
    const pulseProgress = new Float32Array(PULSE_COUNT);
    const pulseEdgeIdx = new Int32Array(PULSE_COUNT);
    const pulseSpeed = new Float32Array(PULSE_COUNT);
    const totalEdges = edgePos.length / 6;

    for (let i = 0; i < PULSE_COUNT; i++) {
      pulseEdgeIdx[i] = Math.floor(Math.random() * totalEdges);
      pulseProgress[i] = Math.random();
      pulseProgressAttr[i] = pulseProgress[i];
      pulseSpeed[i] = 0.004 + Math.random() * 0.012;
    }
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePositions, 3));
    pulseGeo.setAttribute("progress", new THREE.BufferAttribute(pulseProgressAttr, 1));
    const pulseMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uCamZ: { value: 0 }, uTime: { value: 0 } },
      vertexShader: `
        attribute float progress;
        varying float vAlpha, vProgress;
        uniform float uCamZ, uTime;
        void main() {
          vProgress = progress;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          float d = abs(wp.z - uCamZ);
          vAlpha = smoothstep(5.0, 15.0, d) * (1.0 - smoothstep(150.0, 260.0, d));
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float pulse = 1.0 + 0.3 * sin(uTime * 4.0 + position.z * 0.3);
          gl_PointSize = max(3.0, 10.0 * vAlpha * pulse * (130.0 / -mv.z));
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying float vAlpha, vProgress;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          if (d > 1.0) discard;
          float core = exp(-d * d * 2.0);
          float glow = exp(-d * 0.5) * 0.6;
          float outer = exp(-d * 0.3) * 0.2;
          vec3 red = vec3(0.95, 0.2, 0.15);
          vec3 amber = vec3(0.9, 0.6, 0.1);
          vec3 green = vec3(0.05, 0.75, 0.45);
          vec3 col;
          if (vProgress < 0.4) col = mix(red, amber, vProgress / 0.4);
          else col = mix(amber, green, (vProgress - 0.4) / 0.6);
          float bright = core + glow + outer;
          gl_FragColor = vec4(col * bright * 1.2, bright * vAlpha * 0.85);
        }
      `,
    });
    scene.add(new THREE.Points(pulseGeo, pulseMat));
    disposables.push(pulseGeo, pulseMat);

    // ─── Ambient dust ───
    const DUST = 400;
    const dustPos = new Float32Array(DUST * 3);
    const dustVel = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 100;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      dustPos[i * 3 + 2] = -Math.random() * 220;
      dustVel[i * 3] = (Math.random() - 0.5) * 0.003;
      dustVel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      dustVel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x6b7280,
      transparent: true,
      opacity: 0.025,
      sizeAttenuation: true,
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
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ─── Animation loop ───
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
      camera.position.x = mouse.x * 3;
      camera.position.y = mouse.y * -1.5;
      camera.lookAt(camera.position.x * 0.3, 0, camZ - 100);

      const time = t * 3;

      // Update uniforms
      [floor.mat, ceiling.mat].forEach((m) => {
        (m.uniforms as any).uCamZ.value = camZ;
      });
      (edgeMat.uniforms as any).uTime.value = time;
      (edgeMat.uniforms as any).uCamZ.value = camZ;
      (nodeMat.uniforms as any).uTime.value = time;
      (nodeMat.uniforms as any).uCamZ.value = camZ;
      (pulseMat.uniforms as any).uCamZ.value = camZ;
      (pulseMat.uniforms as any).uTime.value = time;

      // Animate pulses along edges
      const pArr = pulseGeo.attributes.position.array as Float32Array;
      const progArr = pulseGeo.attributes.progress.array as Float32Array;
      for (let i = 0; i < PULSE_COUNT; i++) {
        pulseProgress[i] += pulseSpeed[i];
        if (pulseProgress[i] > 1) {
          pulseProgress[i] = 0;
          pulseEdgeIdx[i] = Math.floor(Math.random() * totalEdges);
        }
        const ei = pulseEdgeIdx[i] * 6;
        const pr = pulseProgress[i];
        pArr[i * 3] = edgePos[ei] + (edgePos[ei + 3] - edgePos[ei]) * pr;
        pArr[i * 3 + 1] = edgePos[ei + 1] + (edgePos[ei + 4] - edgePos[ei + 1]) * pr;
        pArr[i * 3 + 2] = edgePos[ei + 2] + (edgePos[ei + 5] - edgePos[ei + 2]) * pr;
        progArr[i] = pr;
      }
      pulseGeo.attributes.position.needsUpdate = true;
      pulseGeo.attributes.progress.needsUpdate = true;

      // Animate dust
      const dArr = dustGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < DUST; i++) {
        dArr[i * 3] += dustVel[i * 3];
        dArr[i * 3 + 1] += dustVel[i * 3 + 1];
        dArr[i * 3 + 2] += dustVel[i * 3 + 2];
        if (dArr[i * 3 + 2] > camZ + 10) {
          dArr[i * 3] = (Math.random() - 0.5) * 100;
          dArr[i * 3 + 1] = (Math.random() - 0.5) * 30;
          dArr[i * 3 + 2] = camZ - 160 - Math.random() * 60;
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
      disposables.forEach((d) => d.dispose());
    };
  }, []);

  return (
    <section className="relative h-screen overflow-hidden" style={{ background: "#E5E7EB" }}>
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Central vignette for text readability */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 50% 48%, rgba(229,231,235,0.88) 0%, rgba(229,231,235,0.55) 40%, rgba(229,231,235,0.2) 70%, transparent 100%)",
        }}
      />

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
              color: "#111827",
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
              color: "#374151",
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
              className="group relative text-[13px] font-semibold uppercase text-white px-8 py-3.5 transition-all duration-500 overflow-hidden hover:bg-[#374151]"
              style={{ letterSpacing: "0.08em", backgroundColor: "#111827" }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10">Request Demo</span>
            </a>
            <a
              href="#pipeline"
              className="group relative text-[13px] font-medium uppercase px-8 py-3.5 transition-all duration-500 overflow-hidden border hover:bg-[#111827] hover:text-white hover:border-[#111827]"
              style={{ letterSpacing: "0.08em", color: "#374151", borderColor: "#374151" }}
            >
              <span className="relative z-10 transition-colors duration-300">Read White Paper</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
