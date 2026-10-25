import { useState, useEffect, useRef, useCallback } from 'react';

// Birthday Target: October 26, 2026 at 00:00:00 (Midnight)
const BIRTHDAY_DATE_STR = '2026-10-26T00:00:00';

export default function Wishes({ theme = 'dark', setActivePage }) {
  const isDark = theme === 'dark';
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isRedirecting, setIsRedirecting] = useState(false);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const confettiParticles = useRef([]);

  // High-performance Canvas Confetti Engine for celebration burst
  const fireConfettiCannon = useCallback((count = 140, originX = 0.5, originY = 0.5) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const colors = [
      '#ff3b69', '#ff708d', '#ffd166', '#06d6a0', '#118ab2',
      '#e056fd', '#f368e0', '#ff9f43', '#54a0ff', '#feca57', '#ffffff'
    ];

    const newParticles = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI) - Math.PI / 2 + (originX < 0.3 ? 0.6 : originX > 0.7 ? -0.6 : 0);
      const speed = Math.random() * 20 + 12;
      const isRibbon = Math.random() > 0.5;

      newParticles.push({
        x: canvas.width * originX,
        y: canvas.height * originY,
        vx: Math.cos(angle) * speed * (Math.random() * 0.8 + 0.6),
        vy: -Math.abs(Math.sin(angle) * speed * 1.2),
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 16,
        gravity: 0.38,
        drag: 0.965,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 120 + 90,
        isRibbon,
        aspect: isRibbon ? Math.random() * 2.5 + 2 : 1,
      });
    }

    confettiParticles.current.push(...newParticles);
  }, []);

  // Confetti Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = confettiParticles.current.length - 1; i >= 0; i--) {
        const p = confettiParticles.current[i];
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

        if (p.life >= p.maxLife || p.y > canvas.height + 50) {
          confettiParticles.current.splice(i, 1);
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Handle direct transition to Home
  const handleGoToHome = useCallback((triggerConfetti = true) => {
    setIsRedirecting(true);
    if (triggerConfetti) {
      fireConfettiCannon(160, 0.5, 0.4);
      setTimeout(() => fireConfettiCannon(120, 0.2, 0.6), 250);
      setTimeout(() => fireConfettiCannon(120, 0.8, 0.6), 500);
    }
    setTimeout(() => {
      if (setActivePage) {
        setActivePage('home');
      }
    }, 850);
  }, [fireConfettiCannon, setActivePage]);

  // Live Countdown logic: If midnight is reached, directly go to Home
  useEffect(() => {
    const target = new Date(BIRTHDAY_DATE_STR).getTime();

    const checkCountdown = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        // Automatically redirect to Home once 12:00 AM arrives
        handleGoToHome(true);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    checkCountdown();
    const timer = setInterval(checkCountdown, 1000);
    return () => clearInterval(timer);
  }, [handleGoToHome]);

  return (
    <div className="relative w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-6 sm:py-10 select-none overflow-hidden">
      {/* Background Confetti Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-40"
      />

      {/* Decorative Soft Glowing Background Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-rose-500/15 via-pink-500/10 to-amber-500/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-red-500/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none -z-10" />

      {/* Main Content Container */}
      <div className="w-full max-w-3xl flex flex-col items-center text-center z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Headline */}
        <h1
          className={`font-cormorant text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-semibold tracking-wide leading-tight mb-3 sm:mb-4 px-2 ${
            isDark ? 'text-white' : 'text-stone-900'
          }`}
        >
          Counting down for a special day ✨
        </h1>

        {/* Warm Friendly Tone Statement (no spoilers) */}
        <p
          className={`font-cormorant italic text-base xs:text-lg sm:text-2xl max-w-xl mb-6 sm:mb-10 leading-relaxed font-normal px-2 ${
            isDark ? 'text-rose-200/90' : 'text-stone-700'
          }`}
        >
          “Hang tight! In just a little while, something truly wonderful begins...”
        </p>

        {/* Glowing Modern Glassmorphism Countdown Cards */}
        <div className="grid grid-cols-4 gap-1.5 xs:gap-2.5 sm:gap-5 w-full max-w-2xl mb-6 sm:mb-10 px-1">
          {/* Days */}
          <div
            className={`flex flex-col items-center justify-center py-3 px-1 xs:py-4 xs:px-2 sm:py-6 sm:px-4 rounded-xl xs:rounded-2xl sm:rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:scale-105 ${
              isDark
                ? 'bg-gradient-to-b from-white/[0.08] to-white/[0.02] border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-white hover:border-rose-500/40'
                : 'bg-white/85 border-rose-200/80 shadow-[0_8px_24px_rgba(244,63,94,0.08)] text-stone-900 hover:border-rose-400'
            }`}
          >
            <span className="font-roman text-2xl xs:text-3xl sm:text-6xl font-normal bg-gradient-to-br from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent block leading-tight">
              {timeLeft.days}
            </span>
            <span
              className={`text-[9px] xs:text-[10px] sm:text-xs font-semibold tracking-wider uppercase mt-1.5 sm:mt-2 px-1.5 xs:px-2.5 py-0.5 rounded-full ${
                isDark ? 'bg-white/5 text-rose-300' : 'bg-rose-100/70 text-rose-700'
              }`}
            >
              Days
            </span>
          </div>

          {/* Hours */}
          <div
            className={`flex flex-col items-center justify-center py-3 px-1 xs:py-4 xs:px-2 sm:py-6 sm:px-4 rounded-xl xs:rounded-2xl sm:rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:scale-105 ${
              isDark
                ? 'bg-gradient-to-b from-white/[0.08] to-white/[0.02] border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-white hover:border-rose-500/40'
                : 'bg-white/85 border-rose-200/80 shadow-[0_8px_24px_rgba(244,63,94,0.08)] text-stone-900 hover:border-rose-400'
            }`}
          >
            <span className="font-roman text-2xl xs:text-3xl sm:text-6xl font-normal bg-gradient-to-br from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent block leading-tight">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span
              className={`text-[9px] xs:text-[10px] sm:text-xs font-semibold tracking-wider uppercase mt-1.5 sm:mt-2 px-1.5 xs:px-2.5 py-0.5 rounded-full ${
                isDark ? 'bg-white/5 text-rose-300' : 'bg-rose-100/70 text-rose-700'
              }`}
            >
              Hours
            </span>
          </div>

          {/* Minutes */}
          <div
            className={`flex flex-col items-center justify-center py-3 px-1 xs:py-4 xs:px-2 sm:py-6 sm:px-4 rounded-xl xs:rounded-2xl sm:rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:scale-105 ${
              isDark
                ? 'bg-gradient-to-b from-white/[0.08] to-white/[0.02] border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-white hover:border-rose-500/40'
                : 'bg-white/85 border-rose-200/80 shadow-[0_8px_24px_rgba(244,63,94,0.08)] text-stone-900 hover:border-rose-400'
            }`}
          >
            <span className="font-roman text-2xl xs:text-3xl sm:text-6xl font-normal bg-gradient-to-br from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent block leading-tight">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span
              className={`text-[9px] xs:text-[10px] sm:text-xs font-semibold tracking-wider uppercase mt-1.5 sm:mt-2 px-1.5 xs:px-2.5 py-0.5 rounded-full ${
                isDark ? 'bg-white/5 text-rose-300' : 'bg-rose-100/70 text-rose-700'
              }`}
            >
              Mins
            </span>
          </div>

          {/* Seconds (Pulsing Glow) */}
          <div
            className={`flex flex-col items-center justify-center py-3 px-1 xs:py-4 xs:px-2 sm:py-6 sm:px-4 rounded-xl xs:rounded-2xl sm:rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:scale-105 ${
              isDark
                ? 'bg-gradient-to-b from-rose-950/30 to-purple-950/20 border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.25)] text-white'
                : 'bg-rose-50/90 border-rose-300 shadow-md text-stone-900'
            }`}
          >
            <span className="font-roman text-2xl xs:text-3xl sm:text-6xl font-normal bg-gradient-to-br from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent block leading-tight">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span
              className={`text-[9px] xs:text-[10px] sm:text-xs font-semibold tracking-wider uppercase mt-1.5 sm:mt-2 px-1.5 xs:px-2.5 py-0.5 rounded-full ${
                isDark ? 'bg-rose-500/20 text-rose-300 animate-pulse' : 'bg-rose-200 text-rose-800'
              }`}
            >
              Secs
            </span>
          </div>
        </div>

      </div>

      {/* Subtle Home Icon in bottom corner for direct access without spoiling the surprise */}
      <button
        type="button"
        disabled={isRedirecting}
        onClick={() => handleGoToHome(false)}
        title="Go to Home"
        aria-label="Go to Home"
        className={`fixed bottom-5 right-5 z-30 p-3 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${
          isDark
            ? 'bg-black/40 hover:bg-black/60 border-white/10 text-stone-300 hover:text-white shadow-[0_4px_16px_rgba(0,0,0,0.5)]'
            : 'bg-white/70 hover:bg-white/90 border-black/10 text-stone-600 hover:text-stone-900 shadow-[0_4px_16px_rgba(0,0,0,0.1)]'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </button>
    </div>
  );
}
