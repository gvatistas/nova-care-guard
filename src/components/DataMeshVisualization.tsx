import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const N = 260, EDGE_PAIRS = 520, P = 140, C = 4;

function Mesh() {
  const data = useMemo(() => {
    const pos = new Float32Array(N * 3);
    const base = new Float32Array(N * 3);
    const vel = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3).fill(0.75);
    const clusters = Array.from({ length: C }, () =>
      new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 6 - 2)
    );

    for (let i = 0; i < N; i++) {
      const c = clusters[i % C];
      const x = c.x + (Math.random() - 0.5) * 3;
      const y = c.y + (Math.random() - 0.5) * 2;
      const z = c.z + (Math.random() - 0.5) * 3;
      pos.set([x, y, z], i * 3);
      base.set([x, y, z], i * 3);
      vel.set([(Math.random() - 0.5) * 0.002, (Math.random() - 0.5) * 0.002, (Math.random() - 0.5) * 0.001], i * 3);
    }

    const edges: number[] = [];
    for (let i = 0; i < N && edges.length / 2 < EDGE_PAIRS; i++) {
      for (let j = i + 1; j < N && edges.length / 2 < EDGE_PAIRS; j++) {
        const dx = pos[i * 3] - pos[j * 3], dy = pos[i * 3 + 1] - pos[j * 3 + 1], dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 2.5 && Math.random() < 0.25) {
          edges.push(i, j);
        }
      }
    }

    const epos = new Float32Array(edges.length * 3);
    const ppos = new Float32Array(P * 3);
    const pmeta = Array.from({ length: P }, () => {
      const k = ((Math.random() * edges.length / 2) | 0) * 2;
      return { e: k, t: Math.random(), s: 0.002 + Math.random() * 0.004 };
    });

    return { pos, base, vel, colors, edges, epos, ppos, pmeta, clusters, pulse: { t: -10, c: 0 }, risk: { t: -10, i: 0 } };
  }, []);

  const nodesRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const partsRef = useRef<THREE.Points>(null);
  const lastEvent = useRef(0);

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;

    // Trigger events every 3-4s
    if (t - lastEvent.current > 3 + Math.random()) {
      lastEvent.current = t;
      if (Math.random() > 0.2) {
        data.pulse = { t, c: (Math.random() * C) | 0 };
      } else {
        data.risk = { t, i: (Math.random() * N) | 0 };
      }
    }

    // Camera drift
    camera.position.z = 8 - Math.sin(t * 0.05) * 0.5;
    camera.position.x = Math.sin(t * 0.03) * 0.3;
    camera.position.y = Math.cos(t * 0.04) * 0.2;

    // Breathing node movement
    for (let i = 0; i < N; i++) {
      const j = i * 3;
      data.pos[j] += data.vel[j] + Math.sin(t + i) * 0.0007;
      data.pos[j + 1] += data.vel[j + 1] + Math.cos(t * 1.2 + i) * 0.0007;
      data.pos[j + 2] += data.vel[j + 2];
      for (let k = 0; k < 3; k++) {
        if (Math.abs(data.pos[j + k] - data.base[j + k]) > 1.2) data.vel[j + k] *= -1;
      }
    }

    // Node colors: depth-based brightness + pulse + risk
    const nc = data.colors;
    const pulseCenter = data.clusters[data.pulse.c];
    for (let i = 0; i < N; i++) {
      const j = i * 3;
      const depth = Math.max(0.15, 1 - (data.pos[j + 2] + 6) / 12);
      const brightness = 0.5 + 0.4 * depth;

      // Emerald pulse
      const dx = data.pos[j] - pulseCenter.x, dy = data.pos[j + 1] - pulseCenter.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const pulseElapsed = t - data.pulse.t;
      const pulseWave = Math.max(0, 1 - Math.abs(pulseElapsed * 3 - dist) / 2);
      const pulseStrength = pulseElapsed < 2 ? pulseWave * Math.max(0, 1 - pulseElapsed / 2) : 0;

      // Amber risk
      const isRisk = i === data.risk.i && t - data.risk.t < 0.4;
      const riskStrength = isRisk ? Math.max(0, 1 - (t - data.risk.t) / 0.4) : 0;

      if (riskStrength > 0.01) {
        nc[j] = 0.96; nc[j + 1] = 0.62; nc[j + 2] = 0.04;
      } else if (pulseStrength > 0.01) {
        const ps = pulseStrength;
        nc[j] = brightness * (1 - ps) + 0.063 * ps;
        nc[j + 1] = brightness * (1 - ps) + 0.725 * ps;
        nc[j + 2] = brightness * (1 - ps) + 0.506 * ps;
      } else {
        nc[j] = brightness; nc[j + 1] = brightness; nc[j + 2] = brightness;
      }
    }

    // Edge positions
    for (let i = 0; i < data.edges.length; i += 2) {
      const a = data.edges[i] * 3, b = data.edges[i + 1] * 3, o = i * 3;
      data.epos[o] = data.pos[a]; data.epos[o + 1] = data.pos[a + 1]; data.epos[o + 2] = data.pos[a + 2];
      data.epos[o + 3] = data.pos[b]; data.epos[o + 4] = data.pos[b + 1]; data.epos[o + 5] = data.pos[b + 2];
    }

    // Particle flow along edges
    for (let i = 0; i < P; i++) {
      const m = data.pmeta[i];
      if (m.e >= data.edges.length) m.e = 0;
      const a = data.edges[m.e] * 3, b = data.edges[m.e + 1] * 3;
      m.t = (m.t + m.s) % 1;
      data.ppos[i * 3] = THREE.MathUtils.lerp(data.pos[a], data.pos[b], m.t);
      data.ppos[i * 3 + 1] = THREE.MathUtils.lerp(data.pos[a + 1], data.pos[b + 1], m.t);
      data.ppos[i * 3 + 2] = THREE.MathUtils.lerp(data.pos[a + 2], data.pos[b + 2], m.t);
    }

    // Flag updates
    if (nodesRef.current) {
      const g = nodesRef.current.geometry;
      (g.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (g.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }
    if (linesRef.current) {
      (linesRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
    if (partsRef.current) {
      (partsRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  return (
    <>
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[data.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.03} sizeAttenuation transparent opacity={0.9} vertexColors depthWrite={false} />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.epos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#94a3b8" transparent opacity={0.12} depthWrite={false} />
      </lineSegments>
      <points ref={partsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.ppos, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#ffffff" size={0.018} sizeAttenuation transparent opacity={0.85} depthWrite={false} />
      </points>
    </>
  );
}

function Grid() {
  const geo = useMemo(() => {
    const p: number[] = [];
    for (let x = -20; x <= 20; x += 1) { p.push(x, -20, -8, x, 20, -8); }
    for (let y = -20; y <= 20; y += 1) { p.push(-20, y, -8, 20, y, -8); }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
    return g;
  }, []);
  return <lineSegments geometry={geo}><lineBasicMaterial color="#ffffff" transparent opacity={0.02} /></lineSegments>;
}

export default function DataMeshVisualization() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ scene }) => { scene.background = new THREE.Color("#000000"); }}
        dpr={[1, 1.5]}
      >
        <Grid />
        <Mesh />
      </Canvas>
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}
