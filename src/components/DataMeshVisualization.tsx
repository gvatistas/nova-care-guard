import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const NODE_COUNT = 400;
const PARTICLE_COUNT = 160;

function Mesh() {
  const data = useMemo(() => {
    const pos = new Float32Array(NODE_COUNT * 3);
    const base = new Float32Array(NODE_COUNT * 3);
    const vel = new Float32Array(NODE_COUNT * 3);
    const colors = new Float32Array(NODE_COUNT * 3).fill(1.0);

    for (let i = 0; i < NODE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 60;
      pos.set([x, y, z], i * 3);
      base.set([x, y, z], i * 3);
      vel.set([(Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.008, (Math.random() - 0.5) * 0.006], i * 3);
    }

    const edges: number[] = [];
    const adj: Map<number, number[]> = new Map();
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = pos[i * 3] - pos[j * 3], dy = pos[i * 3 + 1] - pos[j * 3 + 1], dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < 64 && Math.random() < 0.15) {
          edges.push(i, j);
          if (!adj.has(i)) adj.set(i, []);
          if (!adj.has(j)) adj.set(j, []);
          adj.get(i)!.push(j);
          adj.get(j)!.push(i);
        }
      }
    }

    // Find triangular facets: triplets where all 3 pairs are connected
    const triIndices: number[] = [];
    const edgeSet = new Set<string>();
    for (let e = 0; e < edges.length; e += 2) {
      edgeSet.add(`${edges[e]}-${edges[e + 1]}`);
      edgeSet.add(`${edges[e + 1]}-${edges[e]}`);
    }
    const triSeen = new Set<string>();
    for (const [a, neighbors] of adj) {
      for (const b of neighbors) {
        for (const c of (adj.get(b) || [])) {
          if (c > a && c !== a && edgeSet.has(`${a}-${c}`)) {
            const key = [a, b, c].sort().join(",");
            if (!triSeen.has(key)) {
              triSeen.add(key);
              triIndices.push(a, b, c);
              if (triIndices.length > 300) break; // cap for perf
            }
          }
        }
        if (triIndices.length > 300) break;
      }
      if (triIndices.length > 300) break;
    }

    const triPos = new Float32Array(triIndices.length * 3);

    const epos = new Float32Array(edges.length * 3);
    const ppos = new Float32Array(PARTICLE_COUNT * 3);
    const pmeta = Array.from({ length: PARTICLE_COUNT }, () => ({
      e: edges.length > 0 ? ((Math.random() * edges.length / 2) | 0) * 2 : 0,
      t: Math.random(),
      s: 0.001 + Math.random() * 0.003,
    }));

    // Pick 6 random pulse centers
    const pulseCenters = Array.from({ length: 6 }, () => {
      const idx = (Math.random() * NODE_COUNT) | 0;
      return new THREE.Vector3(pos[idx * 3], pos[idx * 3 + 1], pos[idx * 3 + 2]);
    });

    return { pos, base, vel, colors, edges, epos, ppos, pmeta, pulseCenters, pulse: { t: -10, c: 0 }, risk: { t: -10, i: 0 }, triIndices, triPos };
  }, []);

  const nodesRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const partsRef = useRef<THREE.Points>(null);
  const trisRef = useRef<THREE.Mesh>(null);
  const lastEvent = useRef(0);
  const partsRef = useRef<THREE.Points>(null);
  const lastEvent = useRef(0);

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;

    if (t - lastEvent.current > 3 + Math.random()) {
      lastEvent.current = t;
      if (Math.random() > 0.2) {
        data.pulse = { t, c: (Math.random() * 6) | 0 };
      } else {
        data.risk = { t, i: (Math.random() * NODE_COUNT) | 0 };
      }
    }

    camera.position.z = 30 - Math.sin(t * 0.03) * 2;
    camera.position.x = Math.sin(t * 0.02) * 1.5;
    camera.position.y = Math.cos(t * 0.025) * 1;

    for (let i = 0; i < NODE_COUNT; i++) {
      const j = i * 3;
      data.pos[j] += data.vel[j] + Math.sin(t * 0.3 + i * 0.1) * 0.001;
      data.pos[j + 1] += data.vel[j + 1] + Math.cos(t * 0.25 + i * 0.07) * 0.001;
      data.pos[j + 2] += data.vel[j + 2];
      for (let k = 0; k < 3; k++) {
        if (Math.abs(data.pos[j + k] - data.base[j + k]) > 3) data.vel[j + k] *= -1;
      }
    }

    const nc = data.colors;
    const pc = data.pulseCenters[data.pulse.c];
    for (let i = 0; i < NODE_COUNT; i++) {
      const j = i * 3;
      const depth = Math.max(0.2, Math.min(1.0, (data.pos[j + 2] + 30) / 60));
      const b = 0.6 + 0.4 * depth;

      const dx = data.pos[j] - pc.x, dy = data.pos[j + 1] - pc.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const pe = t - data.pulse.t;
      const wave = pe < 2.5 ? Math.max(0, 1 - Math.abs(pe * 5 - dist) / 4) * Math.max(0, 1 - pe / 2.5) : 0;

      const isRisk = i === data.risk.i && t - data.risk.t < 0.5;
      const rs = isRisk ? Math.max(0, 1 - (t - data.risk.t) / 0.5) : 0;

      if (rs > 0.01) {
        nc[j] = b * (1 - rs) + 0.96 * rs;
        nc[j + 1] = b * (1 - rs) + 0.62 * rs;
        nc[j + 2] = b * (1 - rs) + 0.04 * rs;
      } else if (wave > 0.01) {
        nc[j] = b * (1 - wave) + 0.063 * wave;
        nc[j + 1] = b * (1 - wave) + 0.725 * wave;
        nc[j + 2] = b * (1 - wave) + 0.506 * wave;
      } else {
        nc[j] = b; nc[j + 1] = b; nc[j + 2] = b;
      }
    }

    for (let i = 0; i < data.edges.length; i += 2) {
      const a = data.edges[i] * 3, b2 = data.edges[i + 1] * 3, o = i * 3;
      data.epos[o] = data.pos[a]; data.epos[o + 1] = data.pos[a + 1]; data.epos[o + 2] = data.pos[a + 2];
      data.epos[o + 3] = data.pos[b2]; data.epos[o + 4] = data.pos[b2 + 1]; data.epos[o + 5] = data.pos[b2 + 2];
    }

    if (data.edges.length > 0) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const m = data.pmeta[i];
        if (m.e >= data.edges.length) m.e = 0;
        const a = data.edges[m.e] * 3, b2 = data.edges[m.e + 1] * 3;
        m.t = (m.t + m.s) % 1;
        data.ppos[i * 3] = THREE.MathUtils.lerp(data.pos[a], data.pos[b2], m.t);
        data.ppos[i * 3 + 1] = THREE.MathUtils.lerp(data.pos[a + 1], data.pos[b2 + 1], m.t);
        data.ppos[i * 3 + 2] = THREE.MathUtils.lerp(data.pos[a + 2], data.pos[b2 + 2], m.t);
      }
    }

    // Update triangle facet positions
    for (let i = 0; i < data.triIndices.length; i++) {
      const ni = data.triIndices[i] * 3;
      data.triPos[i * 3] = data.pos[ni];
      data.triPos[i * 3 + 1] = data.pos[ni + 1];
      data.triPos[i * 3 + 2] = data.pos[ni + 2];
    }

    if (nodesRef.current) {
      (nodesRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (nodesRef.current.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }
    if (linesRef.current) {
      (linesRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
    if (partsRef.current) {
      (partsRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
    if (trisRef.current) {
      (trisRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  return (
    <>
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[data.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.06} sizeAttenuation transparent opacity={0.95} vertexColors depthWrite={false} />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.epos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#94a3b8" transparent opacity={0.08} depthWrite={false} />
      </lineSegments>
      <points ref={partsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.ppos, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#ffffff" size={0.035} sizeAttenuation transparent opacity={0.8} depthWrite={false} />
      </points>
      {data.triIndices.length > 0 && (
        <mesh ref={trisRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[data.triPos, 3]} />
          </bufferGeometry>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.03} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}
    </>
  );
}

function Grid() {
  const geo = useMemo(() => {
    const p: number[] = [];
    for (let x = -60; x <= 60; x += 2) { p.push(x, -40, -32, x, 40, -32); }
    for (let y = -40; y <= 40; y += 2) { p.push(-60, y, -32, 60, y, -32); }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
    return g;
  }, []);
  return <lineSegments geometry={geo}><lineBasicMaterial color="#ffffff" transparent opacity={0.02} /></lineSegments>;
}

export default function DataMeshVisualization() {
  return (
    <Canvas
      camera={{ position: [0, 0, 30], fov: 60 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ scene }) => { scene.background = new THREE.Color("#000000"); }}
      dpr={[1, 1.5]}
      style={{ position: "absolute", inset: 0 }}
    >
      <Grid />
      <Mesh />
    </Canvas>
  );
}
