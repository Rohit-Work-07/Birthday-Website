import { useState, useEffect } from 'react';
import ScrapbookCollage from '../components/ScrapbookCollage';
import InteractivePhotoStack from '../components/InteractivePhotoStack';
import VerticalImageStack from '../components/VerticalImageStack';

// 3 hero photos from assets for the hero scrapbook collage
import heroPic1 from '../assets/hero pic 1.jpg';
import heroPic2 from '../assets/hero pic 2.jpg';
import heroPic3 from '../assets/hero pic 3.jpg';

// Photos for "Words from the heart" section uploaded by user
import wordsHeart1 from '../assets/Words from my heart.jpg';
import wordsHeart2 from '../assets/Words from my heart 2.jpg';
import wordsHeart3 from '../assets/words from heart 3.jpg';

const wordsFromHeartItems = [
  { src: wordsHeart1, name: 'Forever With You ❤️' },
  { src: wordsHeart2, name: 'My Favorite Smile 💕' },
  { src: wordsHeart3, name: 'Every Moment With You ✨' },
];

// <-- HER BIRTH DATE: 26 OCT 2002 (Turning 24 on 26 Oct 2026)
const BIRTH_DATE = '2002-10-26';

const rotatingTitles = [
  { text: 'Love', emoji: '❤️' },
  { text: 'Bestie', emoji: '💕' },
  { text: 'Crime Partner', emoji: '💖' },
  { text: 'Soulmate', emoji: '💘' },
  { text: 'Favorite Person', emoji: '💓' },
  { text: 'Everything', emoji: '💗' },
];

export default function Home({ setActivePage, theme = 'dark' }) {
  const [titleIndex, setTitleIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [lifeStats, setLifeStats] = useState({ years: 24, days: 8766 });

  const isDark = theme === 'dark';

  // Smoothly rotate the nickname every 2.8s
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setTitleIndex((prev) => (prev + 1) % rotatingTitles.length);
        setFade(true);
      }, 350);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  // Compute her milestone stats (Turning 24 on 26 Oct 2026)
  useEffect(() => {
    const now = new Date();
    const birthDiff = Math.max(0, now - new Date(BIRTH_DATE));
    const days = Math.floor(birthDiff / (1000 * 60 * 60 * 24));
    // Turning 24!
    const years = 24;
    setLifeStats({ years, days: days > 0 ? days : 8766 });
  }, []);

  return (
    <div className="w-full flex flex-col select-none">
      
      {/* ──────────────── 1. HERO SECTION (FULL SCREEN) ──────────────── */}
      <section className="min-h-[calc(100dvh-70px)] flex flex-col items-center justify-center px-3 sm:px-6 relative py-6 sm:py-12 overflow-hidden">
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-14 my-auto z-10">
          
          {/* Left Column: Scrapbook Photo Collage (from Assets) */}
          <div className="w-full lg:w-1/2 flex justify-center order-2 lg:order-1 lg:-translate-x-8 xl:-translate-x-14">
            <ScrapbookCollage
              photo1={heroPic3}
              photo2={heroPic2}
              photo3={heroPic1}
              theme={theme}
            />
          </div>

          {/* Right Column: Hero Typography & Greeting */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-2 sm:space-y-3 order-1 lg:order-2 px-2">
            {/* Line 1: Happy Birthday */}
            <h1 className="font-cormorant text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium sm:font-semibold tracking-wide leading-tight">
              Happy Birthday
            </h1>

            {/* Line 2: My [Rotating Word + Heart Emoji] */}
            <h2 className="font-cormorant italic text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal sm:font-medium text-red-400 tracking-normal leading-tight drop-shadow-[0_0_20px_rgba(248,113,113,0.35)] flex items-center justify-center lg:justify-start gap-2 sm:gap-3 h-10 sm:h-16">
              <span>My</span>
              <span
                className={`inline-flex items-center gap-1.5 transition-all duration-350 ease-out ${
                  fade
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-2 scale-95'
                }`}
              >
                <span>{rotatingTitles[titleIndex].text}</span>
                <span className="not-italic text-lg sm:text-3xl md:text-4xl inline-block drop-shadow-sm select-none">
                  {rotatingTitles[titleIndex].emoji}
                </span>
              </span>
            </h2>

            {/* Rephrased Romantic Quote */}
            <div className="pt-1 sm:pt-4 max-w-lg">
              <p className="font-cormorant italic text-base sm:text-xl md:text-2xl font-normal opacity-90 leading-relaxed tracking-wide">
                “On this day, you weren't just born — I found a friend, my best friend, and my girlfriend all in one.”
              </p>
            </div>


          </div>
        </div>

        {/* Subtle Scroll Down Indicator */}
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
          <span className="font-cormorant text-[11px] sm:text-sm tracking-widest uppercase">
            Scroll down for a message
          </span>
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </div>
      </section>


      {/* ──────────────── 2. "WORDS FROM THE HEART" SECTION ──────────────── */}
      <section
        className={`relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-8 py-20 sm:py-28 transition-colors duration-700 overflow-x-clip ${
          isDark
            ? 'bg-[#330e26] text-rose-50 shadow-inner'
            : 'bg-[#FCE7ED] text-[#2b1622]'
        }`}
      >
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center relative z-10">
          
          {/* Cute scattered floating ambient stickers */}
          <span className="absolute -top-4 -left-4 sm:-left-12 text-2xl select-none animate-bounce opacity-80 pointer-events-none" style={{ animationDuration: '3s' }}>🎈</span>
          <span className="absolute top-20 -right-4 sm:-right-10 text-xl select-none animate-pulse opacity-70 pointer-events-none">🍰</span>
          <span className="absolute bottom-12 -left-4 sm:-left-10 text-xl select-none animate-bounce opacity-70 pointer-events-none" style={{ animationDuration: '4s' }}>✨</span>
          <span className="absolute -bottom-4 -right-4 sm:-right-8 text-2xl select-none opacity-80 pointer-events-none">🎀</span>

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm tracking-widest uppercase font-semibold text-rose-400 mb-2">
            <span>💌</span>
            <span>A Birthday Message For You</span>
          </div>

          {/* Heading: Words from the heart 💝 */}
          <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-4 flex items-center justify-center gap-2">
            <span>Words from the</span>
            <span className={`font-cormorant italic ml-1 ${
              isDark ? 'text-pink-300 drop-shadow-[0_0_15px_rgba(244,114,182,0.4)]' : 'text-[#a855f7]'
            }`}>
              heart
            </span>
            <span className="text-3xl sm:text-4xl not-italic ml-1">💝</span>
          </h2>

          {/* 2-Column Section Layout: Letter on Left, Interactive Photo Stack on Right */}
          <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-14 mt-6">
            
            {/* Left Column: Luxury White Letter Card */}
            <div className="w-full lg:w-7/12 flex justify-center lg:justify-end">
              <div className="relative bg-white/95 backdrop-blur-md rounded-[24px] sm:rounded-[28px] p-5 xs:p-7 sm:p-10 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-rose-200/50 text-left transition-transform duration-300 hover:scale-[1.01] w-full max-w-xl">
                {/* Large Translucent Quote Icon */}
                <div className="text-rose-200/70 font-serif text-5xl sm:text-7xl leading-none select-none -mb-2 sm:-mb-3">
                  “
                </div>

                {/* Letter Body (Ready for your personal words) */}
                <div className="font-cormorant text-base sm:text-xl font-normal leading-relaxed text-[#3b2733] space-y-3 sm:space-y-4">
                  <p>
                    Dear <span className="font-semibold text-rose-600">Kavya</span> — where do I even begin? Every single moment spent with you has been a treasure I hold close to my heart. Watching you grow, smile, and shine has been the greatest joy of my life. You make every ordinary day feel like magic just by being in it.
                  </p>
                  {/* You can add more paragraphs of your personal letter here */}
                </div>

                {/* Sign-off Footer */}
                <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-rose-100 flex flex-col items-start">
                  <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-rose-400 font-semibold mb-1">
                    WITH ALL MY LOVE,
                  </span>
                  <div className="flex items-center gap-2 font-cormorant italic text-xl sm:text-3xl text-rose-600 font-medium">
                    <span>— Rohit</span>
                    <span className="not-italic text-lg sm:text-xl">🎂 ✨</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Photo Stack */}
            <div className="w-full lg:w-5/12 flex flex-col items-center justify-center">
              <InteractivePhotoStack
                items={wordsFromHeartItems}
                title={null}
              />
              <p className="font-cormorant italic text-xs sm:text-base opacity-80 mt-1 sm:mt-2 text-center">
                Tap card to bring to front • Tap stack to fan out ✨
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ──────────────── 3. "CELEBRATING YOU" SECTION (WITH VERTICAL IMAGE STACK BESIDE IT) ──────────────── */}
      <section
        className={`relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 py-16 sm:py-24 lg:py-28 transition-colors duration-700 overflow-hidden ${
          isDark
            ? 'bg-[#180f33] text-purple-100 shadow-inner'
            : 'bg-[#FFF6ED] text-[#2b1722]'
        }`}
      >
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 lg:gap-16">
          
          {/* Left Column: Celebrating You text & 24 Milestone */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 sm:space-y-6">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
              <span className="font-cormorant text-xs sm:text-sm tracking-[0.3em] uppercase text-red-500 font-bold">
                Celebrating You
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            </div>

            {/* Big Milestone Number - Classical Roman Serif Font */}
            <div className="py-1 sm:py-2">
              <span className="font-roman font-normal text-6xl xs:text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] text-red-500 tracking-normal leading-none drop-shadow-[0_2px_20px_rgba(239,68,68,0.25)] block select-none">
                {lifeStats.years}
              </span>
              <span className="font-cormorant italic text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium mt-2 sm:mt-3 block leading-tight">
                Years of being the coolest, sweetest & most amazing person
              </span>
            </div>

            {/* Friendly & Loving Sentences (Conversational & Warm) */}
            <div className="space-y-3 sm:space-y-4 max-w-xl">
              <p className="font-cormorant text-base sm:text-xl lg:text-2xl font-normal leading-relaxed opacity-95">
                That’s over <span className="font-semibold text-red-500">{lifeStats.days.toLocaleString()} days</span> of your cute smile, your funny jokes, your random chaos, and just making life so much brighter for everyone around you.
              </p>
              
              <p className={`font-cormorant italic text-sm sm:text-lg lg:text-xl font-medium leading-relaxed ${
                isDark ? 'text-purple-300' : 'text-[#8a3359]'
              }`}>
                “Honestly, everything is 100 times better, funnier, and more fun with you around. Happy 24th, my favorite human! 🥳🎉”
              </p>
            </div>

            {/* Gentle romantic divider flourish */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-3 opacity-60">
              <span className="w-12 h-[1.5px] bg-red-400"></span>
              <span className="text-red-500 text-sm">✦</span>
              <span className="w-12 h-[1.5px] bg-red-400"></span>
            </div>
          </div>

          {/* Right Column: 3D Vertical Image Stack */}
          <div className="w-full lg:w-1/2 flex justify-center items-center py-2 sm:py-4">
            <VerticalImageStack theme={theme} />
          </div>

        </div>
      </section>


      {/* ──────────────── 4. FOOTER (COMPACT) ──────────────── */}
      <footer
        className={`w-full py-4 sm:py-5 px-4 text-center border-t relative z-10 transition-colors duration-700 select-none ${
          isDark
            ? 'bg-[#0c192c] border-sky-900/40 text-sky-100'
            : 'bg-[#e8f4fc] border-sky-200/70 text-[#1b3a5b]'
        }`}
      >
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-sm sm:text-base font-cormorant">
          <div className="flex items-center gap-1.5">
            <span>Made with Love</span>
            <span className="text-red-500 animate-pulse text-sm inline-block">❤️</span>
            <span>by</span>
            <span className="font-semibold text-red-500 font-cormorant italic text-base sm:text-lg">
              Rohit
            </span>
          </div>
          <span className="hidden sm:inline opacity-30">•</span>
          <span className="font-romantic text-base sm:text-lg text-rose-400 opacity-90">
            Happy Birthday My Love ❤️🎉
          </span>
        </div>
      </footer>



    </div>
  );
}
