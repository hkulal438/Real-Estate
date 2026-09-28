'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const STORY_TEXT =
  'Aurelian Tower rises from the river district as a quiet landmark — a slender silhouette of warm stone and bronze glass, shaped by light and the slow passage of the day. Forty-two residences, each a home before it is an address, composed with the patience of a master builder and the restraint of a life well lived.';

export function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced) {
      wordsRef.current.forEach((w) => {
        if (w) w.style.opacity = '1';
      });
      return;
    }

    const words = wordsRef.current.filter(Boolean);
    gsap.set(words, { opacity: 0.08 });

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 1,
      onUpdate: (self) => {
        const total = words.length;
        const revealCount = Math.floor(self.progress * total);
        words.forEach((w, i) => {
          if (w) {
            gsap.set(w, { opacity: i < revealCount ? 1 : 0.08 });
          }
        });
      },
    });

    return () => st.kill();
  }, []);

  const words = STORY_TEXT.split(' ');

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative min-h-screen flex items-center justify-center py-32 px-6"
    >
      <div className="max-w-4xl mx-auto">
        <p className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground mb-12 text-center">
          The Story
        </p>
        <p className="font-display text-2xl md:text-4xl lg:text-5xl font-light leading-[1.5] text-foreground text-balance">
          {words.map((word, i) => (
            <span
              key={i}
              ref={(el) => {
                if (el) wordsRef.current[i] = el;
              }}
              className="inline-block mr-[0.25em]"
              style={{ opacity: 0.08 }}
            >
              {word}
            </span>
          ))}
        </p>
        <div className="flex justify-center mt-16">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
