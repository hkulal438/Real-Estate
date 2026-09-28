'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseImageSequenceOptions {
  frameCount: number;
  basePath: string;
  extension?: string;
  zeroPad?: number;
  startFrame?: number;
}

interface UseImageSequenceResult {
  frames: (HTMLImageElement | null)[];
  loaded: number;
  progress: number;
  isReady: boolean;
  getFrame: (index: number) => HTMLImageElement | null;
  drawFrame: (
    ctx: CanvasRenderingContext2D,
    index: number,
    width: number,
    height: number
  ) => void;
}

/**
 * Preloads a numbered image sequence and exposes a drawFrame function
 * that renders the correct frame to a canvas. If the real frames are not
 * found (404), it falls back to a procedurally-drawn animated building
 * sequence so the experience works out of the box.
 */
export function useImageSequence({
  frameCount,
  basePath,
  extension = 'webp',
  zeroPad = 4,
  startFrame = 1,
}: UseImageSequenceOptions): UseImageSequenceResult {
  const [frames, setFrames] = useState<(HTMLImageElement | null)[]>(
    () => new Array(frameCount).fill(null)
  );
  const [loaded, setLoaded] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const framesRef = useRef<(HTMLImageElement | null)[]>(frames);
  framesRef.current = frames;

  const padNum = (n: number) => String(n).padStart(zeroPad, '0');

  useEffect(() => {
    let cancelled = false;
    const local: (HTMLImageElement | null)[] = new Array(frameCount).fill(null);
    let loadCount = 0;
    let failedCount = 0;

    const checkDone = () => {
      if (loadCount + failedCount >= frameCount) {
        if (cancelled) return;
        if (failedCount > loadCount * 0.5) {
          // Most frames missing — use procedural fallback
          setFrames(new Array(frameCount).fill(null));
        } else {
          setFrames([...local]);
        }
        setIsReady(true);
      }
    };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      const src = `${basePath}${padNum(i + startFrame)}.${extension}`;
      img.onload = () => {
        if (cancelled) return;
        local[i] = img;
        loadCount++;
        setLoaded(loadCount);
        checkDone();
      };
      img.onerror = () => {
        if (cancelled) return;
        failedCount++;
        checkDone();
      };
      img.src = src;
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount, basePath, extension, zeroPad, startFrame]);

  const getFrame = useCallback(
    (index: number): HTMLImageElement | null => {
      const clamped = Math.max(0, Math.min(index, frameCount - 1));
      return framesRef.current[clamped];
    },
    [frameCount]
  );

  const drawFrame = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      index: number,
      width: number,
      height: number
    ) => {
      const clamped = Math.max(0, Math.min(index, frameCount - 1));
      const img = framesRef.current[clamped];

      if (img && img.complete && img.naturalWidth > 0) {
        // Cover-fit the image
        const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;
        const x = (width - w) / 2;
        const y = (height - h) / 2;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, x, y, w, h);
      } else {
        drawProcedural(ctx, clamped, frameCount, width, height);
      }
    },
    [frameCount]
  );

  return {
    frames,
    loaded,
    progress: frameCount > 0 ? loaded / frameCount : 0,
    isReady,
    getFrame,
    drawFrame,
  };
}

/**
 * Procedurally draws a cinematic building-reveal sequence when real
 * frames are unavailable. Simulates a drone fly-in with a tower that
 * rises from the ground, lit by a shifting sky gradient.
 */
function drawProcedural(
  ctx: CanvasRenderingContext2D,
  frame: number,
  total: number,
  width: number,
  height: number
) {
  const p = total > 1 ? frame / (total - 1) : 0;

  // Sky gradient — shifts from deep dusk to warm dawn
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  const dawn = Math.min(1, p * 1.3);
  sky.addColorStop(0, `rgb(${20 + dawn * 80}, ${18 + dawn * 50}, ${40 + dawn * 30})`);
  sky.addColorStop(0.6, `rgb(${40 + dawn * 100}, ${35 + dawn * 70}, ${55 + dawn * 40})`);
  sky.addColorStop(1, `rgb(${60 + dawn * 120}, ${50 + dawn * 90}, ${65 + dawn * 50})`);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  // Sun glow
  const sunY = height * (0.7 - p * 0.25);
  const sunX = width * 0.7;
  const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, width * 0.5);
  glow.addColorStop(0, `rgba(255, 200, 130, ${0.15 + p * 0.2})`);
  glow.addColorStop(0.5, `rgba(255, 180, 100, ${0.05 + p * 0.08})`);
  glow.addColorStop(1, 'rgba(255, 180, 100, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Ground haze
  const haze = ctx.createLinearGradient(0, height * 0.6, 0, height);
  haze.addColorStop(0, 'rgba(50, 40, 50, 0)');
  haze.addColorStop(1, 'rgba(30, 25, 35, 0.6)');
  ctx.fillStyle = haze;
  ctx.fillRect(0, height * 0.6, width, height * 0.4);

  // Building — rises and scales up (simulated fly-in)
  const buildingProgress = Math.min(1, p * 1.4);
  const buildingW = width * (0.12 + buildingProgress * 0.38);
  const buildingH = height * (0.25 + buildingProgress * 0.62);
  const buildingX = width * 0.5 - buildingW / 2;
  const buildingY = height - buildingH * 0.92;

  // Building body
  const bodyGrad = ctx.createLinearGradient(buildingX, 0, buildingX + buildingW, 0);
  bodyGrad.addColorStop(0, 'rgba(35, 30, 35, 0.95)');
  bodyGrad.addColorStop(0.5, 'rgba(55, 48, 50, 0.95)');
  bodyGrad.addColorStop(1, 'rgba(25, 22, 25, 0.95)');
  ctx.fillStyle = bodyGrad;
  ctx.fillRect(buildingX, buildingY, buildingW, buildingH);

  // Floor lines
  const floors = 30;
  ctx.strokeStyle = `rgba(200, 170, 120, ${0.12 + p * 0.15})`;
  ctx.lineWidth = 1;
  for (let f = 1; f < floors; f++) {
    const fy = buildingY + (buildingH / floors) * f;
    if (fy > buildingY + buildingH) break;
    ctx.beginPath();
    ctx.moveTo(buildingX, fy);
    ctx.lineTo(buildingX + buildingW, fy);
    ctx.stroke();
  }

  // Windows — light up progressively
  const windowCols = 6;
  const litFraction = Math.min(1, p * 1.5);
  for (let f = 0; f < floors; f++) {
    for (let c = 0; c < windowCols; c++) {
      const seed = (f * 7 + c * 13) % 100;
      if (seed / 100 > litFraction) continue;
      const wx = buildingX + buildingW * 0.1 + (buildingW * 0.8 / windowCols) * c;
      const wy = buildingY + (buildingH / floors) * f + buildingH / floors * 0.2;
      const ww = buildingW * 0.08;
      const wh = buildingH / floors * 0.5;
      const warmth = 0.3 + (seed % 40) / 100;
      ctx.fillStyle = `rgba(255, ${190 + seed % 30}, ${120 + seed % 40}, ${warmth})`;
      ctx.fillRect(wx, wy, ww, wh);
    }
  }

  // Gold crown at top
  if (buildingProgress > 0.5) {
    const crownAlpha = Math.min(1, (buildingProgress - 0.5) * 3);
    ctx.fillStyle = `rgba(200, 160, 90, ${crownAlpha * 0.8})`;
    ctx.fillRect(buildingX - buildingW * 0.05, buildingY - buildingH * 0.02, buildingW * 1.1, buildingH * 0.015);
  }

  // Vignette
  const vig = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.7
  );
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(0.7, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, width, height);

  // Film grain
  const grainCount = 800;
  ctx.fillStyle = 'rgba(255,255,255,0.02)';
  for (let i = 0; i < grainCount; i++) {
    const gx = Math.random() * width;
    const gy = Math.random() * height;
    ctx.fillRect(gx, gy, 1, 1);
  }
}
