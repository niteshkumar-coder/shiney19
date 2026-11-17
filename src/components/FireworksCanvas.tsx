import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface FireworksCanvasHandle {
  burstConfetti: (originXRatio?: number, originYRatio?: number, count?: number) => void;
  launchFireworks: (bursts?: number) => void;
  triggerShootingStar: () => void;
}

interface FireworksCanvasProps {
  activeCelebration: boolean;
  reducedMotion: boolean;
}

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
  gravity: number;
}

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rotation: number;
  vr: number;
  color: string;
  alpha: number;
  ambient: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  trail: Array<{ x: number; y: number }>;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  phase: number;
  speed: number;
}

const PALETTE = ['#FF4FCB', '#FFB6E6', '#FFD780', '#B99AFF', '#FFFFFF', '#FF7AD9'];

export const FireworksCanvas = forwardRef<FireworksCanvasHandle, FireworksCanvasProps>(
  ({ activeCelebration, reducedMotion }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<FireworkParticle[]>([]);
    const confettiRef = useRef<ConfettiPiece[]>([]);
    const shootingStarsRef = useRef<ShootingStar[]>([]);
    const starsRef = useRef<Star[]>([]);
    const activeCelebrationRef = useRef(activeCelebration);
    const reducedMotionRef = useRef(reducedMotion);

    activeCelebrationRef.current = activeCelebration;
    reducedMotionRef.current = reducedMotion;

    const spawnFireworkBurst = (cx: number, cy: number, count = 42) => {
      if (reducedMotionRef.current) count = Math.min(count, 16);
      const baseColor = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const accentColor = PALETTE[Math.floor(Math.random() * PALETTE.length)];

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.2;
        const speed = 1.6 + Math.random() * 4.4;
        particlesRef.current.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.013 + Math.random() * 0.014,
          color: i % 2 === 0 ? baseColor : accentColor,
          size: 1.6 + Math.random() * 2.2,
          gravity: 0.045,
        });
      }
    };

    const spawnConfettiBurst = (originXRatio = 0.5, originYRatio = 0.5, count = 65) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ox = width * originXRatio;
      const oy = height * originYRatio;
      const total = reducedMotionRef.current ? Math.min(count, 20) : count;

      for (let i = 0; i < total; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
        const speed = 3 + Math.random() * 8.5;
        confettiRef.current.push({
          x: ox + (Math.random() - 0.5) * 32,
          y: oy + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          w: 6 + Math.random() * 6,
          h: 4 + Math.random() * 5,
          rotation: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.22,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          alpha: 1,
          ambient: false,
        });
      }
    };

    useImperativeHandle(ref, () => ({
      burstConfetti(originXRatio = 0.5, originYRatio = 0.5, count = 75) {
        spawnConfettiBurst(originXRatio, originYRatio, count);
      },
      launchFireworks(bursts = 4) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        for (let i = 0; i < bursts; i++) {
          window.setTimeout(() => {
            const x = width * (0.15 + Math.random() * 0.7);
            const y = height * (0.14 + Math.random() * 0.36);
            spawnFireworkBurst(x, y, width < 640 ? 34 : 52);
          }, i * 240);
        }
      },
      triggerShootingStar() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const startX = width * (0.1 + Math.random() * 0.25);
        const startY = height * (0.1 + Math.random() * 0.16);
        shootingStarsRef.current.push({
          x: startX,
          y: startY,
          vx: Math.max(8, width * 0.011),
          vy: Math.max(3.2, height * 0.0045),
          life: 0,
          maxLife: 65,
          trail: [],
        });
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animationFrameId = 0;
      let width = window.innerWidth;
      let height = window.innerHeight;

      const initStars = () => {
        const count = width < 640 ? 45 : 85;
        starsRef.current = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height * 0.82,
          radius: 0.7 + Math.random() * 1.5,
          baseAlpha: 0.25 + Math.random() * 0.65,
          phase: Math.random() * Math.PI * 2,
          speed: 0.015 + Math.random() * 0.025,
        }));
      };

      const seedAmbientConfetti = () => {
        const desired = width < 640 ? 18 : 30;
        confettiRef.current = Array.from({ length: desired }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: 0.65 + Math.random() * 1.1,
          w: 5 + Math.random() * 5,
          h: 3 + Math.random() * 4,
          rotation: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.06,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          alpha: 0.55 + Math.random() * 0.35,
          ambient: true,
        }));
      };

      const handleResize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        initStars();
      };

      handleResize();
      seedAmbientConfetti();
      window.addEventListener('resize', handleResize);

      let lastAutoFirework = performance.now();

      const render = (now: number) => {
        ctx.clearRect(0, 0, width, height);

        // Twinkling stars
        for (const star of starsRef.current) {
          star.phase += reducedMotionRef.current ? 0 : star.speed;
          const alpha = star.baseAlpha * (0.65 + 0.35 * Math.sin(star.phase));
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 240, 250, ${alpha.toFixed(2)})`;
          ctx.fill();
        }

        // Gentle random fireworks during active celebration
        if (
          activeCelebrationRef.current &&
          !reducedMotionRef.current &&
          now - lastAutoFirework > 2200
        ) {
          lastAutoFirework = now;
          const fx = width * (0.14 + Math.random() * 0.72);
          const fy = height * (0.12 + Math.random() * 0.32);
          spawnFireworkBurst(fx, fy, width < 640 ? 28 : 42);
        }

        // Update firework particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.vx *= 0.985;
          p.alpha -= p.decay;

          if (p.alpha <= 0.02) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Update falling confetti
        if (!reducedMotionRef.current) {
          for (let i = confettiRef.current.length - 1; i >= 0; i--) {
            const c = confettiRef.current[i];
            c.x += c.vx + Math.sin(now * 0.002 + i) * 0.25;
            c.y += c.vy;
            c.rotation += c.vr;

            if (!c.ambient) {
              c.vy += 0.14;
              c.vx *= 0.985;
              c.alpha -= 0.007;
            }

            if (c.ambient && !activeCelebrationRef.current) {
              // Keep confetti very subtle on Welcome screen
              ctx.save();
              ctx.globalAlpha = c.alpha * 0.35;
              ctx.translate(c.x, c.y);
              ctx.rotate(c.rotation);
              ctx.fillStyle = c.color;
              ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
              ctx.restore();
            } else {
              ctx.save();
              ctx.globalAlpha = Math.max(0, c.alpha);
              ctx.translate(c.x, c.y);
              ctx.rotate(c.rotation);
              ctx.fillStyle = c.color;
              ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
              ctx.restore();
            }

            if (c.y > height + 24 || c.alpha <= 0.01) {
              if (c.ambient) {
                c.y = -12;
                c.x = Math.random() * width;
                c.vy = 0.65 + Math.random() * 1.1;
              } else {
                confettiRef.current.splice(i, 1);
              }
            }
          }
        }

        // Shooting stars
        for (let i = shootingStarsRef.current.length - 1; i >= 0; i--) {
          const s = shootingStarsRef.current[i];
          s.trail.push({ x: s.x, y: s.y });
          if (s.trail.length > 20) s.trail.shift();

          s.x += s.vx;
          s.y += s.vy;
          s.life += 1;

          // Draw glowing tail
          for (let t = 0; t < s.trail.length; t++) {
            const pt = s.trail[t];
            const ratio = (t + 1) / s.trail.length;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.5 + ratio * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 128, ${ratio * 0.75})`;
            ctx.fill();
          }

          // Bright star head
          ctx.save();
          ctx.shadowBlur = 18;
          ctx.shadowColor = '#FF4FCB';
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(s.x, s.y, 4.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (Math.random() < 0.45) {
            particlesRef.current.push({
              x: s.x,
              y: s.y,
              vx: (Math.random() - 0.5) * 1.2,
              vy: (Math.random() - 0.5) * 1.2,
              alpha: 0.9,
              decay: 0.03,
              color: Math.random() > 0.5 ? '#FFD780' : '#FFB6E6',
              size: 1.5,
              gravity: 0.01,
            });
          }

          if (s.life >= s.maxLife || s.x > width + 40) {
            shootingStarsRef.current.splice(i, 1);
          }
        }

        animationFrameId = window.requestAnimationFrame(render);
      };

      animationFrameId = window.requestAnimationFrame(render);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.cancelAnimationFrame(animationFrameId);
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 z-10 pointer-events-none"
      />
    );
  }
);

FireworksCanvas.displayName = 'FireworksCanvas';
