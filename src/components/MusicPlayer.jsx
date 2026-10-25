import { useState, useRef, useEffect, useMemo } from 'react';
import VinylMusicPlayer from './VinylMusicPlayer';

// Covers from assets for the vinyl disc artwork
import cover1 from '../assets/Words from my heart.jpg';
import cover2 from '../assets/Words from my heart 2.jpg';
import cover3 from '../assets/words from heart 3.jpg';
import cover4 from '../assets/hero pic 1.jpg';
import cover5 from '../assets/hero pic 2.jpg';
import cover6 from '../assets/hero pic 3.jpg';

import loverSong from '../assets/lover.mp3';

export default function MusicPlayer({ isDark = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const closeTimerRef = useRef(null);
  const containerRef = useRef(null);

  // Tracks configured with Lover by Taylor Swift
  const tracks = useMemo(() => {
    return [
      {
        title: 'Lover',
        artist: 'Taylor Swift',
        cover: cover1,
        src: loverSong,
      },
      {
        title: 'Lover',
        artist: 'Taylor Swift',
        cover: cover2,
        src: loverSong,
      },
      {
        title: 'Lover',
        artist: 'Taylor Swift',
        cover: cover3,
        src: loverSong,
      },
      {
        title: 'Lover',
        artist: 'Taylor Swift',
        cover: cover4,
        src: loverSong,
      },
      {
        title: 'Lover',
        artist: 'Taylor Swift',
        cover: cover5,
        src: loverSong,
      },
      {
        title: 'Lover',
        artist: 'Taylor Swift',
        cover: cover6,
        src: loverSong,
      },
    ];
  }, []);

  // Handle Hover Open / Close with grace delay
  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (isPinned) return; // Keep open if user clicked to pin
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 380);
  };

  // Handle Click: Toggles playback immediately and opens the player card
  const handleClick = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback error:', err);
      });
      setIsOpen(true);
      setIsPinned(true);
    } else {
      audio.pause();
      setIsPlaying(false);
      setIsPinned(false);
    }
  };

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsPinned(false);
      }
    };
    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Shared Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={tracks[0]?.src}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Music Icon Toggle Button */}
      <button
        type="button"
        onClick={handleClick}
        aria-label={isPlaying ? 'Music playing - click to open player' : 'Music paused - click to open player'}
        title="Background Music • Hover or click to open player"
        className={`p-2.5 rounded-full transition-all duration-300 backdrop-blur-md cursor-pointer border shadow-md hover:scale-110 active:scale-95 flex items-center justify-center ${
          isDark
            ? isPlaying || isOpen
              ? 'bg-rose-500/25 hover:bg-rose-500/35 border-rose-500/50 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
              : 'bg-black/40 hover:bg-black/60 border-white/15 text-stone-300 hover:text-white shadow-[0_4px_16px_rgba(0,0,0,0.5)]'
            : isPlaying || isOpen
            ? 'bg-rose-50 hover:bg-rose-100 border-rose-300 text-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
            : 'bg-white/80 hover:bg-white border-black/10 text-stone-600 hover:text-stone-900 shadow-[0_4px_16px_rgba(0,0,0,0.08)]'
        }`}
      >
        {isPlaying ? (
          /* Animated Equalizer Wave Bars */
          <div className="w-5 h-5 flex items-end justify-center gap-[2.5px] pb-0.5">
            <span
              className="w-[2.5px] bg-current rounded-full animate-pulse"
              style={{ height: '70%', animationDuration: '0.8s' }}
            />
            <span
              className="w-[2.5px] bg-current rounded-full animate-pulse"
              style={{ height: '100%', animationDuration: '0.5s' }}
            />
            <span
              className="w-[2.5px] bg-current rounded-full animate-pulse"
              style={{ height: '50%', animationDuration: '0.7s' }}
            />
            <span
              className="w-[2.5px] bg-current rounded-full animate-pulse"
              style={{ height: '85%', animationDuration: '0.6s' }}
            />
          </div>
        ) : (
          /* Music Note Icon */
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
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        )}
      </button>

      {/* Vinyl Disc Player Pop-up Overlay (Appears on Hover or Click) */}
      {isOpen && (
        <div
          className="vinyl-popup"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <VinylMusicPlayer
            tracks={tracks}
            isDark={isDark}
            audioRefProp={audioRef}
            isPlayingProp={isPlaying}
            onPlayChangeProp={setIsPlaying}
            onClose={() => {
              setIsOpen(false);
              setIsPinned(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
