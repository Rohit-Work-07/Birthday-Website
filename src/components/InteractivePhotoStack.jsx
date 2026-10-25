'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

// Stable, precomputed radial spread coordinates (no jitter re-calculation)
const SPREAD_LAYOUT = [
  { x: -112, y: -42, r: -8.5 }, // Top-left
  { x: 112, y: -38, r: 7.5 },   // Top-right
  { x: 0, y: 82, r: 1.5 },      // Bottom-center
  { x: -95, y: 65, r: -5 },     // Fourth card (if any)
  { x: 95, y: 65, r: 6 },       // Fifth card (if any)
];

// Stable stacked rotations
const STACKED_ROTATIONS = [0, 3, -3.5, 4, -4.5];

const InteractivePhotoStack = React.forwardRef(
  ({ items = [], title, className, ...props }, ref) => {
    const [topCardIndex, setTopCardIndex] = React.useState(0);
    const [isGroupHovered, setIsGroupHovered] = React.useState(false);
    const [clickedIndex, setClickedIndex] = React.useState(null);
    const [hoveredCardIndex, setHoveredCardIndex] = React.useState(null);

    const displayedItems = items.slice(0, 5);

    const handleCardClick = (index, e) => {
      e.stopPropagation();
      setClickedIndex(index);
      setTimeout(() => {
        setTopCardIndex(index);
        setClickedIndex(null);
      }, 650);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center gap-6 w-full select-none py-2',
          className
        )}
        {...props}
      >
        {/* Outer Hit Area: covers the entire spread radius so cursor never falls through gaps */}
        <div
          className="relative w-full max-w-[480px] h-[450px] sm:h-[480px] cursor-pointer flex items-center justify-center mx-auto"
          onMouseEnter={() => setIsGroupHovered(true)}
          onMouseLeave={() => {
            if (clickedIndex === null) {
              setIsGroupHovered(false);
              setHoveredCardIndex(null);
            }
          }}
          onClick={() => {
            // Touch/click toggles spread on mobile
            setIsGroupHovered((prev) => !prev);
          }}
        >
          {/* Card Anchor Point */}
          <div className="relative h-80 w-64">
            {displayedItems.map((item, index) => {
              const isTopCard = index === topCardIndex;
              const numItems = displayedItems.length;
              let stackPosition = index - topCardIndex;
              if (stackPosition < 0) stackPosition += numItems;
              const isClicked = index === clickedIndex;

              const spreadPos = SPREAD_LAYOUT[index % SPREAD_LAYOUT.length];
              const stackedRot = STACKED_ROTATIONS[stackPosition % STACKED_ROTATIONS.length];

              // Clean transform string without Tailwind conflict
              const transformStyle = isGroupHovered
                ? `translate3d(${spreadPos.x}px, ${spreadPos.y}px, 0) rotate(${spreadPos.r}deg) scale(1)`
                : `translate3d(0, ${stackPosition * 8}px, 0) rotate(${stackedRot}deg) scale(${1 - stackPosition * 0.04})`;

              // When spread, the 3rd card (index 2 / bottom card) is rendered in the FRONT
              let zIndex;
              if (isClicked) {
                zIndex = 200;
              } else if (hoveredCardIndex === index) {
                zIndex = 120; // Specific hovered card comes to the top
              } else if (isGroupHovered) {
                // 3rd card (index 2) sits in front of the top two cards
                zIndex = index === 2 ? 80 : 50 + index;
              } else if (isTopCard) {
                zIndex = numItems + 10;
              } else {
                zIndex = numItems - stackPosition;
              }

              return (
                /* Outer Container: controls absolute position, translation, rotation & Z-index */
                <div
                  key={item.name + index}
                  onClick={(e) => handleCardClick(index, e)}
                  onMouseEnter={() => setHoveredCardIndex(index)}
                  onMouseLeave={() => setHoveredCardIndex(null)}
                  className="absolute inset-0 h-80 w-64 will-change-transform pointer-events-auto"
                  style={{
                    transform: transformStyle,
                    zIndex: zIndex,
                    transition:
                      'transform 0.48s cubic-bezier(0.16, 1, 0.3, 1), z-index 0.25s ease',
                  }}
                >
                  {/* Inner Container: visual card styling, separate hover lift, and click spin */}
                  <div
                    className={cn(
                      'w-full h-full rounded-2xl bg-white dark:bg-[#1c1322] p-2.5 shadow-xl transition-all duration-300 border border-black/10 dark:border-rose-300/25',
                      isGroupHovered && 'hover:scale-[1.03] hover:shadow-[0_22px_45px_rgba(0,0,0,0.45)]',
                      isClicked && 'animate-spin-y'
                    )}
                  >
                    <div className="flex h-full w-full flex-col items-center justify-start pointer-events-none">
                      <div className="h-64 w-full overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-900">
                        <img
                          src={item.src}
                          alt={item.name}
                          className="h-full w-full rounded-xl object-cover filter contrast-[1.02]"
                          draggable={false}
                        />
                      </div>
                      <div className="flex h-12 flex-grow items-center justify-center px-2">
                        <p className="font-cormorant italic text-lg sm:text-xl font-medium text-stone-800 dark:text-rose-100 tracking-wide text-center">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {title && (
          <div className="text-center">
            {typeof title === 'string' ? (
              <h3 className="text-center font-cormorant text-2xl sm:text-3xl font-semibold tracking-wide">
                {title}
              </h3>
            ) : (
              title
            )}
          </div>
        )}
      </div>
    );
  }
);

InteractivePhotoStack.displayName = 'InteractivePhotoStack';

export default InteractivePhotoStack;
export { InteractivePhotoStack };

