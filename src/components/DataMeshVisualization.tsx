import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 300;
const EDGE_COUNT = 500;
const PARTICLE_COUNT = 120;
const CLUSTER_COUNT = 5;

function DataMesh() {
  const nodesRef = useRef<THREE.Points>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const rippleRef = useRef({ time: 0, cluster: 0, active: false });
  const amberRef = useRef({ time: 0, node: -1 });
  const lastEventRef = useRef(0);

  const { nodePositions, nodeVelocities, edgePairs, clusters, nodeDepths } = useMemo(() => {
    const pos = new Float32Array(NODE_COUNT * 3);
    const vel = new Float32Array(NODE_COUNT * 3);
    const depths = new Float32Array(NODE_COUNT);
    
    // Create clusters
    const cls: number[][] = [];
    for (let c = 0; c < CLUSTER_COUNT; c++) {
      cls.push([]);
    }

    for (let i = 0; i < NODE_COUNT; i++) {
      const cluster = i < CLUSTER_COUNT * 8 ? Math.floor(i / 8) : -1;
      const cx = cluster >= 0 ? (cluster - 2) * 3 + (Math.random() - 0.5) * 2 : (Math.random() - 0.5) * 18;
      const cy = cluster >= 0 ? (Math.random() - 0.5) * 3 : (Math.random() - 0.5) * 10;
      const cz = cluster >= 0 ? (Math.random() - 0.5) * 2 - 2 : (Math.random() - 0.5) * 8 - 4;
      
      pos[i * 3] = cx;
      pos[i * 3 + 1] = cy;
      pos[i * 3 + 2] = cz;
      vel[i * 3] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
      depths[i] = cz;
      
      if (cluster >= 0) cls[cluster].push(i);
    }

    // Build edges connecting nearby nodes
    const edges: [number, number][] = [];
    const maxDist = 2.8;
    for (let i = 0; i < NODE_COUNT && edges.length < EDGE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT && edges.length < EDGE_COUNT; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < maxDist && Math.random() < 0.3) {
          edges.push([i, j]);
        }
      }
    }

    return { nodePositions: pos, nodeVelocities: vel, edgePairs: edges, clusters: cls, nodeDepths: depths };
  }, []);

  // Particle state: each particle travels along an edge
  const particleState = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const progress = new Float32Array(PARTICLE_COUNT);
    const edgeIdx = new Int32Array(PARTICLE_COUNT);
    const speed = new Float32Array(PARTICLE_COUNT);
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      edgeIdx[i] = Math.floor(Math.random() * edgePairs.length);
      progress[i] = Math.random();
      speed[i] = 0.002 + Math.random() * 0.004;
    }
    return { pos, progress, edgeIdx, speed };
  }, [edgePairs]);

  // Node colors for ripple/amber effects
  const nodeColors = useMemo(() => {
    const c = new Float32Array(NODE_COUNT * 3);
    for (let i = 0; i < NODE_COUNT; i++) {
      c[i * 3] = 0.85; c[i * 3 + 1] = 0.85; c[i * 3 + 2] = 0.85;
    }
    return c;
  }, []);

  const nodeSizes = useMemo(() => {
    const s = new Float32Array(NODE_COUNT);
    for (let i = 0; i < NODE_COUNT; i++) {
      const depth = nodeDepths[i];
      s[i] = Math.max(0.8, 3.0 + depth * 0.4);
    }
    return s;
  }, [nodeDepths]);

  // Geometries
  const nodeGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(nodePositions, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(nodeColors, 3));
    g.setAttribute("size", new THREE.Float32BufferAttribute(nodeSizes, 1));
    return g;
  }, [nodePositions, nodeColors, nodeSizes]);

  const edgeGeo = useMemo(() => {
    const pos: number[] = [];
    edgePairs.forEach(([a, b]) => {
      pos.push(nodePositions[a * 3], nodePositions[a * 3 + 1], nodePositions[a * 3 + 2]);
      pos.push(nodePositions[b * 3], nodePositions[b * 3 + 1], nodePositions[b * 3 + 2]);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    return g;
  }, [nodePositions, edgePairs]);

  const particleGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(particleState.pos, 3));
    return g;
  }, [particleState.pos]);

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    
    // Camera slow drift forward
    camera.position.z = 8 - Math.sin(t * 0.05) * 0.5;
    camera.position.x = Math.sin(t * 0.03) * 0.3;
    camera.position.y = Math.cos(t * 0.04) * 0.2;

    // Move nodes (breathing)
    const nPos = nodeGeo.attributes.position as THREE.BufferAttribute;
    const nArr = nPos.array as Float32Array;
    for (let i = 0; i < NODE_COUNT; i++) {
      nArr[i * 3] += nodeVelocities[i * 3] + Math.sin(t * 0.5 + i) * 0.0005;
      nArr[i * 3 + 1] += nodeVelocities[i * 3 + 1] + Math.cos(t * 0.4 + i * 0.7) * 0.0004;
      nArr[i * 3 + 2] += nodeVelocities[i * 3 + 2];
    }
    nPos.needsUpdate = true;

    // Update edge positions
    const ePos = edgeGeo.attributes.position as THREE.BufferAttribute;
    const eArr = ePos.array as Float32Array;
    edgePairs.forEach(([a, b], idx) => {
      eArr[idx * 6] = nArr[a * 3];
      eArr[idx * 6 + 1] = nArr[a * 3 + 1];
      eArr[idx * 6 + 2] = nArr[a * 3 + 2];
      eArr[idx * 6 + 3] = nArr[b * 3];
      eArr[idx * 6 + 4] = nArr[b * 3 + 1];
      eArr[idx * 6 + 5] = nArr[b * 3 + 2];
    });
    ePos.needsUpdate = true;

    // Move particles along edges
    const pPos = particleGeo.attributes.position as THREE.BufferAttribute;
    const pArr = pPos.array as Float32Array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particleState.progress[i] += particleState.speed[i];
      if (particleState.progress[i] > 1) {
        particleState.progress[i] = 0;
        particleState.edgeIdx[i] = Math.floor(Math.random() * edgePairs.length);
      }
      const [a, b] = edgePairs[particleState.edgeIdx[i]];
      const p = particleState.progress[i];
      pArr[i * 3] = nArr[a * 3] + (nArr[b * 3] - nArr[a * 3]) * p;
      pArr[i * 3 + 1] = nArr[a * 3 + 1] + (nArr[b * 3 + 1] - nArr[a * 3 + 1]) * p;
      pArr[i * 3 + 2] = nArr[a * 3 + 2] + (nArr[b * 3 + 2] - nArr[a * 3 + 2]) * p;
    }
    pPos.needsUpdate = true;

    // Emerald ripple every 3-4s
    const colors = nodeGeo.attributes.color as THREE.BufferAttribute;
    const cArr = colors.array as Float32Array;
    
    // Reset colors
    for (let i = 0; i < NODE_COUNT; i++) {
      const depth = nArr[i * 3 + 2];
      const brightness = Math.max(0.2, Math.min(0.9, 0.6 + depth * 0.08));
      cArr[i * 3] = brightness;
      cArr[i * 3 + 1] = brightness;
      cArr[i * 3 + 2] = brightness;
    }

    if (t - lastEventRef.current > 3.5) {
      lastEventRef.current = t;
      // 80% emerald ripple, 20% amber flash
      if (Math.random() > 0.2) {
        rippleRef.current = { time: t, cluster: Math.floor(Math.random() * CLUSTER_COUNT), active: true };
      } else {
        amberRef.current = { time: t, node: Math.floor(Math.random() * NODE_COUNT) };
      }
    }

    // Apply emerald ripple
    if (rippleRef.current.active) {
      const elapsed = t - rippleRef.current.time;
      if (elapsed < 1.5) {
        const ci = rippleRef.current.cluster;
        const clusterNodes = clusters[ci];
        const rippleRadius = elapsed * 4;
        const cx = clusterNodes.length > 0 ? nArr[clusterNodes[0] * 3] : 0;
        const cy = clusterNodes.length > 0 ? nArr[clusterNodes[0] * 3 + 1] : 0;
        
        for (let i = 0; i < NODE_COUNT; i++) {
          const dx = nArr[i * 3] - cx;
          const dy = nArr[i * 3 + 1] - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < rippleRadius) {
            const intensity = Math.max(0, 1 - elapsed / 1.5) * Math.max(0, 1 - dist / rippleRadius);
            // Emerald: rgb(16, 185, 129) = #10b981
            cArr[i * 3] = cArr[i * 3] * (1 - intensity) + 0.063 * intensity;
            cArr[i * 3 + 1] = cArr[i * 3 + 1] * (1 - intensity) + 0.725 * intensity;
            cArr[i * 3 + 2] = cArr[i * 3 + 2] * (1 - intensity) + 0.506 * intensity;
          }
        }
      } else {
        rippleRef.current.active = false;
      }
    }

    // Amber flash
    if (amberRef.current.node >= 0) {
      const elapsed = t - amberRef.current.time;
      if (elapsed < 0.8) {
        const ni = amberRef.current.node;
        const intensity = Math.max(0, 1 - elapsed / 0.8);
        // Amber: #f59e0b
        cArr[ni * 3] = 0.96 * intensity + cArr[ni * 3] * (1 - intensity);
        cArr[ni * 3 + 1] = 0.62 * intensity + cArr[ni * 3 + 1] * (1 - intensity);
        cArr[ni * 3 + 2] = 0.04 * intensity + cArr[ni * 3 + 2] * (1 - intensity);
      } else {
        amberRef.current.node = -1;
      }
    }

    colors.needsUpdate = true;
  });

  return (
    <>
      <points ref={nodesRef} geometry={nodeGeo}>
        <pointsMaterial vertexColors size={2} sizeAttenuation transparent opacity={0.7} depthWrite={false} />
      </points>
      <lineSegments ref={edgesRef} geometry={edgeGeo}>
        <lineBasicMaterial color={0x444444} transparent opacity={0.12} depthWrite={false} />
      </lineSegments>
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial color={0xffffff} size={1.5} sizeAttenuation transparent opacity={0.5} depthWrite={false} />
      </points>
    </>
  );
}

function BackgroundGrid() {
  const geo = useMemo(() => {
    const positions: number[] = [];
    const range = 20;
    const step = 1;
    for (let x = -range; x <= range; x += step) {
      positions.push(x, -range, -8, x, range, -8);
    }
    for (let y = -range; y <= range; y += step) {
      positions.push(-range, y, -8, range, y, -8);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, []);

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={0xffffff} transparent opacity={0.025} />
    </lineSegments>
  );
}

const DataMeshVisualization = () => {
  return (
    <div className="absolute inset-0" style={{ background: "#000000" }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
        style={{ background: "#000000" }}
      >
        <BackgroundGrid />
        <DataMesh />
      </Canvas>
    </div>
  );
};

export default DataMeshVisualization;
