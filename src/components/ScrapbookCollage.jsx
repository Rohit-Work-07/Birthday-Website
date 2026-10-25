import React from 'react';

/**
 * Romantic Scrapbook Photo Collage
 * Recreates the retro scrapbook aesthetic from the user's reference:
 * - 3 overlapping film photos with crisp borders and subtle tilt
 * - Yellow gingham washi tape strips
 * - Vintage handwritten love note snippet
 * - Die-cut vintage camera sticker
 * - Tropical hibiscus flower sticker
 * - Vintage rotary telephone sticker
 */
export default function ScrapbookCollage({
  photo1,
  photo2,
  photo3,
  theme = 'dark',
}) {
  const isDark = theme === 'dark';

  // Yellow gingham washi tape CSS style
  const ginghamTapeStyle = {
    backgroundColor: '#fffbeb',
    backgroundImage: `
      linear-gradient(90deg, rgba(250, 204, 21, 0.45) 50%, transparent 50%),
      linear-gradient(rgba(250, 204, 21, 0.45) 50%, transparent 50%)
    `,
    backgroundSize: '12px 12px',
  };

  return (
    <div className="relative w-[280px] h-[335px] xs:w-[310px] xs:h-[370px] sm:w-[390px] sm:h-[450px] md:w-[430px] md:h-[490px] mx-auto select-none my-3 sm:my-4 lg:my-0">
      


      {/* ── 2. Checkered Washi Tape Accent (Mid-Center) ── */}
      <div
        className="absolute top-40 xs:top-44 sm:top-52 left-24 xs:left-28 sm:left-36 w-28 xs:w-32 sm:w-40 h-5 xs:h-6 sm:h-7 z-10 opacity-80 shadow-xs transform rotate-1 pointer-events-none"
        style={ginghamTapeStyle}
      />


      {/* ── 4. Photo 1: Top-Right ── */}
      <div
        className="group absolute top-0 right-0 xs:right-1 sm:right-2 w-[148px] h-[148px] xs:w-[165px] xs:h-[165px] sm:w-[215px] sm:h-[210px] md:w-[235px] md:h-[225px] z-10 transform rotate-[1.5deg] hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-300 cursor-pointer"
        title="Tap to focus"
      >
        <div className="w-full h-full bg-black p-[3px] sm:p-1 rounded-sm shadow-[0_12px_28px_rgba(0,0,0,0.35)] border-2 border-black dark:border-stone-800 overflow-hidden">
          <img
            src={photo1}
            alt="Favorite memory"
            className="w-full h-full object-cover object-top rounded-none filter contrast-[1.04] brightness-[0.98] group-hover:brightness-105 transition-all duration-300"
            draggable={false}
          />
        </div>
      </div>

      {/* ── 5. Photo 2: Mid-Left ── */}
      <div
        className="group absolute top-16 xs:top-18 left-0 sm:left-1 w-[138px] h-[175px] xs:w-[155px] xs:h-[195px] sm:w-[200px] sm:h-[250px] md:w-[220px] md:h-[270px] z-10 transform -rotate-[4.5deg] hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-300 cursor-pointer"
        title="Tap to focus"
      >
        <div className="w-full h-full bg-black p-[3px] sm:p-1 rounded-sm shadow-[0_14px_32px_rgba(0,0,0,0.4)] border-2 border-black dark:border-stone-800 overflow-hidden">
          <img
            src={photo2}
            alt="Sweet memory"
            className="w-full h-full object-cover object-[center_68%] rounded-none filter contrast-[1.04] brightness-[0.98] group-hover:brightness-105 transition-all duration-300"
            draggable={false}
          />
        </div>
      </div>

      {/* ── 6. Photo 3: Bottom-Center/Right ── */}
      <div
        className="group absolute bottom-1 right-1 xs:right-2 sm:right-6 w-[155px] h-[155px] xs:w-[175px] xs:h-[175px] sm:w-[225px] sm:h-[225px] md:w-[250px] md:h-[245px] z-20 transform rotate-[1deg] hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-300 cursor-pointer"
        title="Tap to focus"
      >
        <div className="w-full h-full bg-black p-[3px] sm:p-1 rounded-sm shadow-[0_18px_40px_rgba(0,0,0,0.45)] border-2 border-black dark:border-stone-800 overflow-hidden">
          <img
            src={photo3}
            alt="Cherished moment"
            className="w-full h-full object-cover object-[center_46%] rounded-none filter contrast-[1.04] brightness-[0.98] group-hover:brightness-105 transition-all duration-300"
            draggable={false}
          />
        </div>
      </div>


    </div>
  );
}

