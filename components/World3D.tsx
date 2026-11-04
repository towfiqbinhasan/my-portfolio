"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import projectsData from "@/data/project.json";

/*
 * Home-page 3D world: a fixed full-screen canvas behind the content. Scrolling
 * flies the camera along a curved path; each home section has a stop on it:
 *
 *   hero → shattering crystal · about → ring tunnel · experience → glowing line
 *   with milestones · projects → floating screens · contact → calm glowing orb
 *
 * Sections opt in with data-world="<name>". Reduced motion renders one still frame.
 *
 * variant "page" (every other page): the same flight, lighter. The crystal, ring
 * gates, glossy shapes, a guide line with milestones the length of the page, and
 * the orb, with the camera tied straight to scroll progress.
 *
 * Both share the atmosphere: twinkling two-tone stars, nebula clouds, light streaks
 * that rush past when scrolling fast, gates that flare as the camera passes through,
 * and a camera that banks into turns and widens its view with speed.
 */

/* ---------- 1. Config ---------- */

const BLUE = new THREE.Color("#2f7bff");
const CYAN = new THREE.Color("#8fd6ff");
const BG = new THREE.Color("#050b1a");

/** Where on the path (0–1) the camera is when each section reaches the middle of the screen. */
const STOPS: Record<string, number> = {
  hero: 0,
  about: 0.1,
  qualification: 0.2,
  experience: 0.3,
  skills: 0.43,
  projects: 0.53,
  research: 0.7,
  contact: 0.86,
};
const END = 0.92; // the camera stops short of the orb, which sits at 0.99

/** Hand-placed control points: a long dive along -z that sways side to side. */
const PATH = [
  [0, 0, 16], [0, 0.2, 6], [0.4, 0.3, -6], [-1, 0.5, -20], [1, -0.5, -35], [3, 0, -50],
  [0, 1, -65], [-3, 0, -80], [-2, -1, -95], [2, 0, -110], [4, 1, -125], [0, 0, -140],
  [-4, 0, -155], [-2, 1, -170], [1, 0, -185], [0, 0, -200], [0, 0, -215],
].map(([x, y, z]) => new THREE.Vector3(x, y, z));

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Soft, wide cloud sprite for the nebula: a long falloff so it never shows an edge. */
function cloudTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,0.6)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.22)");
  grad.addColorStop(0.7, "rgba(255,255,255,0.05)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Soft round sprite, used for the orb's halo. */
function glowTexture(inner = "rgba(255,255,255,1)", outer = "rgba(255,255,255,0)") {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, inner);
  grad.addColorStop(1, outer);
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function World3D({ variant = "home" }: { variant?: "home" | "page" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const home = variant === "home";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    /* ---------- 2. Setup ---------- */

    // No WebGL (old device, disabled GPU): skip the world, the page works without it.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: "high-performance" });
    } catch {
      return;
    }
    document.documentElement.classList.add("has-world");
    // Phones: fewer pixels to shade keeps the flight at a steady frame rate while scrolling.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.25 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setClearColor(BG);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(BG, 0.034);
    // A soft studio environment gives the glossy metal something to reflect.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.35;

    const camera = new THREE.PerspectiveCamera(mobile ? 70 : 58, window.innerWidth / window.innerHeight, 0.1, 160);
    const curve = new THREE.CatmullRomCurve3(PATH, false, "catmullrom", 0.4);
    const along = (u: number, offset?: THREE.Vector3) => {
      const p = curve.getPointAt(clamp01(u));
      return offset ? p.add(offset) : p;
    };

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const keyLight = new THREE.PointLight(BLUE, 40, 40, 1.6);
    const fillLight = new THREE.PointLight(CYAN, 20, 40, 1.6);
    scene.add(keyLight, fillLight);

    const disposables: { dispose: () => void }[] = [envTex, pmrem];
    const track = <T extends { dispose: () => void }>(x: T) => (disposables.push(x), x);

    const glossy = (color = "#0c1630", emissive = 0.12) =>
      track(
        new THREE.MeshStandardMaterial({
          color,
          metalness: 0.8,
          roughness: 0.2,
          emissive: BLUE,
          emissiveIntensity: emissive,
        })
      );

    /* ---------- 3. Objects ---------- */

    // Stars scattered around the whole path: each its own size, blue→cyan→white tint and twinkle.
    const COUNT = mobile ? 650 : 2200;
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const size = new Float32Array(COUNT);
    const phase = new Float32Array(COUNT);
    const tmp = new THREE.Vector3();
    const tint = new THREE.Color();
    const WHITE = new THREE.Color("#ffffff");
    for (let i = 0; i < COUNT; i++) {
      const p = along(Math.random());
      tmp.randomDirection().multiplyScalar(3 + Math.random() * 22);
      pos.set([p.x + tmp.x, p.y + tmp.y * 0.7, p.z + tmp.z], i * 3);
      const r = Math.random();
      tint.copy(BLUE).lerp(CYAN, Math.min(r * 1.4, 1));
      if (r > 0.9) tint.lerp(WHITE, 0.7);
      col.set([tint.r, tint.g, tint.b], i * 3);
      size[i] = (r > 0.96 ? 0.26 : 0.07 + Math.random() * 0.09) * (mobile ? 1.25 : 1);
      phase[i] = Math.random();
    }
    const particleGeo = track(new THREE.BufferGeometry());
    particleGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    particleGeo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    particleGeo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    particleGeo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    const starUniforms = {
      uTime: { value: 0 },
      uScale: { value: renderer.domElement.height / 2 }, // matches three's own size attenuation
      uBoost: { value: 0 }, // brightens everything while scrolling fast
    };
    const particles = new THREE.Points(
      particleGeo,
      track(
        new THREE.ShaderMaterial({
          uniforms: starUniforms,
          vertexShader: `
            attribute vec3 aColor;
            attribute float aSize;
            attribute float aPhase;
            uniform float uTime;
            uniform float uScale;
            uniform float uBoost;
            varying vec3 vColor;
            varying float vAlpha;
            void main() {
              vec4 mv = modelViewMatrix * vec4(position, 1.0);
              gl_Position = projectionMatrix * mv;
              float depth = -mv.z;
              gl_PointSize = aSize * uScale / depth;
              float twinkle = 0.45 + 0.55 * sin(uTime * (0.8 + aPhase * 2.2) + aPhase * 6.2831);
              float fog = exp(-pow(0.034 * depth, 2.0)); // same falloff as the scene's FogExp2
              vAlpha = clamp(twinkle * (0.6 + uBoost), 0.0, 1.0) * fog;
              vColor = aColor;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            varying float vAlpha;
            void main() {
              float d = length(gl_PointCoord - 0.5);
              float a = smoothstep(0.5, 0.0, d);
              gl_FragColor = vec4(vColor * (1.0 + a * 0.6), a * a * vAlpha);
            }
          `,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      )
    );
    scene.add(particles);

    // Nebula: big, faint coloured clouds far off to the sides, giving the dark some depth
    const cloudTex = track(cloudTexture());
    const NEBULA = ["#1d4ed8", "#0bb4f0", "#2f7bff", "#3730a3", "#0e72a8"];
    const CLOUDS = mobile ? 7 : 14;
    const clouds = Array.from({ length: CLOUDS }, (_, i) => {
      const side = i % 2 ? 1 : -1;
      const sprite = new THREE.Sprite(
        track(
          new THREE.SpriteMaterial({
            map: cloudTex,
            color: NEBULA[i % NEBULA.length],
            transparent: true,
            opacity: 0.1 + Math.random() * 0.08,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            fog: false,
            rotation: Math.random() * Math.PI,
          })
        )
      );
      sprite.position.copy(along((i + 0.5) / CLOUDS, new THREE.Vector3(side * (13 + Math.random() * 10), Math.random() * 10 - 5, -14)));
      sprite.scale.setScalar(26 + Math.random() * 26);
      sprite.userData.spin = (Math.random() - 0.5) * 0.04;
      scene.add(sprite);
      return sprite;
    });

    // Light streaks: ride with the camera and rush past while scrolling fast (hyperspace feel)
    const STREAKS = mobile ? 60 : 150;
    const streakPos = new Float32Array(STREAKS * 6);
    const streakCol = new Float32Array(STREAKS * 6); // head lit, tail black: additive makes it fade out
    const streakData = Array.from({ length: STREAKS }, (_, i) => {
      const a = Math.random() * Math.PI * 2;
      const r = 2.2 + Math.random() * 8;
      tint.copy(BLUE).lerp(CYAN, Math.random());
      if (Math.random() > 0.85) tint.lerp(WHITE, 0.6);
      streakCol.set([tint.r, tint.g, tint.b, 0, 0, 0], i * 6);
      return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.65, z: -Math.random() * 60 };
    });
    const streakGeo = track(new THREE.BufferGeometry());
    streakGeo.setAttribute("position", new THREE.BufferAttribute(streakPos, 3).setUsage(THREE.DynamicDrawUsage));
    streakGeo.setAttribute("color", new THREE.BufferAttribute(streakCol, 3));
    const streakMat = track(
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })
    );
    const streaks = new THREE.LineSegments(streakGeo, streakMat);
    streaks.frustumCulled = false;
    streaks.visible = false;
    camera.add(streaks);
    scene.add(camera);

    // Hero crystal: every face flies outward along its normal as the camera dives in.
    const crystalGeo = track(new THREE.IcosahedronGeometry(2.4, 1)); // non-indexed: 3 vertices per face
    {
      const p = crystalGeo.getAttribute("position");
      const dir = new Float32Array(p.count * 3);
      const rand = new Float32Array(p.count);
      const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
      for (let f = 0; f < p.count; f += 3) {
        a.fromBufferAttribute(p, f);
        b.fromBufferAttribute(p, f + 1);
        c.fromBufferAttribute(p, f + 2);
        const n = a.add(b).add(c).divideScalar(3).normalize();
        const r = Math.random();
        for (let k = 0; k < 3; k++) {
          dir.set([n.x, n.y, n.z], (f + k) * 3);
          rand[f + k] = r;
        }
      }
      crystalGeo.setAttribute("aDir", new THREE.BufferAttribute(dir, 3));
      crystalGeo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    }
    const explode = { value: 0 };
    const crystalMat = glossy("#0d1c3e", 0.12);
    crystalMat.flatShading = true;
    crystalMat.onBeforeCompile = (shader) => {
      shader.uniforms.uExplode = explode;
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nattribute vec3 aDir;\nattribute float aRand;\nuniform float uExplode;")
        .replace(
          "#include <begin_vertex>",
          "#include <begin_vertex>\ntransformed += aDir * uExplode * (0.4 + aRand * 1.6);"
        );
    };
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    // Off to the right of the headline (home: behind the cube), so the copy stays readable.
    crystal.position.copy(along(0.065, home ? new THREE.Vector3(2.4, 0.3, -2) : new THREE.Vector3(5.6, 0.9, -3)));
    const crystalWire = new THREE.LineSegments(
      track(new THREE.EdgesGeometry(track(new THREE.IcosahedronGeometry(2.42, 1)))),
      track(new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.35 }))
    );
    crystal.add(crystalWire);
    scene.add(crystal);

    // About: a tunnel of rings the camera threads through (other pages: gates spread along the route)
    const ringGeo = track(new THREE.TorusGeometry(3.6, 0.03, 12, 120));
    const rings: THREE.Mesh<THREE.TorusGeometry, THREE.MeshStandardMaterial>[] = [];
    for (let i = 0; i < 13; i++) {
      const u = home ? 0.1 + i * 0.0085 : 0.05 + i * 0.066;
      // Own material per gate (blue / cyan in turn) so each can flare as the camera passes
      const ringMat = track(new THREE.MeshStandardMaterial({ color: "#0a1a40", emissive: i % 2 ? CYAN : BLUE, emissiveIntensity: 0.4, metalness: 0.6, roughness: 0.3, transparent: true, opacity: 0.5 }));
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(along(u));
      ring.lookAt(along(u + 0.002));
      ring.userData.spin = (i % 2 ? 1 : -1) * (0.1 + i * 0.01);
      rings.push(ring);
      scene.add(ring);
    }

    // Glossy floaters along the way
    const floaterGeos = {
      knot: track(new THREE.TorusKnotGeometry(1.1, 0.34, 160, 24)),
      ico: track(new THREE.IcosahedronGeometry(1.1, 0)),
      box: track(new RoundedBoxGeometry(1.6, 1.6, 1.6, 4, 0.25)),
      torus: track(new THREE.TorusGeometry(1, 0.32, 24, 80)),
    };
    const floaterSpots: [keyof typeof floaterGeos, number, [number, number, number]][] = [
      ["box", 0.2, [-6, 1.5, 0]],
      ["ico", 0.24, [6, -1.5, 0]],
      ["torus", 0.36, [-6.5, 2, 0]],
      ["knot", 0.46, [6.5, 0.5, 0]],
      ["ico", 0.5, [-6, -2, 0]],
      ["box", 0.72, [6, 1.5, 0]],
      ["knot", 0.76, [-6.5, -1, 0]],
      ["ico", 0.8, [5.5, 2.5, 0]],
      ["torus", 0.83, [-5, 2, 0]],
    ];
    const floaters = floaterSpots
      .filter((_, i) => !mobile || i % 2 === 0)
      .map(([kind, u, [x, y, z]], i) => {
        const m = new THREE.Mesh(floaterGeos[kind], glossy(i % 2 ? "#1a2440" : "#0c1630", i % 3 ? 0.08 : 0.2));
        m.position.copy(along(u, new THREE.Vector3(x, y, z)));
        m.rotation.set(Math.random() * 3, Math.random() * 3, 0);
        m.userData = { baseY: m.position.y, phase: Math.random() * 6, speed: 0.15 + Math.random() * 0.2 };
        scene.add(m);
        return m;
      });

    // Experience (other pages: the whole route): a glowing line drawn along the path, with milestones popping up on it
    const [LINE_FROM, LINE_TO] = home ? [0.3, 0.43] : [0.02, 0.97];
    const LINE_PTS = home ? 80 : 220;
    const linePts = Array.from({ length: LINE_PTS }, (_, i) =>
      along(LINE_FROM + ((LINE_TO - LINE_FROM) * i) / (LINE_PTS - 1), new THREE.Vector3(0, -2.2, 0))
    );
    const lineCurve = new THREE.CatmullRomCurve3(linePts);
    const lineGeo = track(new THREE.TubeGeometry(lineCurve, home ? 400 : 1100, 0.03, 8, false));
    const lineIndexCount = lineGeo.index!.count;
    lineGeo.setDrawRange(0, 0);
    const line = new THREE.Mesh(lineGeo, track(new THREE.MeshBasicMaterial({ color: "#3aa6ff", transparent: true, opacity: 0.55, toneMapped: false })));
    scene.add(line);
    const milestoneGeo = track(new THREE.OctahedronGeometry(0.32, 0));
    const milestones = (home ? [0.12, 0.32, 0.52, 0.72, 0.92] : [0.1, 0.28, 0.46, 0.64, 0.82, 0.97]).map((t) => {
      const m = new THREE.Mesh(milestoneGeo, glossy("#ffffff", 0.9));
      m.position.copy(lineCurve.getPointAt(t)).add(new THREE.Vector3(0, 0.55, 0));
      m.scale.setScalar(0.0001);
      m.userData = { t, shown: false };
      scene.add(m);
      return m;
    });

    // Projects: screenshots as screens floating at different depths, alternating sides
    const loader = new THREE.TextureLoader();
    const planeGeo = track(new THREE.PlaneGeometry(3.4, 2.125));
    const frameGeo = track(new THREE.PlaneGeometry(3.52, 2.245));
    const frameMat = track(new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0.55, toneMapped: false }));
    const screens = (projectsData as { images: string[] }[])
      .slice(0, home ? 6 : 0)
      .map((p, i) => {
        const u = 0.55 + i * 0.026;
        const side = i % 2 ? 1 : -1;
        const group = new THREE.Group();
        group.position.copy(along(u, new THREE.Vector3(side * 6.5, (i % 2 ? 2.6 : -2.6) + (i % 3) * 0.4, -1 - (i % 3) * 1.5)));
        group.lookAt(along(u - 0.03));
        group.rotateY(side * -0.55);
        const tex = track(loader.load(p.images[0]));
        tex.colorSpace = THREE.SRGBColorSpace;
        const screen = new THREE.Mesh(planeGeo, track(new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, transparent: true, opacity: 0.75 })));
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.z = -0.02;
        group.add(frame, screen);
        group.userData.base = group.quaternion.clone();
        scene.add(group);
        return group;
      });

    // Contact: a calm, glowing orb at the end of the road
    const orbPos = along(0.99);
    const orb = new THREE.Mesh(
      track(new THREE.SphereGeometry(2.6, 64, 64)),
      track(new THREE.MeshStandardMaterial({ color: "#04102c", emissive: BLUE, emissiveIntensity: 1.4, metalness: 0.3, roughness: 0.35 }))
    );
    orb.position.copy(orbPos);
    const halo = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: track(glowTexture("rgba(60,160,255,0.9)", "rgba(0,110,255,0)")), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }))
    );
    halo.scale.setScalar(16);
    orb.add(halo);
    const orbLight = new THREE.PointLight(BLUE, 80, 30, 1.5);
    orb.add(orbLight);
    scene.add(orb);

    /* ---------- 4. Camera path: scroll → position on the path ---------- */

    // Knots map scroll offsets to path positions; rebuilt whenever ScrollTrigger re-measures.
    // (Low refresh priority: measured after the pinned sections have added their spacing.)
    let knots: [number, number][] = [[0, 0]];
    // Other pages have no stops: the camera simply follows overall scroll progress.
    const zoneTriggers = Array.from(home ? document.querySelectorAll<HTMLElement>("[data-world]") : [])
      .filter((el) => el.dataset.world! in STOPS)
      .map((el) => ({ u: STOPS[el.dataset.world!], st: ScrollTrigger.create({ trigger: el, start: "top 55%", refreshPriority: -1 }) }));
    const buildKnots = () => {
      const max = ScrollTrigger.maxScroll(window);
      const pts: [number, number][] = zoneTriggers.map(({ u, st }) => [Math.max(st.start, 0), u]);
      // Other pages: each screen of scrolling moves a fixed, short way along the path, so a
      // short page drifts a little instead of racing through the whole world.
      const endU = home ? END : Math.min(END, (max / window.innerHeight) * 0.06);
      pts.push([0, 0], [max, endU]);
      pts.sort((a, b) => a[0] - b[0]);
      // Keep it monotonic so the camera never flies backwards.
      for (let i = 1; i < pts.length; i++) pts[i][1] = Math.max(pts[i][1], pts[i - 1][1]);
      knots = pts;
    };
    buildKnots();
    ScrollTrigger.addEventListener("refresh", buildKnots);
    const scrollToU = (y: number) => {
      for (let i = 1; i < knots.length; i++) {
        const [y0, u0] = knots[i - 1];
        const [y1, u1] = knots[i];
        if (y <= y1) return y1 === y0 ? u1 : u0 + ((y - y0) / (y1 - y0)) * (u1 - u0);
      }
      return knots[knots.length - 1][1];
    };

    /* ---------- 5. Input: mouse parallax, intro, resize, visibility ---------- */

    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);

    // Intro: once the loader lifts, the camera glides in from far away.
    const intro = { back: reduce ? 0 : 34 };
    const startIntro = () => gsap.to(intro, { back: 0, duration: 3.6, ease: "expo.out" });
    window.addEventListener("loader:done", startIntro);
    const introFallback = setTimeout(startIntro, 3000);

    // Phones fire resize whenever the address bar shows or hides; the canvas is CSS-sized,
    // so only a real change (rotation, new width) is worth reallocating the drawing buffer.
    let lastW = window.innerWidth, lastH = window.innerHeight;
    const onResize = () => {
      if (mobile && window.innerWidth === lastW && Math.abs(window.innerHeight - lastH) < 160) return;
      lastW = window.innerWidth;
      lastH = window.innerHeight;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      starUniforms.uScale.value = renderer.domElement.height / 2;
      if (reduce) frame(0);
    };
    window.addEventListener("resize", onResize);

    let running = true;
    const onVisibility = () => (running = !document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    /* ---------- 6. Frame loop ---------- */

    let u = 0;
    let lastY = window.scrollY;
    let speed = 0;
    let t = 0;
    const look = new THREE.Vector3();
    const toCam = new THREE.Quaternion();
    const m4 = new THREE.Matrix4();
    const up = new THREE.Vector3(0, 1, 0);
    const baseFov = camera.fov;
    let warp = 0;
    let bank = 0;

    function frame(dt: number) {
      t += dt;
      const y = window.scrollY;
      // Smoothed scroll speed (px per frame), used to stretch the particle field.
      speed += (Math.abs(y - lastY) - speed) * 0.1;
      lastY = y;
      // The camera glides after the scroll position with a long, soft lag (frame-rate independent).
      u += (scrollToU(y) - u) * (reduce ? 1 : 1 - Math.pow(1 - 0.03, dt * 60));

      // Camera on the path, eased back by the intro and nudged by the mouse.
      mouse.sx += (mouse.x - mouse.sx) * 0.05;
      mouse.sy += (mouse.y - mouse.sy) * 0.05;
      const p = along(u);
      camera.position.set(p.x + mouse.sx * 0.9, p.y - mouse.sy * 0.6 + intro.back * 0.25, p.z + intro.back);
      look.copy(along(u + 0.03));
      look.x += mouse.sx * 1.6;
      look.y -= mouse.sy * 1;
      // Near the end the gaze settles on the orb.
      look.lerp(orbPos, smooth(0.8, END, u));
      camera.lookAt(look);

      // Fast scrolling = warp: the view widens and light streaks rush past.
      // Builds up gently and only on a really fast scroll, then fades out slowly.
      warp += (smooth(8, 70, speed) - warp) * 0.035;
      const fov = baseFov + warp * 5;
      if (Math.abs(camera.fov - fov) > 0.01) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
      // Bank into the path's turns, like a plane, plus a touch of mouse sway.
      const ahead = along(u + 0.035);
      bank += (THREE.MathUtils.clamp((p.x - ahead.x) * 0.045, -0.14, 0.14) - mouse.sx * 0.025 - bank) * 0.04;
      camera.rotateZ(bank);

      streakMat.opacity = warp * 0.4;
      streaks.visible = warp > 0.02;
      if (streaks.visible) {
        const len = 0.6 + warp * 6;
        streakData.forEach((st, i) => {
          st.z += dt * (10 + warp * 55);
          if (st.z > -1) st.z = -55 - Math.random() * 15; // passed the camera: respawn far ahead
          streakPos.set([st.x, st.y, st.z, st.x, st.y, st.z - len], i * 6);
        });
        streakGeo.attributes.position.needsUpdate = true;
      }
      starUniforms.uTime.value = t;
      starUniforms.uBoost.value = warp * 0.3;
      clouds.forEach((c) => (c.material.rotation += c.userData.spin * dt));

      // Lights drift around the camera so the whole route stays lit.
      keyLight.position.set(p.x + Math.sin(t * 0.4) * 6, p.y + 3, p.z - 6 + Math.cos(t * 0.3) * 3);
      fillLight.position.set(p.x - Math.cos(t * 0.35) * 6, p.y - 2, p.z - 10);

      // Hero crystal turns by itself, then bursts apart and swells as the camera dives through.
      const dive = smooth(0.01, 0.085, u);
      explode.value = dive * 5;
      crystal.scale.setScalar(1 + dive * 0.8);
      crystal.rotation.x = t * 0.15 + dive * 1.2;
      crystal.rotation.y = t * 0.22;
      (crystalWire.material as THREE.LineBasicMaterial).opacity = 0.35 * (1 - dive);

      // Gates spin, and flare up and swell slightly as the camera threads through them.
      rings.forEach((r) => {
        r.rotation.z += r.userData.spin * dt * (1 + warp * 1.5);
        const near = 1 - smooth(1.5, 12, r.position.distanceTo(camera.position));
        r.material.emissiveIntensity = 0.4 + near * 1.1;
        r.material.opacity = 0.5 + near * 0.2;
        r.scale.setScalar(1 + near * 0.1);
      });
      floaters.forEach((m) => {
        m.rotation.x += m.userData.speed * dt;
        m.rotation.y += m.userData.speed * 0.8 * dt;
        m.position.y = m.userData.baseY + Math.sin(t * 0.6 + m.userData.phase) * 0.35;
      });

      // Particles drift, and stretch along the flight direction (around the camera) when scrolling fast.
      const stretch = 1 + Math.min(speed / 90, 0.4);
      particles.scale.z += (stretch - particles.scale.z) * 0.05;
      particles.position.z = camera.position.z * (1 - particles.scale.z);
      particles.position.y = Math.sin(t * 0.2) * 0.4;
      particles.rotation.z = Math.sin(t * 0.05) * 0.03;

      // Experience line draws itself just ahead of the camera; milestones pop on as it reaches them.
      const draw = clamp01((u + 0.05 - LINE_FROM) / (LINE_TO - LINE_FROM));
      lineGeo.setDrawRange(0, Math.floor((lineIndexCount * draw) / 6) * 6);
      milestones.forEach((m) => {
        const show = draw >= m.userData.t;
        if (show !== m.userData.shown) {
          m.userData.shown = show;
          gsap.to(m.scale, show
            ? { x: 1, y: 1, z: 1, duration: reduce ? 0 : 1.2, ease: "elastic.out(1, 0.45)" }
            : { x: 0.0001, y: 0.0001, z: 0.0001, duration: 0.3, ease: "power3.inOut" });
        }
        m.rotation.y += dt * 1.2;
      });

      // Project screens turn to face the camera as it passes close by.
      screens.forEach((g) => {
        const d = g.position.distanceTo(camera.position);
        const near = 1 - smooth(5, 16, d);
        m4.lookAt(camera.position, g.position, up);
        toCam.setFromRotationMatrix(m4);
        const target = (g.userData.base as THREE.Quaternion).clone().slerp(toCam, near * 0.85);
        g.quaternion.slerp(target, reduce ? 1 : 0.08);
      });

      // The orb breathes.
      const pulse = 1 + Math.sin(t * 1.3) * 0.03;
      orb.scale.setScalar(pulse);
      halo.material.opacity = 0.7 + Math.sin(t * 1.3) * 0.2;

      renderer.render(scene, camera);
    }

    const tick = (_: number, deltaMS: number) => {
      if (running) frame(Math.min(deltaMS / 1000, 0.05));
    };
    if (reduce) frame(0);
    else gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      clearTimeout(introFallback);
      window.removeEventListener("loader:done", startIntro);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      ScrollTrigger.removeEventListener("refresh", buildKnots);
      zoneTriggers.forEach(({ st }) => st.kill());
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      document.documentElement.classList.remove("has-world");
    };
  }, [variant]);

  return (
    <>
      {/* Kept dim on purpose: it's atmosphere behind the text, never competing with it */}
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-40" />
      {/* Vignette: darkens the edges so the content always reads */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(2,6,18,0.4) 30%, rgba(2,6,18,0.7) 75%, rgba(2,6,18,0.94) 100%)" }}
      />
    </>
  );
}
