import { useState, useCallback, useEffect, useRef } from 'react';

import celeb1 from '../assets/celeb 1.jpg';
import celeb2 from '../assets/celeb 2.jpg';
import celeb3 from '../assets/celeb 3.jpg';
import celeb4 from '../assets/celeb 4.jpg';
import celeb5 from '../assets/celeb 5.jpg';
import celeb6 from '../assets/celeb 6.jpg';

const images = [
  { id: 1, src: celeb1, alt: 'Celebrating You - Look 1', title: 'Graceful & Radiant' },
  { id: 2, idNum: 2, src: celeb2, alt: 'Celebrating You - Look 2', title: 'Warmest Smile' },
  { id: 3, idNum: 3, src: celeb3, alt: 'Celebrating You - Look 3', title: 'Pure Elegance' },
  { id: 4, idNum: 4, src: celeb4, alt: 'Celebrating You - Look 4', title: 'Cute & Stylish' },
  { id: 5, idNum: 5, src: celeb5, alt: 'Celebrating You - Look 5', title: 'Sunshine Vibes' },
  { id: 6, idNum: 6, src: celeb6, alt: 'Celebrating You - Look 6', title: 'Queen in Red' },
];

export default function VerticalImageStack({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const currentDragYRef = useRef(0);
  const lastNavigationTime = useRef(0);
  const navigationCooldown = 380; // ms between navigations
  const containerRef = useRef(null);

  const navigate = useCallback((newDirection) => {
    const now = Date.now();
    if (now - lastNavigationTime.current < navigationCooldown) return;
    lastNavigationTime.current = now;

    setCurrentIndex((prev) => {
      if (newDirection > 0) {
        return prev === images.length - 1 ? 0 : prev + 1;
      }
      return prev === 0 ? images.length - 1 : prev - 1;
    });
  }, []);

  // Mouse / Touch Drag handlers
  const handlePointerDown = (e) => {
    setIsDragging(true);
    startYRef.current = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    currentDragYRef.current = 0;
    setDragOffset(0);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const currentY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const delta = currentY - startYRef.current;
    currentDragYRef.current = delta;
    setDragOffset(delta * 0.4); // Elastic damping factor
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 40;
    if (currentDragYRef.current < -threshold) {
      navigate(1);
    } else if (currentDragYRef.current > threshold) {
      navigate(-1);
    }
    setDragOffset(0);
    currentDragYRef.current = 0;
  };

  // Wheel listener scoped to the container
  const handleWheel = useCallback(
    (e) => {
      if (Math.abs(e.deltaY) > 22) {
        e.preventDefault();
        if (e.deltaY > 0) {
          navigate(1);
        } else {
          navigate(-1);
        }
      }
    },
    [navigate]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Compute 3D Card Stack geometry for smooth CSS transitions
  const getCardStyle = (index) => {
    const total = images.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) {
      return {
        y: isDragging ? dragOffset : 0,
        scale: 1,
        opacity: 1,
        zIndex: 10,
        rotateX: isDragging ? dragOffset * -0.06 : 0,
        pointerEvents: 'auto',
      };
    } else if (diff === -1) {
      return {
        y: -150 + (isDragging ? dragOffset * 0.3 : 0),
        scale: 0.84,
        opacity: 0.65,
        zIndex: 8,
        rotateX: 9,
        pointerEvents: 'none',
      };
    } else if (diff === -2) {
      return {
        y: -260 + (isDragging ? dragOffset * 0.2 : 0),
        scale: 0.72,
        opacity: 0.3,
        zIndex: 6,
        rotateX: 16,
        pointerEvents: 'none',
      };
    } else if (diff === 1) {
      return {
        y: 150 + (isDragging ? dragOffset * 0.3 : 0),
        scale: 0.84,
        opacity: 0.65,
        zIndex: 8,
        rotateX: -9,
        pointerEvents: 'none',
      };
    } else if (diff === 2) {
      return {
        y: 260 + (isDragging ? dragOffset * 0.2 : 0),
        scale: 0.72,
        opacity: 0.3,
        zIndex: 6,
        rotateX: -16,
        pointerEvents: 'none',
      };
    } else {
      return {
        y: diff > 0 ? 380 : -380,
        scale: 0.6,
        opacity: 0,
        zIndex: 0,
        rotateX: diff > 0 ? -20 : 20,
        pointerEvents: 'none',
      };
    }
  };

  const isVisible = (index) => {
    const total = images.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return Math.abs(diff) <= 2;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative flex h-[580px] sm:h-[640px] w-full max-w-[360px] sm:max-w-[420px] items-center justify-center select-none touch-none"
    >
      {/* 3D Perspective Card Stack Area */}
      <div
        className="relative flex h-[480px] w-[280px] sm:w-[320px] items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ perspective: '1200px' }}
      >
        {images.map((image, index) => {
          if (!isVisible(index)) return null;
          const style = getCardStyle(index);
          const isCurrent = index === currentIndex;

          return (
            <div
              key={image.id}
              className="absolute transition-transform duration-400 ease-out will-change-transform"
              style={{
                transform: `translate3d(0, ${style.y}px, 0) scale(${style.scale}) rotateX(${style.rotateX}deg)`,
                opacity: style.opacity,
                zIndex: style.zIndex,
                pointerEvents: style.pointerEvents,
                transformStyle: 'preserve-3d',
                transition: isDragging && isCurrent ? 'none' : 'all 0.42s cubic-bezier(0.2, 0.9, 0.3, 1)',
              }}
            >
              {/* Individual Card Container */}
              <div
                className={`relative h-[390px] w-[265px] sm:h-[430px] sm:w-[295px] overflow-hidden rounded-3xl border transition-all duration-300 ${
                  isDark
                    ? isCurrent
                      ? 'border-rose-500/40 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85),0_0_35px_rgba(244,63,94,0.3)] ring-1 ring-white/10'
                      : 'border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]'
                    : isCurrent
                    ? 'border-rose-300 shadow-[0_25px_50px_-12px_rgba(244,63,94,0.3),0_10px_20px_rgba(0,0,0,0.06)] ring-2 ring-rose-200'
                    : 'border-rose-100 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.08)]'
                }`}
              >
                {/* Photo image */}
                <img
                  src={image.src}
                  alt={image.alt}
                  draggable={false}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />

                {/* Top Subtle Sheen Overlay */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Bottom Title & Gradient Backdrop */}
                <div className="absolute inset-x-0 bottom-0 pt-16 pb-4 px-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end pointer-events-none text-white">
                  <span className="font-cormorant italic text-lg sm:text-xl font-normal drop-shadow-md">
                    {image.title}
                  </span>
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-rose-300">
                    Memory #{index + 1}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Navigation Dots */}
      <div className="absolute right-1 sm:right-2 top-1/2 flex -translate-y-1/2 flex-col gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-2 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentIndex
                ? isDark
                  ? 'h-6 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                  : 'h-6 bg-red-500 shadow-sm'
                : isDark
                ? 'h-2 bg-white/30 hover:bg-white/60'
                : 'h-2 bg-black/25 hover:bg-black/50'
            }`}
          />
        ))}
      </div>

      {/* Left Counter */}
      <div className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20">
        <div className="flex flex-col items-center select-none">
          <span
            className={`font-roman text-2xl sm:text-3xl font-normal ${
              isDark ? 'text-red-400' : 'text-red-500'
            }`}
          >
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <div
            className={`my-1.5 h-px w-6 ${
              isDark ? 'bg-white/20' : 'bg-black/20'
            }`}
          />
          <span
            className={`text-xs font-medium ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {String(images.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Bottom Swipe / Scroll Hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[11px] font-medium tracking-widest uppercase opacity-70 pointer-events-none z-20">
        <span className="animate-bounce">↕</span>
        <span>Scroll or drag</span>
      </div>
    </div>
  );
}
