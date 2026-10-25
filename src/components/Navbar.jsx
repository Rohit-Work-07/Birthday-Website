import { useEffect, useRef, useState, useCallback } from 'react';

export default function Navbar({ activePage, setActivePage, theme = 'dark' }) {
  const mainNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'pics', label: 'Gallery' },
    { id: 'us', label: 'Us' },
  ];

  const isDark = theme === 'dark';
  const navContainerRef = useRef(null);
  const buttonRefs = useRef({});
  const [hoveredId, setHoveredId] = useState(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });

  const currentHighlightId = hoveredId || activePage;

  // Accurately compute capsule position relative to the nav container
  const updatePill = useCallback((targetId) => {
    const idToUse = targetId || currentHighlightId;
    const targetEl = buttonRefs.current[idToUse];
    const containerEl = navContainerRef.current;

    if (targetEl && containerEl) {
      const targetRect = targetEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();

      setPillStyle({
        left: targetRect.left - containerRect.left,
        top: targetRect.top - containerRect.top,
        width: targetRect.width,
        height: targetRect.height,
        opacity: 1,
      });
    }
  }, [currentHighlightId]);

  // Recalculate whenever hovered or active item changes
  useEffect(() => {
    updatePill(currentHighlightId);
    // Double check after small tick for DOM font settling
    const timer = setTimeout(() => updatePill(currentHighlightId), 30);
    window.addEventListener('resize', () => updatePill(currentHighlightId));

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', () => updatePill(currentHighlightId));
    };
  }, [currentHighlightId, updatePill]);

  return (
    <header className="w-full flex justify-center pt-3 pb-1.5 px-4 z-20 select-none">
      <nav
        ref={navContainerRef}
        aria-label="Main Navigation"
        onMouseLeave={() => setHoveredId(null)}
        className={`relative flex items-center justify-center p-1 sm:p-1.5 rounded-full backdrop-blur-md border shadow-md transition-all duration-300 ${
          isDark
            ? 'bg-black/35 border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.4)]'
            : 'bg-white/80 border-black/10 shadow-[0_6px_20px_rgba(0,0,0,0.06)]'
        }`}
      >
        {/* Sliding Pill / Capsule Highlight Backdrop (anchored at top-0 left-0) */}
        <span
          className={`absolute top-0 left-0 rounded-full pointer-events-none transition-all duration-300 ease-out z-0 will-change-transform ${
            isDark
              ? 'bg-red-500/20 border border-red-500/40 shadow-[0_0_16px_rgba(239,68,68,0.35)]'
              : 'bg-white shadow-[0_3px_12px_rgba(0,0,0,0.08)] border border-rose-200/60'
          }`}
          style={{
            transform: `translate3d(${pillStyle.left}px, ${pillStyle.top}px, 0)`,
            width: `${pillStyle.width}px`,
            height: `${pillStyle.height}px`,
            opacity: pillStyle.opacity,
          }}
        />

        {/* Main Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          {mainNavItems.map((item) => {
            const isHighlighted = currentHighlightId === item.id;
            return (
              <button
                key={item.id}
                ref={(el) => (buttonRefs.current[item.id] = el)}
                type="button"
                onMouseEnter={() => setHoveredId(item.id)}
                onClick={() => {
                  setActivePage(item.id);
                  setHoveredId(null);
                }}
                className={`relative z-10 py-1 sm:py-1.5 px-2.5 sm:px-4 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-colors duration-200 cursor-pointer ${
                  isHighlighted
                    ? isDark
                      ? 'text-red-400 font-semibold'
                      : 'text-red-500 font-semibold'
                    : isDark
                    ? 'text-stone-300 hover:text-white'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}


