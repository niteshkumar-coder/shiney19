import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { GuidedPointer } from './GuidedPointer';

interface WelcomeScreenProps {
  onOpenComplete: () => void;
  onTriggerConfetti: () => void;
  onGiftClick?: () => void;
  showPointer?: boolean;
  reducedMotion: boolean;
}

type BoxPhase = 'idle' | 'shaking' | 'opening' | 'opened';

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onOpenComplete,
  onTriggerConfetti,
  onGiftClick,
  showPointer = false,
  reducedMotion,
}) => {
  const [phase, setPhase] = useState<BoxPhase>('idle');

  const handleOpenGift = () => {
    if (phase !== 'idle') return;
    onGiftClick?.();

    if (reducedMotion) {
      setPhase('opened');
      onTriggerConfetti();
      window.setTimeout(onOpenComplete, 350);
      return;
    }

    setPhase('shaking');
    window.setTimeout(() => {
      setPhase('opening');
      onTriggerConfetti();
    }, 550);

    window.setTimeout(() => {
      setPhase('opened');
    }, 1150);

    window.setTimeout(() => {
      onOpenComplete();
    }, 1650);
  };

  return (
    <section
      id="home"
      className="relative z-20 flex min-h-[100dvh] flex-col items-center justify-center px-4 pt-20 pb-12 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.15] text-balance">
          A Little Surprise
          <br />
          <span className="bg-gradient-to-r from-white via-[#FFB6E6] to-[#FF4FCB] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(255,79,203,0.45)]">
            For You
          </span>{' '}
          <span aria-hidden="true">💝</span>
        </h1>

        <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-[#FFB6E6]/90 max-w-md mx-auto leading-relaxed">
          Hey Shiney! Someone has a special birthday surprise for you. <span aria-hidden="true">🎁</span>
        </p>
      </motion.div>

      {/* Centerpiece 3D-style Gift Box on glowing circular stage */}
      <div className="relative mt-8 sm:mt-12 mb-6 sm:mb-8 flex flex-col items-center justify-center">
        {/* Sparkling ambient stars around gift */}
        <motion.div
          animate={reducedMotion ? undefined : { opacity: [0.4, 1, 0.4], scale: [0.9, 1.15, 0.9] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          className="absolute -top-6 -left-10 sm:-left-14 text-[#FFD780] pointer-events-none"
          aria-hidden="true"
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>
        <motion.div
          animate={reducedMotion ? undefined : { opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
          transition={{ duration: 2.9, repeat: Infinity, delay: 0.8 }}
          className="absolute top-6 -right-10 sm:-right-14 text-[#FFB6E6] pointer-events-none"
          aria-hidden="true"
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>

        {/* Bright radiant burst when opening */}
        <AnimatePresence>
          {(phase === 'opening' || phase === 'opened') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="pointer-events-none absolute -top-16 w-64 h-64 rounded-full blur-2xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,215,128,0.75) 28%, rgba(255,79,203,0.5) 60%, transparent 78%)',
              }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        {/* Interactive Gift Box Button */}
        <motion.button
          type="button"
          onClick={handleOpenGift}
          aria-label="Open Shiney's birthday gift box"
          disabled={phase !== 'idle'}
          animate={
            phase === 'shaking'
              ? {
                  rotate: [0, -6, 6, -7, 7, -4, 4, 0],
                  scale: [1, 1.05, 1.03, 1.07, 1.04, 1],
                  transition: { duration: 0.55 },
                }
              : phase === 'idle' && !reducedMotion
              ? {
                  y: [0, -8, 0],
                  transition: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' },
                }
              : undefined
          }
          whileHover={phase === 'idle' ? { scale: 1.04 } : undefined}
          whileTap={phase === 'idle' ? { scale: 0.97 } : undefined}
          className="relative group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4FCB] rounded-3xl p-4"
        >
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-end justify-center">
            {/* Inner golden glow spilling out when lid opens */}
            <motion.div
              initial={false}
              animate={{
                opacity: phase === 'opening' || phase === 'opened' ? 1 : 0,
                scaleY: phase === 'opening' || phase === 'opened' ? 1 : 0.2,
              }}
              transition={{ duration: 0.45 }}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 w-32 h-32 origin-bottom pointer-events-none"
              style={{
                background:
                  'linear-gradient(to top, rgba(255,215,128,0.95), rgba(255,79,203,0.45), transparent)',
                clipPath: 'polygon(15% 100%, 85% 100%, 100% 0%, 0% 0%)',
                filter: 'blur(6px)',
              }}
              aria-hidden="true"
            />

            {/* Gift Lid + Golden Bow */}
            <motion.div
              initial={false}
              animate={
                phase === 'opening' || phase === 'opened'
                  ? { y: -56, x: 14, rotate: 18, opacity: phase === 'opened' ? 0 : 1 }
                  : { y: 0, x: 0, rotate: 0, opacity: 1 }
              }
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-6 sm:top-8 z-20 flex flex-col items-center"
            >
              {/* Sculpted Golden Bow */}
              <motion.svg
                viewBox="0 0 120 48"
                className="w-24 sm:w-28 h-10 -mb-1.5 drop-shadow-[0_4px_10px_rgba(255,215,128,0.55)]"
                animate={
                  phase === 'opening'
                    ? { scale: [1, 1.25, 0.9], rotate: [0, -8, 12] }
                    : undefined
                }
              >
                <defs>
                  <linearGradient id="goldBow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF0B8" />
                    <stop offset="50%" stopColor="#FFD780" />
                    <stop offset="100%" stopColor="#D4942A" />
                  </linearGradient>
                </defs>
                <path
                  d="M60 36 C42 36, 16 28, 22 12 C28 -2, 54 14, 60 32 Z"
                  fill="url(#goldBow)"
                />
                <path
                  d="M60 36 C78 36, 104 28, 98 12 C92 -2, 66 14, 60 32 Z"
                  fill="url(#goldBow)"
                />
                <path d="M53 34 L36 47 L46 47 L58 37 Z" fill="#E3A93A" />
                <path d="M67 34 L84 47 L74 47 L62 37 Z" fill="#E3A93A" />
                <ellipse cx="60" cy="34" rx="8" ry="6" fill="#FFE8A3" />
              </motion.svg>

              {/* Lid Box */}
              <div
                className="relative w-36 sm:w-44 h-9 sm:h-10 rounded-xl shadow-[0_10px_22px_rgba(16,9,31,0.65)] overflow-hidden border border-[#FFB6E6]/40"
                style={{
                  background: 'linear-gradient(135deg, #FF7AD9 0%, #B34CEB 52%, #6B21A8 100%)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent" />
                <div
                  className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-6 sm:w-7"
                  style={{
                    background: 'linear-gradient(90deg, #E5A93B 0%, #FFE8A3 50%, #D4942A 100%)',
                  }}
                />
              </div>
            </motion.div>

            {/* Gift Base */}
            <div
              className="relative z-10 w-32 sm:w-40 h-24 sm:h-28 rounded-b-2xl rounded-t-md shadow-[0_18px_40px_rgba(255,79,203,0.35)] overflow-hidden border border-[#FFB6E6]/30"
              style={{
                background: 'linear-gradient(155deg, #FF6AD5 0%, #9D4EDD 55%, #4C1D95 100%)',
              }}
            >
              {/* Satin highlight */}
              <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white/18 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black/25 to-transparent" />
              {/* Vertical golden ribbon */}
              <div
                className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-6 sm:w-7 shadow-inner"
                style={{
                  background: 'linear-gradient(90deg, #D99B2E 0%, #FFE8A3 48%, #C6831E 100%)',
                }}
              />
              {/* Horizontal golden ribbon */}
              <div
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-5 sm:h-6 opacity-90"
                style={{
                  background: 'linear-gradient(180deg, #FFE8A3 0%, #FFD780 50%, #C6831E 100%)',
                }}
              />
            </div>
          </div>
        </motion.button>

        {/* Glowing circular stage platform */}
        <div
          className="relative -mt-4 w-52 sm:w-64 h-8 rounded-full border border-[#FFB6E6]/60"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(255,79,203,0.5) 0%, rgba(185,154,255,0.22) 60%, transparent 100%)',
            boxShadow:
              '0 0 28px rgba(255,79,203,0.65), inset 0 0 14px rgba(255,255,255,0.45)',
          }}
          aria-hidden="true"
        />

        {/* Decorative mini gifts flanking on desktop */}
        <div
          className="hidden md:block absolute -left-36 bottom-1 w-14 h-14 rounded-lg opacity-80 shadow-lg border border-white/15"
          style={{ background: 'linear-gradient(145deg, #B99AFF 0%, #5B21B6 100%)' }}
          aria-hidden="true"
        >
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2.5 bg-[#FFD780]/85" />
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2.5 bg-[#FFD780]/85" />
        </div>
        <div
          className="hidden md:block absolute -right-36 bottom-1 w-12 h-12 rounded-lg opacity-80 shadow-lg border border-white/15"
          style={{ background: 'linear-gradient(145deg, #FF7AD9 0%, #831843 100%)' }}
          aria-hidden="true"
        >
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2 bg-[#FFB6E6]/85" />
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 bg-[#FFB6E6]/85" />
        </div>
      </div>

      {/* Primary CTA Button */}
      <div className="relative inline-flex mt-2 mb-12">
        <motion.button
          type="button"
          onClick={handleOpenGift}
          disabled={phase !== 'idle'}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="relative z-10 min-h-[48px] px-8 py-3.5 rounded-full font-medium text-sm sm:text-base text-white bg-gradient-to-r from-[#FF4FCB] via-[#E03BB8] to-[#9D4EDD] border border-[#FFB6E6]/45 shadow-[0_0_30px_rgba(255,79,203,0.5)] hover:shadow-[0_0_40px_rgba(255,79,203,0.75)] transition-shadow whitespace-nowrap cursor-pointer disabled:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD780]"
        >
          {phase === 'idle' ? 'Click to Open 🎁' : 'Opening Your Surprise... ✨'}
        </motion.button>

        <GuidedPointer
          visible={showPointer && phase === 'idle'}
          tooltip="Click here to open your surprise! 💗"
          shape="pill"
          placement="bottom"
        />
      </div>
    </section>
  );
};
