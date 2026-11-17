import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { GuidedPointer } from './GuidedPointer';

interface MessageSectionProps {
  onContinueToWishes?: () => void;
  showNextPointer?: boolean;
}

export const MessageSection: React.FC<MessageSectionProps> = ({
  onContinueToWishes,
  showNextPointer = false,
}) => {
  return (
    <section
      id="message"
      className="relative z-20 scroll-mt-20 flex flex-col items-center justify-center px-4 py-16 sm:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl mx-auto"
      >
        {/* Ambient pink glow behind card */}
        <div
          className="pointer-events-none absolute -inset-4 rounded-[2.5rem] blur-3xl opacity-35"
          style={{
            background:
              'radial-gradient(circle at 30% 50%, rgba(255,79,203,0.45), rgba(185,154,255,0.2), transparent 75%)',
          }}
          aria-hidden="true"
        />

        {/* Glassmorphism Card with overlapping Polaroid Flower Photo */}
        <div className="relative glass-purple rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_24px_70px_rgba(16,9,31,0.85)]">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
            {/* Left Polaroid Floral Frame */}
            <motion.div
              whileHover={{ rotate: -1, scale: 1.02 }}
              transition={{ duration: 0.25 }}
              className="relative shrink-0 w-56 sm:w-64 md:w-72 -rotate-2 md:-rotate-3 bg-[#FFF8FC] p-3.5 pb-10 rounded-xl shadow-[0_18px_40px_rgba(0,0,0,0.45)] border border-white/80"
            >
              <div className="relative aspect-[4/4.2] w-full overflow-hidden rounded-lg bg-[#2A193D]">
                {/* Crisp botanical illustration of pink daisy flowers in soft sunlight */}
                <svg
                  viewBox="0 0 260 270"
                  className="w-full h-full object-cover"
                  role="img"
                  aria-label="Bouquet of blooming pink daisy flowers"
                >
                  <defs>
                    <linearGradient id="bgPhoto" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B2945" />
                      <stop offset="55%" stopColor="#261B30" />
                      <stop offset="100%" stopColor="#1B1222" />
                    </linearGradient>
                    <radialGradient id="sunBokeh" cx="30%" cy="25%" r="60%">
                      <stop offset="0%" stopColor="#FFD780" stopOpacity="0.4" />
                      <stop offset="50%" stopColor="#FFB6E6" stopOpacity="0.16" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                    <linearGradient id="petalLight" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFE5F4" />
                      <stop offset="55%" stopColor="#FFB6E6" />
                      <stop offset="100%" stopColor="#E669B6" />
                    </linearGradient>
                    <linearGradient id="petalDeep" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFD1EC" />
                      <stop offset="100%" stopColor="#C94C9A" />
                    </linearGradient>
                  </defs>

                  <rect width="260" height="270" fill="url(#bgPhoto)" />
                  <circle cx="72" cy="64" r="90" fill="url(#sunBokeh)" />
                  <circle cx="200" cy="45" r="24" fill="#FFE6F5" fillOpacity="0.1" />
                  <circle cx="52" cy="130" r="18" fill="#FFD780" fillOpacity="0.1" />

                  {/* Stems & foliage */}
                  <path d="M130 270 Q124 200 105 145" stroke="#537A5A" strokeWidth="5" fill="none" strokeLinecap="round" />
                  <path d="M132 270 Q138 195 162 135" stroke="#476D4E" strokeWidth="5" fill="none" strokeLinecap="round" />
                  <path d="M128 270 Q128 190 128 100" stroke="#628B69" strokeWidth="5.5" fill="none" strokeLinecap="round" />
                  <path d="M134 270 Q154 220 185 182" stroke="#4E7555" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                  <path d="M126 270 Q100 225 76 184" stroke="#4E7555" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                  <ellipse cx="105" cy="212" rx="18" ry="8" transform="rotate(-35 105 212)" fill="#4A7052" />
                  <ellipse cx="158" cy="206" rx="18" ry="8" transform="rotate(32 158 206)" fill="#588060" />

                  {/* Helper macro for daisies */}
                  {[
                    { cx: 128, cy: 96, scale: 1.02 },
                    { cx: 78, cy: 146, scale: 0.84 },
                    { cx: 174, cy: 132, scale: 0.9 },
                    { cx: 118, cy: 162, scale: 0.88 },
                    { cx: 176, cy: 184, scale: 0.72 },
                  ].map((flower, fIdx) => (
                    <g
                      key={fIdx}
                      transform={`translate(${flower.cx}, ${flower.cy}) scale(${flower.scale})`}
                    >
                      {Array.from({ length: 14 }).map((_, pIdx) => (
                        <ellipse
                          key={pIdx}
                          cx="0"
                          cy="-24"
                          rx="6.2"
                          ry="16"
                          transform={`rotate(${(360 / 14) * pIdx})`}
                          fill={pIdx % 2 === 0 ? 'url(#petalLight)' : 'url(#petalDeep)'}
                          stroke="rgba(255,255,255,0.28)"
                          strokeWidth="0.6"
                        />
                      ))}
                      <circle cx="0" cy="0" r="10.5" fill="#F4A236" />
                      <circle cx="0" cy="0" r="7" fill="#FFD166" />
                      <circle cx="-2" cy="-2" r="2.2" fill="#FFF3B0" />
                    </g>
                  ))}
                </svg>
              </div>

              {/* Pink glowing heart sticker on Polaroid corner */}
              <div
                className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-[#24103F] border border-[#FFB6E6]/60 flex items-center justify-center shadow-[0_0_20px_rgba(255,79,203,0.65)]"
                aria-hidden="true"
              >
                <span className="text-lg">💗</span>
              </div>
            </motion.div>

            {/* Right Birthday Message */}
            <div className="flex-1 text-left">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight text-balance">
                A Birthday Message For You <span aria-hidden="true">💌</span>
              </h2>

              <div className="mt-5 space-y-4 text-sm sm:text-base md:text-[1.06rem] leading-relaxed text-[#FFF3FA]/92">
                <p className="font-semibold text-[#FFB6E6] text-base sm:text-lg">
                  Happy Birthday, Shiney! <span aria-hidden="true">🎉</span>
                </p>
                <p>
                  Wishing you a day full of happiness, laughter and beautiful memories.
                </p>
                <p>
                  May all your dreams come true and you keep shining brighter every day!
                </p>
                <p className="font-medium text-white">
                  Keep Smiling and Enjoy Your Special Day! <span aria-hidden="true">💗</span>
                </p>
              </div>

              {/* Delicate glowing heart flourish line + gentle next step */}
              <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-[#FFB6E6]/70 flex-1 min-w-[120px]" aria-hidden="true">
                  <span className="h-px flex-1 bg-gradient-to-r from-[#FF4FCB]/70 via-[#FFB6E6]/40 to-transparent" />
                  <span className="text-sm text-[#FF4FCB] neon-pink-text">♡</span>
                  <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#FFB6E6]/40" />
                </div>

                {onContinueToWishes && (
                  <div className="relative inline-flex">
                    <motion.button
                      type="button"
                      onClick={onContinueToWishes}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="relative z-10 inline-flex items-center gap-2 min-h-[44px] px-5 py-2 rounded-full text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-[#FF4FCB]/85 to-[#9D4EDD]/85 border border-[#FFB6E6]/45 shadow-[0_0_20px_rgba(255,79,203,0.35)] hover:shadow-[0_0_28px_rgba(255,79,203,0.6)] transition-shadow whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD780]"
                    >
                      <span>Make a Wish Next 💗</span>
                      <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                    </motion.button>

                    <GuidedPointer
                      visible={showNextPointer}
                      tooltip="Click here next! 💗"
                      shape="pill"
                      align="end"
                      placement="bottom"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
