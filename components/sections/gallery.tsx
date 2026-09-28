'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GALLERY } from '@/lib/content';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced) return;

    const items = section.querySelectorAll('[data-gallery-item]');
    items.forEach((item, i) => {
      const img = item.querySelector('[data-gallery-img]');
      gsap.set(item, { clipPath: 'inset(0 0 100% 0)' });
      gsap.set(img, { yPercent: 30 });

      ScrollTrigger.create({
        trigger: item,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(item, {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.1,
            ease: 'power4.out',
            delay: (i % 3) * 0.1,
          });
          gsap.to(img, {
            yPercent: 0,
            duration: 1.3,
            ease: 'power3.out',
            delay: (i % 3) * 0.1,
          });
        },
      });
    });

    // Heading
    const heading = section.querySelector('[data-heading]');
    if (heading) {
      ScrollTrigger.create({
        trigger: heading,
        start: 'top 85%',
        onEnter: () => {
          gsap.from(heading.children, {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
          });
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (section.contains(st.trigger as Node)) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative py-32 px-6 md:px-16"
    >
      <div data-heading className="max-w-7xl mx-auto mb-16">
        <p className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">
          Gallery
        </p>
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight">
          A study in <em className="text-gold not-italic font-normal">light</em>
        </h2>
      </div>

      {/* Masonry grid */}
      <div className="max-w-7xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6">
        {GALLERY.map((item, i) => (
          <div
            key={i}
            data-gallery-item
            className={`mb-4 md:mb-6 break-inside-avoid overflow-hidden rounded-sm bg-muted ${
              item.span === 'tall'
                ? 'aspect-[3/4]'
                : item.span === 'wide'
                ? 'aspect-[4/3]'
                : 'aspect-[1/1]'
            }`}
          >
            <div className="relative w-full h-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                data-gallery-img
                className="w-full h-full object-cover will-change-transform transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal/0 hover:bg-charcoal/10 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
