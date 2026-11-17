import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { Navbar, type NavDestination } from './components/Navbar';
import { LoadingScreen } from './components/LoadingScreen';
import { AmbientBackdrop } from './components/AmbientBackdrop';
import { FireworksCanvas, type FireworksCanvasHandle } from './components/FireworksCanvas';
import { WelcomeScreen } from './components/WelcomeScreen';
import { JavaRevealTerminal } from './components/JavaRevealTerminal';
import { CelebrationSection } from './components/CelebrationSection';
import { LiveAgeCounter } from './components/LiveAgeCounter';
import { InteractiveZone } from './components/InteractiveZone';
import { MessageSection } from './components/MessageSection';
import { FloatingControls } from './components/FloatingControls';
import { type GuideStep } from './components/GuidedPointer';
import { birthdayAudio } from './utils/birthdayAudio';

type ExperienceStage = 'welcome' | 'terminal' | 'celebrating';

export default function App() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [isLoading, setIsLoading] = useState(true);
  const [stage, setStage] = useState<ExperienceStage>('welcome');
  const [showLightFlash, setShowLightFlash] = useState(false);
  const [activeNav, setActiveNav] = useState<NavDestination>('home');
  const [cakeCut, setCakeCut] = useState(false);
  const [welcomeKey, setWelcomeKey] = useState(0);
  const [guideStep, setGuideStep] = useState<GuideStep>('open-gift');

  const [audioState, setAudioState] = useState(() => birthdayAudio.getState());
  const canvasRef = useRef<FireworksCanvasHandle | null>(null);

  // Section refs for intelligent smooth scrolling
  const celebrationRef = useRef<HTMLDivElement | null>(null);
  const ageCounterRef = useRef<HTMLDivElement | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const interactiveRef = useRef<HTMLDivElement | null>(null);

  // Prevent overlapping scroll animations and stale guide transitions
  const pendingScrollTimerRef = useRef<number | null>(null);
  const pendingGuideTimerRef = useRef<number | null>(null);
  const userInteractedScrollRef = useRef(false);

  const isCelebrating = stage === 'celebrating';

  const clearPendingScroll = useCallback(() => {
    if (pendingScrollTimerRef.current !== null) {
      window.clearTimeout(pendingScrollTimerRef.current);
      pendingScrollTimerRef.current = null;
    }
  }, []);

  const clearPendingGuide = useCallback(() => {
    if (pendingGuideTimerRef.current !== null) {
      window.clearTimeout(pendingGuideTimerRef.current);
      pendingGuideTimerRef.current = null;
    }
  }, []);

  const scheduleGuideAdvance = useCallback(
    (nextStep: GuideStep, delayMs: number) => {
      clearPendingGuide();
      pendingGuideTimerRef.current = window.setTimeout(() => {
        pendingGuideTimerRef.current = null;
        setGuideStep(nextStep);
      }, prefersReducedMotion ? 100 : delayMs);
    },
    [clearPendingGuide, prefersReducedMotion]
  );

  const scrollToRefCenter = useCallback(
    (targetRef: RefObject<HTMLDivElement | null>) => {
      const el = targetRef.current;
      if (!el) return;
      el.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'center',
      });
    },
    [prefersReducedMotion]
  );

  const scheduleAutoScroll = useCallback(
    (targetRef: RefObject<HTMLDivElement | null>, delayMs: number) => {
      clearPendingScroll();
      userInteractedScrollRef.current = false;

      pendingScrollTimerRef.current = window.setTimeout(() => {
        pendingScrollTimerRef.current = null;
        if (userInteractedScrollRef.current) return;
        scrollToRefCenter(targetRef);
      }, prefersReducedMotion ? 120 : delayMs);
    },
    [clearPendingScroll, prefersReducedMotion, scrollToRefCenter]
  );

  useEffect(() => {
    const unsubscribe = birthdayAudio.subscribe(setAudioState);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setIsLoading(false),
      prefersReducedMotion ? 250 : 850
    );
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion]);

  // Cancel pending automatic scroll if the visitor manually scrolls elsewhere
  useEffect(() => {
    const cancelOnManualScroll = () => {
      userInteractedScrollRef.current = true;
      clearPendingScroll();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
        cancelOnManualScroll();
      }
    };

    window.addEventListener('wheel', cancelOnManualScroll, { passive: true });
    window.addEventListener('touchmove', cancelOnManualScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown, { passive: true });

    return () => {
      window.removeEventListener('wheel', cancelOnManualScroll);
      window.removeEventListener('touchmove', cancelOnManualScroll);
      window.removeEventListener('keydown', handleKeyDown);
      clearPendingScroll();
      clearPendingGuide();
    };
  }, [clearPendingScroll, clearPendingGuide]);

  // Advance pointer from Birthday Message to Make a Wish if visitor scrolls manually into Interactive Zone
  useEffect(() => {
    if (!isCelebrating || guideStep !== 'read-message') return;
    const target = interactiveRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setGuideStep('make-wish');
        }
      },
      { threshold: 0.45 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isCelebrating, guideStep]);

  // Step 1 -> Step 2: Gift box opened -> glowing flash -> Java Code Terminal
  const handleGiftOpenComplete = () => {
    clearPendingScroll();
    setGuideStep('run-surprise');
    if (!prefersReducedMotion) {
      setShowLightFlash(true);
      window.setTimeout(() => {
        setStage('terminal');
      }, 240);
      window.setTimeout(() => {
        setShowLightFlash(false);
      }, 650);
    } else {
      setStage('terminal');
    }
  };

  // Step 3 -> Step 4: RUN BIRTHDAY SURPRISE clicked -> Birthday Celebration centered + guide to cake
  const handleRunSurpriseFromTerminal = () => {
    clearPendingScroll();
    setStage('celebrating');
    setActiveNav('surprise');
    setGuideStep('celebration-cake');
    birthdayAudio.playSparkleChime();
    canvasRef.current?.launchFireworks(8);
    canvasRef.current?.burstConfetti(0.5, 0.42, 110);

    window.requestAnimationFrame(() => {
      scrollToRefCenter(celebrationRef);
    });
  };

  const handleNavigate = (destination: NavDestination) => {
    clearPendingScroll();
    clearPendingGuide();
    setActiveNav(destination);

    if (destination === 'home') {
      setStage('welcome');
      setCakeCut(false);
      setGuideStep('open-gift');
      setWelcomeKey((k) => k + 1);
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      return;
    }

    const targetRef = destination === 'message' ? messageRef : celebrationRef;

    if (stage !== 'celebrating') {
      setStage('celebrating');
      setGuideStep(destination === 'message' ? 'read-message' : 'celebration-cake');
      canvasRef.current?.launchFireworks(5);
      window.setTimeout(() => {
        scrollToRefCenter(targetRef);
      }, 90);
      return;
    }

    scrollToRefCenter(targetRef);
  };

  // Step 4 -> Step 5: Celebration Cake cut -> wait for cake animation -> smoothly scroll to Birthday Message (no auto-scroll away while reading)
  const handleCelebrationCutCake = () => {
    setCakeCut(true);
    birthdayAudio.playSparkleChime();
    canvasRef.current?.burstConfetti(0.5, 0.48, 85);
    canvasRef.current?.launchFireworks(3);

    if (guideStep === 'celebration-cake') {
      setGuideStep('read-message');
      scheduleAutoScroll(messageRef, 1750);
    }
  };

  // Step 5 -> Step 6: Visitor clicks "Make a Wish Next" after reading message -> smoothly scroll to Interactive Zone -> Make a Wish pointer
  const handleContinueFromMessage = () => {
    clearPendingScroll();
    setGuideStep('make-wish');
    scrollToRefCenter(interactiveRef);
  };

  // Step 6 -> Step 7: Make a Wish clicked -> wait for shooting stars -> move pointer to Cut Cake
  const handleMakeWish = () => {
    clearPendingScroll();
    birthdayAudio.playWishChime();
    canvasRef.current?.triggerShootingStar();
    window.setTimeout(() => {
      canvasRef.current?.triggerShootingStar();
    }, 380);

    if (guideStep === 'celebration-cake' || guideStep === 'read-message' || guideStep === 'make-wish') {
      scheduleGuideAdvance('cut-cake', 1150);
    }
  };

  // Step 7 -> Step 8: Cut Cake clicked in Interactive Zone -> wait for confetti -> move pointer to Fireworks Celebrate
  const handleInteractiveCutCake = () => {
    clearPendingScroll();
    setCakeCut(true);
    birthdayAudio.playSparkleChime();
    canvasRef.current?.burstConfetti(0.5, 0.48, 85);
    canvasRef.current?.launchFireworks(3);

    if (guideStep === 'cut-cake' || guideStep === 'make-wish' || guideStep === 'read-message') {
      scheduleGuideAdvance('celebrate-fireworks', 1200);
    }
  };

  // Step 8 -> Step 9: Celebrate (Fireworks) clicked -> wait for fireworks -> move pointer to Play Music
  const handleCelebrate = (fromInteractiveZone = false) => {
    birthdayAudio.playSparkleChime();
    canvasRef.current?.launchFireworks(7);
    canvasRef.current?.burstConfetti(0.5, 0.35, 70);

    if (guideStep === 'celebrate-fireworks') {
      scheduleGuideAdvance('play-music', 1350);
    } else if (!fromInteractiveZone && guideStep === 'celebration-cake') {
      setGuideStep('read-message');
      scheduleAutoScroll(messageRef, 1750);
    }
  };

  // Final Step -> Done: Play Music clicked -> start tune and hide pointer
  const handleToggleMusic = () => {
    clearPendingScroll();
    clearPendingGuide();
    birthdayAudio.togglePlay();
    if (guideStep !== 'open-gift' && guideStep !== 'run-surprise') {
      setGuideStep('done');
    }
  };

  const handleReplay = () => {
    clearPendingScroll();
    clearPendingGuide();
    birthdayAudio.pause();
    setCakeCut(false);
    setStage('welcome');
    setActiveNav('home');
    setGuideStep('open-gift');
    setWelcomeKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden text-white">
      <AnimatePresence>
        {isLoading && <LoadingScreen onSkip={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Purple & Pink glowing screen flash between Gift Open and Java Terminal */}
      <AnimatePresence>
        {showLightFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(255,79,203,0.8) 45%, rgba(36,16,63,0.95) 100%)',
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Step 2: Full-Screen Java Code Execution Terminal Reveal */}
      <AnimatePresence>
        {stage === 'terminal' && (
          <JavaRevealTerminal
            reducedMotion={prefersReducedMotion}
            showPointer={guideStep === 'run-surprise'}
            onRunSurprise={handleRunSurpriseFromTerminal}
            onCancelToHome={handleReplay}
          />
        )}
      </AnimatePresence>

      {/* Atmospheric fairy lights, gradients, moving text & balloons */}
      <AmbientBackdrop showHearts={isCelebrating && !prefersReducedMotion} />

      {/* Fireworks, confetti, stars & shooting stars */}
      <FireworksCanvas
        ref={canvasRef}
        activeCelebration={isCelebrating}
        reducedMotion={prefersReducedMotion}
      />

      {/* Top Navigation Bar */}
      <Navbar activeSection={activeNav} onNavigate={handleNavigate} />

      {/* Main Content Flow */}
      <main className="relative z-20">
        {stage === 'welcome' ? (
          <WelcomeScreen
            key={welcomeKey}
            reducedMotion={prefersReducedMotion}
            showPointer={guideStep === 'open-gift'}
            onGiftClick={() => setGuideStep('run-surprise')}
            onTriggerConfetti={() => {
              birthdayAudio.playSparkleChime();
              canvasRef.current?.burstConfetti(0.5, 0.52, 90);
            }}
            onOpenComplete={handleGiftOpenComplete}
          />
        ) : stage === 'celebrating' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Step 3-4: Birthday Celebration & Cake */}
            <div ref={celebrationRef} className="scroll-mt-20">
              <CelebrationSection
                cakeCut={cakeCut}
                showCutPointer={guideStep === 'celebration-cake'}
                onCutCake={handleCelebrationCutCake}
                onCelebrate={() => handleCelebrate(false)}
                reducedMotion={prefersReducedMotion}
              />
            </div>

            {/* Live Age Counter: Shiney's Beautiful Journey */}
            <div ref={ageCounterRef} className="scroll-mt-20">
              <LiveAgeCounter />
            </div>

            {/* Step 5: Personal Birthday Message (peaceful reading, zero forced scroll away) */}
            <div ref={messageRef} className="scroll-mt-20">
              <MessageSection
                onContinueToWishes={handleContinueFromMessage}
                showNextPointer={guideStep === 'read-message'}
              />
            </div>

            {/* Steps 5-8: Interactive Birthday Zone (Make a Wish -> Cut Cake -> Celebrate -> Play Music) */}
            <div ref={interactiveRef} className="scroll-mt-20">
              <InteractiveZone
                onMakeWish={handleMakeWish}
                onCutCake={handleInteractiveCutCake}
                onCelebrate={() => handleCelebrate(true)}
                onToggleMusic={handleToggleMusic}
                onToggleMute={() => birthdayAudio.toggleMute()}
                showWishPointer={guideStep === 'make-wish'}
                showCutCakePointer={guideStep === 'cut-cake'}
                showCelebratePointer={guideStep === 'celebrate-fireworks'}
                showMusicPointer={guideStep === 'play-music'}
                isPlaying={audioState.isPlaying}
                isMuted={audioState.isMuted}
                audioSupported={audioState.audioSupported}
                audioError={audioState.errorMessage}
              />
            </div>

            {/* Quiet Celebration Footer with Replay */}
            <footer className="relative z-20 border-t border-white/10 py-10 px-4 pb-24 sm:pb-12 text-center">
              <p className="text-xs sm:text-sm text-[#FFB6E6]/80">
                Made with warmth for Shiney&apos;s 19th Birthday Celebration 💗
              </p>
              <button
                type="button"
                onClick={handleReplay}
                className="mt-4 inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-[#FFD780] glass-purple border border-[#FFD780]/30 hover:border-[#FFD780]/70 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4FCB]"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Replay Celebration</span>
              </button>
            </footer>
          </motion.div>
        ) : null}
      </main>

      {/* Discreet Floating Music & Replay Controls */}
      <FloatingControls
        isPlaying={audioState.isPlaying}
        isMuted={audioState.isMuted}
        showReplay={isCelebrating}
        onToggleMusic={handleToggleMusic}
        onToggleMute={() => birthdayAudio.toggleMute()}
        onReplay={handleReplay}
      />
    </div>
  );
}
