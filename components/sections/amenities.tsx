'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AMENITIES } from '@/lib/content';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function Amenities() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let tween: gsap.core.Tween | null = null;
    let headingSt: ScrollTrigger | null = null;

    if (!prefersReduced) {
      // Horizontal scroll: pin and translate track
      const getScrollAmount = () => {
        return track.scrollWidth - window.innerWidth;
      };

      tween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Parallax on images within cards
      const images = track.querySelectorAll('[data-parallax]');
      images.forEach((img) => {
        gsap.to(img, {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getScrollAmount()}`,
            scrub: 1,
          },
        });
      });
    }

    // Heading fade in
    if (headingRef.current && !prefersReduced) {
      headingSt = ScrollTrigger.create({
        trigger: headingRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.from(headingRef.current!.children, {
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
      if (tween) tween.scrollTrigger?.kill();
      if (headingSt) headingSt.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="amenities"
      className="relative overflow-hidden bg-foreground/[0.02]"
    >
      <div className="h-screen flex flex-col justify-center">
        <div
          ref={headingRef}
          className="px-6 md:px-16 mb-12 md:mb-16"
        >
          <p className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">
            Amenities
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight">
            A life, <em className="text-gold not-italic font-normal">considered</em>
          </h2>
        </div>

        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-6 md:gap-10 px-6 md:px-16 will-change-transform"
            style={{ width: 'max-content' }}
          >
            {AMENITIES.map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-[42vw] lg:w-[34vw] xl:w-[30vw]"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-muted">
                  <div className="absolute inset-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      data-parallax
                      className="w-full h-[115%] object-cover transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="font-body text-[10px] tracking-[0.3em] uppercase text-gold-light mb-2">
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <h3 className="font-display text-2xl md:text-3xl font-light text-bone mb-2">
                      {item.title}
                    </h3>
                    <p className="font-body text-sm text-bone/70 leading-relaxed max-w-xs">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {/* End spacer */}
            <div className="flex-shrink-0 w-6 md:w-16" />
          </div>
        </div>
      </div>
    </section>
  );
}
