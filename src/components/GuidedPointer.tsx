import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

export type GuideStep =
  | 'open-gift'
  | 'run-surprise'
  | 'cut-cake'
  | 'make-wish'
  | 'play-music'
  | 'done';

interface GuidedPointerProps {
  visible: boolean;
  tooltip: string;
  shape?: 'pill' | 'circle';
  align?: 'center' | 'start' | 'end';
  placement?: 'bottom' | 'top';
}

export const GuidedPointer: React.FC<GuidedPointerProps> = ({
  visible,
  tooltip,
  shape = 'pill',
  align = 'center',
  placement = 'bottom',
}) => {
  const reducedMotion = Boolean(useReducedMotion());

  const alignClasses =
    align === 'start'
      ? 'left-0 sm:left-1/2 sm:-translate-x-1/2 items-start sm:items-center'
      : align === 'end'
      ? 'right-0 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 items-end sm:items-center'
      : 'left-1/2 -translate-x-1/2 items-center';

  const placementClasses =
    placement === 'top' ? 'bottom-full mb-2.5 flex-col-reverse' : 'top-full mt-2 flex-col';

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Subtle pulsing glow ring around the target button */}
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={
              reducedMotion
                ? { opacity: 0.7 }
                : {
                    opacity: [0.45, 0.9, 0.45],
                    scale: [1, 1.07, 1],
                  }
            }
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className={`pointer-events-none absolute -inset-1.5 z-0 ${
              shape === 'circle' ? 'rounded-full' : 'rounded-full'
            } border-2 border-[#FFB6E6]/75 shadow-[0_0_24px_rgba(255,79,203,0.65)]`}
          />

          {/* Cute bouncing hand pointer + floating tooltip */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, y: placement === 'top' ? 6 : -6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.18 } }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`pointer-events-none select-none absolute z-30 flex ${alignClasses} ${placementClasses}`}
          >
            {/* Bouncing pointing hand */}
            <motion.span
              animate={
                reducedMotion
                  ? undefined
                  : {
                      y: [0, -7, 0],
                    }
              }
              transition={{ duration: 1.05, repeat: Infinity, ease: 'easeInOut' }}
              className="text-2xl sm:text-[1.65rem] leading-none drop-shadow-[0_0_14px_rgba(255,79,203,0.95)]"
            >
              👆
            </motion.span>

            {/* Small friendly tooltip */}
            <div className="mt-1.5 px-3 py-1.5 rounded-xl bg-[#24103F]/95 backdrop-blur-md border border-[#FFB6E6]/45 shadow-[0_8px_24px_rgba(16,9,31,0.8),0_0_18px_rgba(255,79,203,0.3)] text-[11px] sm:text-xs font-medium text-white whitespace-nowrap">
              {tooltip}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
