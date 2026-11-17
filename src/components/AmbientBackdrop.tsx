import React from 'react';

interface BalloonProps {
  className?: string;
  colorFrom: string;
  colorTo: string;
  delay?: string;
  sizeClass?: string;
}

const Balloon: React.FC<BalloonProps> = ({
  className = '',
  colorFrom,
  colorTo,
  delay = '0s',
  sizeClass = 'w-14 h-20 sm:w-20 sm:h-28',
}) => (
  <div
    className={`pointer-events-none select-none animate-balloon ${className}`}
    style={{ animationDelay: delay }}
    aria-hidden="true"
  >
    <svg viewBox="0 0 80 120" className={sizeClass} fill="none">
      <defs>
        <radialGradient id={`grad-${colorFrom.replace('#', '')}`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="28%" stopColor={colorFrom} stopOpacity="0.95" />
          <stop offset="100%" stopColor={colorTo} stopOpacity="0.9" />
        </radialGradient>
      </defs>
      <ellipse
        cx="40"
        cy="42"
        rx="28"
        ry="34"
        fill={`url(#grad-${colorFrom.replace('#', '')})`}
      />
      <ellipse cx="29" cy="27" rx="6" ry="11" transform="rotate(-18 29 27)" fill="white" fillOpacity="0.32" />
      <path d="M36 75 L44 75 L40 81 Z" fill={colorTo} />
      <path
        d="M40 81 Q34 94 42 106 Q46 113 38 120"
        stroke="rgba(255, 215, 128, 0.45)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

const FAIRY_BULBS = [
  { left: '4%', top: '16px', delay: '0s' },
  { left: '12%', top: '34px', delay: '0.5s' },
  { left: '21%', top: '42px', delay: '1.1s' },
  { left: '31%', top: '32px', delay: '0.3s' },
  { left: '41%', top: '18px', delay: '1.4s' },
  { left: '52%', top: '28px', delay: '0.8s' },
  { left: '63%', top: '40px', delay: '0.2s' },
  { left: '74%', top: '34px', delay: '1.2s' },
  { left: '84%', top: '22px', delay: '0.6s' },
  { left: '94%', top: '14px', delay: '1.5s' },
];

export const AmbientBackdrop: React.FC<{ showHearts?: boolean }> = ({ showHearts = false }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Luxury deep purple atmospheric gradients */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[520px] rounded-full opacity-45 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(255,79,203,0.22) 0%, rgba(185,154,255,0.12) 45%, transparent 72%)',
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 opacity-40 blur-3xl"
        style={{
          background: 'radial-gradient(ellipse at bottom, rgba(255,79,203,0.28) 0%, rgba(36,16,63,0.25) 55%, transparent 80%)',
        }}
      />

      {/* Moving glowing "Happy Birthday Shiney" background streams */}
      <div className="absolute inset-0 flex flex-col justify-evenly py-20 select-none overflow-hidden">
        {[
          { direction: 'animate-marquee-left', color: 'text-[#FFB6E6]/20', size: 'text-2xl sm:text-4xl' },
          { direction: 'animate-marquee-right', color: 'text-[#FF4FCB]/18', size: 'text-3xl sm:text-5xl' },
          { direction: 'animate-marquee-left', color: 'text-[#FFD780]/16', size: 'text-2xl sm:text-4xl' },
        ].map((row, rowIdx) => (
          <div key={rowIdx} className="w-full overflow-hidden -rotate-3">
            <div className={`flex w-max ${row.direction}`}>
              {[0, 1].map((dup) => (
                <div key={dup} className="flex shrink-0 items-center gap-10 sm:gap-16 pr-10 sm:pr-16">
                  {Array.from({ length: 4 }).map((_, itemIdx) => (
                    <span
                      key={itemIdx}
                      className={`font-script font-bold whitespace-nowrap tracking-wide ${row.size} ${row.color}`}
                      style={{
                        textShadow: '0 0 18px rgba(255, 79, 203, 0.25)',
                      }}
                    >
                      Happy Birthday Shiney 💗 ✨
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Top warm fairy lights */}
      <div className="absolute top-12 left-0 right-0 h-20 opacity-85">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 80">
          <path
            d="M 0 12 Q 250 64 500 20 Q 780 68 1200 10"
            fill="none"
            stroke="rgba(255, 215, 128, 0.28)"
            strokeWidth="1.5"
          />
        </svg>
        {FAIRY_BULBS.map((bulb, index) => (
          <span
            key={index}
            className="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full animate-fairy"
            style={{
              left: bulb.left,
              top: bulb.top,
              animationDelay: bulb.delay,
              background: 'radial-gradient(circle, #FFF7DB 20%, #FFD780 70%, rgba(255,215,128,0) 100%)',
              boxShadow: '0 0 14px 4px rgba(255, 215, 128, 0.65)',
            }}
          />
        ))}
      </div>

      {/* Floating ambient balloons on side edges */}
      <Balloon
        className="absolute left-1 sm:left-8 top-32 opacity-75"
        colorFrom="#FFB6E6"
        colorTo="#9D4EDD"
        delay="0s"
      />
      <Balloon
        className="hidden sm:block absolute left-16 top-56 opacity-60"
        colorFrom="#D9BBFF"
        colorTo="#6C2BD9"
        delay="1.8s"
        sizeClass="w-16 h-24"
      />
      <Balloon
        className="absolute right-1 sm:right-8 top-28 opacity-75"
        colorFrom="#D4A5FF"
        colorTo="#7B2CBF"
        delay="1.1s"
      />
      <Balloon
        className="hidden sm:block absolute right-16 top-56 opacity-65"
        colorFrom="#FF85DC"
        colorTo="#B5179E"
        delay="2.4s"
        sizeClass="w-16 h-24"
      />

      {/* Rising glowing hearts & floating balloons from bottom during celebration */}
      {showHearts && (
        <div className="absolute inset-0">
          {[14, 28, 48, 72, 86].map((leftPct, idx) => (
            <span
              key={leftPct}
              className="absolute bottom-12 text-[#FF4FCB]/55 text-lg sm:text-xl animate-heart-rise"
              style={{
                left: `${leftPct}%`,
                animationDelay: `${idx * 0.95}s`,
                textShadow: '0 0 12px rgba(255,79,203,0.8)',
              }}
            >
              💗
            </span>
          ))}

          {[
            { left: '8%', delay: '0s', from: '#FF7AD9', to: '#9D4EDD' },
            { left: '24%', delay: '3.2s', from: '#FFD780', to: '#FF4FCB' },
            { left: '68%', delay: '1.6s', from: '#D9BBFF', to: '#6C2BD9' },
            { left: '88%', delay: '4.8s', from: '#FFB6E6', to: '#B5179E' },
          ].map((b, idx) => (
            <div
              key={idx}
              className="absolute -bottom-24 animate-balloon-rise opacity-70"
              style={{ left: b.left, animationDelay: b.delay }}
            >
              <svg viewBox="0 0 60 90" className="w-10 h-16 sm:w-14 sm:h-20" fill="none">
                <ellipse cx="30" cy="30" rx="20" ry="25" fill={b.from} fillOpacity="0.85" />
                <ellipse cx="22" cy="20" rx="4" ry="8" transform="rotate(-18 22 20)" fill="white" fillOpacity="0.3" />
                <path d="M27 55 L33 55 L30 59 Z" fill={b.to} />
                <path d="M30 59 Q26 70 31 82" stroke="rgba(255,215,128,0.5)" strokeWidth="1.2" />
              </svg>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
