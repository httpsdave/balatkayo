"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

interface ThanosDustImageProps {
  revealed: boolean;
  facadeSrc: string;
  realitySrc: string;
  onDustingChange?: (isDusting: boolean) => void;
}

interface Particle {
  origX: number;
  origY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  eraseRadius: number;
  launchTime: number;
  maxLife: number;
  life: number;
  launched: boolean;
  r: number;
  g: number;
  b: number;
  isEmber: boolean;
  turbulenceFreq: number;
  turbulencePhase: number;
}

function createParticles(
  imgData: ImageData,
  width: number,
  height: number,
  sweepDuration: number
): Particle[] {
  const particles: Particle[] = [];
  const data = imgData.data;

  // Adaptive sampling to maintain smooth 60fps while delivering dense ash disintegration
  const targetCount = Math.min(5200, Math.max(3400, Math.floor((width * height) / 36)));
  const area = width * height;
  const step = Math.max(3, Math.sqrt(area / targetCount));

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      // Jitter grid points to create organic particulate distribution
      const jx = Math.min(width - 1, Math.max(0, x + (Math.random() - 0.5) * step * 0.9));
      const jy = Math.min(height - 1, Math.max(0, y + (Math.random() - 0.5) * step * 0.9));

      const px = Math.floor(jx);
      const py = Math.floor(jy);
      const idx = (py * width + px) * 4;

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      // Skip fully transparent pixels
      if (a < 25) continue;

      // Thanos snap diagonal sweep from bottom-left to top-right with organic noise
      const nx = jx / width; // 0 (left) to 1 (right)
      const ny = jy / height; // 0 (top) to 1 (bottom)

      // Diagonal sweep progression (starts at bottom-left and sweeps across)
      const diag = (1 - ny) * 0.65 + nx * 0.35;

      // Organic noise factor for ragged, porous crumbling boundary
      const noise =
        (Math.sin(jx * 0.05 + jy * 0.03) * 0.5 +
          Math.cos(jx * 0.03 - jy * 0.04) * 0.5 +
          (Math.random() - 0.5) * 0.65) *
        0.13;

      const progress = Math.max(0, Math.min(1, diag + noise));
      const launchTime = progress * sweepDuration;

      // Physics: drifting upward and slightly to the right with gentle atmospheric breeze
      const vx = 0.35 + Math.random() * 1.35; // gentle rightward drift
      const vy = -(1.1 + Math.random() * 1.8); // upward lift
      const size = 1.3 + Math.random() * 1.7; // ash fleck size
      const eraseRadius = step * 1.15; // ensures clean overlap
      const maxLife = 550 + Math.random() * 450; // 550ms - 1000ms

      // ~5% chance for a subtle warm ember/cinder
      const isEmber = Math.random() < 0.05;

      particles.push({
        origX: jx,
        origY: jy,
        x: jx,
        y: jy,
        vx,
        vy,
        size,
        eraseRadius,
        launchTime,
        maxLife,
        life: 0,
        launched: false,
        r: isEmber ? Math.min(255, r + 50) : r,
        g: isEmber ? Math.min(255, g + 30) : g,
        b: isEmber ? Math.max(0, b - 20) : b,
        isEmber,
        turbulenceFreq: 0.006 + Math.random() * 0.004,
        turbulencePhase: Math.random() * Math.PI * 2,
      });
    }
  }

  return particles;
}

export default function ThanosDustImage({
  revealed,
  facadeSrc,
  realitySrc,
  onDustingChange,
}: ThanosDustImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isDusting, setIsDusting] = useState(false);
  const isFirstMount = useRef(true);
  const prevRevealed = useRef(revealed);
  const animFrameRef = useRef<number | null>(null);

  const facadeImgRef = useRef<HTMLImageElement | null>(null);
  const realityImgRef = useRef<HTMLImageElement | null>(null);

  const setDustingState = useCallback(
    (dusting: boolean) => {
      setIsDusting(dusting);
      onDustingChange?.(dusting);
    },
    [onDustingChange]
  );

  // Preload images into memory for instant canvas extraction
  useEffect(() => {
    const img1 = new window.Image();
    img1.src = facadeSrc;
    facadeImgRef.current = img1;

    const img2 = new window.Image();
    img2.src = realitySrc;
    realityImgRef.current = img2;

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [facadeSrc, realitySrc]);

  const startDustAnimation = useCallback(
    (outgoingSrc: string) => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      if (width <= 0 || height <= 0) return;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Create offscreen buffer canvas for outgoing image erosion
      const buffer = document.createElement("canvas");
      buffer.width = width;
      buffer.height = height;
      const bCtx = buffer.getContext("2d", { willReadFrequently: true });
      if (!bCtx) return;

      const img = outgoingSrc === facadeSrc ? facadeImgRef.current : realityImgRef.current;
      if (!img || !img.complete) {
        return;
      }

      // Snapshot outgoing image onto buffer
      bCtx.drawImage(img, 0, 0, width, height);

      const imgData = bCtx.getImageData(0, 0, width, height);
      const SWEEP_DURATION = 820; // 820ms sweep across the image
      const particles = createParticles(imgData, width, height, SWEEP_DURATION);

      setDustingState(true);

      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      let startTime: number | null = null;
      let lastTime: number | null = null;

      const animate = (time: number) => {
        if (startTime === null) {
          startTime = time;
          lastTime = time;
        }

        const elapsed = time - startTime;
        const dt = Math.min(32, time - (lastTime || time));
        lastTime = time;

        // 1. Launch newly ready particles & perforate the buffer image
        bCtx.globalCompositeOperation = "destination-out";
        bCtx.fillStyle = "rgba(0, 0, 0, 1)";
        bCtx.beginPath();
        let hasNewlyLaunched = false;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (!p.launched && elapsed >= p.launchTime) {
            p.launched = true;
            hasNewlyLaunched = true;
            const half = p.eraseRadius * 0.7;
            bCtx.rect(p.origX - half, p.origY - half, p.eraseRadius * 1.4, p.eraseRadius * 1.4);
          }
        }

        if (hasNewlyLaunched) {
          bCtx.fill();
        }

        // Clean out buffer once sweep passes
        if (elapsed > SWEEP_DURATION + 100) {
          bCtx.clearRect(0, 0, width, height);
        }

        // 2. Clear main canvas and draw crumbling buffer image
        ctx.clearRect(0, 0, width, height);

        if (elapsed <= SWEEP_DURATION + 100) {
          ctx.drawImage(buffer, 0, 0);
        }

        // 3. Update & render floating ash/dust particles
        let activeCount = 0;
        const dtRatio = dt / 16.67;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (!p.launched) continue;
          if (p.life >= p.maxLife) continue;

          activeCount++;
          p.life += dt;
          const progress = p.life / p.maxLife;

          // Atmospheric drift physics with subtle sine wave turbulence
          const sway = Math.sin(p.life * p.turbulenceFreq + p.turbulencePhase) * 0.45;
          p.x += (p.vx + sway) * dtRatio;
          p.y += p.vy * dtRatio;

          // Natural dispersion fade: solid at start, then dissolves to dust
          let alpha = 1;
          if (progress > 0.15) {
            alpha = Math.max(0, 1 - Math.pow((progress - 0.15) / 0.85, 1.4));
          }

          // Gentle fade near container top to avoid hard clipping edge
          if (p.y < 24) {
            alpha *= Math.max(0, p.y / 24);
          }

          // Ash flake shrinks slightly as it burns away
          const currentSize = Math.max(0.7, p.size * (1 - progress * 0.4));

          if (p.isEmber && progress < 0.65) {
            // Subtle glowing cinder
            const flicker = Math.sin(p.life * 0.04) * 0.2 + 0.8;
            ctx.fillStyle = `rgba(255, ${Math.floor(160 * flicker)}, 40, ${alpha * 0.95})`;
          } else {
            ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${alpha * 0.85})`;
          }

          ctx.fillRect(p.x, p.y, currentSize, currentSize);
        }

        // 4. Complete animation when sweep has ended and all dust has settled/faded
        if (elapsed > SWEEP_DURATION + 100 && activeCount === 0) {
          ctx.clearRect(0, 0, width, height);
          setDustingState(false);
          animFrameRef.current = null;
          return;
        }

        animFrameRef.current = requestAnimationFrame(animate);
      };

      animFrameRef.current = requestAnimationFrame(animate);
    },
    [facadeSrc, realitySrc, setDustingState]
  );

  // Watch for mode switch to trigger dusting
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevRevealed.current = revealed;
      return;
    }

    if (prevRevealed.current === revealed) return;

    // Outgoing image is whichever one we are leaving
    const outgoingSrc = prevRevealed.current ? realitySrc : facadeSrc;
    prevRevealed.current = revealed;

    startDustAnimation(outgoingSrc);
  }, [revealed, facadeSrc, realitySrc, startDustAnimation]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-black select-none"
    >
      {/* Facade Image (Balatkayo - Imelda) */}
      <Image
        src={facadeSrc}
        alt="Balatkayo - Imelda"
        fill
        className="object-cover"
        style={{
          opacity: isDusting ? (revealed ? 0 : 1) : revealed ? 0 : 1,
        }}
        sizes="(max-width: 768px) 88vw, 650px"
        priority
      />

      {/* Reality Image (Katotohanan - Marcos) */}
      <Image
        src={realitySrc}
        alt="Katotohanan - Marcos"
        fill
        className="object-cover"
        style={{
          opacity: isDusting ? (revealed ? 1 : 0) : revealed ? 1 : 0,
        }}
        sizes="(max-width: 768px) 88vw, 650px"
      />

      {/* Thanos Snap Disintegration & Dust Canvas (JUST the center image) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10 w-full h-full"
        style={{ display: isDusting ? "block" : "none" }}
      />
    </div>
  );
}
