import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Keep in sync with --c-bg / --c-accent / --c-fg in index.css
const PALETTES = {
  dark: {
    bg: [6, 9, 13], base: [72, 178, 236], hot: [253, 240, 213], pulse: [253, 240, 213],
    line: [72, 178, 236], lineFloor: 0.35, lineOpacity: 0.55, blending: THREE.AdditiveBlending,
  },
  light: {
    bg: [245, 239, 226], base: [3, 110, 170], hot: [9, 30, 48], pulse: [3, 110, 170],
    line: [12, 52, 92], lineFloor: 0.75, lineOpacity: 0.7, blending: THREE.NormalBlending,
  },
};

const COUNT = 280;
const RADIUS = 1.5;
const LINK_DIST = 0.42;
const PULSES = 18;
const HOVER_R = 0.4;
const PUSH = 0.22;

const toColor = ([r, g, b]) => new THREE.Color(r / 255, g / 255, b / 255);

const seeded = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const buildNetwork = () => {
  const rand = seeded(7);
  const base = new Float32Array(COUNT * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    const s = RADIUS * (1 + (rand() - 0.5) * 0.12);
    base[i * 3] = Math.cos(t) * r * s;
    base[i * 3 + 1] = y * s;
    base[i * 3 + 2] = Math.sin(t) * r * s;
  }
  const edges = [];
  const adj = Array.from({ length: COUNT }, () => []);
  for (let i = 0; i < COUNT; i++) {
    for (let j = i + 1; j < COUNT; j++) {
      const dx = base[i * 3] - base[j * 3];
      const dy = base[i * 3 + 1] - base[j * 3 + 1];
      const dz = base[i * 3 + 2] - base[j * 3 + 2];
      if (dx * dx + dy * dy + dz * dz < LINK_DIST * LINK_DIST) {
        adj[i].push(edges.length);
        adj[j].push(edges.length);
        edges.push([i, j]);
      }
    }
  }
  return { base, edges, adj };
};

const spawn = (net) => {
  const e = Math.floor(Math.random() * net.edges.length);
  return { e, from: net.edges[e][0], t: Math.random(), speed: 0.6 + Math.random() * 0.9 };
};

const makeGlow = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.25, "rgba(255,255,255,0.75)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
};

const Network = ({ palette, mouse }) => {
  const net = useMemo(buildNetwork, []);
  const glow = useMemo(makeGlow, []);
  const colors = useMemo(
    () => ({
      bg: toColor(palette.bg), base: toColor(palette.base), hot: toColor(palette.hot),
      pulse: toColor(palette.pulse), line: toColor(palette.line),
    }),
    [palette]
  );

  const st = useMemo(
    () => ({
      pos: new Float32Array(COUNT * 3),
      col: new Float32Array(COUNT * 3),
      linePos: new Float32Array(net.edges.length * 6),
      lineCol: new Float32Array(net.edges.length * 6),
      pulsePos: new Float32Array(PULSES * 3),
      hover: new Float32Array(COUNT),
      fire: new Float32Array(COUNT),
      heat: new Float32Array(COUNT),
      depth: new Float32Array(COUNT),
      pulses: Array.from({ length: PULSES }, () => spawn(net)),
      spin: 0,
      v: new THREE.Vector3(),
      c1: new THREE.Color(),
      c2: new THREE.Color(),
    }),
    [net]
  );

  const group = useRef();
  const core = useRef();
  const pointsGeo = useRef();
  const linesGeo = useRef();
  const pulseGeo = useRef();

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const g = group.current;
    const m = mouse.current;
    const { base, edges, adj } = net;
    const { pos, col, linePos, lineCol, pulsePos, hover, fire, heat, depth: depths, v, c1, c2 } = st;

    st.spin += dt * 0.12;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, st.spin + m.tx * 1.1, 2.5, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, m.ty * 0.7, 2.5, dt);
    core.current.rotation.y -= dt * 0.3;
    core.current.rotation.x += dt * 0.15;
    g.updateMatrixWorld();

    for (let i = 0; i < COUNT; i++) {
      v.set(base[i * 3], base[i * 3 + 1], base[i * 3 + 2]).applyMatrix4(g.matrixWorld);
      const depth = THREE.MathUtils.clamp((v.z + RADIUS) / (2 * RADIUS), 0, 1);
      depths[i] = depth;
      v.project(state.camera);

      let infl = 0;
      if (m.active && depth > 0.45) {
        const d = Math.hypot(v.x - m.x, v.y - m.y);
        infl = Math.max(0, 1 - d / HOVER_R) ** 2;
      }
      hover[i] = THREE.MathUtils.damp(hover[i], infl, 6, dt);
      fire[i] = Math.max(0, fire[i] - dt * 1.8);
      const h = Math.min(1, hover[i] + fire[i] * 0.8);
      heat[i] = h;

      const k = 1 + hover[i] * PUSH;
      pos[i * 3] = base[i * 3] * k;
      pos[i * 3 + 1] = base[i * 3 + 1] * k;
      pos[i * 3 + 2] = base[i * 3 + 2] * k;

      c1.copy(colors.base).lerp(colors.hot, h);
      c2.copy(colors.bg).lerp(c1, 0.25 + 0.75 * depth);
      col[i * 3] = c2.r;
      col[i * 3 + 1] = c2.g;
      col[i * 3 + 2] = c2.b;
    }

    const bg = colors.bg;
    const floor = palette.lineFloor;
    for (let e = 0; e < edges.length; e++) {
      const [a, b] = edges[e];
      for (let s = 0; s < 2; s++) {
        const n = s ? b : a;
        const o = e * 6 + s * 3;
        const f = (0.25 + 0.75 * depths[n]) * (floor + (1 - floor) * heat[n]);
        c1.copy(colors.line).lerp(colors.hot, heat[n]);
        linePos[o] = pos[n * 3];
        linePos[o + 1] = pos[n * 3 + 1];
        linePos[o + 2] = pos[n * 3 + 2];
        lineCol[o] = bg.r + (c1.r - bg.r) * f;
        lineCol[o + 1] = bg.g + (c1.g - bg.g) * f;
        lineCol[o + 2] = bg.b + (c1.b - bg.b) * f;
      }
    }

    st.pulses.forEach((p, i) => {
      p.t += dt * p.speed;
      let [a, b] = edges[p.e];
      if (p.from !== a) [a, b] = [b, a];
      if (p.t >= 1) {
        fire[b] = 1;
        const options = adj[b].filter((x) => x !== p.e);
        if (options.length) {
          p.e = options[Math.floor(Math.random() * options.length)];
          p.from = b;
          p.t = 0;
        } else {
          Object.assign(p, spawn(net), { t: 0 });
        }
        [a, b] = edges[p.e];
        if (p.from !== a) [a, b] = [b, a];
      }
      pulsePos[i * 3] = pos[a * 3] + (pos[b * 3] - pos[a * 3]) * p.t;
      pulsePos[i * 3 + 1] = pos[a * 3 + 1] + (pos[b * 3 + 1] - pos[a * 3 + 1]) * p.t;
      pulsePos[i * 3 + 2] = pos[a * 3 + 2] + (pos[b * 3 + 2] - pos[a * 3 + 2]) * p.t;
    });

    pointsGeo.current.attributes.position.needsUpdate = true;
    pointsGeo.current.attributes.color.needsUpdate = true;
    linesGeo.current.attributes.position.needsUpdate = true;
    linesGeo.current.attributes.color.needsUpdate = true;
    pulseGeo.current.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshBasicMaterial color={colors.base} wireframe transparent opacity={0.15} />
      </mesh>
      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={linesGeo}>
          <bufferAttribute attach="attributes-position" args={[st.linePos, 3]} />
          <bufferAttribute attach="attributes-color" args={[st.lineCol, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={palette.lineOpacity} depthWrite={false} blending={palette.blending} />
      </lineSegments>
      <points frustumCulled={false}>
        <bufferGeometry ref={pointsGeo}>
          <bufferAttribute attach="attributes-position" args={[st.pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[st.col, 3]} />
        </bufferGeometry>
        <pointsMaterial map={glow} size={0.17} sizeAttenuation vertexColors transparent depthWrite={false} blending={palette.blending} />
      </points>
      <points frustumCulled={false}>
        <bufferGeometry ref={pulseGeo}>
          <bufferAttribute attach="attributes-position" args={[st.pulsePos, 3]} />
        </bufferGeometry>
        <pointsMaterial map={glow} size={0.3} color={colors.pulse} transparent depthWrite={false} blending={palette.blending} />
      </points>
    </group>
  );
};

export default function NeuralSphere({ theme }) {
  const wrap = useRef(null);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0, active: false });
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onMove = (e) => {
      if (!wrap.current) return;
      const r = wrap.current.getBoundingClientRect();
      const m = mouse.current;
      m.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      m.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      m.tx = e.clientX / window.innerWidth - 0.5;
      m.ty = e.clientY / window.innerHeight - 0.5;
      m.active = true;
    };
    const onLeave = () => { mouse.current.active = false; };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(wrap.current);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      io.disconnect();
    };
  }, []);

  const palette = PALETTES[theme] || PALETTES.dark;

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 2]}
        resize={{ offsetSize: true }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ pointerEvents: "none" }}
      >
        <Network key={theme} palette={palette} mouse={mouse} />
      </Canvas>
    </div>
  );
}
