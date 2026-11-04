"use client";
import { useEffect, useRef } from "react";

// Equations that drift up through the background.
const FORMULAS = [
  "p(θ|x) = p(x|θ) p(θ) / p(x)",
  "Attention(Q,K,V) = softmax(QKᵀ / √dₖ) V",
  "θ ← θ − η ∇θ L(θ)",
  "σ(z) = 1 / (1 + e⁻ᶻ)",
  "H(X) = −Σ p(x) log p(x)",
  "L = −Σ yᵢ log ŷᵢ",
  "R² = 1 − SSᵣₑₛ / SSₜₒₜ",
  "ρ = cov(X,Y) / σₓσᵧ",
  "KL(P‖Q) = Σ P(x) log P(x)/Q(x)",
  "H₀: μ₁ = μ₂   (p < 0.05)",
  "ŷ = Wx + b",
  "∂L/∂w = (ŷ − y) x",
  "x̄ = (1/n) Σ xᵢ",
  "f(x) = Σ αᵢ K(xᵢ, x) + b",
  "P(A|B) = P(B|A) P(A) / P(B)",
  "ReLU(x) = max(0, x)",
];

type Node = { x: number; y: number; vx: number; vy: number; r: number; phase: number };
type Formula = { text: string; x: number; y: number; speed: number; size: number; life: number; max: number };

const LINK_DIST = 150; // px: nodes closer than this get connected

/** Full-screen, click-through canvas: a drifting neural-net graph with floating equations. */
export default function ResearchBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const serif = getComputedStyle(document.documentElement).getPropertyValue("--font-serif").trim() || "Georgia";

    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let formulas: Formula[] = [];

    const newFormula = (anywhere: boolean): Formula => {
      const max = 900 + Math.random() * 700; // frames on screen
      return {
        text: FORMULAS[Math.floor(Math.random() * FORMULAS.length)],
        x: Math.random() * (w - 260) + 20,
        y: anywhere ? Math.random() * h : h + 30,
        speed: 0.15 + Math.random() * 0.25,
        size: 15 + Math.random() * 9,
        life: anywhere ? Math.random() * max : 0,
        max,
      };
    };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(90, (w * h) / 20000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 1.2 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2,
      }));
      formulas = Array.from({ length: w < 640 ? 5 : 11 }, () => newFormula(true));
    };

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Edges of the network
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > LINK_DIST) continue;
          ctx.strokeStyle = `rgba(56,189,248,${(1 - d / LINK_DIST) * 0.35})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Neurons, each softly pulsing
      for (const n of nodes) {
        const glow = 0.5 + 0.5 * Math.sin(t * 0.03 + n.phase);
        ctx.fillStyle = `rgba(125,211,252,${0.45 + glow * 0.45})`;
        ctx.shadowColor = "rgba(56,189,248,0.9)";
        ctx.shadowBlur = 6 + glow * 8;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Equations fade in, rise, and fade out
      for (const f of formulas) {
        const p = f.life / f.max;
        const alpha = Math.min(p / 0.15, (1 - p) / 0.15, 1) * 0.22;
        ctx.font = `italic ${f.size}px ${serif}, Georgia, serif`;
        ctx.fillStyle = `rgba(96,165,250,${Math.max(alpha, 0)})`;
        ctx.fillText(f.text, f.x, f.y);
      }
    };

    const step = () => {
      t++;
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      formulas = formulas.map((f) => {
        f.y -= f.speed;
        f.life++;
        return f.life >= f.max || f.y < -30 ? newFormula(false) : f;
      });
    };

    build();
    draw();
    const onResize = () => {
      build();
      draw();
    };
    window.addEventListener("resize", onResize);
    if (reduce) return () => window.removeEventListener("resize", onResize);

    let raf = 0;
    const loop = () => {
      step();
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 h-full w-full opacity-30 mix-blend-screen"
    />
  );
}
