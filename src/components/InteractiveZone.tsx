import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, CakeSlice, PartyPopper, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface InteractiveZoneProps {
  onMakeWish: () => void;
  onCutCake: () => void;
  onCelebrate: () => void;
  onToggleMusic: () => void;
  onToggleMute: () => void;
  isPlaying: boolean;
  isMuted: boolean;
  audioSupported: boolean;
  audioError: string | null;
}

export const InteractiveZone: React.FC<InteractiveZoneProps> = ({
  onMakeWish,
  onCutCake,
  onCelebrate,
  onToggleMusic,
  onToggleMute,
  isPlaying,
  isMuted,
  audioSupported,
  audioError,
}) => {
  const [wishTextVisible, setWishTextVisible] = useState(false);
  const [heartPulse, setHeartPulse] = useState(false);
  const [cakeToastVisible, setCakeToastVisible] = useState(false);

  const handleWishClick = () => {
    setWishTextVisible(true);
    setHeartPulse(true);
    onMakeWish();
    window.setTimeout(() => setHeartPulse(false), 1200);
  };

  const handleCutCakeClick = () => {
    setCakeToastVisible(true);
    onCutCake();
    window.setTimeout(() => setCakeToastVisible(false), 3200);
  };

  return (
    <section
      id="interactive"
      className="relative z-20 flex flex-col items-center justify-center px-4 py-14 sm:py-20 text-center"
    >
      {/* Glowing Neon Dashed Heart Sky Emblem */}
      <motion.div
        animate={heartPulse ? { scale: [1, 1.18, 1] } : { scale: [1, 1.03, 1] }}
        transition={
          heartPulse
            ? { duration: 0.7, ease: 'easeOut' }
            : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }
        }
        className="mb-6 sm:mb-8"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 120 105"
          className="w-24 h-20 sm:w-32 sm:h-28 drop-shadow-[0_0_20px_rgba(255,79,203,0.85)]"
        >
          <path
            d="M60 92 C60 92 14 64 14 34 C14 18 26 8 40 8 C50 8 57 14 60 22 C63 14 70 8 80 8 C94 8 106 18 106 34 C106 64 60 92 60 92 Z"
            fill="none"
            stroke="#FF7AD9"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeDasharray="6 8"
          />
        </svg>
      </motion.div>

      <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-2 text-balance">
        Interactive Birthday Zone
      </h3>
      <p className="text-xs sm:text-sm text-[#FFB6E6]/80 mb-8 max-w-md">
        Tap any circle below to send a wish, slice the cake, launch fireworks, or play birthday music
      </p>

      {/* Wish / Cake Feedback Banner */}
      <AnimatePresence mode="wait">
        {wishTextVisible && (
          <motion.div
            key="wish-banner"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4 }}
            className="mb-7 px-6 py-3 rounded-2xl glass-purple border border-[#FFD780]/50 shadow-[0_0_28px_rgba(255,79,203,0.35)]"
            role="status"
            aria-live="polite"
          >
            <p className="font-display text-base sm:text-xl font-semibold text-[#FFD780] neon-gold-text">
              May all your wishes come true! ✨
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cakeToastVisible && (
          <motion.div
            key="cake-toast"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-6 px-5 py-2 rounded-full bg-[#FF4FCB]/20 border border-[#FFB6E6]/45 text-sm text-[#FFF3FA]"
            role="status"
            aria-live="polite"
          >
            Cake sliced with confetti! Make a Wish! ✨🎂
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 Large Circular Glassmorphism Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-7 max-w-3xl mx-auto">
        {/* Button 1: Make a Wish */}
        <motion.button
          type="button"
          onClick={handleWishClick}
          whileHover={{ scale: 1.06, y: -3 }}
          whileTap={{ scale: 0.95 }}
          className="group flex flex-col items-center justify-center w-32 h-32 sm:w-36 sm:h-36 rounded-full glass-purple border border-[#FFB6E6]/35 hover:border-[#FF4FCB] shadow-[0_12px_32px_rgba(255,79,203,0.22)] hover:shadow-[0_0_36px_rgba(255,79,203,0.55)] transition-all cursor-pointer p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD780]"
        >
          <span className="flex items-center justify-center w-11 h-11 rounded-full bg-[#FF4FCB]/25 text-[#FFB6E6] mb-2 group-hover:scale-110 transition-transform">
            <Heart className="w-6 h-6 fill-[#FF4FCB] text-[#FF4FCB]" aria-hidden="true" />
          </span>
          <span className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">
            Make a Wish
          </span>
        </motion.button>

        {/* Button 2: Cut Cake */}
        <motion.button
          type="button"
          onClick={handleCutCakeClick}
          whileHover={{ scale: 1.06, y: -3 }}
          whileTap={{ scale: 0.95 }}
          className="group flex flex-col items-center justify-center w-32 h-32 sm:w-36 sm:h-36 rounded-full glass-purple border border-[#FFB6E6]/35 hover:border-[#FF4FCB] shadow-[0_12px_32px_rgba(185,154,255,0.22)] hover:shadow-[0_0_36px_rgba(255,79,203,0.55)] transition-all cursor-pointer p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD780]"
        >
          <span className="flex items-center justify-center w-11 h-11 rounded-full bg-[#B99AFF]/25 text-[#FFB6E6] mb-2 group-hover:scale-110 transition-transform">
            <CakeSlice className="w-6 h-6 text-[#FFB6E6]" aria-hidden="true" />
          </span>
          <span className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">
            Cut Cake
          </span>
        </motion.button>

        {/* Button 3: Celebrate */}
        <motion.button
          type="button"
          onClick={onCelebrate}
          whileHover={{ scale: 1.06, y: -3 }}
          whileTap={{ scale: 0.95 }}
          className="group flex flex-col items-center justify-center w-32 h-32 sm:w-36 sm:h-36 rounded-full glass-purple border border-[#FFB6E6]/35 hover:border-[#FFD780] shadow-[0_12px_32px_rgba(255,215,128,0.18)] hover:shadow-[0_0_36px_rgba(255,215,128,0.45)] transition-all cursor-pointer p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD780]"
        >
          <span className="flex items-center justify-center w-11 h-11 rounded-full bg-[#FFD780]/20 text-[#FFD780] mb-2 group-hover:scale-110 transition-transform">
            <PartyPopper className="w-6 h-6 text-[#FFD780]" aria-hidden="true" />
          </span>
          <span className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">
            Celebrate
          </span>
        </motion.button>

        {/* Button 4: Play Music */}
        <motion.button
          type="button"
          onClick={onToggleMusic}
          whileHover={{ scale: 1.06, y: -3 }}
          whileTap={{ scale: 0.95 }}
          aria-pressed={isPlaying}
          className={`group flex flex-col items-center justify-center w-32 h-32 sm:w-36 sm:h-36 rounded-full glass-purple border transition-all cursor-pointer p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD780] ${
            isPlaying
              ? 'border-[#FF4FCB] shadow-[0_0_36px_rgba(255,79,203,0.6)]'
              : 'border-[#FFB6E6]/35 hover:border-[#FF4FCB] shadow-[0_12px_32px_rgba(185,154,255,0.22)]'
          }`}
        >
          <span className="flex items-center justify-center w-11 h-11 rounded-full bg-white/15 text-white mb-2 group-hover:scale-110 transition-transform">
            {isPlaying ? (
              <Pause className="w-6 h-6 text-[#FFD780]" aria-hidden="true" />
            ) : (
              <Play className="w-6 h-6 ml-0.5 text-white" aria-hidden="true" />
            )}
          </span>
          <span className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">
            {isPlaying ? 'Pause Music' : 'Play Music'}
          </span>
        </motion.button>
      </div>

      {/* Inline Music Controls + Audio Fallback Notice */}
      <div className="mt-7 flex flex-col items-center gap-2">
        {isPlaying && (
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-purple border border-[#FFB6E6]/25 text-xs text-[#FFB6E6]">
            <span>Birthday melody playing</span>
            <button
              type="button"
              onClick={onToggleMute}
              className="inline-flex items-center gap-1.5 min-h-[32px] px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD780]"
              aria-label={isMuted ? 'Unmute music' : 'Mute music'}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#FFB6E6]" aria-hidden="true" />
                  <span>Unmute</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#FFD780]" aria-hidden="true" />
                  <span>Mute</span>
                </>
              )}
            </button>
          </div>
        )}

        {(!audioSupported || audioError) && (
          <p className="text-xs text-[#FFB6E6]/80 max-w-sm" role="status">
            {audioError || 'Audio is unavailable in this browser. Enjoy the visual celebration!'}
          </p>
        )}
      </div>
    </section>
  );
};
