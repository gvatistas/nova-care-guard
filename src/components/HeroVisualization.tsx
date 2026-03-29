import { useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --- Data: Human silhouette nodes (left side, connected wireframe torso) ---
const HUMAN_NODES: [number, number][] = [
  // Head
  [0, 3.8], [-.3, 3.5], [.3, 3.5], [-.2, 3.2], [.2, 3.2],
  // Neck
  [0, 3.0],
  // Shoulders
  [-1.0, 2.6], [-.5, 2.7], [.5, 2.7], [1.0, 2.6],
  // Torso
  [-.7, 2.0], [-.3, 2.1], [.3, 2.1], [.7, 2.0],
  [-.6, 1.3], [-.2, 1.4], [.2, 1.4], [.6, 1.3],
  [-.5, 0.6], [-.15, 0.7], [.15, 0.7], [.5, 0.6],
  // Hips
  [-.4, 0.0], [.4, 0.0],
  // Arms
  [-1.4, 2.2], [-1.7, 1.5], [-1.9, 0.8],
  [1.4, 2.2], [1.7, 1.5], [1.9, 0.8],
];

const HUMAN_EDGES: [number, number][] = [
  [0,1],[0,2],[1,3],[2,4],[3,5],[4,5],
  [5,7],[5,8],[7,6],[8,9],[7,11],[8,12],
  [6,10],[9,13],[10,11],[11,12],[12,13],
  [10,14],[11,15],[12,16],[13,17],
  [14,15],[15,16],[16,17],
  [14,18],[15,19],[16,20],[17,21],
  [18,19],[19,20],[20,21],
  [18,22],[21,23],[19,22],[20,23],
  [6,24],[24,25],[25,26],[9,27],[27,28],[28,29],
];

// --- Decision tree nodes branching from the torso ---
interface TreeNode {
  x: number; y: number;
  type: "hex" | "diamond";
  isProblem?: boolean;
}

const TREE_NODES: TreeNode[] = [
  // Root from torso
  { x: 1.8, y: 2.2, type: "hex" },           // 0 - root
  { x: 2.6, y: 2.8, type: "diamond" },        // 1
  { x: 2.6, y: 1.6, type: "diamond" },        // 2
  { x: 3.4, y: 3.2, type: "hex" },            // 3
  { x: 3.4, y: 2.4, type: "hex", isProblem: true }, // 4 - problem
  { x: 3.4, y: 1.8, type: "diamond" },        // 5
  { x: 3.4, y: 1.0, type: "hex" },            // 6
  { x: 4.2, y: 3.4, type: "diamond" },        // 7
  { x: 4.2, y: 2.8, type: "hex" },            // 8 - reroute target
  { x: 4.2, y: 2.0, type: "diamond", isProblem: true }, // 9 - problem
  { x: 4.2, y: 1.2, type: "hex" },            // 10
  { x: 5.0, y: 3.0, type: "hex" },            // 11 - success
  { x: 5.0, y: 2.2, type: "diamond" },        // 12
  { x: 5.0, y: 1.4, type: "hex" },            // 13
];

const TREE_EDGES: [number, number][] = [
  [0,1],[0,2],[1,3],[1,4],[2,5],[2,6],
  [3,7],[4,8],[5,9],[6,10],
  [7,11],[8,11],[8,12],[9,12],[10,13],
];

// Paths for sequential animation
const PATHS: number[][] = [
  [0, 1, 3, 7, 11],       // clean path
  [0, 1, 4, 8, 11],       // hits problem at 4, reroutes through 8
  [0, 2, 5, 9, 12],       // hits problem at 9, reroutes
  [0, 2, 6, 10, 13],      // clean path
];

const TEAL = new THREE.Color(0x2dd4bf);
const TEAL_DIM = new THREE.Color(0x1a8a7a);
const AMBER = new THREE.Color(0xf59e0b);
const GREEN_BRIGHT = new THREE.Color(0x4aedc4);

// --- Human wireframe mesh ---
function HumanMesh() {
  const lineRef = useRef<THREE.LineSegments>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const { lineGeo, pointGeo } = useMemo(() => {
    const positions: number[] = [];
    HUMAN_EDGES.forEach(([a, b]) => {
      positions.push(HUMAN_NODES[a][0] - 2.5, HUMAN_NODES[a][1] - 1.9, 0);
      positions.push(HUMAN_NODES[b][0] - 2.5, HUMAN_NODES[b][1] - 1.9, 0);
    });
    const lg = new THREE.BufferGeometry();
    lg.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    const pts: number[] = [];
    HUMAN_NODES.forEach(([x, y]) => pts.push(x - 2.5, y - 1.9, 0));
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));

    return { lineGeo: lg, pointGeo: pg };
  }, []);

  useFrame(({ clock }) => {
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.25 + Math.sin(clock.elapsedTime * 0.5) * 0.08;
    }
  });

  return (
    <group position={[-1.2, 0, 0]}>
      <lineSegments ref={lineRef} geometry={lineGeo}>
        <lineBasicMaterial color={TEAL_DIM} transparent opacity={0.3} />
      </lineSegments>
      <points ref={pointsRef} geometry={pointGeo}>
        <pointsMaterial color={TEAL} size={0.08} transparent opacity={0.6} sizeAttenuation />
      </points>
    </group>
  );
}

// --- Decision tree with animated flow ---
function DecisionTree() {
  const groupRef = useRef<THREE.Group>(null);
  const nodeColorsRef = useRef<Float32Array>(new Float32Array(TREE_NODES.length * 3));
  const nodeAlphasRef = useRef<Float32Array>(new Float32Array(TREE_NODES.length).fill(0.2));
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Create shapes
  const hexShape = useMemo(() => {
    const s = new THREE.Shape();
    const r = 0.12;
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      const method = i === 0 ? "moveTo" : "lineTo";
      s[method](Math.cos(a) * r, Math.sin(a) * r);
    }
    s.closePath();
    return new THREE.ShapeGeometry(s);
  }, []);

  const diamondShape = useMemo(() => {
    const s = new THREE.Shape();
    const r = 0.1;
    s.moveTo(0, r);
    s.lineTo(r, 0);
    s.lineTo(0, -r);
    s.lineTo(-r, 0);
    s.closePath();
    return new THREE.ShapeGeometry(s);
  }, []);

  // Edge geometry
  const edgeGeo = useMemo(() => {
    const pos: number[] = [];
    TREE_EDGES.forEach(([a, b]) => {
      const na = TREE_NODES[a], nb = TREE_NODES[b];
      pos.push(na.x - 2.5, na.y - 1.9, 0);
      pos.push(nb.x - 2.5, nb.y - 1.9, 0);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const cycleTime = 4; // seconds per full path animation
    const pathIndex = Math.floor(t / cycleTime) % PATHS.length;
    const pathProgress = (t % cycleTime) / cycleTime;
    const path = PATHS[pathIndex];
    const activeCount = Math.floor(pathProgress * (path.length + 1));

    // Reset all node colors
    TREE_NODES.forEach((node, i) => {
      const baseColor = node.isProblem ? TEAL_DIM : TEAL_DIM;
      nodeColorsRef.current[i * 3] = baseColor.r;
      nodeColorsRef.current[i * 3 + 1] = baseColor.g;
      nodeColorsRef.current[i * 3 + 2] = baseColor.b;
      nodeAlphasRef.current[i] = 0.15;
    });

    // Light up active path nodes
    for (let i = 0; i < activeCount && i < path.length; i++) {
      const ni = path[i];
      const node = TREE_NODES[ni];
      let color: THREE.Color;

      if (node.isProblem) {
        // Flash amber/red briefly then show reroute
        const flashPhase = ((t * 3) % 1);
        color = flashPhase > 0.5 ? AMBER : new THREE.Color(0xef4444);
      } else {
        color = GREEN_BRIGHT;
      }

      nodeColorsRef.current[ni * 3] = color.r;
      nodeColorsRef.current[ni * 3 + 1] = color.g;
      nodeColorsRef.current[ni * 3 + 2] = color.b;
      nodeAlphasRef.current[ni] = node.isProblem ? 0.85 : 0.9;
    }

    // Apply to meshes
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.color.setRGB(
        nodeColorsRef.current[i * 3],
        nodeColorsRef.current[i * 3 + 1],
        nodeColorsRef.current[i * 3 + 2]
      );
      mat.opacity = nodeAlphasRef.current[i];
    });
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color={TEAL_DIM} transparent opacity={0.12} />
      </lineSegments>
      {TREE_NODES.map((node, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el; }}
          geometry={node.type === "hex" ? hexShape : diamondShape}
          position={[node.x - 2.5, node.y - 1.9, 0]}
        >
          <meshBasicMaterial color={TEAL_DIM} transparent opacity={0.15} />
        </mesh>
      ))}
    </group>
  );
}

// --- Floating data particles ---
function DataParticles() {
  const count = 60;
  const ref = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const v = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 8;
      p[i * 3 + 1] = (Math.random() - 0.5) * 5;
      p[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      v[i * 3] = (Math.random() - 0.5) * 0.003;
      v[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      v[i * 3 + 2] = 0;
    }
    return { positions: p, velocities: v };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame(() => {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3];
      arr[i * 3 + 1] += velocities[i * 3 + 1];
      // Wrap around
      if (arr[i * 3] > 4) arr[i * 3] = -4;
      if (arr[i * 3] < -4) arr[i * 3] = 4;
      if (arr[i * 3 + 1] > 2.5) arr[i * 3 + 1] = -2.5;
      if (arr[i * 3 + 1] < -2.5) arr[i * 3 + 1] = 2.5;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color={TEAL} size={0.03} transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

// --- Background grid ---
function BackgroundGrid() {
  const geo = useMemo(() => {
    const positions: number[] = [];
    const range = 6;
    const step = 0.5;
    for (let x = -range; x <= range; x += step) {
      positions.push(x, -range, -0.5, x, range, -0.5);
    }
    for (let y = -range; y <= range; y += step) {
      positions.push(-range, y, -0.5, range, y, -0.5);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, []);

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={0xffffff} transparent opacity={0.03} />
    </lineSegments>
  );
}

// --- Main scene ---
function Scene() {
  return (
    <>
      <BackgroundGrid />
      <HumanMesh />
      <DecisionTree />
      <DataParticles />
    </>
  );
}

const HeroVisualization = () => {
  return (
    <div className="w-full h-full min-h-[400px]" style={{ background: "transparent" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default HeroVisualization;
