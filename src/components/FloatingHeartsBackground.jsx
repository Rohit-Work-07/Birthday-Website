import React, { useEffect, useState, useMemo } from 'react';

/**
 * Romantic Floating Hearts Background with Dark & White theme support
 * Provides a buttery-smooth backdrop with floating heart particles,
 * interactive heart ripples on click, and smooth gradient transitions.
 */
export default function FloatingHeartsBackground({ theme = 'dark', onToggleTheme, children }) {
  // Red shades for ambient floating hearts
  // Red shades for ambient floating hearts
  const redPalette = ['#ef4444', '#f43f5e', '#e11d48', '#dc2626', '#ff2d55'];

  // Generate random ambient floating hearts throughout the entire page
  const ambientHearts = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => {
      const size = Math.floor(Math.random() * 24) + 12; // 12px to 36px
      const left = Math.random() * 100; // 0% to 100%
      const duration = Math.random() * 8 + 8; // 8s to 16s
      // Negative delay pre-distributes hearts across all heights of the screen instantly
      const delay = -(Math.random() * 16);
      const drift = (Math.random() - 0.5) * 120; // -60px to 60px
      const rotate = (Math.random() - 0.5) * 60; // -30deg to 30deg
      const opacity = Math.random() * 0.45 + 0.35; // 0.35 to 0.80
      const strokeOnly = Math.random() > 0.7; // Some outline hearts, some filled
      const color = redPalette[i % redPalette.length];

      return {
        id: `ambient-${i}`,
        size,
        left,
        duration,
        delay,
        drift,
        rotate,
        opacity,
        strokeOnly,
        color,
      };
    });
  }, []);

  // Click-to-spawn romantic burst of hearts
  const [burstHearts, setBurstHearts] = useState([]);

  const handlePointerDown = (e) => {
    // Spawn 6 mini floating hearts at exact click/touch position
    const clickX = e.clientX;
    const clickY = e.clientY;

    const newHearts = Array.from({ length: 6 }, (_, i) => ({
      id: `${Date.now()}-${i}-${Math.random()}`,
      x: clickX,
      y: clickY,
      size: Math.floor(Math.random() * 16) + 14,
      driftX: (Math.random() - 0.5) * 100,
      driftY: -(Math.random() * 90 + 50),
      duration: Math.random() * 1.2 + 1.2,
      rotate: (Math.random() - 0.5) * 45,
      color: redPalette[Math.floor(Math.random() * redPalette.length)],
    }));

    setBurstHearts((prev) => [...prev.slice(-30), ...newHearts]);
  };

  // Clean up completed burst hearts
  useEffect(() => {
    if (burstHearts.length === 0) return;
    const timer = setTimeout(() => {
      setBurstHearts((prev) => prev.slice(6));
    }, 2500);
    return () => clearTimeout(timer);
  }, [burstHearts]);

  const isDark = theme === 'dark';

  return (
    <div
      onPointerDown={handlePointerDown}
      className={`relative min-h-screen w-full transition-colors duration-1000 select-none ${
        isDark
          ? 'bg-gradient-to-b from-[#08080c] via-[#0d0e15] to-[#040407] text-white'
          : 'bg-gradient-to-b from-[#ffffff] via-[#f7f8fa] to-[#eceff3] text-gray-900'
      }`}
    >
      {/* Ambient Smooth Light Gradients (Fixed throughout the entire page) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        {/* Soft subtle warm-red ambient glow */}
        <div
          className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[150px] pointer-events-none transition-opacity duration-1000 ${
            isDark
              ? 'bg-rose-900/[0.12]'
              : 'bg-rose-100/60'
          }`}
        />
        {/* Secondary gentle ambient glow */}
        <div
          className={`absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none transition-opacity duration-1000 ${
            isDark
              ? 'bg-red-950/[0.08]'
              : 'bg-red-50/50'
          }`}
        />
      </div>

      {/* Floating Ambient Hearts Layer (Floats seamlessly over all section background colors) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-20">
        {ambientHearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute bottom-[-50px] animate-float-heart"
            style={{
              left: `${heart.left}%`,
              animationDuration: `${heart.duration}s`,
              animationDelay: `${heart.delay}s`,
              '--drift-x': `${heart.drift}px`,
              '--target-rotate': `${heart.rotate}deg`,
              '--target-opacity': heart.opacity,
            }}
          >
            <svg
              width={heart.size}
              height={heart.size}
              viewBox="0 0 24 24"
              fill={heart.strokeOnly ? 'none' : heart.color}
              stroke={heart.color}
              strokeWidth={heart.strokeOnly ? 2 : 0}
              className={`transition-all duration-700 ${
                isDark
                  ? 'drop-shadow-[0_0_12px_rgba(239,68,68,0.55)]'
                  : 'drop-shadow-[0_2px_8px_rgba(225,29,72,0.3)]'
              }`}
              style={{
                opacity: heart.opacity,
              }}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        ))}

        {/* Interactive Click/Tap Burst Hearts (Fixed across viewport) */}
        {burstHearts.map((item) => (
          <div
            key={item.id}
            className="absolute pointer-events-none animate-burst-heart"
            style={{
              left: `${item.x}px`,
              top: `${item.y}px`,
              '--burst-x': `${item.driftX}px`,
              '--burst-y': `${item.driftY}px`,
              '--burst-rot': `${item.rotate}deg`,
              animationDuration: `${item.duration}s`,
            }}
          >
            <svg
              width={item.size}
              height={item.size}
              viewBox="0 0 24 24"
              fill={item.color}
              className="drop-shadow-[0_0_14px_rgba(239,68,68,0.75)]"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Theme Toggle Icon Button (Top Right) */}
      {onToggleTheme && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleTheme();
          }}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className={`fixed top-3 right-3 sm:top-4 sm:right-4 z-40 p-2 sm:p-2.5 rounded-full transition-all duration-300 backdrop-blur-md cursor-pointer border shadow-md hover:scale-110 active:scale-95 ${
            isDark
              ? 'bg-black/40 hover:bg-black/60 border-white/15 text-amber-300 hover:text-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
              : 'bg-white/80 hover:bg-white border-black/10 text-stone-700 hover:text-stone-950 shadow-[0_4px_16px_rgba(0,0,0,0.08)]'
          }`}
        >
          {isDark ? (
            /* Sun Icon (Click to switch to Light mode) */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 transition-transform duration-300 rotate-0 hover:rotate-45"
            >
              <circle cx="12" cy="12" r="5" fill="currentColor" fillOpacity="0.2" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            /* Moon Icon (Click to switch to Dark mode) */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 transition-transform duration-300 -rotate-12 hover:rotate-0"
            >
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                fill="currentColor"
                fillOpacity="0.15"
              />
            </svg>
          )}
        </button>
      )}

      {/* Foreground Content Container (Ready for user to add whatever content they want) */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}
