import { useState, useEffect } from 'react';

/**
 * Twin Counters:
 * 1. "Celebrating You" (Years & Days of her life)
 * 2. "Time Together" (Days, Hours, Minutes, Seconds of your relationship)
 * 
 * Edit the dates below to match your special dates:
 */
const BIRTH_DATE = '2002-10-26'; // <-- HER BIRTH DATE (YYYY-MM-DD)
const TOGETHER_START_DATE = '2024-02-14'; // <-- CHANGE TO WHEN YOU GOT TOGETHER (YYYY-MM-DD)

export default function TwinCounters({ theme = 'dark', showCelebratingYou = true, showTimeTogether = true }) {
  const isDark = theme === 'dark';

  const [timeTogether, setTimeTogether] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [lifeStats, setLifeStats] = useState({ years: 0, days: 0 });

  useEffect(() => {
    const updateStats = () => {
      const now = new Date();

      // Time Together
      const togetherDiff = Math.max(0, now - new Date(TOGETHER_START_DATE));
      const tDays = Math.floor(togetherDiff / (1000 * 60 * 60 * 24));
      const tHours = Math.floor((togetherDiff / (1000 * 60 * 60)) % 24);
      const tMinutes = Math.floor((togetherDiff / (1000 * 60)) % 60);
      const tSeconds = Math.floor((togetherDiff / 1000) % 60);
      setTimeTogether({ days: tDays, hours: tHours, minutes: tMinutes, seconds: tSeconds });

      // Celebrating You (Life)
      const birthDiff = Math.max(0, now - new Date(BIRTH_DATE));
      const bDays = Math.floor(birthDiff / (1000 * 60 * 60 * 24));
      const bYears = Math.floor(bDays / 365.25);
      setLifeStats({ years: bYears, days: bDays });
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 sm:mt-10 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        
        {/* CARD 1: CELEBRATING YOU */}
        {showCelebratingYou && (
          <div
            className={`p-5 sm:p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 ${
              isDark
                ? 'bg-black/30 border-white/10 hover:border-red-500/40 hover:shadow-[0_0_25px_rgba(239,68,68,0.2)]'
                : 'bg-white/70 border-black/10 hover:border-red-400 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
              <h3 className="font-cormorant text-xs sm:text-sm tracking-widest uppercase font-semibold text-red-400">
                Celebrating You
              </h3>
            </div>
            
            <div className="my-2">
              <span className="font-cormorant text-3xl sm:text-4xl font-semibold text-red-500">
                {lifeStats.years}
              </span>
              <span className="font-cormorant text-lg sm:text-xl font-normal ml-1.5 opacity-90">
                Years of Grace
              </span>
            </div>

            <p className="font-cormorant text-sm sm:text-base font-normal opacity-75 mt-1">
              {lifeStats.days.toLocaleString()} days of making the world brighter ✨
            </p>
          </div>
        )}

        {/* CARD 2: TIME TOGETHER */}
        {showTimeTogether && (
          <div
            className={`p-5 sm:p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 ${
              isDark
                ? 'bg-black/30 border-white/10 hover:border-red-500/40 hover:shadow-[0_0_25px_rgba(239,68,68,0.2)]'
                : 'bg-white/70 border-black/10 hover:border-red-400 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
              <h3 className="font-cormorant text-xs sm:text-sm tracking-widest uppercase font-semibold text-red-400">
                Time Together
              </h3>
            </div>

            {/* Live Ticker: Days, Hours, Mins, Secs */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-3 my-2 text-center">
              <div>
                <span className="font-roman text-2xl sm:text-3xl font-normal text-red-500">
                  {timeTogether.days}
                </span>
                <span className="block text-[10px] tracking-wider uppercase opacity-60">Days</span>
              </div>
              <span className="text-red-400/60 font-light -mt-3">:</span>
              <div>
                <span className="font-roman text-2xl sm:text-3xl font-normal text-red-500">
                  {String(timeTogether.hours).padStart(2, '0')}
                </span>
                <span className="block text-[10px] tracking-wider uppercase opacity-60">Hours</span>
              </div>
              <span className="text-red-400/60 font-light -mt-3">:</span>
              <div>
                <span className="font-roman text-2xl sm:text-3xl font-normal text-red-500">
                  {String(timeTogether.minutes).padStart(2, '0')}
                </span>
                <span className="block text-[10px] tracking-wider uppercase opacity-60">Mins</span>
              </div>
              <span className="text-red-400/60 font-light -mt-3">:</span>
              <div>
                <span className="font-roman text-2xl sm:text-3xl font-normal text-red-500">
                  {String(timeTogether.seconds).padStart(2, '0')}
                </span>
                <span className="block text-[10px] tracking-wider uppercase opacity-60">Secs</span>
              </div>
            </div>

            <p className="font-cormorant text-sm sm:text-base font-normal opacity-75 mt-1">
              Every second with you is a blessing ❤️
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
