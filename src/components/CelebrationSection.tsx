import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GuidedPointer } from './GuidedPointer';

interface CelebrationSectionProps {
  cakeCut: boolean;
  onCutCake: () => void;
  onCelebrate: () => void;
  showCutPointer?: boolean;
  reducedMotion: boolean;
}

const CANDLE_POSITIONS = [
  { x: 96, color: '#FF4FCB', stripe: '#FFB6E6' },
  { x: 118, color: '#B99AFF', stripe: '#FFFFFF' },
  { x: 140, color: '#FFD780', stripe: '#FF4FCB' },
  { x: 162, color: '#FF7AD9', stripe: '#FFFFFF' },
  { x: 184, color: '#B99AFF', stripe: '#FFD780' },
  { x: 206, color: '#FF4FCB', stripe: '#FFFFFF' },
  { x: 228, color: '#FFD780', stripe: '#FFB6E6' },
];

export const CelebrationSection: React.FC<CelebrationSectionProps> = ({
  cakeCut,
  onCutCake,
  onCelebrate,
  showCutPointer = false,
  reducedMotion,
}) => {
  const [litCandles, setLitCandles] = useState<boolean[]>(
    () => Array(CANDLE_POSITIONS.length).fill(true)
  );

  const toggleCandle = (index: number) => {
    setLitCandles((prev) => prev.map((lit, idx) => (idx === index ? !lit : lit)));
  };

  const handleCutButtonClick = () => {
    onCutCake();
  };

  return (
    <section
      id="surprise"
      className="relative z-20 scroll-mt-20 flex min-h-[92dvh] flex-col items-center justify-center px-4 pt-20 pb-14 text-center"
    >
      {/* Glowing Neon Crown + Cursive Heading */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-3xl mx-auto"
      >
        {/* Minimal glowing crown above heading */}
        <svg
          viewBox="0 0 64 34"
          className="w-11 h-7 mx-auto mb-1 drop-shadow-[0_0_12px_rgba(255,215,128,0.8)]"
          aria-hidden="true"
        >
          <path
            d="M8 28 L12 10 L24 20 L32 6 L40 20 L52 10 L56 28 Z"
            fill="none"
            stroke="#FFD780"
            strokeWidth="2.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <circle cx="12" cy="8" r="2.2" fill="#FFD780" />
          <circle cx="32" cy="4" r="2.5" fill="#FFD780" />
          <circle cx="52" cy="8" r="2.2" fill="#FFD780" />
        </svg>

        <h2 className="font-script text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-bold leading-[1.08] text-[#FFB6E6] neon-pink-text text-balance">
          HAPPY 19TH BIRTHDAY
          <br />
          <span className="text-white">SHINEY!</span>{' '}
          <span aria-hidden="true" className="text-4xl sm:text-5xl md:text-6xl align-middle">
            🎂💗
          </span>
        </h2>

        <p className="mt-3 sm:mt-4 text-sm sm:text-base font-medium text-[#4ADE80] tracking-wide drop-shadow-[0_0_12px_rgba(74,222,128,0.4)]">
          Java Magic Successfully Executed!
        </p>
        <p className="mt-1 font-display text-base sm:text-lg italic text-[#FFD780] neon-gold-text">
          Welcome to Chapter 19 ✨
        </p>

        {/* Neon glowing side hearts */}
        <span
          aria-hidden="true"
          className="hidden sm:inline-block absolute -left-8 top-16 text-2xl text-[#FF4FCB] neon-pink-text -rotate-12 select-none"
        >
          ♡
        </span>
        <span
          aria-hidden="true"
          className="hidden sm:inline-block absolute -right-8 bottom-12 text-xl text-[#FFD780] neon-gold-text rotate-12 select-none"
        >
          ♡
        </span>
      </motion.div>

      {/* Interactive Pink Birthday Cake */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-6 sm:mt-8 mb-4 w-full max-w-[340px] sm:max-w-[390px] mx-auto"
      >
        {/* Warm aura behind cake */}
        <div
          className="pointer-events-none absolute inset-x-6 top-6 bottom-4 rounded-full blur-3xl opacity-55"
          style={{
            background:
              'radial-gradient(circle, rgba(255,79,203,0.45) 0%, rgba(255,215,128,0.25) 45%, transparent 75%)',
          }}
          aria-hidden="true"
        />

        {/* Animated knife during cake cut */}
        <AnimatePresence>
          {cakeCut && !reducedMotion && (
            <motion.div
              initial={{ opacity: 0, x: 70, y: -55, rotate: -25 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: [70, 18, 8, 22],
                y: [-55, 8, 30, -25],
                rotate: [-25, -14, -8, -18],
              }}
              transition={{ duration: 1.35, ease: 'easeInOut' }}
              className="pointer-events-none absolute right-10 top-6 z-30"
              aria-hidden="true"
            >
              <svg viewBox="0 0 96 40" className="w-24 h-10 drop-shadow-[0_6px_14px_rgba(255,215,128,0.65)]">
                <path d="M4 22 L62 12 L64 24 L8 28 Z" fill="#F8FAFC" />
                <path d="M4 22 L62 12 L62 16 L6 24 Z" fill="#E2E8F0" />
                <rect x="62" y="13" width="30" height="9" rx="4.5" fill="#FFD780" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        <svg
          viewBox="0 0 320 260"
          className="relative z-10 w-full h-auto drop-shadow-[0_22px_36px_rgba(16,9,31,0.85)]"
          role="img"
          aria-label="Pink frosted birthday cake with glowing candles"
        >
          <defs>
            <linearGradient id="cakeBody" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E65BA8" />
              <stop offset="35%" stopColor="#FF9FE0" />
              <stop offset="70%" stopColor="#FF75C3" />
              <stop offset="100%" stopColor="#C43B8D" />
            </linearGradient>
            <linearGradient id="icingDrip" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF5FB" />
              <stop offset="100%" stopColor="#FFB6E6" />
            </linearGradient>
            <linearGradient id="pedestal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C88E32" />
              <stop offset="50%" stopColor="#FFF1C2" />
              <stop offset="100%" stopColor="#B87A1E" />
            </linearGradient>
            <radialGradient id="flameGlow" cx="50%" cy="60%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#FFD780" />
              <stop offset="100%" stopColor="#FF7A18" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Glowing Pedestal */}
          <ellipse cx="160" cy="236" rx="88" ry="12" fill="rgba(255,79,203,0.35)" />
          <path d="M138 206 L182 206 L194 234 L126 234 Z" fill="url(#pedestal)" />
          <ellipse cx="160" cy="206" rx="112" ry="15" fill="url(#pedestal)" />
          <ellipse cx="160" cy="203" rx="108" ry="12" fill="#FFF7E2" fillOpacity="0.85" />

          {/* Main Cake Cylinder */}
          <rect x="74" y="114" width="172" height="86" rx="16" fill="url(#cakeBody)" />
          {/* Cream middle layer band */}
          <path
            d="M74 156 Q118 164 160 156 Q202 148 246 156 L246 164 Q202 156 160 164 Q118 172 74 164 Z"
            fill="#FFEAF7"
            opacity="0.88"
          />

          {/* Top Frosting & Drips */}
          <ellipse cx="160" cy="114" rx="86" ry="18" fill="#FFDDF2" />
          <path
            d="M74 114
               Q74 134 86 134 Q96 134 98 122
               Q103 145 114 145 Q124 145 126 124
               Q134 138 145 138 Q155 138 158 121
               Q168 148 180 148 Q190 148 192 124
               Q200 137 210 137 Q220 137 222 122
               Q230 136 240 132 Q246 128 246 114
               Q204 128 160 128 Q116 128 74 114 Z"
            fill="url(#icingDrip)"
          />

          {/* Sprinkles & pearls */}
          <circle cx="96" cy="178" r="3" fill="#FFD780" />
          <circle cx="116" cy="184" r="2.5" fill="#FFFFFF" />
          <circle cx="138" cy="176" r="3" fill="#B99AFF" />
          <circle cx="162" cy="185" r="3" fill="#FFD780" />
          <circle cx="186" cy="177" r="2.5" fill="#FFFFFF" />
          <circle cx="208" cy="183" r="3" fill="#B99AFF" />
          <circle cx="228" cy="176" r="2.5" fill="#FFD780" />

          {/* Interactive Separated Cake Slice when Cut */}
          <g
            style={{
              transform: cakeCut ? 'translate(22px, 10px)' : 'translate(0px, 0px)',
              transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {cakeCut && (
              <>
                <path
                  d="M172 118 L224 122 L224 196 L172 198 Z"
                  fill="#FFBCE5"
                  stroke="#FFF5FB"
                  strokeWidth="1.5"
                />
                <path d="M172 146 L224 148 L224 156 L172 154 Z" fill="#FFFFFF" />
                <path d="M172 170 L224 172 L224 180 L172 178 Z" fill="#FF4FCB" opacity="0.65" />
              </>
            )}
          </g>

          {/* 7 Interactive Birthday Candles */}
          {CANDLE_POSITIONS.map((candle, idx) => {
            const isLit = litCandles[idx];
            return (
              <g
                key={candle.x}
                onClick={() => toggleCandle(idx)}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`Birthday candle ${idx + 1}, ${isLit ? 'lit' : 'blown out'}. Tap to toggle.`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCandle(idx);
                  }
                }}
              >
                {/* Candle stick */}
                <rect
                  x={candle.x - 4.5}
                  y="74"
                  width="9"
                  height="38"
                  rx="3"
                  fill={candle.color}
                />
                <path
                  d={`M${candle.x - 4.5} 84 L${candle.x + 4.5} 80 M${candle.x - 4.5} 96 L${candle.x + 4.5} 92 M${candle.x - 4.5} 107 L${candle.x + 4.5} 103`}
                  stroke={candle.stripe}
                  strokeWidth="2"
                  opacity="0.85"
                />
                {/* Wick */}
                <line
                  x1={candle.x}
                  y1="74"
                  x2={candle.x}
                  y2="68"
                  stroke="#FFE8A3"
                  strokeWidth="1.5"
                />
                {/* Flame */}
                {isLit && (
                  <g className="animate-flame">
                    <circle cx={candle.x} cy="58" r="14" fill="url(#flameGlow)" opacity="0.7" />
                    <path
                      d={`M${candle.x} 46 C${candle.x + 6} 54, ${candle.x + 5.5} 66, ${candle.x} 67 C${candle.x - 5.5} 66, ${candle.x - 6} 54, ${candle.x} 46 Z`}
                      fill="#FFB703"
                    />
                    <path
                      d={`M${candle.x} 52 C${candle.x + 3} 57, ${candle.x + 2.8} 64, ${candle.x} 65 C${candle.x - 2.8} 64, ${candle.x - 3} 57, ${candle.x} 52 Z`}
                      fill="#FFF8D6"
                    />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        <p className="mt-1 text-xs text-[#B99AFF]/80">
          Tip: Tap any candle to blow out or relight
        </p>
      </motion.div>

      {/* Make a Wish celebration banner when cake is cut */}
      <AnimatePresence>
        {cakeCut && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45 }}
            className="mb-5 px-6 py-2.5 rounded-full glass-purple border border-[#FFD780]/50 shadow-[0_0_26px_rgba(255,215,128,0.35)]"
            role="status"
            aria-live="polite"
          >
            <span className="font-display text-lg sm:text-xl font-semibold text-[#FFD780] neon-gold-text">
              Make a Wish! ✨
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Cake & Fireworks Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mt-2 pb-10 sm:pb-8">
        <div className="relative inline-flex">
          <motion.button
            type="button"
            onClick={handleCutButtonClick}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="relative z-10 min-h-[48px] px-7 py-3 rounded-full font-medium text-sm sm:text-base text-white bg-gradient-to-r from-[#FF4FCB] to-[#A855F7] border border-[#FFB6E6]/45 shadow-[0_0_24px_rgba(255,79,203,0.45)] hover:shadow-[0_0_36px_rgba(255,79,203,0.7)] transition-shadow whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD780]"
          >
            {cakeCut ? 'Cut Again 🎂' : 'Cut the Cake 🎂'}
          </motion.button>

          <GuidedPointer
            visible={showCutPointer}
            tooltip="Tap to cut the birthday cake! 🎂"
            shape="pill"
            placement="bottom"
          />
        </div>

        <motion.button
          type="button"
          onClick={onCelebrate}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="min-h-[48px] px-7 py-3 rounded-full font-medium text-sm sm:text-base text-[#FFD780] glass-purple border border-[#FFD780]/40 hover:border-[#FFD780]/75 hover:bg-[#24103F]/90 shadow-[0_0_20px_rgba(185,154,255,0.28)] transition-all whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4FCB]"
        >
          Celebrate 🎉
        </motion.button>
      </div>
    </section>
  );
};
