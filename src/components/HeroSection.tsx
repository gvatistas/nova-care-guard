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
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 600);
    camera.position.set(0, 0, 0);
    camera.lookAt(0, 0, -100);

    // ─── Infinite corridor mesh — floor + ceiling ───
    const GRID_W = 80;
    const GRID_D = 120;
    const SPACING = 2.2;

    const createGridPlane = (yOffset: number, flip: boolean) => {
      const group = new THREE.Group();

      // Grid lines
      const linePositions: number[] = [];
      // Longitudinal lines (going into distance)
      for (let x = -GRID_W / 2; x <= GRID_W / 2; x++) {
        const xp = x * SPACING;
        linePositions.push(xp, 0, 0, xp, 0, -GRID_D * SPACING);
      }
      // Lateral lines
      for (let z = 0; z <= GRID_D; z++) {
        const zp = -z * SPACING;
        linePositions.push(-GRID_W / 2 * SPACING, 0, zp, GRID_W / 2 * SPACING, 0, zp);
      }
      // Diagonal connections for triangular mesh feel
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
        transparent: true,
        depthWrite: false,
        uniforms: {
          uCamZ: { value: 0 },
          uTime: { value: 0 },
        },
        vertexShader: `
          varying float vDist;
          varying float vFade;
          uniform float uCamZ;
          void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vDist = abs(worldPos.z - uCamZ);
            vFade = smoothstep(0.0, 30.0, vDist) * (1.0 - smoothstep(180.0, 260.0, vDist));
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `,
        fragmentShader: `
          varying float vDist;
          varying float vFade;
          void main() {
            float alpha = vFade * 0.08;
            gl_FragColor = vec4(0.6, 0.7, 0.8, alpha);
          }
        `,
      });
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      group.add(lines);

      // Node dots at intersections
      const dotPositions: number[] = [];
      const dotAlphas: number[] = [];
      for (let x = -GRID_W / 2; x <= GRID_W / 2; x += 1) {
        for (let z = 0; z <= GRID_D; z += 1) {
          dotPositions.push(x * SPACING, 0, -z * SPACING);
          // Brighter toward center column, fading at edges
          const centerFade = 1 - Math.abs(x) / (GRID_W / 2) * 0.6;
          dotAlphas.push(centerFade);
        }
      }
      const dotGeo = new THREE.BufferGeometry();
      dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(dotPositions, 3));
      dotGeo.setAttribute("alpha", new THREE.Float32BufferAttribute(dotAlphas, 1));

      const dotMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uCamZ: { value: 0 },
        },
        vertexShader: `
          attribute float alpha;
          varying float vAlpha;
          varying float vDist;
          uniform float uTime;
          uniform float uCamZ;
          void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vDist = abs(worldPos.z - uCamZ);
            float distFade = smoothstep(0.0, 20.0, vDist) * (1.0 - smoothstep(150.0, 250.0, vDist));
            float pulse = 1.0 + sin(uTime * 1.5 + position.x * 0.8 + position.z * 0.3) * 0.2;
            vAlpha = alpha * distFade * pulse;
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = max(1.0, (3.5 * alpha * distFade) * (120.0 / -mvPos.z));
            gl_Position = projectionMatrix * mvPos;
          }
        `,
        fragmentShader: `
          varying float vAlpha;
          varying float vDist;
          void main() {
            float d = length(gl_PointCoord - 0.5) * 2.0;
            if (d > 1.0) discard;
            float core = exp(-d * d * 5.0) * vAlpha;
            float halo = (1.0 - d * d) * vAlpha * 0.15;
            float brightness = core + halo;
            gl_FragColor = vec4(0.85, 0.9, 1.0, brightness * 0.5);
          }
        `,
      });
      const dots = new THREE.Points(dotGeo, dotMat);
      group.add(dots);

      group.position.y = yOffset;
      if (flip) group.scale.y = -1;

      return { group, lineMat, dotMat, lineGeo, dotGeo };
    };

    const floor = createGridPlane(-18, false);
    const ceiling = createGridPlane(18, true);
    scene.add(floor.group);
    scene.add(ceiling.group);

    // ─── Horizon glow ───
    const horizonGeo = new THREE.PlaneGeometry(300, 8, 1, 1);
    const horizonMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          float xFade = exp(-pow((vUv.x - 0.5) * 2.0, 2.0) * 1.5);
          float yFade = exp(-pow((vUv.y - 0.5) * 2.0, 2.0) * 8.0);
          float pulse = 0.8 + 0.2 * sin(uTime * 0.5);
          float alpha = xFade * yFade * 0.12 * pulse;
          gl_FragColor = vec4(0.7, 0.8, 0.95, alpha);
        }
      `,
    });
    const horizonPlane = new THREE.Mesh(horizonGeo, horizonMat);
    horizonPlane.position.set(0, 0, -260);
    scene.add(horizonPlane);

    // ─── Ambient dust ───
    const DUST_COUNT = 400;
    const dustPos = new Float32Array(DUST_COUNT * 3);
    const dustVel = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 100;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      dustPos[i * 3 + 2] = -Math.random() * 200;
      dustVel[i * 3] = (Math.random() - 0.5) * 0.003;
      dustVel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      dustVel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.08, color: 0x556677, transparent: true, opacity: 0.08,
      sizeAttenuation: true, blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(dustGeo, dustMat));

    // ─── Scan wave — travels along the corridor ───
    const scanGeo = new THREE.PlaneGeometry(200, 40, 1, 1);
    const scanMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `
        varying vec2 vUv;
        void main() {
          float xFade = exp(-pow((vUv.x - 0.5) * 2.0, 2.0) * 3.0);
          float yFade = exp(-pow((vUv.y - 0.5) * 2.0, 2.0) * 2.0);
          float alpha = xFade * yFade * 0.03;
          gl_FragColor = vec4(0.5, 0.7, 0.9, alpha);
        }
      `,
    });
    const scanPlane = new THREE.Mesh(scanGeo, scanMat);
    scanPlane.rotation.x = Math.PI * 0.5;
    scene.add(scanPlane);

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

      // Smooth mouse
      mouse.x += (mouse.tx - mouse.x) * 0.015;
      mouse.y += (mouse.ty - mouse.y) * 0.015;

      // Slow drift forward
      const camZ = -t * 3;
      camera.position.z = camZ;
      camera.position.x = mouse.x * 3;
      camera.position.y = mouse.y * -1.5;
      camera.lookAt(camera.position.x * 0.3, 0, camZ - 100);

      // Update uniforms
      const allMats = [floor.lineMat, floor.dotMat, ceiling.lineMat, ceiling.dotMat];
      allMats.forEach(m => {
        (m.uniforms as any).uTime.value = t * 3;
        (m.uniforms as any).uCamZ.value = camZ;
      });
      (horizonMat.uniforms as any).uTime.value = t * 3;
      horizonPlane.position.z = camZ - 260;
      (scanMat.uniforms as any).uTime.value = t;

      // Scan wave position — oscillates along corridor
      const scanZ = camZ - 30 - Math.sin(t * 0.8) * 60;
      scanPlane.position.z = scanZ;
      scanPlane.position.y = 0;

      // Dust drift
      const dArr = dustGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < DUST_COUNT; i++) {
        dArr[i * 3] += dustVel[i * 3];
        dArr[i * 3 + 1] += dustVel[i * 3 + 1];
        dArr[i * 3 + 2] += dustVel[i * 3 + 2];
        // Recycle particles that fall behind camera
        if (dArr[i * 3 + 2] > camZ + 10) {
          dArr[i * 3] = (Math.random() - 0.5) * 100;
          dArr[i * 3 + 1] = (Math.random() - 0.5) * 30;
          dArr[i * 3 + 2] = camZ - 150 - Math.random() * 50;
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
      [floor, ceiling].forEach(g => {
        g.lineGeo.dispose(); g.dotGeo.dispose();
        g.lineMat.dispose(); g.dotMat.dispose();
      });
      horizonGeo.dispose(); horizonMat.dispose();
      dustGeo.dispose(); dustMat.dispose();
      scanGeo.dispose(); scanMat.dispose();
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
