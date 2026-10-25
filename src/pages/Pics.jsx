import { useMemo, useState, useEffect } from 'react';
import DepthCarousel from '../components/DepthCarousel';

// Explicit imports for all gallery images (up to 20) to guarantee static bundling
import gallery1 from '../assets/gallery 1.jpg';
import gallery2 from '../assets/gallery 2.jpg';
import gallery3 from '../assets/gallery 3.jpg';
import gallery4 from '../assets/gallery 4.jpg';
import gallery5 from '../assets/gallery 5.jpg';
import gallery6 from '../assets/galery 6.jpg'; // handles filename spelling
import gallery7 from '../assets/gallery 7.jpg';
import gallery8 from '../assets/gallery 8.jpg';
import gallery9 from '../assets/gallery 9.jpg';
import gallery10 from '../assets/gallery 10.jpg';
import gallery11 from '../assets/gallery 11.jpg';
import gallery12 from '../assets/gallery 12.jpg';
import gallery13 from '../assets/gallery 13.jpg';
import gallery14 from '../assets/gallery 14.jpg';
import gallery15 from '../assets/gallery 15.jpg';
import gallery16 from '../assets/galery 16.jpg'; // handles filename spelling
import gallery17 from '../assets/gallery 17.jpg';
import gallery18 from '../assets/gallery 18.jpg';
import gallery20 from '../assets/gallery 20.jpg';

const staticGalleryPhotos = [
  { image: gallery1, alt: 'Gallery Photo 1', objectPosition: 'center 0%' },
  { image: gallery2, alt: 'Gallery Photo 2', objectPosition: 'center 15%' },
  { image: gallery3, alt: 'Gallery Photo 3', objectPosition: 'center 15%' },
  { image: gallery4, alt: 'Gallery Photo 4', objectPosition: 'center 15%' },
  { image: gallery5, alt: 'Gallery Photo 5', objectPosition: 'center 15%' },
  { image: gallery6, alt: 'Gallery Photo 6', objectPosition: 'center 15%' },
  { image: gallery7, alt: 'Gallery Photo 7', objectPosition: 'center 15%' },
  { image: gallery8, alt: 'Gallery Photo 8', objectPosition: 'center 15%' },
  { image: gallery9, alt: 'Gallery Photo 9', objectPosition: 'center 15%' },
  { image: gallery10, alt: 'Gallery Photo 10', objectPosition: 'center 15%' },
  { image: gallery11, alt: 'Gallery Photo 11', objectPosition: 'center 15%' },
  { image: gallery12, alt: 'Gallery Photo 12', objectPosition: 'center 15%' },
  { image: gallery13, alt: 'Gallery Photo 13', objectPosition: 'center 15%' },
  { image: gallery14, alt: 'Gallery Photo 14', objectPosition: 'center 15%' },
  { image: gallery15, alt: 'Gallery Photo 15', objectPosition: 'center 15%' },
  { image: gallery16, alt: 'Gallery Photo 16', objectPosition: 'center 15%' },
  { image: gallery17, alt: 'Gallery Photo 17', objectPosition: 'center 15%' },
  { image: gallery18, alt: 'Gallery Photo 18', objectPosition: 'center 15%' },
  { image: gallery20, alt: 'Gallery Photo 20', objectPosition: 'center 15%' },
];

export default function Pics({ theme = 'dark' }) {
  const isDark = theme === 'dark';

  // Dynamic glob to automatically pick up all gallery files in sorted order
  const galleryModules = import.meta.glob(['../assets/gallery*.jpg', '../assets/galery*.jpg'], { eager: true });

  const items = useMemo(() => {
    const fromGlob = Object.entries(galleryModules)
      .sort(([pathA], [pathB]) => {
        const numA = parseInt(pathA.match(/gale?ry\s*(\d+)/i)?.[1] || '0', 10);
        const numB = parseInt(pathB.match(/gale?ry\s*(\d+)/i)?.[1] || '0', 10);
        return numA - numB;
      })
      .map(([path, mod], idx) => {
        const num = path.match(/gale?ry\s*(\d+)/i)?.[1] || idx + 1;
        const isPhoto1 = String(num) === '1';
        return {
          image: mod.default,
          alt: `Gallery Photo ${num}`,
          objectPosition: isPhoto1 ? 'center 0%' : 'center 15%',
        };
      });

    return fromGlob.length > 0 ? fromGlob : staticGalleryPhotos;
  }, [galleryModules]);

  // Dynamic responsive sizing for mobile vs tablet vs desktop
  const [carouselConfig, setCarouselConfig] = useState(() => {
    if (typeof window === 'undefined') {
      return { cardWidth: 360, cardHeight: 470, spread: 100, depth: 230, visibleCards: 4 };
    }
    const w = window.innerWidth;
    if (w < 480) {
      const cw = Math.min(Math.round(w * 0.72), 265);
      return {
        cardWidth: Math.max(cw, 220),
        cardHeight: Math.round(cw * 1.34),
        spread: 48,
        depth: 140,
        visibleCards: 3,
      };
    } else if (w < 768) {
      return { cardWidth: 295, cardHeight: 395, spread: 72, depth: 180, visibleCards: 4 };
    }
    return { cardWidth: 360, cardHeight: 470, spread: 100, depth: 230, visibleCards: 4 };
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) {
        const cw = Math.min(Math.round(w * 0.72), 265);
        setCarouselConfig({
          cardWidth: Math.max(cw, 220),
          cardHeight: Math.round(cw * 1.34),
          spread: 48,
          depth: 140,
          visibleCards: 3,
        });
      } else if (w < 768) {
        setCarouselConfig({ cardWidth: 295, cardHeight: 395, spread: 72, depth: 180, visibleCards: 4 });
      } else {
        setCarouselConfig({ cardWidth: 360, cardHeight: 470, spread: 100, depth: 230, visibleCards: 4 });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="w-full max-w-6xl mx-auto px-2 sm:px-4 h-[calc(100dvh-60px)] max-h-[calc(100dvh-60px)] overflow-hidden flex flex-col justify-between items-center py-2 sm:py-4 select-none">
      {/* Compact Page Title */}
      <div className="text-center shrink-0 flex flex-col items-center px-2">
        <h1 className="font-cormorant text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide leading-tight">
          Captured Memories
        </h1>
        <p className="font-cormorant italic text-xs sm:text-sm font-normal opacity-85 text-red-400 mt-1">
          “Every picture tells a story, but yours are my favorite art.”
        </p>
      </div>

      {/* 3D Depth Carousel Container - Dynamically fills remaining screen height */}
      <div className="w-full max-w-4xl flex-1 min-h-0 relative flex items-center justify-center my-auto">
        {items.length > 0 ? (
          <DepthCarousel
            items={items}
            depth={carouselConfig.depth}
            spread={carouselConfig.spread}
            tilt={18}
            tiltDirection="right"
            perspective={1200}
            visibleCards={carouselConfig.visibleCards}
            falloff={0.2}
            blur={5}
            autoplay={false}
            loop
            cardWidth={carouselConfig.cardWidth}
            cardHeight={carouselConfig.cardHeight}
            radius={20}
            tint={isDark ? '#05060a' : '#1e0817'}
            duration={700}
            ease="power3.out"
            autoplayDelay={3200}
            showControls
            showIndicators
          />
        ) : (
          <p className="text-sm opacity-60">No photos found in assets.</p>
        )}
      </div>
    </section>
  );
}
