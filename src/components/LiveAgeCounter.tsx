import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';

export interface BirthTimeConfig {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  hour: number; // 0-23 (IST)
  minute: number; // 0-59 (IST)
  second: number; // 0-59 (IST)
  timeZone: string;
}

export const DEFAULT_SHINEY_BIRTH_CONFIG: BirthTimeConfig = {
  year: 2007,
  month: 11,
  day: 18,
  hour: 0,
  minute: 0,
  second: 0,
  timeZone: 'Asia/Kolkata',
};

interface ElapsedAge {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  istClockLabel: string;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function pad3(n: number): string {
  return String(n).padStart(3, '0');
}

function getISTDateParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });

  const parts = formatter.formatToParts(date);
  const lookup = (type: Intl.DateTimeFormatPartTypes): number => {
    const found = parts.find((p) => p.type === type);
    return found ? Number(found.value) : 0;
  };

  return {
    year: lookup('year'),
    month: lookup('month'),
    day: lookup('day'),
    hour: lookup('hour'),
    minute: lookup('minute'),
    second: lookup('second'),
  };
}

function createISTDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number
): Date {
  // Handle Feb 29 leap-day births cleanly in non-leap years if config changes
  const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const adjustedDay = month === 2 && day === 29 && !isLeap(year) ? 28 : day;

  const iso = `${year}-${pad2(month)}-${pad2(adjustedDay)}T${pad2(hour)}:${pad2(
    minute
  )}:${pad2(second)}+05:30`;
  return new Date(iso);
}

export function calculateElapsedAgeIST(
  now: Date,
  config: BirthTimeConfig
): ElapsedAge {
  const istNow = getISTDateParts(now, config.timeZone);
  const nowMs = now.getTime();

  const anniversaryThisYear = createISTDate(
    istNow.year,
    config.month,
    config.day,
    config.hour,
    config.minute,
    config.second
  );

  let years = istNow.year - config.year;
  let lastAnniversary = anniversaryThisYear;

  if (nowMs < anniversaryThisYear.getTime()) {
    years -= 1;
    lastAnniversary = createISTDate(
      istNow.year - 1,
      config.month,
      config.day,
      config.hour,
      config.minute,
      config.second
    );
  }

  years = Math.max(0, years);
  const diffMs = Math.max(0, nowMs - lastAnniversary.getTime());

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const istDateFormatted = new Intl.DateTimeFormat('en-GB', {
    timeZone: config.timeZone,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(now);

  const istClockLabel = `${istDateFormatted} · ${pad2(istNow.hour)}:${pad2(
    istNow.minute
  )}:${pad2(istNow.second)} IST`;

  return {
    years,
    days,
    hours,
    minutes,
    seconds,
    istClockLabel,
  };
}

interface CounterCardProps {
  value: string;
  label: string;
  accent?: 'pink' | 'purple' | 'gold';
  reducedMotion: boolean;
  wide?: boolean;
}

const CounterCard: React.FC<CounterCardProps> = ({
  value,
  label,
  accent = 'pink',
  reducedMotion,
  wide = false,
}) => {
  const borderAccent =
    accent === 'gold'
      ? 'border-[#FFD780]/45 shadow-[0_14px_40px_rgba(255,215,128,0.22)]'
      : accent === 'purple'
      ? 'border-[#B99AFF]/40 shadow-[0_14px_40px_rgba(185,154,255,0.24)]'
      : 'border-[#FF4FCB]/45 shadow-[0_14px_42px_rgba(255,79,203,0.28)]';

  const valueColor =
    accent === 'gold'
      ? 'text-[#FFD780] neon-gold-text'
      : accent === 'purple'
      ? 'text-[#E9D8FF] drop-shadow-[0_0_16px_rgba(185,154,255,0.65)]'
      : 'text-[#FFB6E6] neon-pink-text';

  return (
    <motion.div
      whileHover={reducedMotion ? undefined : { y: -3, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-2xl glass-purple px-5 py-5 sm:px-7 sm:py-6 flex flex-col items-center justify-center ${borderAccent} ${
        wide ? 'col-span-2 max-w-xs sm:max-w-sm mx-auto w-full' : 'w-full'
      }`}
    >
      <div
        className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-28 h-20 rounded-full blur-2xl opacity-45"
        style={{
          background:
            accent === 'gold'
              ? 'rgba(255, 215, 128, 0.45)'
              : accent === 'purple'
              ? 'rgba(185, 154, 255, 0.45)'
              : 'rgba(255, 79, 203, 0.45)',
        }}
        aria-hidden="true"
      />

      <div className="relative h-12 sm:h-16 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={reducedMotion ? false : { y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reducedMotion ? undefined : { y: -14, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`font-display text-4xl sm:text-5xl font-bold tracking-tight tabular-nums ${valueColor}`}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>

      <span className="mt-1.5 text-xs sm:text-sm font-medium tracking-[0.18em] uppercase text-white/80">
        {label}
      </span>
    </motion.div>
  );
};

interface LiveAgeCounterProps {
  birthConfig?: BirthTimeConfig;
}

export const LiveAgeCounter: React.FC<LiveAgeCounterProps> = ({
  birthConfig = DEFAULT_SHINEY_BIRTH_CONFIG,
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [age, setAge] = useState<ElapsedAge>(() =>
    calculateElapsedAgeIST(new Date(), birthConfig)
  );

  useEffect(() => {
    const update = () => {
      setAge(calculateElapsedAgeIST(new Date(), birthConfig));
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [birthConfig]);

  return (
    <section
      id="journey"
      aria-labelledby="journey-heading"
      className="relative z-20 scroll-mt-20 px-4 py-16 sm:py-22 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-2xl"
      >
        {/* Subtle floating hearts and sparkles */}
        {!prefersReducedMotion && (
          <div className="pointer-events-none select-none" aria-hidden="true">
            <motion.div
              animate={{ y: [0, -10, 0], opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 left-2 sm:left-8 text-[#FF4FCB]"
            >
              <Heart className="w-5 h-5 fill-[#FF4FCB]/50" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -12, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
              className="absolute top-6 right-2 sm:right-6 text-[#FFD780]"
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -8, 0], opacity: [0.45, 0.9, 0.45] }}
              transition={{ duration: 4.1, repeat: Infinity, ease: 'easeInOut', delay: 1.3 }}
              className="hidden sm:block absolute bottom-12 -left-6 text-[#FFB6E6]"
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0], opacity: [0.45, 0.9, 0.45] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
              className="hidden sm:block absolute bottom-16 -right-6 text-[#FF4FCB]"
            >
              <Heart className="w-4 h-4 fill-[#FF4FCB]/40" />
            </motion.div>
          </div>
        )}

        {/* Section Header */}
        <h2
          id="journey-heading"
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white text-balance"
        >
          Shiney&apos;s Beautiful Journey <span aria-hidden="true">💗</span>
        </h2>

        <p className="mt-3 text-sm sm:text-base text-[#FFB6E6]/90 max-w-md mx-auto">
          Every second is a beautiful part of your story.
        </p>

        {/* Clean unboxed metadata */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs text-[#B99AFF]/85 tabular-nums">
          <span>Born 18 Nov 2007</span>
          <span aria-hidden="true">·</span>
          <span>19th Birthday 18 Nov 2026</span>
          <span aria-hidden="true">·</span>
          <span>{age.istClockLabel}</span>
        </div>

        {/* 5 Animated Live Age Counter Cards */}
        <div
          className="mt-8 sm:mt-10 grid grid-cols-2 gap-3.5 sm:gap-5"
          role="timer"
          aria-live="off"
          aria-label={`${age.years} years, ${age.days} days, ${age.hours} hours, ${age.minutes} minutes, ${age.seconds} seconds`}
        >
          <CounterCard
            value={pad2(age.years)}
            label="Years"
            accent="pink"
            reducedMotion={prefersReducedMotion}
          />
          <CounterCard
            value={pad3(age.days)}
            label="Days"
            accent="purple"
            reducedMotion={prefersReducedMotion}
          />
          <CounterCard
            value={pad2(age.hours)}
            label="Hours"
            accent="purple"
            reducedMotion={prefersReducedMotion}
          />
          <CounterCard
            value={pad2(age.minutes)}
            label="Minutes"
            accent="pink"
            reducedMotion={prefersReducedMotion}
          />
          <CounterCard
            value={pad2(age.seconds)}
            label="Seconds"
            accent="gold"
            reducedMotion={prefersReducedMotion}
            wide
          />
        </div>

        {/* Journey Footer */}
        <p className="mt-8 font-display text-base sm:text-lg italic text-[#FFD780]/95 neon-gold-text">
          19 Years of Smiles, Dreams &amp; Beautiful Memories ✨
        </p>
      </motion.div>
    </section>
  );
};
