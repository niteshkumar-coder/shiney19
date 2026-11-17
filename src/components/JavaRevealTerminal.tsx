import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, CheckCircle2, Sparkles, Maximize2, Minimize2, X } from 'lucide-react';

interface JavaRevealTerminalProps {
  onRunSurprise: () => void;
  onCancelToHome: () => void;
  reducedMotion: boolean;
}

const JAVA_SOURCE_CODE = `public class BirthdaySurprise {

    public static void main(String[] args) {

        System.out.println("Initializing Surprise...");

        String name = "Shiney";

        System.out.println("Loading Happiness...");
        System.out.println("Preparing Birthday Cake...");
        System.out.println("Launching Fireworks...");

        celebrate(name);
    }

    public static void celebrate(String name) {

        System.out.println("Happy Birthday " + name + "!");

    }
}`;

const TERMINAL_LOGS = [
  '[01] Initializing Birthday System...',
  '[02] Loading Java Libraries...',
  '[03] Compiling BirthdaySurprise.java...',
  '[04] Preparing Happiness...',
  '[05] Loading 19 Years of Memories...',
  '[06] Preparing Birthday Cake...',
  '[07] Connecting Fireworks Engine...',
  '[08] Birthday Surprise Ready!',
];

function highlightJavaLine(line: string): React.ReactNode {
  if (!line.trim()) return '\u00A0';

  // Simple token highlighting for crisp IDE readability
  const tokenRegex =
    /(".*?"|\b(?:public|class|static|void|String)\b|\b(?:System|out|println|main|celebrate|BirthdaySurprise)\b)/g;
  const parts = line.split(tokenRegex);

  return parts.map((part, idx) => {
    if (!part) return null;
    if (part.startsWith('"') && part.endsWith('"')) {
      return (
        <span key={idx} className="text-[#FFD780]">
          {part}
        </span>
      );
    }
    if (/^(public|class|static|void|String)$/.test(part)) {
      return (
        <span key={idx} className="text-[#FF4FCB] font-medium">
          {part}
        </span>
      );
    }
    if (/^(System|out|println|main|celebrate|BirthdaySurprise)$/.test(part)) {
      return (
        <span key={idx} className="text-[#B99AFF]">
          {part}
        </span>
      );
    }
    return (
      <span key={idx} className="text-[#4ADE80]">
        {part}
      </span>
    );
  });
}

export const JavaRevealTerminal: React.FC<JavaRevealTerminalProps> = ({
  onRunSurprise,
  onCancelToHome,
  reducedMotion,
}) => {
  const [typedLength, setTypedLength] = useState(0);
  const [visibleLogCount, setVisibleLogCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isZoomingOut, setIsZoomingOut] = useState(false);

  const codeScrollRef = useRef<HTMLDivElement | null>(null);
  const logsScrollRef = useRef<HTMLDivElement | null>(null);

  const totalChars = JAVA_SOURCE_CODE.length;
  const isComplete = progress >= 100 && visibleLogCount >= TERMINAL_LOGS.length;

  // Stage 1: Real state-driven progressive Java typing animation
  useEffect(() => {
    if (reducedMotion) {
      setTypedLength(totalChars);
      setVisibleLogCount(TERMINAL_LOGS.length);
      setProgress(100);
      return;
    }

    if (typedLength >= totalChars) return;

    const timer = window.setTimeout(() => {
      setTypedLength((prev) => Math.min(totalChars, prev + 3));
    }, 18);

    return () => window.clearTimeout(timer);
  }, [typedLength, totalChars, reducedMotion]);

  // Stage 2: Smooth state-driven progress bar (0% -> 100%)
  useEffect(() => {
    if (reducedMotion) return;
    if (progress >= 100) return;

    const timer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        const step = prev < 70 ? 2 : 1;
        return Math.min(100, prev + step);
      });
    }, 65);

    return () => window.clearInterval(timer);
  }, [progress, reducedMotion]);

  // Stage 3: Sequential terminal log messages tied to progress milestones
  useEffect(() => {
    if (reducedMotion) return;
    const targetLogs = Math.min(
      TERMINAL_LOGS.length,
      Math.floor((progress / 100) * TERMINAL_LOGS.length) + (progress > 4 ? 1 : 0)
    );
    if (targetLogs > visibleLogCount) {
      const delay = window.setTimeout(() => {
        setVisibleLogCount((c) => Math.min(TERMINAL_LOGS.length, c + 1));
      }, 140);
      return () => window.clearTimeout(delay);
    }
  }, [progress, visibleLogCount, reducedMotion]);

  // Auto-scroll code and log containers as new content types out
  useEffect(() => {
    if (codeScrollRef.current) {
      codeScrollRef.current.scrollTop = codeScrollRef.current.scrollHeight;
    }
  }, [typedLength]);

  useEffect(() => {
    if (logsScrollRef.current) {
      logsScrollRef.current.scrollTop = logsScrollRef.current.scrollHeight;
    }
  }, [visibleLogCount, isComplete]);

  const displayedLines = useMemo(() => {
    return JAVA_SOURCE_CODE.slice(0, typedLength).split('\n');
  }, [typedLength]);

  const handleRunClick = () => {
    if (isZoomingOut) return;
    setIsZoomingOut(true);
    window.setTimeout(() => {
      onRunSurprise();
    }, reducedMotion ? 100 : 480);
  };

  const statusItems = [
    { label: 'Java Compiler', value: progress >= 38 ? 'Ready' : 'Compiling...', ready: progress >= 38 },
    { label: 'Birthday Engine', value: progress >= 65 ? 'Ready' : 'Loading...', ready: progress >= 65 },
    { label: 'Fireworks System', value: progress >= 85 ? 'Ready' : 'Connecting...', ready: progress >= 85 },
    { label: 'Happiness Module', value: progress >= 52 ? 'Loaded' : 'Initializing...', ready: progress >= 52 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={
        isZoomingOut
          ? { opacity: 0, scale: 1.12, filter: 'blur(8px)' }
          : { opacity: 1, scale: 1, filter: 'blur(0px)' }
      }
      transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#060813]/95 backdrop-blur-xl p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="java-terminal-title"
    >
      {/* Subtle purple-pink ambient terminal glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-45"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(255,79,203,0.18), transparent 45%), radial-gradient(circle at 80% 80%, rgba(185,154,255,0.16), transparent 50%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        layout={!reducedMotion}
        initial={{ opacity: 0, scale: 0.92, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className={`relative z-10 w-full rounded-2xl border border-[#B99AFF]/30 bg-[#0A0F22]/95 shadow-[0_28px_90px_rgba(0,0,0,0.85),0_0_45px_rgba(255,79,203,0.18)] overflow-hidden flex flex-col ${
          isMaximized ? 'max-w-6xl min-h-[86dvh]' : 'max-w-5xl'
        }`}
        style={{ fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace' }}
      >
        {/* Terminal Top Bar with Window Controls */}
        <div className="flex items-center justify-between gap-3 px-3 sm:px-4 py-1.5 bg-[#0E152E] border-b border-white/10">
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={onCancelToHome}
              aria-label="Close terminal and return home"
              title="Close"
              className="group min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-[#FF5F56] text-[#10091F] transition-transform group-hover:scale-110">
                <X className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => setIsMinimized((m) => !m)}
              aria-label={isMinimized ? 'Expand terminal body' : 'Minimize terminal body'}
              title={isMinimized ? 'Expand' : 'Minimize'}
              className="group min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-[#FFBD2E] text-[#10091F] transition-transform group-hover:scale-110">
                <Minimize2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsMinimized(false);
                setIsMaximized((m) => !m);
              }}
              aria-label={isMaximized ? 'Restore terminal size' : 'Maximize terminal'}
              title={isMaximized ? 'Restore' : 'Maximize'}
              className="group min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-[#27C93F] text-[#10091F] transition-transform group-hover:scale-110">
                <Maximize2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#FFB6E6] truncate">
            <Terminal className="w-4 h-4 text-[#FF4FCB] shrink-0" aria-hidden="true" />
            <span id="java-terminal-title" className="truncate font-medium">
              BirthdaySurprise.java — Celebration IDE
            </span>
          </div>

          <span className="hidden sm:inline-block text-[11px] text-[#B99AFF]/75 whitespace-nowrap">
            Visual Simulation
          </span>
        </div>

        {/* Terminal Body */}
        {!isMinimized && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {/* Left Pane: Java Source Code Typing */}
            <div className="lg:col-span-7 flex flex-col bg-[#080C1B]">
              <div className="flex items-center justify-between px-4 py-2 bg-[#0D132B]/70 border-b border-white/10 text-[11px] text-[#B99AFF]">
                <span>src / BirthdaySurprise.java</span>
                <span className="text-[#4ADE80]">
                  {typedLength < totalChars ? 'Typing...' : 'Source Ready'}
                </span>
              </div>

              <div
                ref={codeScrollRef}
                className="p-4 sm:p-5 text-xs sm:text-[13px] leading-6 overflow-y-auto max-h-[240px] sm:max-h-[320px] lg:max-h-[380px] text-left"
              >
                {displayedLines.map((line, idx) => {
                  const isLastLine = idx === displayedLines.length - 1;
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="w-6 shrink-0 select-none text-right text-white/25 tabular-nums">
                        {idx + 1}
                      </span>
                      <pre className="whitespace-pre-wrap break-words [font-family:inherit] flex-1">
                        {highlightJavaLine(line)}
                        {isLastLine && (
                          <span
                            className="inline-block w-2 h-4 ml-0.5 align-middle bg-[#4ADE80] animate-pulse"
                            aria-hidden="true"
                          />
                        )}
                      </pre>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Pane: Execution Console & Status */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-[#060916]">
              <div>
                <div className="flex items-center justify-between px-4 py-2 bg-[#0D132B]/70 border-b border-white/10 text-[11px] text-[#FFB6E6]">
                  <span>Console Output</span>
                  <span className="tabular-nums text-[#4ADE80]">{progress}%</span>
                </div>

                {/* Animated Console Logs */}
                <div
                  ref={logsScrollRef}
                  className="p-4 space-y-1.5 text-xs leading-relaxed overflow-y-auto max-h-[190px] sm:max-h-[220px] text-left"
                >
                  {TERMINAL_LOGS.slice(0, visibleLogCount).map((log, idx) => (
                    <motion.div
                      key={log}
                      initial={reducedMotion ? false : { opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.22 }}
                      className={
                        idx === TERMINAL_LOGS.length - 1
                          ? 'text-[#FFB6E6] font-semibold'
                          : 'text-[#4ADE80]'
                      }
                    >
                      {log}
                    </motion.div>
                  ))}

                  {!isComplete && (
                    <div className="text-[#4ADE80]/80 flex items-center gap-1 pt-1">
                      <span>&gt;</span>
                      <span className="inline-block w-2 h-3.5 bg-[#4ADE80] animate-pulse" />
                    </div>
                  )}
                </div>
              </div>

              {/* Status Indicators & Progress Bar */}
              <div className="p-4 border-t border-white/10 bg-[#0A0F24]/70 space-y-3.5">
                {/* 4 Terminal Status Indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-left">
                  {statusItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10"
                    >
                      <span className="text-white/75 truncate">{item.label}:</span>
                      <span
                        className={`font-semibold shrink-0 ${
                          item.ready ? 'text-[#4ADE80]' : 'text-[#FFD780]'
                        }`}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Live Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="text-[#B99AFF]">Execution Progress</span>
                    <span className="text-[#4ADE80] font-semibold tabular-nums">
                      {progress}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden border border-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#4ADE80] via-[#FF4FCB] to-[#B99AFF]"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.15, ease: 'linear' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compilation Success Footer & Action Button */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-[#FF4FCB]/35 bg-gradient-to-r from-[#120A2A] via-[#1B0D35] to-[#120A2A] px-4 py-5 sm:px-6 text-center"
            >
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold mb-4">
                <span className="inline-flex items-center gap-1.5 text-[#4ADE80]">
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  BUILD SUCCESSFUL ✓
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#B99AFF]">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  EXECUTION COMPLETED ✓
                </span>
                <span className="text-[#FFB6E6]">ACCESS GRANTED 💗</span>
              </div>

              <motion.button
                type="button"
                onClick={handleRunClick}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="min-h-[50px] px-8 py-3.5 rounded-full font-sans font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-[#FF4FCB] via-[#D946EF] to-[#8B5CF6] border border-[#FFB6E6]/55 shadow-[0_0_32px_rgba(255,79,203,0.6)] hover:shadow-[0_0_46px_rgba(255,79,203,0.85)] transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD780]"
              >
                RUN BIRTHDAY SURPRISE 🎉
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
