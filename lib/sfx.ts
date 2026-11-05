"use client";

/*
 * Animation mode sound effects, synthesised with Web Audio (no audio files to load).
 * Off by default; the navbar's sound button turns it on and the choice is remembered.
 * Every effect is a no-op while sound is off, so callers can fire them freely.
 *
 * Cinematic UI character rather than game blips: soft airy whooshes, glassy shimmers with long
 * tails, deep booms, warm pad swells, and a faint electric crackle and hum for texture. Only
 * sines, triangles and filtered noise with soft attacks, through a large hall and a gentle
 * high cut, so nothing is harsh. Each page (tab) has its own key and chord voicing, so every
 * page sounds different while the effects that overlap still sound like one piece.
 */

const KEY = "sfx";
const listeners = new Set<() => void>();

/** root: MIDI note of the page's key; chord: a lush voicing in semitones above it; hum: Hz. */
type Theme = { root: number; chord: number[]; hum: number };

const ADD9 = [0, 7, 14, 16, 19]; // 1 5 9 3 5
const MAJ7 = [0, 7, 11, 16, 19]; // 1 5 7 3 5
const MIN9 = [0, 7, 14, 15, 22]; // 1 5 9 ♭3 ♭7
const SUS = [0, 7, 14, 17, 19]; // 1 5 9 4 5

const THEMES: Record<string, Theme> = {
  home: { root: 50, chord: ADD9, hum: 55 },
  qualification: { root: 53, chord: MAJ7, hum: 58 },
  experience: { root: 52, chord: MIN9, hum: 52 },
  skills: { root: 55, chord: SUS, hum: 62 },
  projects: { root: 48, chord: MIN9, hum: 49 },
  research: { root: 47, chord: SUS, hum: 46 },
  certificate: { root: 54, chord: MAJ7, hum: 60 },
  cv: { root: 51, chord: ADD9, hum: 54 },
  contact: { root: 57, chord: ADD9, hum: 64 },
  photography: { root: 49, chord: MAJ7, hum: 50 },
  filmography: { root: 45, chord: MIN9, hum: 44 },
  tour: { root: 56, chord: SUS, hum: 61 },
  gadgets: { root: 58, chord: MIN9, hum: 66 },
  activity: { root: 53, chord: ADD9, hum: 57 },
};

let enabled = false;
let loaded = false;
let ctx: AudioContext | null = null;
let dry: GainNode | null = null; // into the master (high cut + compressor)
let wet: GainNode | null = null; // dry + the hall
let noiseBuf: AudioBuffer | null = null;
let crackleBuf: AudioBuffer | null = null;
let wind: { gain: GainNode; filter: BiquadFilterNode } | null = null;
let theme: Theme = THEMES.home;
let page = "";
const last: Record<string, number> = {};

const load = () => {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    enabled = localStorage.getItem(KEY) === "on";
  } catch {}
};

/* ---------- audio graph ---------- */

/** A generated stereo hall: a short gap, then a long, smooth tail. */
const hall = (a: AudioContext, seconds: number) => {
  const len = Math.floor(a.sampleRate * seconds);
  const pre = Math.floor(a.sampleRate * 0.02);
  const buf = a.createBuffer(2, len, a.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = pre; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
  }
  return buf;
};

/** Built on first use (browsers only allow audio to start after a click or key press). */
const audio = () => {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    const a = (ctx = new AC());

    const comp = a.createDynamicsCompressor();
    comp.threshold.value = -20;
    comp.ratio.value = 3;
    comp.attack.value = 0.01;
    comp.release.value = 0.3;
    comp.connect(a.destination);
    const soften = a.createBiquadFilter(); // nothing glassy should ever turn shrill
    soften.type = "lowpass";
    soften.frequency.value = 9000;
    soften.connect(comp);
    dry = a.createGain();
    dry.gain.value = 0.7;
    dry.connect(soften);

    wet = a.createGain();
    wet.connect(dry);
    const verb = a.createConvolver();
    verb.buffer = hall(a, 3.6);
    const verbGain = a.createGain();
    verbGain.gain.value = 0.55;
    wet.connect(verb).connect(verbGain).connect(dry);

    noiseBuf = a.createBuffer(1, a.sampleRate * 3, a.sampleRate);
    const n = noiseBuf.getChannelData(0);
    for (let i = 0; i < n.length; i++) n[i] = Math.random() * 2 - 1;
    // Sparse, soft electric crackle: occasional clicks that die away quickly
    crackleBuf = a.createBuffer(1, a.sampleRate * 3, a.sampleRate);
    const c = crackleBuf.getChannelData(0);
    let v = 0;
    for (let i = 0; i < c.length; i++) {
      if (Math.random() < 0.0015) v = (Math.random() * 2 - 1) * (0.2 + Math.random() * 0.8);
      c[i] = v;
      v *= 0.8;
    }
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
};

type Out = { a: AudioContext; dry: GainNode; wet: GainNode };

/** Run an effect only when sound is on (and at most once per `gap` ms for that effect). */
const play = (name: string, gap: number, fn: (o: Out) => void) => {
  load();
  if (!enabled) return;
  const a = audio();
  if (!a || !dry || !wet || a.state !== "running") return;
  const now = performance.now();
  if (now - (last[name] ?? 0) < gap) return;
  last[name] = now;
  fn({ a, dry, wet });
};

/* ---------- building blocks ---------- */

const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);
/** The page's chord tone `i` (wrapping up an octave past the top), `oct` octaves up. */
const tone = (i: number, oct = 0) => {
  const c = theme.chord;
  return hz(theme.root + c[i % c.length] + 12 * (Math.floor(i / c.length) + oct));
};

const shape = (a: AudioContext, out: AudioNode, peak: number, attack: number, release: number, at: number) => {
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, at + attack + release);
  g.connect(out);
  return g;
};

/** A glassy note: a sine with a quiet octave partial and a slight detune, soft attack, long tail. */
const glass = (o: Out, f: number, at: number, vel: number, release = 1.6, pan = 0) => {
  const { a } = o;
  const p = a.createStereoPanner();
  p.pan.value = pan;
  p.connect(o.wet);
  const env = shape(a, p, vel, 0.012, release, at);
  [
    [f, 1],
    [f * 2.001, 0.25],
    [f * 0.998, 0.6],
  ].forEach(([freq, level]) => {
    const osc = a.createOscillator();
    osc.frequency.value = freq;
    const g = a.createGain();
    g.gain.value = level / 1.85;
    osc.connect(g).connect(env);
    osc.start(at);
    osc.stop(at + release + 0.1);
  });
};

/** A warm pad: triangles a touch apart, swelling in and fading slowly. */
const pad = (o: Out, freqs: number[], at: number, vel: number, swell: number, release: number) => {
  const { a } = o;
  const lp = a.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1400;
  lp.connect(shape(a, o.wet, vel, swell, release, at));
  freqs.forEach((f, i) =>
    [-6, 6].forEach((cents) => {
      const osc = a.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = f;
      osc.detune.value = cents + (i % 2 ? 3 : -3);
      const g = a.createGain();
      g.gain.value = 1 / (freqs.length * 2);
      osc.connect(g).connect(lp);
      osc.start(at);
      osc.stop(at + swell + release + 0.1);
    })
  );
};

/** Air moving past: filtered noise sweeping between two frequencies and across the stereo field. */
const whoosh = (o: Out, from: number, to: number, at: number, dur: number, vel: number) => {
  const { a } = o;
  const src = a.createBufferSource();
  src.buffer = noiseBuf;
  const f = a.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = 0.8;
  f.frequency.setValueAtTime(from, at);
  f.frequency.exponentialRampToValueAtTime(to, at + dur);
  const p = a.createStereoPanner();
  p.pan.setValueAtTime(-0.6, at);
  p.pan.linearRampToValueAtTime(0.6, at + dur);
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(vel, at + dur * 0.55);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(f).connect(g).connect(p).connect(o.wet);
  src.start(at, Math.random() * 1.5);
  src.stop(at + dur + 0.05);
};

/** A deep cinematic boom: a falling sub with a soft, dark thud of noise. */
const boom = (o: Out, at: number, vel: number) => {
  const { a } = o;
  const osc = a.createOscillator();
  osc.frequency.setValueAtTime(70, at);
  osc.frequency.exponentialRampToValueAtTime(32, at + 0.9);
  osc.connect(shape(a, o.dry, vel, 0.01, 1.3, at));
  osc.start(at);
  osc.stop(at + 1.4);
  const src = a.createBufferSource();
  src.buffer = noiseBuf;
  const lp = a.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 260;
  src.connect(lp).connect(shape(a, o.wet, vel * 0.5, 0.005, 0.6, at));
  src.start(at, Math.random());
  src.stop(at + 0.7);
};

/** A soft, rounded tick (the kind a good interface makes), with a hint of room. */
const tick = (o: Out, at: number, vel: number, f = 1900 + Math.random() * 500) => {
  const { a } = o;
  const osc = a.createOscillator();
  osc.frequency.setValueAtTime(f, at);
  osc.frequency.exponentialRampToValueAtTime(f * 0.7, at + 0.03);
  const g = shape(a, o.dry, vel, 0.002, 0.04, at);
  osc.connect(g);
  g.connect(o.wet);
  osc.start(at);
  osc.stop(at + 0.08);
};

/** Faint electric texture: soft crackle, darkened, and a quiet hum with a slow waver. */
const electric = (o: Out, at: number, dur: number, vel: number, withHum = true) => {
  const { a } = o;
  const src = a.createBufferSource();
  src.buffer = crackleBuf;
  const band = a.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 2600;
  band.Q.value = 0.6;
  src.connect(band).connect(shape(a, o.wet, vel, 0.05, dur, at));
  src.start(at, Math.random() * 2);
  src.stop(at + dur + 0.1);
  if (!withHum) return;
  const hum = a.createOscillator();
  hum.frequency.value = theme.hum * 2;
  const waver = a.createOscillator();
  waver.frequency.value = 5 + Math.random() * 3;
  const depth = a.createGain();
  depth.gain.value = 0.4;
  const level = shape(a, o.wet, vel * 0.25, dur * 0.3, dur * 0.7, at);
  const am = a.createGain();
  am.gain.value = 0.6;
  waver.connect(depth).connect(am.gain);
  hum.connect(am).connect(level);
  [hum, waver].forEach((n) => {
    n.start(at);
    n.stop(at + dur + 0.1);
  });
};

/** Gently strummed chord tones, rising, with long tails. */
const strum = (o: Out, at: number, vel: number, count = 4, oct = 1, gap = 0.045) => {
  for (let i = 0; i < count; i++) glass(o, tone(i + 1, oct), at + i * gap, vel * (1 - i * 0.1), 1.8, -0.4 + (0.8 * i) / Math.max(1, count - 1));
};

/** The page's signature: air rushing in, a boom, its chord blooming, and a shimmer on top. */
const signature = (o: Out, long: boolean) => {
  const t = o.a.currentTime;
  const rush = long ? 0.9 : 0.6;
  whoosh(o, 300, 4500, t, rush, 0.09);
  boom(o, t + rush * 0.9, 0.5);
  pad(o, [tone(0, -1), tone(1, -1), tone(3, -1)], t + rush * 0.8, 0.07, 0.5, 2.2);
  strum(o, t + rush * 0.95, 0.06, 5, 1, 0.07);
  electric(o, t + rush, 1.4, 0.05);
};

/* ---------- effects ---------- */

export const sfx = {
  /** One key press of a typed command: a quiet, soft tick */
  type: () => play("type", 60, (o) => tick(o, o.a.currentTime, 0.035)),

  /** Scrambled text decoding: the faintest tick */
  decode: () => play("decode", 140, (o) => tick(o, o.a.currentTime, 0.012, 2600 + Math.random() * 800)),

  /** ACCESS GRANTED: the chord rising in glass, with a breath of electricity */
  granted: () =>
    play("granted", 350, (o) => {
      strum(o, o.a.currentTime, 0.06, 4, 1, 0.06);
      electric(o, o.a.currentTime, 0.8, 0.04, false);
    }),

  /** Glitch: a brief digital flutter of air and crackle */
  glitch: () =>
    play("glitch", 260, (o) => {
      const { a } = o;
      const t = a.currentTime;
      const src = a.createBufferSource();
      src.buffer = noiseBuf;
      const f = a.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = 1800;
      f.Q.value = 1.5;
      const flutter = a.createGain();
      for (let s = 0; s < 0.28; s += 0.028) flutter.gain.setValueAtTime(Math.random() < 0.5 ? 0.15 : 1, t + s);
      src.connect(f).connect(flutter).connect(shape(a, o.wet, 0.05, 0.01, 0.28, t));
      src.start(t, Math.random());
      src.stop(t + 0.35);
      electric(o, t, 0.35, 0.05, false);
    }),

  /** Laser scan: air sweeping down the section */
  laser: (dur = 1.1) => play("laser", 300, (o) => whoosh(o, 5200, 380, o.a.currentTime, dur, 0.05)),

  /** Lightning over a section: soft crackle, a distant roll of thunder, a breath of air */
  storm: (dur = 1.3) =>
    play("storm", 500, (o) => {
      const { a } = o;
      const t = a.currentTime;
      electric(o, t, dur, 0.07);
      const src = a.createBufferSource();
      src.buffer = noiseBuf;
      const lp = a.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(380, t);
      lp.frequency.exponentialRampToValueAtTime(90, t + dur + 1);
      src.connect(lp).connect(shape(a, o.wet, 0.12, 0.08, dur + 1, t));
      src.start(t, Math.random());
      src.stop(t + dur + 1.2);
      whoosh(o, 900, 3000, t, dur * 0.7, 0.025);
    }),

  /** HUD frame locking on: a deep boom under a low swell of the page's chord */
  lock: () =>
    play("lock", 300, (o) => {
      const t = o.a.currentTime;
      boom(o, t, 0.45);
      pad(o, [tone(0, -1), tone(1, -1)], t, 0.05, 0.08, 1.4);
    }),

  /** A card or image being scanned in: a small rising breath */
  scan: () => play("scan", 220, (o) => whoosh(o, 700, 3200, o.a.currentTime, 0.35, 0.025)),

  /** A card locked on as a target: two glass notes */
  target: () =>
    play("target", 140, (o) => {
      const t = o.a.currentTime;
      glass(o, tone(2, 1), t, 0.035, 0.9, -0.3);
      glass(o, tone(4, 1), t + 0.08, 0.03, 1.1, 0.3);
    }),

  /** Pointer over a button or link: a whisper of a tick */
  hover: () => play("hover", 80, (o) => tick(o, o.a.currentTime, 0.014, 2400)),

  /** Button press: a soft tick with a small glass note */
  click: () =>
    play("click", 80, (o) => {
      tick(o, o.a.currentTime, 0.05, 1600);
      glass(o, tone(0, 1), o.a.currentTime, 0.025, 0.6);
    }),

  /** The name (navbar or hero): an electric shimmer that climbs the page's chord */
  name: () =>
    play("name", 900, (o) => {
      const t = o.a.currentTime;
      whoosh(o, 500, 6000, t, 0.5, 0.08);
      electric(o, t, 0.9, 0.1);
      boom(o, t + 0.1, 0.25);
      strum(o, t + 0.12, 0.08, 5, 1, 0.05);
      glass(o, tone(1, 3), t + 0.45, 0.03, 2.2);
    }),

  /** Fast scrolling: rushing air with a crackle in it, louder the faster you go (0 to 1) */
  setStatic: (level: number) => {
    if (!enabled || !ctx || !wet || ctx.state !== "running") {
      if (wind && ctx) wind.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
      return;
    }
    if (!wind) {
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(wet);
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 0.7;
      filter.frequency.value = 600;
      filter.connect(gain);
      const air = ctx.createBufferSource();
      air.buffer = noiseBuf;
      air.loop = true;
      air.connect(filter);
      air.start();
      const sparks = ctx.createBufferSource();
      sparks.buffer = crackleBuf;
      sparks.loop = true;
      const sparkLevel = ctx.createGain();
      sparkLevel.gain.value = 0.5;
      sparks.connect(sparkLevel).connect(gain);
      sparks.start();
      wind = { gain, filter };
    }
    wind.filter.frequency.setTargetAtTime(500 + level * 2500, ctx.currentTime, 0.1);
    wind.gain.gain.setTargetAtTime(level * 0.09, ctx.currentTime, 0.08);
  },

  /** A page (tab) was opened: switch to its key and play its signature */
  page: (pathname: string) => {
    const key = pathname.split("/").filter(Boolean)[0] ?? "home";
    const changed = page !== "" && key !== page;
    page = key;
    theme = THEMES[key] ?? THEMES.home;
    if (changed) play("page", 0, (o) => signature(o, false));
  },
};

export const isSoundOn = () => {
  load();
  return enabled;
};

export const setSound = (on: boolean) => {
  load();
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {}
  if (on) {
    // Turning it on plays this page's signature (once the context has started)
    audio()
      ?.resume()
      .then(() => play("boot", 0, (o) => signature(o, true)))
      .catch(() => {});
  } else {
    sfx.setStatic(0);
  }
  listeners.forEach((l) => l());
};

export const subscribeSound = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

/** If sound was left on last visit, the browser still needs a click/key before audio may start. */
export const wakeSound = () => {
  load();
  if (enabled) audio();
};
