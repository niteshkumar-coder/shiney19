import React from 'react';
import { motion } from 'motion/react';
import { Gift } from 'lucide-react';

interface LoadingScreenProps {
  onSkip?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onSkip }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45 } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#10091F] px-6 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex items-center justify-center mb-6">
        <div
          className="absolute w-28 h-28 rounded-full blur-2xl opacity-70"
          style={{
            background: 'radial-gradient(circle, rgba(255,79,203,0.65) 0%, rgba(185,154,255,0.2) 70%, transparent 100%)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-[#24103F]/90 border border-[#FFB6E6]/35 shadow-[0_0_35px_rgba(255,79,203,0.45)]"
        >
          <Gift className="w-10 h-10 text-[#FFD780]" strokeWidth={1.75} />
        </motion.div>
      </div>

      <p className="font-display text-xl sm:text-2xl text-white tracking-wide">
        Unwrapping Shiney&apos;s Surprise...
      </p>
      <p className="mt-2 text-sm text-[#FFB6E6]/80">
        Lighting the candles and preparing fireworks
      </p>

      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="mt-8 min-h-[44px] px-5 py-2 text-xs font-medium text-[#B99AFF] hover:text-white underline underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4FCB] rounded-lg"
        >
          Enter Now
        </button>
      )}
    </motion.div>
  );
};
