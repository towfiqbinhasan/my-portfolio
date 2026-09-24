"use client";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { motion, useMotionValue, useAnimationFrame, useReducedMotion } from "framer-motion";
import { SKILLS } from "@/lib/skills";

/* ---------- 3D cube ---------- */

const CUBIE = 76; // size of one small cube (px)
const STEP = CUBIE + 4; // spacing between cubies
const HALF = CUBIE / 2;
type Coord = { x: number; y: number; z: number };

// For each face: its transform, fake lighting, and which tile (0-8) a cubie
// occupies on that side of the big cube — null when the face is hidden inside.
const FACES: {
  key: string;
  transform: string;
  shade: number;
  tile: (c: Coord) => number | null;
}[] = [
  { key: "front", transform: `translateZ(${HALF}px)`, shade: 0.55, tile: (c) => (c.z === 1 ? (c.y + 1) * 3 + c.x + 1 : null) },
  { key: "right", transform: `rotateY(90deg) translateZ(${HALF}px)`, shade: 0.4, tile: (c) => (c.x === 1 ? (c.y + 1) * 3 + 1 - c.z : null) },
  { key: "back", transform: `rotateY(180deg) translateZ(${HALF}px)`, shade: 0.35, tile: (c) => (c.z === -1 ? (c.y + 1) * 3 + 1 - c.x : null) },
  { key: "left", transform: `rotateY(-90deg) translateZ(${HALF}px)`, shade: 0.5, tile: (c) => (c.x === -1 ? (c.y + 1) * 3 + c.z + 1 : null) },
  { key: "top", transform: `rotateX(90deg) translateZ(${HALF}px)`, shade: 0.8, tile: (c) => (c.y === -1 ? (c.z + 1) * 3 + c.x + 1 : null) },
  { key: "bottom", transform: `rotateX(-90deg) translateZ(${HALF}px)`, shade: 0.2, tile: (c) => (c.y === 1 ? (1 - c.z) * 3 + c.x + 1 : null) },
];

function Cubie({ x, y, z }: Coord) {
  return (
    <div
      className="absolute left-0 top-0"
      style={{
        width: CUBIE,
        height: CUBIE,
        marginLeft: -HALF,
        marginTop: -HALF,
        transformStyle: "preserve-3d",
        transform: `translate3d(${x * STEP}px, ${y * STEP}px, ${z * STEP}px)`,
      }}
    >
      {FACES.map((face, f) => {
        const light = Math.round(16 + face.shade * 30);
        const tile = face.tile({ x, y, z });
        const base = `linear-gradient(145deg, rgb(${light},${light},${light + 3}) 0%, rgb(3,8,20) 100%)`;

        // Faces hidden inside the cube: plain dark plastic.
        if (tile == null) {
          return (
            <div
              key={face.key}
              className="absolute inset-0 rounded-[10px]"
              style={{ transform: face.transform, backfaceVisibility: "hidden", backgroundImage: base }}
            />
          );
        }

        const skill = SKILLS[(f * 9 + tile) % SKILLS.length];
        // Diagonal wave: the shine reaches each tile a moment after its neighbour.
        const delay = ((tile % 3) + Math.floor(tile / 3)) * 0.14 + f * 0.9;

        return (
          <div
            key={face.key}
            className="cube-tile absolute inset-0 rounded-[10px] flex flex-col items-center justify-center gap-1.5"
            style={
              {
                transform: face.transform,
                backfaceVisibility: "hidden",
                backgroundImage: `radial-gradient(circle at 50% 38%, ${skill.color}2e 0%, transparent 62%), ${base}`,
                "--c": skill.color,
                "--d": `${delay}s`,
              } as CSSProperties
            }
          >
            <skill.icon
              className="cube-icon relative z-[1]"
              size={30}
              style={{
                color: skill.color,
                opacity: 0.75 + face.shade * 0.25,
                filter: `drop-shadow(0 0 10px ${skill.color}80)`,
              }}
            />
            <span
              className="relative z-[1] text-[9px] font-semibold tracking-wide text-neutral-200 whitespace-nowrap"
              style={{ opacity: 0.65 + face.shade * 0.35 }}
            >
              {skill.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Layer({ y, angle }: { y: number; angle: number }) {
  const cubies = [];
  for (let x = -1; x <= 1; x++)
    for (let z = -1; z <= 1; z++)
      cubies.push(<Cubie key={`${x}${z}`} x={x} y={y} z={z} />);

  return (
    <motion.div
      className="absolute left-0 top-0"
      style={{ transformStyle: "preserve-3d" }}
      animate={{ rotateY: angle }}
      transition={{ type: "spring", stiffness: 60, damping: 14, mass: 1.2 }}
    >
      {cubies}
    </motion.div>
  );
}

type LayerName = "top" | "middle" | "bottom";

// Scramble the skills, then play the moves backwards so every side returns to its original set.
const SCRAMBLE: [LayerName, number][] = [
  ["top", 90],
  ["bottom", -90],
  ["middle", 180],
  ["top", -90],
  ["bottom", 90],
];
const SEQUENCE: ([LayerName, number] | null)[] = [
  ...SCRAMBLE,
  null, // hold scrambled
  ...[...SCRAMBLE].reverse().map(([l, d]): [LayerName, number] => [l, -d]),
  null, // hold solved
  null,
];

export default function RubikCube() {
  const reduce = useReducedMotion();
  const [twists, setTwists] = useState<Record<LayerName, number>>({ top: 0, middle: 0, bottom: 0 });

  useEffect(() => {
    if (reduce) return;
    let i = 0;
    const id = setInterval(() => {
      const move = SEQUENCE[i % SEQUENCE.length];
      if (move) {
        const [layer, deg] = move;
        setTwists((t) => ({ ...t, [layer]: t[layer] + deg }));
      }
      i++;
    }, 1500);
    return () => clearInterval(id);
  }, [reduce]);

  // Drag to rotate, with momentum; drifts back into a slow auto-spin when left alone.
  const REST_X = -20;
  const rotX = useMotionValue(REST_X);
  const rotY = useMotionValue(30);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 }); // degrees per frame

  useAnimationFrame((_, delta) => {
    if (dragging.current) return;
    const f = Math.min(delta / 16.7, 3); // normalise to ~60fps
    const v = velocity.current;
    v.x *= Math.pow(0.94, f);
    v.y *= Math.pow(0.94, f);

    const spin = reduce ? 0 : 0.125; // matches the old 48s-per-turn auto-spin
    rotY.set(rotY.get() + (v.y + spin) * f);
    // Once momentum fades, tilt eases back so the logos stay readable.
    const x = rotX.get() + v.x * f;
    rotX.set(Math.abs(v.x) < 0.05 ? x + (REST_X - x) * 0.02 * f : x);
  });

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    velocity.current = { x: 0, y: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    const vy = dx * 0.45;
    const vx = -dy * 0.45;
    velocity.current = { x: vx, y: vy };
    rotY.set(rotY.get() + vy);
    rotX.set(Math.max(-75, Math.min(75, rotX.get() + vx)));
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      className="relative w-[380px] h-[380px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-pan-y"
      style={{ perspective: 1400 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {/* Slowly rotating colour aura behind the cube */}
      <div
        aria-hidden
        className="hero-badge-spin absolute top-1/2 left-1/2 -ml-40 -mt-40 w-80 h-80 rounded-full blur-[90px] opacity-35"
        style={{
          animationDuration: "24s",
          background: "conic-gradient(from 0deg, #3b82f6, #3b82f6, #22c55e, #f59e0b, #22d3ee, #3b82f6)",
        }}
      />
      {/* Floor: soft coloured reflection + contact shadow */}
      <div aria-hidden className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-80 h-16 rounded-[100%] bg-gradient-to-r from-blue-500/25 via-cyan-400/20 to-cyan-400/25 blur-2xl" />
      <div aria-hidden className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-8 rounded-[100%] bg-black blur-xl opacity-90" />

      <motion.div
        style={{ transformStyle: "preserve-3d" }}
        animate={reduce ? undefined : { y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}>
          <div className="relative" style={{ transformStyle: "preserve-3d" }}>
            <Layer y={-1} angle={twists.top} />
            <Layer y={0} angle={twists.middle} />
            <Layer y={1} angle={twists.bottom} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
