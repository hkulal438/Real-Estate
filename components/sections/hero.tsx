'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useImageSequence } from '@/hooks/use-image-sequence';
import { Building3D } from './building-3d';
import { PROJECT } from '@/lib/content';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const FRAME_COUNT = 120;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const loadRef = useRef<HTMLDivElement>(null);
  const [use3D, setUse3D] = useState(false);
  const [show3DToggle, setShow3DToggle] = useState(false);
  const prefersReduced = useRef(false);

  const { drawFrame, progress, isReady } = useImageSequence({
    frameCount: FRAME_COUNT,
    basePath: '/seq/tower_',
    extension: 'webp',
  });

  // Check for reduced motion + mobile
  useEffect(() => {
    prefersReduced.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const isMobile = window.innerWidth < 768;
    setShow3DToggle(!isMobile && !prefersReduced.current);
  }, []);

  // Loading screen fade-out
  useEffect(() => {
    if (!isReady || !loadRef.current) return;
    const tl = gsap.timeline();
    tl.to(loadRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => {
        if (loadRef.current) loadRef.current.style.display = 'none';
      },
    });
  }, [isReady]);

  // Canvas draw + ScrollTrigger
  useEffect(() => {
    if (use3D) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameIndex = 0;
    let rafId = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(ctx, frameIndex, window.innerWidth, window.innerHeight);
    };
    resize();
    window.addEventListener('resize', resize);

    // Initial draw
    drawFrame(ctx, 0, window.innerWidth, window.innerHeight);

    let st: ScrollTrigger | null = null;

    if (!prefersReduced.current) {
      st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          frameIndex = Math.round(self.progress * (FRAME_COUNT - 1));
          drawFrame(ctx, frameIndex, window.innerWidth, window.innerHeight);

          // Fade overlay text
          if (overlayRef.current) {
            const opacity = gsap.utils.clamp(0, 1, 1 - self.progress * 2.5);
            const translateY = self.progress * -80;
            gsap.set(overlayRef.current, {
              opacity,
              y: translateY,
            });
          }
        },
      });
    } else {
      // Reduced motion: just show middle frame
      frameIndex = Math.floor(FRAME_COUNT / 2);
      drawFrame(ctx, frameIndex, window.innerWidth, window.innerHeight);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (st) st.kill();
      cancelAnimationFrame(rafId);
    };
  }, [drawFrame, use3D]);

  const handleToggle3D = useCallback(() => {
    setUse3D((prev) => {
      const next = !prev;
      if (next) {
        // Kill ScrollTrigger pin when switching to 3D
        ScrollTrigger.getAll().forEach((st) => {
          if (st.vars.pin && st.trigger === sectionRef.current) st.kill();
        });
      } else {
        // Refresh after switching back
        setTimeout(() => ScrollTrigger.refresh(), 100);
      }
      return next;
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-charcoal"
      id="hero"
    >
      {/* Loading screen */}
      <div
        ref={loadRef}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-charcoal"
      >
        <div className="text-center">
          <p className="font-display text-2xl md:text-3xl text-bone/90 tracking-wide mb-6">
            {PROJECT.name}
          </p>
          <div className="w-48 h-px bg-bone/10 mx-auto mb-4 overflow-hidden">
            <div
              className="h-full bg-gold transition-all duration-300"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-bone/50">
            {Math.round(progress * 100)}%
          </p>
        </div>
      </div>

      {/* Canvas sequence */}
      {!use3D && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
        />
      )}

      {/* 3D mode */}
      {use3D && (
        <div className="absolute inset-0">
          <Building3D />
        </div>
      )}

      {/* Gradient overlay for text legibility */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(20,16,18,0.5) 0%, rgba(20,16,18,0.15) 30%, rgba(20,16,18,0.1) 60%, rgba(20,16,18,0.6) 100%)',
        }}
      />

      {/* Title overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
      >
        <p className="font-body text-xs md:text-sm tracking-[0.4em] uppercase text-bone/60 mb-6">
          {PROJECT.address} &middot; {PROJECT.city}
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-bone leading-[1.05] tracking-tight">
          {PROJECT.name}
        </h1>
        <div className="w-16 h-px gold-line my-8" />
        <p className="font-display text-xl md:text-2xl font-light text-bone/80 italic">
          {PROJECT.tagline}
        </p>
        <p className="font-body text-sm md:text-base text-bone/50 mt-4 max-w-md">
          {PROJECT.subtitle}
        </p>
      </div>

      {/* 3D toggle */}
      {show3DToggle && (
        <button
          onClick={handleToggle3D}
          className="absolute bottom-8 right-8 z-30 group flex items-center gap-2 px-4 py-2 border hairline rounded-full bg-charcoal/40 backdrop-blur-sm hover:bg-charcoal/60 transition-colors"
        >
          <span className="font-body text-xs tracking-[0.2em] uppercase text-bone/70 group-hover:text-bone transition-colors">
            {use3D ? '2D Mode' : '3D Mode'}
          </span>
          <span
            className={`w-8 h-4 rounded-full transition-colors ${
              use3D ? 'bg-gold' : 'bg-bone/20'
            } relative`}
          >
            <span
              className={`absolute top-0.5 w-3 h-3 rounded-full bg-bone transition-transform ${
                use3D ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </span>
        </button>
      )}

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-bone/40">
          Scroll to explore
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-bone/30 to-transparent" />
      </div>
    </section>
  );
}
