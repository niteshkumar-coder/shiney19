import { useEffect, useRef, useState } from 'react';
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

  const isCelebrating = stage === 'celebrating';

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

  const scrollToElement = (id: string, block: ScrollLogicalPosition = 'start') => {
    window.requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block });
      }
    });
  };

  // Step 1 -> Step 2: Gift box clicked & opened -> glowing flash -> Java IDE terminal
  const handleGiftOpenComplete = () => {
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

  // Step 2 -> Step 3: "RUN BIRTHDAY SURPRISE 🎉" clicked -> grand celebration + guide to Cut Cake
  const handleRunSurpriseFromTerminal = () => {
    setStage('celebrating');
    setActiveNav('surprise');
    setGuideStep('cut-cake');
    birthdayAudio.playSparkleChime();
    canvasRef.current?.launchFireworks(8);
    canvasRef.current?.burstConfetti(0.5, 0.42, 110);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleNavigate = (destination: NavDestination) => {
    setActiveNav(destination);

    if (destination === 'home') {
      setStage('welcome');
      setCakeCut(false);
      setGuideStep('open-gift');
      setWelcomeKey((k) => k + 1);
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      return;
    }

    if (stage !== 'celebrating') {
      setStage('celebrating');
      setGuideStep((prev) =>
        prev === 'open-gift' || prev === 'run-surprise' ? 'cut-cake' : prev
      );
      canvasRef.current?.launchFireworks(5);
      window.setTimeout(() => {
        scrollToElement(destination === 'message' ? 'message' : 'surprise');
      }, 80);
      return;
    }

    scrollToElement(destination === 'message' ? 'message' : 'surprise');
  };

  // Step 3 -> Step 4: Cut Cake clicked -> celebrate -> advance pointer to Make a Wish
  const handleCutCake = (fromInteractiveZone = false) => {
    setCakeCut(true);
    birthdayAudio.playSparkleChime();
    canvasRef.current?.burstConfetti(0.5, 0.48, 85);
    canvasRef.current?.launchFireworks(3);

    if (guideStep === 'cut-cake') {
      setGuideStep('make-wish');
      if (!fromInteractiveZone) {
        window.setTimeout(() => {
          const interactiveEl = document.getElementById('interactive');
          if (interactiveEl) {
            const rect = interactiveEl.getBoundingClientRect();
            if (rect.top > window.innerHeight * 0.72) {
              interactiveEl.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'center',
              });
            }
          }
        }, 1450);
      }
    }
  };

  const handleCelebrate = () => {
    birthdayAudio.playSparkleChime();
    canvasRef.current?.launchFireworks(7);
    canvasRef.current?.burstConfetti(0.5, 0.35, 70);
  };

  // Step 4 -> Step 5: Make a Wish clicked -> advance pointer to Play Music
  const handleMakeWish = () => {
    birthdayAudio.playWishChime();
    canvasRef.current?.triggerShootingStar();
    window.setTimeout(() => {
      canvasRef.current?.triggerShootingStar();
    }, 380);

    if (guideStep === 'cut-cake' || guideStep === 'make-wish') {
      setGuideStep('play-music');
    }
  };

  // Step 5 -> Done: Play Music clicked -> hide guided pointer
  const handleToggleMusic = () => {
    birthdayAudio.togglePlay();
    if (guideStep === 'play-music' || guideStep === 'make-wish' || guideStep === 'cut-cake') {
      setGuideStep('done');
    }
  };

  const handleReplay = () => {
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

      {/* Step 2-4: Full-Screen Java Code Execution Terminal Reveal */}
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
            {/* Page 2: Birthday Celebration */}
            <CelebrationSection
              cakeCut={cakeCut}
              showCutPointer={guideStep === 'cut-cake'}
              onCutCake={() => handleCutCake(false)}
              onCelebrate={handleCelebrate}
              reducedMotion={prefersReducedMotion}
            />

            {/* Live Age Counter: Shiney's Beautiful Journey */}
            <LiveAgeCounter />

            {/* Page 4: Interactive Birthday Zone */}
            <InteractiveZone
              onMakeWish={handleMakeWish}
              onCutCake={() => {
                handleCutCake(true);
                scrollToElement('surprise');
              }}
              onCelebrate={handleCelebrate}
              onToggleMusic={handleToggleMusic}
              onToggleMute={() => birthdayAudio.toggleMute()}
              showWishPointer={guideStep === 'make-wish'}
              showMusicPointer={guideStep === 'play-music'}
              isPlaying={audioState.isPlaying}
              isMuted={audioState.isMuted}
              audioSupported={audioState.audioSupported}
              audioError={audioState.errorMessage}
            />

            {/* Page 3: Personal Birthday Message */}
            <MessageSection />

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
