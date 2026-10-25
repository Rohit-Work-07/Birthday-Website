import { useState, useEffect, useRef, useCallback } from 'react';

// Math & Physics Logic
export function clamp(v, a, b) {
  return Math.min(b, Math.max(a, v));
}

/** Height of a string sagging by `sag` between (0, y0) and (w, y0), at x. */
export function stringY(x, w, y0, sag) {
  const t = clamp(x / w, 0, 1);
  return y0 + 4 * sag * t * (1 - t);
}

/** One step of a critically damped spring toward target. */
export function springStep(x, v, target, dt, k = 70) {
  const c = 2 * Math.sqrt(k);
  const nv = v + (k * (target - x) - c * v) * dt;
  return [x + nv * dt, nv];
}

/** One step of a print's swing. */
export function swingStep(a, w, lineVel, dt, gain) {
  const nw = w + (-38 * a - 4.2 * w + lineVel * 0.0034 * gain) * dt;
  return [clamp(a + nw * dt, -0.6, 0.6), nw];
}

/** Index of the print nearest the centre for a line offset. */
export function nearestAt(off, spacing, n) {
  return clamp(Math.round(off / spacing), 0, Math.max(0, n - 1));
}

export function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

const PALETTES = {
  dawn: { top: '#e7b7a5', bottom: '#f8e8d6', sun: '#fff4df', far: '#d2b2bb', near: '#3a2a3b', mist: '255,240,232' },
  alpine: { top: '#7ea5c8', bottom: '#e3ecf2', sun: '#ffffff', far: '#a9bfd0', near: '#1c3044', mist: '236,244,250' },
  dusk: { top: '#2a2450', bottom: '#ef8d60', sun: '#ffd9a6', far: '#93607c', near: '#18121f', mist: '255,196,160' },
  mist: { top: '#c4d0cb', bottom: '#eef1ec', sun: '#ffffff', far: '#aebcb5', near: '#2c3a33', mist: '246,248,245' },
};

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexRgb(h) {
  const v = parseInt(h.replace('#', ''), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function mixRgb(a, b, t) {
  const A = hexRgb(a);
  const B = hexRgb(b);
  return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',') + ')';
}

function paintLandscape(seed, palette, w = 1600, h = 1000) {
  if (typeof document === 'undefined') return '';
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  if (!g) return '';
  const P = PALETTES[palette] ?? PALETTES.dawn;
  const r = mulberry32(seed * 104729 + 7);

  const sky = g.createLinearGradient(0, 0, 0, h * 0.72);
  sky.addColorStop(0, P.top);
  sky.addColorStop(1, P.bottom);
  g.fillStyle = sky;
  g.fillRect(0, 0, w, h);
  const sx = w * (0.22 + r() * 0.56);
  const sy = h * (0.26 + r() * 0.16);
  const halo = g.createRadialGradient(sx, sy, 0, sx, sy, w * 0.45);
  halo.addColorStop(0, 'rgba(' + hexRgb(P.sun).join(',') + ',.85)');
  halo.addColorStop(0.08, 'rgba(' + hexRgb(P.sun).join(',') + ',.55)');
  halo.addColorStop(1, 'rgba(' + hexRgb(P.sun).join(',') + ',0)');
  g.fillStyle = halo;
  g.fillRect(0, 0, w, h);
  g.fillStyle = P.sun;
  g.beginPath();
  g.arc(sx, sy, h * 0.045, 0, Math.PI * 2);
  g.fill();

  const layers = 5;
  for (let L = 0; L < layers; L++) {
    const k = L / (layers - 1);
    const base = h * (0.42 + k * 0.4);
    const amp = h * (0.07 + k * 0.1);
    const ph = [r(), r(), r(), r()].map((v) => v * Math.PI * 2);
    const fr = [1.3 + r(), 3.1 + r() * 2, 7 + r() * 4, 17 + r() * 8];
    const ridge = (x) => {
      const u = x / w;
      return (
        base -
        amp *
          (0.55 * Math.sin(u * fr[0] + ph[0]) +
            0.28 * Math.sin(u * fr[1] + ph[1]) +
            0.12 * Math.abs(Math.sin(u * fr[2] + ph[2])) +
            0.05 * Math.sin(u * fr[3] + ph[3]))
      );
    };
    const mist = g.createLinearGradient(0, base - amp * 1.4, 0, base + amp * 0.4);
    mist.addColorStop(0, 'rgba(' + P.mist + ',0)');
    mist.addColorStop(1, 'rgba(' + P.mist + ',' + (0.55 - k * 0.35).toFixed(2) + ')');
    g.fillStyle = mist;
    g.fillRect(0, base - amp * 1.4, w, amp * 1.8);
    const body = g.createLinearGradient(0, base - amp, 0, h);
    body.addColorStop(0, mixRgb(P.far, P.near, Math.pow(k, 1.3)));
    body.addColorStop(1, mixRgb(P.far, P.near, Math.min(1, Math.pow(k, 1.3) + 0.18)));
    g.fillStyle = body;
    g.beginPath();
    g.moveTo(0, h);
    for (let x = 0; x <= w; x += 6) g.lineTo(x, ridge(x));
    g.lineTo(w, h);
    g.closePath();
    g.fill();
  }

  const vig = g.createRadialGradient(w / 2, h * 0.45, h * 0.3, w / 2, h / 2, w * 0.78);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,.32)');
  g.fillStyle = vig;
  g.fillRect(0, 0, w, h);
  const grain = g.getImageData(0, 0, w, h);
  const d = grain.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (r() - 0.5) * 14;
    d[i] += v;
    d[i + 1] += v;
    d[i + 2] += v;
  }
  g.putImageData(grain, 0, 0);
  return c.toDataURL('image/jpeg', 0.88);
}

function useSlideImages(slides) {
  const key = slides.map((s) => s.image || (s.palette || 'dawn') + ':' + (s.seed ?? 1)).join('|');
  const [painted, setPainted] = useState(() => slides.map(() => ''));
  useEffect(() => {
    setPainted(slides.map((s, i) => (s.image ? '' : paintLandscape(s.seed ?? i + 1, s.palette || 'dawn'))));
  }, [key]);
  return slides.map((s, i) => s.image || painted[i] || '');
}

const PL_CSS = `
.pl-wrapper { position: relative; width: 100%; max-width: 100%; }
.pl-root { position: relative; width: 100%; overflow: hidden; background: transparent; color: var(--pl-ink); user-select: none; -webkit-user-select: none; touch-action: pan-y; outline: none; cursor: grab; }
.pl-root[data-drag='1'] { cursor: grabbing; }
.pl-string { position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.pl-card { position: absolute; left: 0; top: 0; width: var(--pl-cw); transform-origin: 50% 0; will-change: transform; cursor: inherit; }
.pl-print { margin-top: 10px; background: #faf8f5; padding: 10px 10px 4px; border-radius: 3px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.12), 0 16px 26px -12px rgba(0,0,0,0.45); transition: transform .45s cubic-bezier(.2,.7,.2,1), filter .45s ease, opacity .45s ease; border: 1px solid rgba(0,0,0,0.08); }
.pl-card[data-on='0'] .pl-print { transform: scale(.86); filter: saturate(.75) brightness(.92); opacity: 0.68; }
.pl-card[data-on='1'] .pl-print { transform: scale(1.06); box-shadow: 0 14px 30px -5px rgba(0,0,0,0.25), 0 26px 45px -8px rgba(0,0,0,0.6); opacity: 1; }
.pl-shot { position: relative; aspect-ratio: 1; overflow: hidden; background: #d9d5cc; border-radius: 2px; }
.pl-shot img { position: absolute; inset: 0; width: 100%; height: 100%; max-width: none; object-fit: cover; object-position: center 20%; display: block; pointer-events: none; }
.pl-note { height: 32px; display: flex; align-items: center; justify-content: center; padding: 0 4px; font: italic 500 13px/1.1 ui-serif, Georgia, 'Times New Roman', serif; color: #2e2a25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; }
.pl-peg { position: absolute; left: 50%; top: 0; width: 10px; height: 24px; margin-left: -5px; border-radius: 2px; background: linear-gradient(90deg, #c9a67a, #e3c9a1 45%, #b8915f); box-shadow: 0 2px 4px rgba(0,0,0,0.3); z-index: 10; }
.pl-peg::after { content: ''; position: absolute; left: 4px; top: 7px; width: 2px; height: 6px; background: rgba(80,60,30,0.5); border-radius: 1px; }
@media (prefers-reduced-motion: reduce) { .pl-print { transition: none; } }
`;

export default function PolaroidLineCarousel({
  slides = [],
  stageHeight = 420,
  cardWidth = 295,
  sag = 36,
  swing = 1,
  autoplay = 4200,
  string = '#c2a1cf',
  background = 'transparent',
  ink = 'currentColor',
  onChange,
  className = '',
  style = {},
  ariaLabel = 'Memories with you',
}) {
  const n = slides.length;
  const srcs = useSlideImages(slides);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [size, setSize] = useState({ w: 1000, h: stageHeight, cw: cardWidth });
  const rootRef = useRef(null);
  const pathRef = useRef(null);
  const cards = useRef([]);
  const sim = useRef({ off: 0, vel: 0, target: 0, a: [], w: [] });
  const drag = useRef(null);
  const lastTouch = useRef(0);
  const activeRef = useRef(0);
  const opts = useRef({ sag, swing });
  opts.current = { sag, swing };

  const spacing = size.cw * 1.12;
  const goTo = useCallback(
    (i) => {
      sim.current.target = clamp(i, 0, n - 1) * spacing;
    },
    [n, spacing]
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(() => {
      const r = root.getBoundingClientRect();
      const cw = Math.round(Math.max(180, Math.min(cardWidth, r.width * 0.55, r.height * 0.72)));
      setSize({ w: r.width, h: r.height, cw });
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [cardWidth]);

  useEffect(() => {
    sim.current.target = activeRef.current * spacing;
    sim.current.off = activeRef.current * spacing;
  }, [spacing]);

  useEffect(() => {
    onChange?.(active);
  }, [active, onChange]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visible = true;
    let raf = 0;
    let prev = performance.now();
    const S = sim.current;

    const frame = (now) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.033, (now - prev) / 1000);
      prev = now;
      const { w, h, cw } = size;
      const y0 = Math.max(22, h * 0.1);
      const d = drag.current;
      let lineVel;
      if (d && d.moved) {
        lineVel = d.v * 1000;
      } else {
        const before = S.off;
        [S.off, S.vel] = springStep(S.off, S.vel, S.target, dt);
        lineVel = -(S.off - before) / Math.max(dt, 1e-3);
      }
      const o = opts.current;
      const g = reduce ? 0 : o.swing;
      const near = nearestAt(S.off, spacing, n);
      for (let i = 0; i < n; i++) {
        const el = cards.current[i];
        if (!el) continue;
        const x = w / 2 + i * spacing - S.off;
        if (x < -cw * 1.5 || x > w + cw * 1.5) {
          el.style.visibility = 'hidden';
          continue;
        }
        el.style.visibility = 'visible';
        let a = S.a[i] || 0;
        let av = S.w[i] || 0;
        [a, av] = swingStep(a, av, lineVel, dt, g);
        if (g) a += Math.sin(now / 1300 + i * 1.7) * 0.0009 * g;
        S.a[i] = a;
        S.w[i] = av;
        const y = stringY(x, w, y0, o.sag) - 4;
        el.style.transform = 'translate(' + (x - cw / 2).toFixed(1) + 'px,' + y.toFixed(1) + 'px) rotate(' + a.toFixed(4) + 'rad)';
        el.style.zIndex = String(i === near ? n + 1 : n - Math.abs(i - near));
      }
      pathRef.current?.setAttribute('d', 'M0 ' + y0 + ' Q' + w / 2 + ' ' + (y0 + 2 * o.sag) + ' ' + w + ' ' + y0);
      if (near !== activeRef.current) {
        activeRef.current = near;
        setActive(near);
      }
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        prev = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(root);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [size, spacing, n]);

  useEffect(() => {
    if (!autoplay || n < 2) return;
    const t = window.setInterval(() => {
      if (document.hidden || drag.current || performance.now() - lastTouch.current < autoplay) return;
      goTo(activeRef.current >= n - 1 ? 0 : activeRef.current + 1);
    }, autoplay);
    return () => window.clearInterval(t);
  }, [autoplay, n, goTo]);

  const onDown = (e) => {
    lastTouch.current = performance.now();
    drag.current = { x: e.clientX, off: sim.current.off, lx: e.clientX, lt: e.timeStamp, v: 0, moved: false };
  };

  const onMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      setDragging(true);
      rootRef.current?.setPointerCapture(e.pointerId);
    }
    if (!d.moved) return;
    const dt = Math.max(1, e.timeStamp - d.lt);
    d.v = 0.7 * ((e.clientX - d.lx) / dt) + 0.3 * d.v;
    d.lx = e.clientX;
    d.lt = e.timeStamp;
    const max = (n - 1) * spacing;
    let off = d.off - dx;
    if (off < 0) off *= 0.35;
    if (off > max) off = max + (off - max) * 0.35;
    sim.current.off = off;
  };

  const onUp = (e) => {
    const d = drag.current;
    drag.current = null;
    lastTouch.current = performance.now();
    if (!d) return;
    if (d.moved) {
      setDragging(false);
      sim.current.vel = -d.v * 1000;
      goTo(nearestAt(sim.current.off - d.v * 180, spacing, n));
      return;
    }
    const card = e.target.closest('[data-i]');
    if (card) goTo(Number(card.getAttribute('data-i')));
  };

  const step = (dir) => {
    lastTouch.current = performance.now();
    goTo(clamp(activeRef.current + dir, 0, n - 1));
  };

  const onKey = (e) => {
    if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else return;
    e.preventDefault();
  };

  const s = slides[active] || {};

  return (
    <div
      className={['pl-wrapper flex flex-col items-center select-none', className].filter(Boolean).join(' ')}
      style={{
        '--pl-ink': ink,
        '--pl-cw': size.cw + 'px',
        ...style,
      }}
    >
      <style>{PL_CSS}</style>

      {/* ── Swinging Clothesline Stage (Guaranteed Never to Overlap Bar) ── */}
      <div
        ref={rootRef}
        className="pl-root relative w-full overflow-hidden outline-none cursor-grab"
        style={{ height: `${stageHeight}px` }}
        data-drag={dragging ? '1' : '0'}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <svg className="pl-string" aria-hidden="true">
          <path ref={pathRef} fill="none" stroke={string} strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        {slides.map((sl, i) => (
          <div
            key={i}
            className="pl-card"
            data-i={i}
            data-on={i === active ? '1' : '0'}
            ref={(el) => (cards.current[i] = el)}
            aria-hidden={i === active ? undefined : true}
          >
            <div className="pl-print">
              <div className="pl-shot">
                {srcs[i] ? <img src={srcs[i]} alt={sl.alt || sl.title || ''} draggable={false} /> : null}
              </div>
              <div className="pl-note font-romantic text-base sm:text-lg">{sl.title || ''}</div>
            </div>
            <div className="pl-peg" />
          </div>
        ))}
      </div>

      {/* ── Clean Information & Controls Bar (Separated Below Stage) ── */}
      <div className="w-full max-w-xl mx-auto px-4 mt-1 sm:mt-2 flex items-center justify-between gap-3 sm:gap-4 z-10">
        <div className="flex-1 min-w-0" key={active}>
          {s.title && (
            <h3 className="font-cormorant font-semibold text-lg sm:text-2xl truncate text-rose-500 dark:text-rose-400">
              {s.title}
            </h3>
          )}
          {s.caption && (
            <p className="font-cormorant italic text-xs sm:text-sm opacity-85 truncate mt-0.5">
              {s.caption}
            </p>
          )}
        </div>

        {/* Counter & Prev/Next Arrows */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="font-mono text-xs sm:text-sm tracking-wider opacity-70">
            <b className="font-bold opacity-100">{pad2(active + 1)}</b> / {pad2(n)}
          </span>
          <button
            type="button"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-stone-300/40 dark:border-white/20 bg-black/5 dark:bg-white/10 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
            aria-label="Previous photo"
            onClick={() => step(-1)}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>
          <button
            type="button"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-stone-300/40 dark:border-white/20 bg-black/5 dark:bg-white/10 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
            aria-label="Next photo"
            onClick={() => step(1)}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
