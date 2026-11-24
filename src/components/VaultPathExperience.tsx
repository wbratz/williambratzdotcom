import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ontologySteps, vaultStages } from "../lib/vaultPath";
import type { VaultStageStatus } from "../lib/vaultPath";
import styles from "../../styles/VaultPath.module.css";

type ViewMode = "overview" | "focus";
type Navigation = { selected: number; mode: ViewMode; move: boolean };
type CameraView = {
  x: number;
  y: number;
  z: number;
  radius: number;
  phi: number;
  theta: number;
};
type CameraFlight = {
  start: number;
  from: CameraView;
  to: CameraView;
  turn: number;
};

const statusLabels: Record<VaultStageStatus, string> = {
  built: "Built",
  pilot: "Pilot",
  measured: "Measured",
  output: "Output",
  "in-progress": "In progress",
};

const statusColors: Record<VaultStageStatus, number> = {
  built: 0x69bfff,
  pilot: 0xf0bd68,
  measured: 0x69d9b0,
  output: 0xe4d2ff,
  "in-progress": 0xb6a1ff,
};

// Two connected lanes: the answer remains on the forward route; review returns corrections.
const locations = [
  [-15, 9],
  [-7.5, 9],
  [0, 9],
  [7.5, 9],
  [15, 9],
  [15, -7],
  [7.5, -7],
  [0, -7],
  [-7.5, -7],
  [-15, -7],
].map(([x, z]) => new THREE.Vector3(x, 0, z));

function makeGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D is unavailable");
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.22, "rgba(255,255,255,.85)");
  gradient.addColorStop(0.5, "rgba(255,255,255,.2)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

function glowSprite(
  texture: THREE.Texture,
  color: number,
  size: number,
  opacity = 0.5,
) {
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  sprite.scale.set(size, size, 1);
  sprite.renderOrder = -2;
  return sprite;
}

function addBox(
  group: THREE.Group,
  material: THREE.Material,
  size: [number, number, number],
  position: [number, number, number],
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  group.add(mesh);
  const outlineColor =
    material instanceof THREE.MeshStandardMaterial
      ? material.color
      : new THREE.Color(0x69bfff);
  mesh.add(
    new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({
        color: outlineColor,
        transparent: true,
        opacity: 0.76,
      }),
    ),
  );
  return mesh;
}

function addCylinder(
  group: THREE.Group,
  material: THREE.Material,
  radius: number,
  height: number,
  position: [number, number, number],
) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, 24),
    material,
  );
  mesh.position.set(...position);
  group.add(mesh);
  return mesh;
}

function makeModel(index: number, color: number, glowTexture: THREE.Texture) {
  const group = new THREE.Group();
  const glow = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.45,
    metalness: 0.15,
    roughness: 0.45,
  });
  const body = new THREE.MeshStandardMaterial({
    color: 0x0c1830,
    emissive: 0x081633,
    emissiveIntensity: 0.7,
    metalness: 0.15,
    roughness: 0.55,
  });
  const light = new THREE.MeshStandardMaterial({
    color: 0xc9e7fb,
    emissive: 0x244e77,
    emissiveIntensity: 0.18,
  });
  const ink = new THREE.MeshBasicMaterial({ color: 0x0b1d35 });

  switch (index) {
    case 0: {
      // Files, code, and an agent conversation enter as sources.
      [-0.9, 0, 0.9].forEach((x, i) => {
        addCylinder(group, body, 0.52, 0.12, [x, 0.28, 0]);
        const page = addBox(
          group,
          i === 1 ? glow : light,
          [0.82, 1.45, 0.1],
          [x, 1.25 + (i === 1 ? 0.25 : 0), 0],
        );
        page.rotation.y = (i - 1) * -0.18;
        for (let line = 0; line < 3; line += 1) {
          addBox(
            group,
            ink,
            [0.52 - line * 0.06, 0.045, 0.02],
            [x, 1.62 - line * 0.25 + (i === 1 ? 0.25 : 0), 0.07],
          );
        }
      });
      break;
    }
    case 1: {
      // An actual gate, rather than an abstract funnel.
      addBox(group, body, [0.3, 2.2, 0.42], [-1.05, 1.23, 0]);
      addBox(group, body, [0.3, 2.2, 0.42], [1.05, 1.23, 0]);
      addBox(group, glow, [2.4, 0.28, 0.48], [0, 2.42, 0]);
      addBox(
        group,
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.16,
          side: THREE.DoubleSide,
        }),
        [1.82, 1.8, 0.04],
        [0, 1.3, 0],
      );
      const lock = new THREE.Mesh(
        new THREE.TorusGeometry(0.25, 0.07, 8, 24, Math.PI),
        light,
      );
      lock.position.set(0, 1.53, 0.2);
      group.add(lock);
      addBox(group, light, [0.58, 0.5, 0.15], [0, 1.02, 0.23]);
      break;
    }
    case 2: {
      // A wall of retained source cells, not another stack of books.
      addBox(group, body, [3.35, 3.15, 0.42], [0, 1.62, -0.38]);
      const cellGeometry = new THREE.BoxGeometry(0.55, 0.56, 0.58);
      const cellMaterial = new THREE.MeshStandardMaterial({
        color: 0x5a84a8,
        emissive: 0x0b2748,
        emissiveIntensity: 0.7,
        roughness: 0.55,
      });
      const cells = new THREE.InstancedMesh(cellGeometry, cellMaterial, 16);
      const matrix = new THREE.Matrix4();
      const cellColor = new THREE.Color();
      for (let row = 0; row < 4; row += 1) {
        for (let column = 0; column < 4; column += 1) {
          const cell = row * 4 + column;
          matrix.makeTranslation(
            -1.16 + column * 0.77,
            0.56 + row * 0.69,
            0.14,
          );
          cells.setMatrixAt(cell, matrix);
          cellColor.setHex(
            cell === 11 || cell === 14
              ? 0x93dfff
              : cell % 3 === 0
                ? 0x5a9fc9
                : 0x315477,
          );
          cells.setColorAt(cell, cellColor);
        }
      }
      cells.instanceMatrix.needsUpdate = true;
      if (cells.instanceColor) cells.instanceColor.needsUpdate = true;
      group.add(cells);
      addBox(group, glow, [3.25, 0.08, 0.7], [0, 3.25, 0.12]);
      break;
    }
    case 3: {
      // A broad open book, with illuminated source citations at its edge.
      addBox(group, body, [3.55, 0.18, 1.55], [0, 0.42, -0.08]);
      const left = addBox(group, light, [1.7, 2.35, 0.09], [-0.9, 1.6, 0]);
      const right = addBox(group, glow, [1.7, 2.35, 0.09], [0.9, 1.6, 0]);
      left.rotation.y = -0.38;
      right.rotation.y = 0.38;
      addBox(group, body, [0.18, 2.36, 0.3], [0, 1.6, -0.08]);
      for (let line = 0; line < 4; line += 1) {
        addBox(
          group,
          ink,
          [0.84, 0.045, 0.025],
          [-0.86, 2.25 - line * 0.37, 0.15],
        );
        addBox(
          group,
          ink,
          [0.84, 0.045, 0.025],
          [0.86, 2.25 - line * 0.37, 0.15],
        );
      }
      for (let citation = 0; citation < 3; citation += 1) {
        addBox(
          group,
          glow,
          [0.12, 0.28, 0.15],
          [1.83, 0.95 + citation * 0.62, 0],
        );
      }
      break;
    }
    case 4: {
      // Typed concept relationships, with a central claim.
      const points = [
        [0, 1.6, 0],
        [-1.25, 0.85, 0],
        [1.25, 0.85, 0],
        [-1.08, 2.42, 0],
        [1.08, 2.42, 0],
        [0, 0.45, 0.2],
      ] as [number, number, number][];
      const edge = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.9,
      });
      const segments = new Float32Array((points.length - 1) * 6);
      for (let i = 1; i < points.length; i += 1) {
        segments.set(points[0], (i - 1) * 6);
        segments.set(points[i], (i - 1) * 6 + 3);
      }
      const lines = new THREE.BufferGeometry();
      lines.setAttribute("position", new THREE.BufferAttribute(segments, 3));
      group.add(new THREE.LineSegments(lines, edge));
      const nodes = new THREE.InstancedMesh(
        new THREE.SphereGeometry(0.25, 14, 10),
        glow,
        points.length,
      );
      const matrix = new THREE.Matrix4();
      points.forEach((point, i) => {
        matrix.makeTranslation(...point);
        if (i === 0) matrix.scale(new THREE.Vector3(1.7, 1.7, 1.7));
        nodes.setMatrixAt(i, matrix);
      });
      nodes.instanceMatrix.needsUpdate = true;
      group.add(nodes);
      points.forEach((point) => {
        const spark = glowSprite(glowTexture, color, 1.8, 0.28);
        spark.position.set(...point);
        group.add(spark);
      });
      break;
    }
    case 5: {
      // Tall, separated Markdown slabs in a rack.
      for (let shelf = 0; shelf < 3; shelf += 1) {
        const y = 0.7 + shelf * 0.95;
        addBox(group, body, [3.2, 0.12, 1.15], [0, y - 0.48, -0.12]);
        for (let file = 0; file < 4; file += 1) {
          const x = -1.17 + file * 0.78;
          addBox(
            group,
            shelf === 1 && file === 2 ? glow : light,
            [0.12, 0.78, 0.84],
            [x, y, 0],
          );
        }
      }
      addBox(group, body, [0.12, 3.2, 1.2], [-1.62, 1.6, -0.12]);
      addBox(group, body, [0.12, 3.2, 1.2], [1.62, 1.6, -0.12]);
      break;
    }
    case 6: {
      // Search lens over returned pages.
      [-0.9, 0, 0.9].forEach((x, i) =>
        addBox(
          group,
          i === 1 ? glow : light,
          [0.55, 1.15 + i * 0.18, 0.08],
          [x, 1.2, -0.35],
        ),
      );
      const lens = new THREE.Mesh(
        new THREE.TorusGeometry(0.7, 0.13, 12, 40),
        glow,
      );
      lens.position.set(-0.1, 1.58, 0.5);
      group.add(lens);
      const handle = addBox(
        group,
        light,
        [0.21, 0.85, 0.21],
        [0.66, 0.72, 0.5],
      );
      handle.rotation.z = -0.72;
      break;
    }
    case 7: {
      // Context cards feed a visible agent terminal.
      addBox(group, body, [2.15, 1.55, 0.28], [0.3, 1.54, -0.25]);
      addBox(group, ink, [1.82, 1.22, 0.03], [0.3, 1.56, -0.08]);
      for (let i = 0; i < 3; i += 1)
        addBox(
          group,
          glow,
          [1.18 - i * 0.16, 0.06, 0.035],
          [0.13, 1.85 - i * 0.27, -0.04],
        );
      addBox(group, light, [0.42, 0.2, 0.55], [0.3, 0.65, -0.3]);
      addBox(group, glow, [0.64, 0.75, 0.08], [-1.05, 1.26, 0.65]);
      break;
    }
    case 8: {
      // The outward result is a message to a person.
      addBox(group, glow, [2.1, 1.45, 0.13], [-0.35, 1.7, 0]);
      for (let i = 0; i < 3; i += 1)
        addBox(
          group,
          ink,
          [1.42 - i * 0.24, 0.075, 0.04],
          [-0.35, 2.02 - i * 0.3, 0.09],
        );
      const tail = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.64, 3), glow);
      tail.rotation.z = Math.PI / 2;
      tail.position.set(0.55, 0.98, 0);
      group.add(tail);
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.29, 16, 12),
        light,
      );
      head.position.set(1.28, 1.55, 0.2);
      group.add(head);
      addCylinder(group, body, 0.44, 0.72, [1.28, 0.87, 0.2]);
      break;
    }
    default: {
      // A grading board closes the loop.
      addBox(group, body, [2.55, 2.1, 0.35], [0, 1.5, -0.2]);
      addBox(group, ink, [2.2, 1.72, 0.04], [0, 1.5, 0]);
      [0.36, 0.68, 1.04, 1.39].forEach((height, i) => {
        addBox(
          group,
          i === 3 ? glow : light,
          [0.33, height, 0.06],
          [-0.75 + i * 0.48, 0.95 + height / 2, 0.07],
        );
      });
      break;
    }
  }

  const halo = glowSprite(
    glowTexture,
    color,
    index === 3 || index === 4 ? 14 : 11,
    0.12,
  );
  halo.position.set(0, 1.5, -0.65);
  group.add(halo);
  const highlight = glowSprite(glowTexture, color, 3, 0.3);
  highlight.position.set(0, 2.05, 0.12);
  group.add(highlight);
  group.userData.litMaterial = glow;
  group.userData.haloMaterial = halo.material;
  group.userData.highlightMaterial = highlight.material;
  return group;
}

function addArrow(
  scene: THREE.Scene,
  curve: THREE.CatmullRomCurve3,
  t: number,
  color: number,
) {
  const arrow = new THREE.Mesh(
    new THREE.ConeGeometry(0.28, 0.75, 7),
    new THREE.MeshBasicMaterial({ color }),
  );
  arrow.position.copy(curve.getPointAt(t));
  arrow.position.y = 0.48;
  arrow.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    curve.getTangentAt(t).normalize(),
  );
  scene.add(arrow);
}

type ParticleStream = { update: (delta: number, elapsed: number) => void };

function makeParticleStream(
  scene: THREE.Scene,
  curve: THREE.CatmullRomCurve3,
  texture: THREE.Texture,
  count: number,
  size: number,
  mode: "forward" | "feedback",
  stageBoundaries: number[] = [],
): ParticleStream {
  const samples = curve.getSpacedPoints(320);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const speeds = new Float32Array(count);
  const offsets = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    phases[i] = (i + Math.random() * 0.8) / count;
    speeds[i] = (mode === "forward" ? 0.045 : 0.07) + Math.random() * 0.04;
    offsets[i * 3] = Math.random() * 2 - 1;
    offsets[i * 3 + 1] = Math.random();
    offsets[i * 3 + 2] = Math.random() * 2 - 1;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const points = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size,
      map: texture,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    }),
  );
  points.frustumCulled = false;
  scene.add(points);
  const gate = stageBoundaries[1] ?? 0.13;
  const wiki = stageBoundaries[3] ?? 0.36;
  const smooth = (start: number, end: number, value: number) => {
    const k = Math.max(0, Math.min(1, (value - start) / (end - start)));
    return k * k * (3 - 2 * k);
  };
  return {
    update(delta, elapsed) {
      for (let i = 0; i < count; i += 1) {
        const i3 = i * 3;
        const t = (phases[i] + delta * speeds[i]) % 1;
        phases[i] = t;
        const sampleIndex = t * 320;
        const low = Math.floor(sampleIndex);
        const high = Math.min(320, low + 1);
        const fraction = sampleIndex - low;
        const a = samples[low];
        const b = samples[high];
        let nearest = Math.min(t, 1 - t);
        if (mode === "forward") {
          for (let stage = 0; stage < stageBoundaries.length; stage += 1) {
            nearest = Math.min(nearest, Math.abs(stageBoundaries[stage] - t));
          }
        }
        const jitter =
          mode === "forward"
            ? 0.08 + Math.min(0.3, nearest * 3)
            : 0.1 + Math.min(0.18, nearest);
        positions[i3] = a.x + (b.x - a.x) * fraction + offsets[i3] * jitter;
        positions[i3 + 1] =
          a.y +
          (b.y - a.y) * fraction +
          0.25 +
          offsets[i3 + 1] * (mode === "forward" ? 0.8 : 0.45) +
          Math.sin(elapsed * 1.7 + i * 1.3) * 0.035;
        positions[i3 + 2] =
          a.z + (b.z - a.z) * fraction + offsets[i3 + 2] * jitter;
        const fade = smooth(0, 0.06, t) * (1 - smooth(0.94, 1, t));
        let red: number;
        let green: number;
        let blue: number;
        if (mode === "feedback") {
          red = 1;
          green = 0.36;
          blue = 0.27;
        } else if (t < gate) {
          red = 0.38;
          green = 0.48;
          blue = 0.62;
        } else if (t < wiki) {
          red = 0.25;
          green = 0.78;
          blue = 1;
        } else {
          red = 0.58;
          green = 0.64;
          blue = 1;
        }
        const flash =
          mode === "forward"
            ? Math.max(
                0,
                1 - Math.min(Math.abs(t - gate), Math.abs(t - wiki)) / 0.018,
              )
            : Math.max(0, 1 - t / 0.025);
        const intensity = fade * (0.55 + 0.35 * offsets[i3 + 1]);
        colors[i3] = (red * (1 - flash) + flash) * intensity;
        colors[i3 + 1] = (green * (1 - flash) + flash) * intensity;
        colors[i3 + 2] = (blue * (1 - flash) + flash) * intensity;
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
    },
  };
}

export default function VaultPathExperience() {
  const mountRef = useRef<HTMLDivElement>(null);
  const infoPanelRef = useRef<HTMLElement>(null);
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const navigationRef = useRef<Navigation>({
    selected: 0,
    mode: "overview",
    move: false,
  });
  const [selected, setSelected] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [autoplay, setAutoplay] = useState(false);
  const [webglState, setWebglState] = useState<
    "loading" | "ready" | "unavailable"
  >("loading");
  const stage = vaultStages[selected];

  useEffect(() => {
    navigationRef.current = { selected, mode: viewMode, move: true };
  }, [selected, viewMode]);

  useEffect(() => {
    if (window.innerWidth > 800)
      infoPanelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [selected]);

  useEffect(() => {
    if (window.innerWidth <= 800) setViewMode("focus");
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setInterval(() => {
      setSelected((current) => (current + 1) % vaultStages.length);
      setViewMode("focus");
    }, 10000);
    return () => window.clearInterval(timer);
  }, [autoplay]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebglState("unavailable");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setClearColor(0x071024, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = styles.canvas;
    renderer.domElement.setAttribute("aria-hidden", "true");
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x071024, 70, 165);
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 200);
    camera.position.set(0, 28, 42);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.065;
    controls.minDistance = 10;
    controls.maxDistance = 165;
    controls.minPolarAngle = 0.4;
    controls.maxPolarAngle = 1.42;
    controls.target.set(0, 0.7, 1);
    controls.update();
    let flight: CameraFlight | null = null;
    const onControlStart = () => {
      flight = null;
      navigationRef.current.move = false;
      setAutoplay(false);
    };
    controls.addEventListener("start", onControlStart);

    scene.add(new THREE.HemisphereLight(0x9cc4ff, 0x0a1224, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 0.7);
    key.position.set(-13, 18, 16);
    scene.add(key);
    const grid = new THREE.GridHelper(100, 50, 0x285384, 0x15355b);
    grid.position.y = -0.19;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.09;
    scene.add(grid);

    const route = new THREE.CatmullRomCurve3(
      locations.map((point) => point.clone().setY(0.24)),
      false,
      "centripetal",
    );
    scene.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(route, 320, 0.26, 8, false),
        new THREE.MeshBasicMaterial({
          color: 0x2385e9,
          transparent: true,
          opacity: 0.08,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
      new THREE.Mesh(
        new THREE.TubeGeometry(route, 320, 0.05, 8, false),
        new THREE.MeshBasicMaterial({
          color: 0x8ad8ff,
          transparent: true,
          opacity: 0.55,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
    );
    for (let i = 0; i < locations.length - 1; i += 1)
      addArrow(scene, route, (i + 0.5) / (locations.length - 1), 0x95ddff);

    const feedback = new THREE.CatmullRomCurve3([
      locations[9].clone().setY(0.3),
      new THREE.Vector3(-21, 0.3, -7),
      new THREE.Vector3(-21, 0.3, 16),
      new THREE.Vector3(-5, 0.3, 17),
      new THREE.Vector3(7.5, 0.3, 16),
      locations[3].clone().setY(0.3),
    ]);
    const feedbackLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(feedback.getPoints(160)),
      new THREE.LineDashedMaterial({
        color: 0xff8f70,
        dashSize: 0.42,
        gapSize: 0.26,
        transparent: true,
        opacity: 0.95,
      }),
    );
    feedbackLine.computeLineDistances();
    scene.add(feedbackLine);
    scene.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(feedback, 240, 0.19, 6, false),
        new THREE.MeshBasicMaterial({
          color: 0xff8f70,
          transparent: true,
          opacity: 0.035,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
    );
    addArrow(scene, feedback, 0.94, 0xff8f70);
    const feedbackBranch = new THREE.CatmullRomCurve3([
      new THREE.Vector3(7.5, 0.3, 16),
      new THREE.Vector3(15, 0.3, 16),
      locations[4].clone().setY(0.3),
    ]);
    const branchLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(feedbackBranch.getPoints(50)),
      new THREE.LineDashedMaterial({
        color: 0xff8f70,
        dashSize: 0.42,
        gapSize: 0.26,
        transparent: true,
        opacity: 0.75,
      }),
    );
    branchLine.computeLineDistances();
    scene.add(branchLine);
    addArrow(scene, feedbackBranch, 0.86, 0xff8f70);

    const glowTexture = makeGlowTexture();
    const routeSamples = route.getSpacedPoints(320);
    const boundaries = locations.map((location) => {
      let nearestIndex = 0;
      let nearestDistance = Infinity;
      for (let sample = 0; sample < routeSamples.length; sample += 1) {
        const distance = routeSamples[sample].distanceToSquared(location);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = sample;
        }
      }
      return nearestIndex / 320;
    });
    const streams = [
      makeParticleStream(
        scene,
        route,
        glowTexture,
        680,
        0.36,
        "forward",
        boundaries,
      ),
      makeParticleStream(scene, feedback, glowTexture, 96, 0.34, "feedback"),
      makeParticleStream(
        scene,
        feedbackBranch,
        glowTexture,
        38,
        0.28,
        "feedback",
      ),
    ];

    const rings: THREE.MeshBasicMaterial[] = [];
    const models: THREE.Group[] = [];
    const pickTargets: THREE.Mesh[] = [];
    locations.forEach((point, index) => {
      const color = statusColors[vaultStages[index].status];
      const station = new THREE.Group();
      station.position.copy(point);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.56,
      });
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(
          index === 3 || index === 4 ? 2.7 : 2.3,
          0.035,
          8,
          64,
        ),
        ringMaterial,
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.14;
      station.add(ring);
      rings.push(ringMaterial);
      const model = makeModel(index, color, glowTexture);
      if (index === 3 || index === 4 || index === 9)
        model.scale.setScalar(1.18);
      station.add(model);
      models.push(model);
      const picker = new THREE.Mesh(
        new THREE.SphereGeometry(2.28, 12, 10),
        new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
      );
      picker.position.y = 1.3;
      picker.userData.stage = index;
      station.add(picker);
      pickTargets.push(picker);
      scene.add(station);
    });

    // The wiki's visible citations reach back to retained source evidence.
    for (let citation = 0; citation < 3; citation += 1) {
      const path = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(
          locations[2].x + 1.2,
          2.1 + citation * 0.35,
          locations[2].z - 0.4,
        ),
        new THREE.Vector3(3.75, 4.2 + citation * 0.35, 9.1),
        new THREE.Vector3(
          locations[3].x - 1.6,
          1.2 + citation * 0.55,
          locations[3].z - 0.2,
        ),
      );
      scene.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(path.getPoints(24)),
          new THREE.LineBasicMaterial({
            color: 0x8ad8ff,
            transparent: true,
            opacity: 0.28,
          }),
        ),
      );
    }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDown: { x: number; y: number } | null = null;
    const onPointerDown = (event: PointerEvent) => {
      pointerDown = { x: event.clientX, y: event.clientY };
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!pointerDown) return;
      const distance = Math.hypot(
        event.clientX - pointerDown.x,
        event.clientY - pointerDown.y,
      );
      pointerDown = null;
      if (distance > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(pickTargets, false)[0];
      if (hit) {
        setAutoplay(false);
        setSelected(hit.object.userData.stage as number);
        setViewMode("focus");
      }
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    let width = 1;
    let height = 1;
    let mobile = false;
    const resize = () => {
      width = Math.max(1, mount.clientWidth);
      height = Math.max(1, mount.clientHeight);
      mobile = width <= 800;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      navigationRef.current.move = true;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();
    setWebglState("ready");

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const spherical = new THREE.Spherical();
    const offset = new THREE.Vector3();
    const labelPoint = new THREE.Vector3();
    const interpolatedView: CameraView = {
      x: 0,
      y: 0,
      z: 0,
      radius: 0,
      phi: 0,
      theta: 0,
    };
    const captureView = (): CameraView => {
      offset.copy(camera.position).sub(controls.target);
      spherical.setFromVector3(offset);
      return {
        x: controls.target.x,
        y: controls.target.y,
        z: controls.target.z,
        radius: spherical.radius,
        phi: spherical.phi,
        theta: spherical.theta,
      };
    };
    const targetView = (navigation: Navigation): CameraView => {
      if (navigation.mode === "overview") {
        return mobile
          ? { x: 0, y: -40, z: 1, radius: 145, phi: 0.55, theta: 0 }
          : { x: 4.6, y: 0.7, z: 1, radius: 55, phi: 0.95, theta: 0 };
      }
      const point = locations[navigation.selected];
      return {
        x: point.x + (mobile ? 0 : 3.2),
        y: mobile ? -1.5 : 1.2,
        z: point.z,
        radius: mobile ? 18 : 22,
        phi: mobile ? 0.9 : 1.05,
        theta: navigation.selected >= 5 ? -0.12 : 0.12,
      };
    };
    const applyView = (view: CameraView, pullback = 0) => {
      controls.target.set(view.x, view.y, view.z);
      spherical.set(view.radius + pullback, view.phi, view.theta);
      camera.position.setFromSpherical(spherical).add(controls.target);
      if (scene.fog instanceof THREE.Fog) {
        scene.fog.near = (view.radius + pullback) * 0.6;
        scene.fog.far = (view.radius + pullback) * 1.45 + 40;
      }
      controls.update();
    };
    const ease = (k: number) =>
      k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    const clock = new THREE.Clock();
    let frameHandle = 0;
    const animate = () => {
      frameHandle = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const navigation = navigationRef.current;
      const active = navigation.selected;
      if (navigation.move) {
        const from = captureView();
        const to = targetView(navigation);
        flight = {
          start: performance.now(),
          from,
          to,
          turn: Math.atan2(
            Math.sin(to.theta - from.theta),
            Math.cos(to.theta - from.theta),
          ),
        };
        navigation.move = false;
      }
      if (flight) {
        const current = flight;
        const progress = reducedMotion
          ? 1
          : Math.min(1, (performance.now() - current.start) / 1700);
        const k = ease(progress);
        const travel = Math.hypot(
          current.to.x - current.from.x,
          current.to.z - current.from.z,
        );
        interpolatedView.x =
          current.from.x + (current.to.x - current.from.x) * k;
        interpolatedView.y =
          current.from.y + (current.to.y - current.from.y) * k;
        interpolatedView.z =
          current.from.z + (current.to.z - current.from.z) * k;
        interpolatedView.radius =
          current.from.radius + (current.to.radius - current.from.radius) * k;
        interpolatedView.phi =
          current.from.phi + (current.to.phi - current.from.phi) * k;
        interpolatedView.theta = current.from.theta + current.turn * k;
        applyView(
          interpolatedView,
          Math.sin(Math.PI * k) * Math.min(14, travel * 0.22),
        );
        if (progress >= 1) flight = null;
      } else controls.update();
      for (let index = 0; index < rings.length; index += 1) {
        const material = rings[index];
        material.opacity +=
          ((index === active ? 1 : 0.3) - material.opacity) * 0.08;
        (
          models[index].userData.litMaterial as THREE.MeshStandardMaterial
        ).emissiveIntensity = index === active ? 0.85 : 0.28;
        (models[index].userData.haloMaterial as THREE.SpriteMaterial).opacity =
          index === active ? 0.16 : 0.07;
        (
          models[index].userData.highlightMaterial as THREE.SpriteMaterial
        ).opacity = index === active ? 0.34 : 0.12;
        const baseScale = index === 3 || index === 4 || index === 9 ? 1.18 : 1;
        const scale = baseScale * (index === active ? 1.12 : 1);
        const nextScale =
          models[index].scale.x + (scale - models[index].scale.x) * 0.08;
        models[index].scale.setScalar(nextScale);
      }
      for (let index = 0; index < streams.length; index += 1)
        streams[index].update(reducedMotion ? 0 : delta, clock.elapsedTime);
      for (let index = 0; index < locations.length; index += 1) {
        const point = locations[index];
        const label = labelRefs.current[index];
        if (!label) continue;
        labelPoint.copy(point);
        labelPoint.y += 4.7;
        labelPoint.project(camera);
        const screenX = (labelPoint.x * 0.5 + 0.5) * width;
        const screenY = (-labelPoint.y * 0.5 + 0.5) * height;
        label.style.left = `${screenX}px`;
        label.style.top = `${screenY}px`;
        const visible =
          labelPoint.z < 1 &&
          labelPoint.x > -1.15 &&
          labelPoint.x < 1.15 &&
          labelPoint.y > -1.1 &&
          labelPoint.y < 1.1 &&
          !(
            width > 900 &&
            navigation.mode === "focus" &&
            screenX < 520 &&
            screenY < 280
          );
        label.style.opacity = visible ? "1" : "0";
        label.style.pointerEvents = visible ? "auto" : "none";
      }
      if (!document.hidden) renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameHandle);
      observer.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      controls.removeEventListener("start", onControlStart);
      controls.dispose();
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.Line ||
          object instanceof THREE.Sprite ||
          object instanceof THREE.Points
        ) {
          if (
            object instanceof THREE.Mesh ||
            object instanceof THREE.Line ||
            object instanceof THREE.Points
          )
            object.geometry.dispose();
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      glowTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const selectStage = (index: number) => {
    setAutoplay(false);
    setSelected(index);
    setViewMode("focus");
  };
  const move = (direction: number) =>
    selectStage(
      Math.min(vaultStages.length - 1, Math.max(0, selected + direction)),
    );
  const showOverview = () => {
    setAutoplay(false);
    setViewMode("overview");
  };
  const toggleAutoplay = () => {
    if (autoplay) {
      setAutoplay(false);
    } else {
      setViewMode("focus");
      setAutoplay(true);
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      )
        return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      } else if (event.key === "Escape") showOverview();
      else if (event.key.toLowerCase() === "p") toggleAutoplay();
      else if (/^[0-9]$/.test(event.key))
        selectStage(event.key === "0" ? 9 : Number(event.key) - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className={styles.experience}>
      <div className={styles.shell}>
        <section
          className={styles.scenePanel}
          aria-label="Interactive map of the Vault context path"
        >
          <div ref={mountRef} className={styles.sceneMount} />
          <div
            className={`${styles.sceneHeading} ${viewMode === "focus" ? styles.sceneHeadingFocus : ""}`}
          >
            <p>The Vault / system map</p>
            <h1>From source to answer</h1>
            <span>
              Trace one decision through the Vault, into an agent, and back to
              the person who asked.
            </span>
          </div>
          {webglState === "unavailable" && (
            <p className={styles.fallback}>
              3D rendering is unavailable here. Use the stage controls and
              explanations to follow the same path.
            </p>
          )}
          {webglState === "ready" && (
            <div
              className={`${styles.labels} ${viewMode === "overview" ? styles.labelsOverview : ""}`}
            >
              {vaultStages.map((item, index) => (
                <button
                  key={item.short}
                  ref={(element) => {
                    labelRefs.current[index] = element;
                  }}
                  className={`${styles.sceneLabel} ${index === selected ? styles.sceneLabelActive : ""}`}
                  type="button"
                  tabIndex={-1}
                  onClick={() => selectStage(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.short}</strong>
                  {index === selected && viewMode === "focus" && (
                    <small>{item.role}</small>
                  )}
                </button>
              ))}
            </div>
          )}
          <div className={styles.flowKey}>
            <span>
              <i className={styles.forwardLine} /> Source to answer
            </span>
            <span>
              <i className={styles.returnLine} /> Review to wiki and ontology
            </span>
          </div>
          <div className={styles.focusCaption}>
            {viewMode === "overview"
              ? "Overview / 10 connected stages"
              : `${String(selected + 1).padStart(2, "0")} / ${stage.short} · ${stage.role}`}
          </div>
          <div className={styles.sceneLegend}>
            <span>
              <i className={styles.builtDot} /> Built
            </span>
            <span>
              <i className={styles.pilotDot} /> Pilot
            </span>
            <span>
              <i className={styles.measuredDot} /> Measured
            </span>
            <span>
              <i className={styles.outputDot} /> Output
            </span>
            <span>
              <i className={styles.progressDot} /> In progress
            </span>
          </div>
          {viewMode === "overview" && (
            <p className={styles.sceneHint}>
              Drag to orbit · scroll to zoom · <kbd>←</kbd> <kbd>→</kbd> stages
              · <kbd>0</kbd>–<kbd>9</kbd> jump · <kbd>P</kbd> tour ·{" "}
              <kbd>Esc</kbd> map
            </p>
          )}
        </section>

        <nav className={styles.mobileStages} aria-label="Vault path stages">
          {vaultStages.map((item, index) => (
            <button
              key={item.short}
              type="button"
              className={index === selected ? styles.mobileStageActive : ""}
              onClick={() => selectStage(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span> {item.short}
            </button>
          ))}
        </nav>

        <aside
          ref={infoPanelRef}
          className={styles.infoPanel}
          aria-labelledby="stage-title"
        >
          <div className={styles.infoTop}>
            <p className={styles.infoKicker}>The Vault path</p>
            <h2>Explore the system</h2>
            <div className={styles.tourControls}>
              <button
                type="button"
                onClick={showOverview}
                aria-pressed={viewMode === "overview"}
              >
                View whole map
              </button>
              <button
                type="button"
                onClick={toggleAutoplay}
                aria-pressed={autoplay}
              >
                {autoplay ? "Pause tour" : "▶ Autoplay tour"}
              </button>
            </div>
          </div>
          <div key={selected} className={styles.infoBody} aria-live="polite">
            <div className={styles.stageMeta}>
              <span>
                Stage {String(selected + 1).padStart(2, "0")} /{" "}
                {String(vaultStages.length).padStart(2, "0")}
              </span>
              <span className={`${styles.status} ${styles[stage.status]}`}>
                {statusLabels[stage.status]}
              </span>
            </div>
            <h3 id="stage-title">{stage.title}</h3>
            <p className={styles.stageSummary}>{stage.summary}</p>
            <div
              className={styles.chipChain}
              aria-label="Path around this stage"
            >
              {(selected === 0
                ? vaultStages.slice(0, 3)
                : selected === 9
                  ? vaultStages.slice(7, 10)
                  : vaultStages.slice(selected - 1, selected + 2)
              ).map(({ short: name }, index) => (
                <span key={`${name}-${index}`}>
                  {index > 0 && <b aria-hidden="true">→</b>}
                  <i>{name}</i>
                </span>
              ))}
            </div>
            {selected === 8 && (
              <div className={styles.answerPreview}>
                <span>What the person receives</span>
                <p className={styles.exampleQuestion}>
                  “Why is retry behavior capped here?”
                </p>
                <blockquote>
                  “The cap keeps repeated failures from amplifying downstream
                  load. I kept it in this service's handler and added a test.
                  The cited Vault decision explains the rule and its scope.”
                </blockquote>
                <small>Illustrative answer, not a private Vault record</small>
              </div>
            )}
            <div className={styles.detailList}>
              {[...stage.details, stage.example].slice(0, 3).map((detail) => (
                <p key={detail}>{detail}</p>
              ))}
            </div>
            <details className={styles.engineerDetails}>
              <summary>For engineers</summary>
              {selected === 4 && (
                <div className={styles.pipeline}>
                  <h4>The ontology pipeline lens</h4>
                  <ol>
                    {ontologySteps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
              <div className={styles.handoff}>
                <span>Next handoff</span>
                <p>{stage.handoff}</p>
              </div>
              <div className={styles.boundary}>
                <span>Keep in view</span>
                <p>{stage.boundary}</p>
              </div>
            </details>
          </div>
          <div className={styles.panelFooter}>
            <div className={styles.stageNav}>
              <button
                type="button"
                onClick={() => move(-1)}
                disabled={selected === 0}
              >
                ← Previous
              </button>
              <span>
                {selected + 1} / {vaultStages.length}
              </span>
              <button
                type="button"
                onClick={() => move(1)}
                disabled={selected === vaultStages.length - 1}
              >
                Next →
              </button>
            </div>
            <a href="/projects/vault">Read the Vault architecture ↗</a>
          </div>
        </aside>
      </div>
    </div>
  );
}
