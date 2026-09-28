'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NEIGHBOURHOOD } from '@/lib/content';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function Location() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [activePin, setActivePin] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced) {
      const pins = section.querySelectorAll('[data-pin]');
      pins.forEach((p) => {
        (p as HTMLElement).style.opacity = '1';
        (p as HTMLElement).style.transform = 'scale(1)';
      });
      return;
    }

    const pins = section.querySelectorAll('[data-pin]');
    const highlights = section.querySelectorAll('[data-highlight]');

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      onEnter: () => {
        gsap.fromTo(
          pins,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.7)',
          }
        );
        gsap.fromTo(
          highlights,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
          }
        );
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="location"
      className="relative py-32 px-6 md:px-16 bg-foreground/[0.02]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">
            Location
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight">
            The <em className="text-gold not-italic font-normal">river district</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-16">
          {/* Map */}
          <div className="lg:col-span-3">
            <div
              ref={mapRef}
              className="relative aspect-[4/5] md:aspect-[5/5] rounded-sm overflow-hidden border hairline bg-muted/50"
            >
              {/* Stylized map */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="xMidYMid slice"
              >
                {/* River */}
                <path
                  d="M 0 55 Q 30 50 50 58 T 100 52 L 100 100 L 0 100 Z"
                  fill="hsl(var(--muted))"
                  opacity="0.4"
                />
                <path
                  d="M 0 55 Q 30 50 50 58 T 100 52"
                  fill="none"
                  stroke="hsl(var(--gold))"
                  strokeWidth="0.3"
                  opacity="0.4"
                />

                {/* Grid streets */}
                {[10, 25, 40, 70, 85].map((y) => (
                  <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="hsl(var(--foreground) / 0.08)" strokeWidth="0.2" />
                ))}
                {[15, 35, 55, 75, 90].map((x) => (
                  <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" stroke="hsl(var(--foreground) / 0.08)" strokeWidth="0.2" />
                ))}

                {/* Building marker (the tower) */}
                <rect x="46" y="48" width="8" height="8" fill="hsl(var(--gold))" opacity="0.8" />
                <rect x="47" y="49" width="6" height="6" fill="hsl(var(--gold-dark))" />
              </svg>

              {/* Pins */}
              {NEIGHBOURHOOD.map((place, i) => (
                <button
                  key={i}
                  data-pin
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{
                    left: `${place.x}%`,
                    top: `${place.y}%`,
                    opacity: 0,
                  }}
                  onMouseEnter={() => setActivePin(i)}
                  onMouseLeave={() => setActivePin(null)}
                  onClick={() => setActivePin(activePin === i ? null : i)}
                >
                  <span className="relative flex items-center justify-center">
                    <span className="absolute w-6 h-6 rounded-full bg-gold/20 animate-ping" style={{ animationDuration: '3s' }} />
                    <span className="relative w-3 h-3 rounded-full bg-gold border border-bone shadow-lg" />
                  </span>
                  <span
                    className={`absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-charcoal text-bone text-[10px] font-body tracking-wider uppercase rounded transition-opacity ${
                      activePin === i ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {place.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {NEIGHBOURHOOD.map((place, i) => (
              <div
                key={i}
                data-highlight
                className="border-l hairline pl-6 py-2"
                style={{ opacity: 0 }}
              >
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="font-display text-xl font-light text-foreground">
                    {place.title}
                  </h3>
                  <span className="font-body text-[10px] tracking-[0.2em] uppercase text-gold">
                    {place.distance}
                  </span>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {place.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
