import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * EdgePartyBombers Component
 * Features dual party popper cannons mounted at the bottom-left and bottom-right
 * edges of the screen, continuously blasting festive paper ribbons, confetti,
 * and sparkles inward with physical recoil and muzzle animations.
 */
export default function EdgePartyBombers({ theme = 'dark', enabled = true }) {
  const isDark = theme === 'dark';
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const [leftRecoil, setLeftRecoil] = useState(false);
  const [rightRecoil, setRightRecoil] = useState(false);
  const [isBlasting, setIsBlasting] = useState(true);

  // Confetti Color Palette
  const confettiColors = [
    '#ff2a6d', '#ff5e7e', '#ffd166', '#06d6a0', '#118ab2',
    '#9b5de5', '#f15bb5', '#fee440', '#00bbf9', '#00f5d4', '#ffffff'
  ];

  // Shoot confetti from a specific cannon
  const shootCannon = useCallback((side = 'left', count = 45, isMega = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Trigger visual recoil animation on the cannon
    if (side === 'left') {
      setLeftRecoil(true);
      setTimeout(() => setLeftRecoil(false), 220);
    } else {
      setRightRecoil(true);
      setTimeout(() => setRightRecoil(false), 220);
    }

    const originX = side === 'left' ? 40 : canvas.width - 40;
    const originY = canvas.height - 40;

    // Base angle: left shoots up-right (-60°), right shoots up-left (-120°)
    const baseAngle = side === 'left' ? -Math.PI / 3 : (-2 * Math.PI) / 3;
    const spread = Math.PI / 4; // 45 degree spread

    const particleCount = isMega ? count * 2.2 : count;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = baseAngle + (Math.random() - 0.5) * spread;
      const speed = isMega ? Math.random() * 22 + 15 : Math.random() * 18 + 12;
      const isRibbon = Math.random() > 0.45;
      const size = Math.random() * 8 + 5;

      newParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed * (Math.random() * 0.4 + 0.8),
        vy: Math.sin(angle) * speed * (Math.random() * 0.4 + 0.8),
        size,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 18,
        gravity: 0.36,
        drag: 0.965,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 110 + 90,
        isRibbon,
        aspect: isRibbon ? Math.random() * 2.5 + 2 : 1,
      });
    }

    particlesRef.current.push(...newParticles);
  }, []);

  // Continuous Automatic Party Bomber Blasts
  useEffect(() => {
    if (!enabled || !isBlasting) return;

    let step = 0;
    const blastInterval = setInterval(() => {
      step = (step + 1) % 6;

      if (step === 0 || step === 3) {
        // Left cannon blast
        shootCannon('left', 40);
      } else if (step === 1 || step === 4) {
        // Right cannon blast
        shootCannon('right', 40);
      } else if (step === 2 || step === 5) {
        // Grand Synchronized Double Edge Blast
        shootCannon('left', 35);
        shootCannon('right', 35);
      }
    }, 1400);

    return () => clearInterval(blastInterval);
  }, [enabled, isBlasting, shootCannon]);

  // Canvas particle render loop (60fps)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.rotation += p.rotationSpeed;
        p.life++;

        if (p.life > p.maxLife * 0.7) {
          p.opacity = Math.max(0, 1 - (p.life - p.maxLife * 0.7) / (p.maxLife * 0.3));
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.isRibbon) {
          ctx.fillRect(-p.size / 2, (-p.size * p.aspect) / 2, p.size, p.size * p.aspect);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        if (p.life >= p.maxLife || p.y > canvas.height + 40) {
          particles.splice(i, 1);
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Fullscreen Canvas overlay for the party particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-30"
      />

      {/* ──────────────── LEFT PARTY BOMBER CANNON ──────────────── */}
      <div
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 flex flex-col items-center select-none"
        title="Left Party Bomber - Click to fire mega blast!"
      >
        <button
          type="button"
          onClick={() => shootCannon('left', 65, true)}
          className={`relative group p-3 sm:p-3.5 rounded-full backdrop-blur-md border transition-all duration-200 cursor-pointer shadow-xl ${
            leftRecoil ? 'scale-90 -translate-x-1 translate-y-1' : 'hover:scale-110'
          } ${
            isDark
              ? 'bg-rose-950/70 border-rose-500/40 text-white shadow-[0_0_20px_rgba(244,63,94,0.35)]'
              : 'bg-white/90 border-rose-300 text-rose-600 shadow-lg'
          }`}
        >
          {/* Cannon Graphic tilted 45° shooting inward */}
          <div className="text-3xl sm:text-4xl transform rotate-45 transition-transform group-hover:rotate-[50deg]">
            🎉
          </div>

          {/* Glowing pulse ring */}
          <div className="absolute inset-0 rounded-full border border-rose-400/50 animate-ping pointer-events-none opacity-40" />
        </button>
      </div>

      {/* ──────────────── RIGHT PARTY BOMBER CANNON ──────────────── */}
      <div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-center select-none"
        title="Right Party Bomber - Click to fire mega blast!"
      >
        <button
          type="button"
          onClick={() => shootCannon('right', 65, true)}
          className={`relative group p-3 sm:p-3.5 rounded-full backdrop-blur-md border transition-all duration-200 cursor-pointer shadow-xl ${
            rightRecoil ? 'scale-90 translate-x-1 translate-y-1' : 'hover:scale-110'
          } ${
            isDark
              ? 'bg-purple-950/70 border-purple-500/40 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]'
              : 'bg-white/90 border-purple-300 text-purple-600 shadow-lg'
          }`}
        >
          {/* Cannon Graphic tilted -45° shooting inward */}
          <div className="text-3xl sm:text-4xl transform -rotate-45 scale-x-[-1] transition-transform group-hover:-rotate-[50deg]">
            🎉
          </div>

          {/* Glowing pulse ring */}
          <div className="absolute inset-0 rounded-full border border-purple-400/50 animate-ping pointer-events-none opacity-40" />
        </button>
      </div>

      {/* Subtle Pause / Play Control floating pill in bottom center */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40">
        <button
          type="button"
          onClick={() => setIsBlasting((prev) => !prev)}
          className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium tracking-wide backdrop-blur-md border transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-md ${
            isDark
              ? 'bg-black/40 hover:bg-black/60 border-white/15 text-gray-300'
              : 'bg-white/70 hover:bg-white/90 border-black/10 text-gray-700'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isBlasting ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span>{isBlasting ? 'Party Bombers: Continuous Blast ON' : 'Party Bombers: Paused'}</span>
        </button>
      </div>
    </>
  );
}
