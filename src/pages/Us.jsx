import { useState, useEffect } from 'react';
import PolaroidLineCarousel from '../components/PolaroidLineCarousel';

// Images for Polaroid Carousel (6 uploaded polaroid photos)
import polaroid1 from '../assets/polaroid 1.jpg';
import polaroid2 from '../assets/polaroid 2.jpg';
import polaroid3 from '../assets/polaroid 3.jpg';
import polaroid4 from '../assets/polaroid 4.jpg';
import polaroid5 from '../assets/polaroid 5.jpg';
import polaroid6 from '../assets/polaroid 6.jpg';

const polaroidSlides = [
  {
    image: polaroid1,
    title: 'Warmest Smile With You',
    caption: 'Every time I look at your smile, my whole world lights up.',
    alt: 'Smiling together',
  },
  {
    image: polaroid2,
    title: 'Just You & Me',
    caption: 'My favorite person to share quiet cafe corners and laugh with.',
    alt: 'Cafe moment',
  },
  {
    image: polaroid3,
    title: 'Sunshine & Laughter',
    caption: 'Golden afternoons, sweet sunshine, and memories made to last forever.',
    alt: 'Park memories',
  },
  {
    image: polaroid4,
    title: 'My Favorite Kiss ❤️',
    caption: 'The sweetest moment that made my heart skip a thousand beats.',
    alt: 'Sweet kiss',
  },
  {
    image: polaroid5,
    title: 'Dressed Up in Love',
    caption: 'Standing by your side looking at how stunning and radiant you are.',
    alt: 'Festive celebration',
  },
  {
    image: polaroid6,
    title: 'Everyday Magic',
    caption: 'No matter where we go, everything is magical because I am with you.',
    alt: 'Mall outing',
  },
];

// Images for Timeline Milestones
import firstMeet1 from '../assets/First meet 1.jpg';
import firstMeet2 from '../assets/first meet 2.jpg';
import firstMeet3 from '../assets/First meet 3.jpg';
import event1 from '../assets/Event 1.jpg';
import event2 from '../assets/Event 2.jpg';
import annualDay from '../assets/Annual day.jpg';
import charminar1 from '../assets/charminar 1.jpg';
import charminar2 from '../assets/charminar 2.jpg';
import charminar3 from '../assets/charminar 3.jpg';
import signature1 from '../assets/Signature day 1.jpg';
import signature2 from '../assets/Signature day 2.jpg';
import signature3 from '../assets/Signature day 3.jpg';
import signature4 from '../assets/Signature day 4.jpg';
import wordsHeart1 from '../assets/Words from my heart.jpg';
import wordsHeart2 from '../assets/Words from my heart 2.jpg';
import wordsHeart3 from '../assets/words from heart 3.jpg';

// <-- EDIT YOUR RELATIONSHIP START DATE HERE (YYYY-MM-DD)
const TOGETHER_START_DATE = '2024-02-14';

const milestones = [
  {
    id: '2020',
    year: '2020',
    title: 'First Meet',
    emoji: '🧑‍🤝‍🧑',
    description:
      'You came into my life as the most unexpected friend. That unexpected friendship quickly grew into best friends, and that beautiful bond became love. I will always remember the very first day I met you.',
    images: [firstMeet1, firstMeet2, firstMeet3],
    imgPosition: 'object-[center_12%]',
  },
  {
    id: '2021',
    year: '2021',
    title: 'Event Organizers',
    emoji: '🤝✨',
    description:
      'Partnering up with you to organize that college event is something I will never forget. All the hard work, late prep, and behind-the-scenes hustle we poured into it made its grand success so special — especially because I got to do it by your side.',
    images: [event1, event2],
    imgPosition: 'object-top',
  },
  {
    id: '2022',
    year: '2022',
    title: 'Annual Day',
    emoji: '🌼✨',
    description:
      'Our very first big event in college, and truly one of our best memories. Dressed up in our best, enjoying every celebration together, and having the time of our lives as captured right here in this picture.',
    images: [annualDay],
    imgPosition: 'object-[center_25%]',
  },
  {
    id: '2023',
    year: '2023',
    title: 'Visit to Charminar',
    emoji: '🕌💫',
    description:
      'Hands down one of the best outings we’ve ever had. Exploring the historic streets around Charminar, discovering beautiful places with you, and cherishing every moment side by side.',
    images: [charminar1, charminar2, charminar3],
    imgPosition: 'object-center',
  },
  {
    id: '2024',
    year: '2024',
    title: 'Signature Day',
    emoji: '🎓✍️',
    description:
      'Marking the end of your B.Tech journey and a chapter filled with so many college stories. Writing memories on white shirts, laughing together, and celebrating one of the most wonderful and unforgettable days of my life.',
    images: [signature1, signature2, signature3, signature4],
    imgPosition: 'object-top',
  },
  {
    id: 'present',
    year: 'Present',
    title: 'Words From The Heart & Forever',
    emoji: '💌♾️',
    description:
      'Every chapter behind us brought us here, and every chapter ahead belongs to us. Words from the heart, timeless moments, and a love that only grows deeper with every passing day.',
    images: [wordsHeart1, wordsHeart2, wordsHeart3],
    imgPosition: 'object-[center_20%]',
  },
];

export default function Us({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const [timeTogether, setTimeTogether] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [activePhotoIdx, setActivePhotoIdx] = useState({});
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const updateStats = () => {
      const diff = Math.max(0, new Date() - new Date(TOGETHER_START_DATE));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeTogether({ days, hours, minutes, seconds });
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle ESC key for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [stageHeight, setStageHeight] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 640 ? 370 : 420));
  useEffect(() => {
    const handleResize = () => {
      setStageHeight(window.innerWidth < 640 ? 370 : 420);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-12 flex flex-col items-center select-none">
      
      {/* ──────────────── 1. POLAROID CLOTHESLINE SECTION ("MEMORIES WITH YOU") ──────────────── */}
      <div className="w-full flex flex-col items-center mb-10 sm:mb-20">
        {/* Eyebrow badge with "Memories with you" tag */}
        <div className="inline-flex items-center gap-1.5 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          <span className="font-cormorant text-[11px] sm:text-xs tracking-[0.25em] uppercase font-bold text-rose-500">
            Memories with you
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
        </div>

        {/* Section Heading - reduced slightly so big polaroids take center stage */}
        <h1
          className={`font-cormorant text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide text-center transition-colors px-2 ${
            isDark ? 'text-white' : 'text-[#1a111e]'
          }`}
        >
          Memories With You
        </h1>
        <p
          className={`font-cormorant italic text-xs sm:text-sm font-normal opacity-85 mt-0.5 text-center max-w-md px-2 ${
            isDark ? 'text-rose-300' : 'text-rose-600'
          }`}
        >
          “Every single memory with you is my favorite chapter.”
        </p>

        {/* Polaroid Line Carousel Container - Bigger Polaroid Prints */}
        <div className="w-full mt-2">
          <PolaroidLineCarousel
            slides={polaroidSlides}
            stageHeight={stageHeight}
            cardWidth={295}
            sag={36}
            swing={1.0}
            autoplay={4200}
            string={isDark ? '#e2b4bd' : '#8a7f72'}
            background="transparent"
            ink={isDark ? '#fce7f3' : '#1f1625'}
          />
        </div>
      </div>

      {/* ──────────────── 2. TIME TOGETHER LIVE COUNTER ──────────────── */}
      <div
        className={`w-full max-w-xl p-4 xs:p-6 sm:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-md border text-center transition-all duration-300 mb-14 sm:mb-28 ${
          isDark
            ? 'bg-gradient-to-b from-[#1b0816]/80 via-[#26091e]/80 to-[#180614]/80 border-rose-500/25 shadow-[0_0_45px_rgba(244,63,94,0.2)] text-white'
            : 'bg-gradient-to-b from-[#FFF5F7] via-[#FCEAEF] to-[#FCE2E8] border-rose-300/80 shadow-lg text-[#2b1722]'
        }`}
      >
        <span
          className={`font-cormorant text-xs sm:text-sm tracking-widest uppercase font-semibold ${
            isDark ? 'text-rose-400' : 'text-rose-700'
          }`}
        >
          Time Spent In Love
        </span>

        {/* Live Ticker Grid with soft translucent cards */}
        <div className="grid grid-cols-4 gap-1.5 xs:gap-2.5 sm:gap-4 my-4 sm:my-6 text-center">
          <div
            className={`p-1.5 xs:p-2 sm:p-3 rounded-xl sm:rounded-2xl border transition-all ${
              isDark ? 'bg-rose-950/30 border-rose-500/20' : 'bg-white/80 border-rose-200/90 shadow-xs'
            }`}
          >
            <span className="font-roman text-2xl xs:text-3xl sm:text-5xl font-normal text-rose-500 block">
              {timeTogether.days}
            </span>
            <span
              className={`text-[9px] xs:text-[10px] sm:text-xs tracking-wider uppercase font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Days
            </span>
          </div>
          <div
            className={`p-1.5 xs:p-2 sm:p-3 rounded-xl sm:rounded-2xl border transition-all ${
              isDark ? 'bg-rose-950/30 border-rose-500/20' : 'bg-white/80 border-rose-200/90 shadow-xs'
            }`}
          >
            <span className="font-roman text-2xl xs:text-3xl sm:text-5xl font-normal text-rose-500 block">
              {String(timeTogether.hours).padStart(2, '0')}
            </span>
            <span
              className={`text-[9px] xs:text-[10px] sm:text-xs tracking-wider uppercase font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Hours
            </span>
          </div>
          <div
            className={`p-1.5 xs:p-2 sm:p-3 rounded-xl sm:rounded-2xl border transition-all ${
              isDark ? 'bg-rose-950/30 border-rose-500/20' : 'bg-white/80 border-rose-200/90 shadow-xs'
            }`}
          >
            <span className="font-roman text-2xl xs:text-3xl sm:text-5xl font-normal text-rose-500 block">
              {String(timeTogether.minutes).padStart(2, '0')}
            </span>
            <span
              className={`text-[9px] xs:text-[10px] sm:text-xs tracking-wider uppercase font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Minutes
            </span>
          </div>
          <div
            className={`p-1.5 xs:p-2 sm:p-3 rounded-xl sm:rounded-2xl border transition-all ${
              isDark ? 'bg-rose-950/30 border-rose-500/20' : 'bg-white/80 border-rose-200/90 shadow-xs'
            }`}
          >
            <span className="font-roman text-2xl xs:text-3xl sm:text-5xl font-normal text-rose-500 block">
              {String(timeTogether.seconds).padStart(2, '0')}
            </span>
            <span
              className={`text-[9px] xs:text-[10px] sm:text-xs tracking-wider uppercase font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Seconds
            </span>
          </div>
        </div>

        <p
          className={`font-cormorant italic text-base sm:text-lg font-normal ${
            isDark ? 'text-rose-200/90' : 'text-gray-700'
          }`}
        >
          ...and a lifetime more to go ❤️
        </p>
      </div>

      {/* ──────────────── 3. "OUR STORY" TIMELINE SECTION (AT THE END) ──────────────── */}
      <div className="w-full max-w-2xl">
        {/* Section Header styled exactly like reference image */}
        <div className="mb-10 sm:mb-14 text-left">
          <div
            className={`flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase ${
              isDark ? 'text-[#D1A7DC]' : 'text-[#8E44AD]'
            }`}
          >
            <span className="text-sm">🎗️</span>
            <span>OUR STORY</span>
          </div>
          <h2
            className={`font-cormorant text-4xl sm:text-6xl font-medium tracking-tight mt-2.5 transition-colors ${
              isDark ? 'text-white' : 'text-[#1a111e]'
            }`}
          >
            Life's greatest
          </h2>
          <div
            className={`font-cormorant italic text-3xl sm:text-5xl font-light flex items-center gap-2 sm:gap-3 mt-1 ${
              isDark ? 'text-[#D1A7DC]' : 'text-[#7D3C98]'
            }`}
          >
            <span>chapters</span>
            <span className="not-italic text-2xl sm:text-3xl">📖💐</span>
          </div>
        </div>

        {/* Timeline Container with Left Vertical Line */}
        <div className="relative pl-6 sm:pl-8">
          {/* Continuous Vertical Connecting Line */}
          <div
            className={`absolute left-[6.5px] sm:left-[8.5px] top-3 bottom-8 w-[2px] transition-colors ${
              isDark ? 'bg-purple-900/50' : 'bg-[#D2B4DE]'
            }`}
          />

          {milestones.map((item, index) => {
            const isLast = index === milestones.length - 1;
            const currentIdx = activePhotoIdx[item.id] || 0;
            const currentPhoto = item.images[currentIdx];

            return (
              <div
                key={item.id}
                className={`relative pl-6 sm:pl-9 ${isLast ? 'pb-4' : 'pb-14 sm:pb-20'}`}
              >
                {/* Hollow Circle Node on Line */}
                <div
                  className={`absolute left-[-2px] sm:left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 transition-transform duration-200 hover:scale-125 z-10 ${
                    isDark
                      ? 'border-[#B892C5] bg-[#160c1c] shadow-[0_0_8px_rgba(184,146,197,0.3)]'
                      : 'border-[#8E44AD] bg-white ring-2 ring-purple-100 shadow-sm'
                  }`}
                />

                {/* Year Label */}
                <div
                  className={`text-xs sm:text-sm font-semibold tracking-wider mb-1 ${
                    isDark ? 'text-[#CE9FE0]' : 'text-[#6C3483]'
                  }`}
                >
                  {item.year}
                </div>

                {/* Milestone Title */}
                <h3
                  className={`font-cormorant text-2xl sm:text-3xl font-semibold tracking-wide mb-2.5 transition-colors ${
                    isDark ? 'text-white' : 'text-[#1a111e]'
                  }`}
                >
                  {item.title}
                </h3>

                {/* Milestone Description */}
                <p
                  className={`text-sm sm:text-base font-normal leading-relaxed mb-4 max-w-xl transition-colors ${
                    isDark ? 'text-gray-300' : 'text-[#2d2235]'
                  }`}
                >
                  {item.description} {item.emoji}
                </p>

                {/* Media Card with Portrait Frame & High Visibility for Faces */}
                <div className="w-full max-w-sm sm:max-w-md">
                  <div
                    onClick={() => setLightboxImage(currentPhoto)}
                    className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer border shadow-sm hover:shadow-lg transition-all duration-300 ${
                      isDark
                        ? 'border-purple-900/40 bg-purple-950/20 shadow-black/40'
                        : 'border-purple-200/80 bg-white shadow-md'
                    }`}
                  >
                    <div className="aspect-[3/4] sm:aspect-[4/5] w-full max-h-[580px] overflow-hidden bg-neutral-900/5">
                      <img
                        src={currentPhoto}
                        alt={`${item.title} memory`}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                          item.imgPosition || 'object-top'
                        }`}
                        loading="lazy"
                      />
                    </div>

                    {/* Subtle click-to-expand badge */}
                    <div className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-full text-[11px] font-medium backdrop-blur-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to expand 🔍
                    </div>
                  </div>

                  {/* Thumbnail Row if Year has Multiple Images */}
                  {item.images.length > 1 && (
                    <div className="flex items-center gap-2 mt-3 overflow-x-auto py-1">
                      {item.images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setActivePhotoIdx((prev) => ({
                              ...prev,
                              [item.id]: idx,
                            }))
                          }
                          className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 cursor-pointer ${
                            currentIdx === idx
                              ? isDark
                                ? 'border-[#C894D8] scale-105 ring-2 ring-purple-500/40 shadow-sm'
                                : 'border-[#8E44AD] scale-105 ring-2 ring-purple-300 shadow-sm'
                              : isDark
                              ? 'border-transparent opacity-60 hover:opacity-100'
                              : 'border-purple-100 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${item.title} thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                      <span
                        className={`text-[11px] font-semibold ml-2 select-none ${
                          isDark ? 'text-[#CE9FE0]' : 'text-[#5B2C6F]'
                        }`}
                      >
                        {currentIdx + 1} of {item.images.length}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal for Full View */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
          >
            <img
              src={lightboxImage}
              alt="Enlarged memory"
              className="max-h-[82vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
            />
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="mt-3 px-5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-medium backdrop-blur-md transition-colors cursor-pointer"
            >
              Close ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
