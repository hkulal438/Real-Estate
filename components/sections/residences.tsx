'use client';

import { useRef, useEffect, useState, forwardRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RESIDENCES } from '@/lib/content';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type TabId = (typeof RESIDENCES)[number]['id'];

export function Residences() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<TabId>('1br');
  const floorPlanRef = useRef<SVGSVGElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);

  const active = RESIDENCES.find((r) => r.id === activeTab)!;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced) return;

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

    return () => ScrollTrigger.getAll().forEach((st) => {
      if (section.contains(st.trigger as Node)) st.kill();
    });
  }, []);

  // Animate on tab change
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 0.9, ease: 'power3.out' }
      );
    }
    if (floorPlanRef.current) {
      gsap.fromTo(
        floorPlanRef.current.querySelectorAll('[data-room]'),
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          transformOrigin: 'center',
        }
      );
    }
    if (specsRef.current) {
      gsap.fromTo(
        specsRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  return (
    <section
      ref={sectionRef}
      id="residences"
      className="relative py-32 px-6 md:px-16"
    >
      <div data-heading className="max-w-7xl mx-auto mb-16 md:mb-24">
        <p className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">
          Residences &amp; Floor Plans
        </p>
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight">
          Forty-two homes, <em className="text-gold not-italic font-normal">each unique</em>
        </h2>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-1 md:gap-2 mb-12 border-b hairline pb-px">
          {RESIDENCES.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveTab(r.id)}
              className={`relative px-4 md:px-6 py-3 font-body text-xs md:text-sm tracking-[0.15em] uppercase transition-colors ${
                activeTab === r.id
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground/70'
              }`}
            >
              {r.label}
              {activeTab === r.id && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-px bg-gold" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Image */}
          <div ref={imageRef} className="relative aspect-[4/3] overflow-hidden rounded-sm bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.image}
              alt={active.label}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="font-display text-xl text-bone font-light">
                {active.label}
              </p>
            </div>
          </div>

          {/* Specs + Floor Plan */}
          <div className="flex flex-col gap-8">
            <div ref={specsRef}>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8 max-w-md">
                {active.desc}
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <SpecItem label="Area" value={active.area} />
                <SpecItem label="Bedrooms" value={active.beds} />
                <SpecItem label="Bathrooms" value={active.baths} />
                <SpecItem label="Price from" value={active.priceFrom} />
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="#enquire"
                  className="inline-flex items-center px-6 py-3 border hairline rounded-full font-body text-xs tracking-[0.2em] uppercase text-foreground hover:bg-foreground hover:text-background transition-colors"
                >
                  Enquire
                </a>
                <span className="font-body text-xs text-muted-foreground">
                  {active.priceFrom}
                </span>
              </div>
            </div>

            {/* Animated floor plan SVG */}
            <div className="border hairline rounded-sm p-6 bg-card">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
                Floor Plan — {active.label}
              </p>
              <FloorPlanSVG ref={floorPlanRef} type={activeTab} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l hairline pl-4">
      <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1">
        {label}
      </p>
      <p className="font-display text-lg font-light text-foreground">{value}</p>
    </div>
  );
}

const FloorPlanSVG = forwardRef<
  SVGSVGElement,
  { type: TabId }
>(function FloorPlanSVG({ type }, ref) {
  const plans: Record<TabId, JSX.Element> = {
    '1br': (
      <>
        <rect data-room x="20" y="20" width="160" height="120" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <rect data-room x="20" y="140" width="100" height="80" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <rect data-room x="120" y="140" width="60" height="80" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <line data-room x1="20" y1="140" x2="180" y2="140" stroke="currentColor" strokeWidth="0.5" className="text-gold/40" />
        <text data-room x="100" y="85" textAnchor="middle" className="font-body fill-current text-[8px] text-muted-foreground uppercase tracking-widest">Living</text>
        <text data-room x="70" y="185" textAnchor="middle" className="font-body fill-current text-[8px] text-muted-foreground uppercase tracking-widest">Bed</text>
        <text data-room x="150" y="185" textAnchor="middle" className="font-body fill-current text-[8px] text-muted-foreground uppercase tracking-widest">Bath</text>
      </>
    ),
    '2br': (
      <>
        <rect data-room x="20" y="20" width="180" height="100" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <rect data-room x="20" y="120" width="90" height="50" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <rect data-room x="110" y="120" width="90" height="50" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <rect data-room x="20" y="170" width="90" height="50" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <rect data-room x="110" y="170" width="90" height="50" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <line data-room x1="20" y1="120" x2="200" y2="120" stroke="currentColor" strokeWidth="0.5" className="text-gold/40" />
        <line data-room x1="100" y1="120" x2="100" y2="220" stroke="currentColor" strokeWidth="0.5" className="text-gold/40" />
        <text data-room x="110" y="75" textAnchor="middle" className="font-body fill-current text-[8px] text-muted-foreground uppercase tracking-widest">Living / Kitchen</text>
        <text data-room x="65" y="150" textAnchor="middle" className="font-body fill-current text-[8px] text-muted-foreground uppercase tracking-widest">Bed 1</text>
        <text data-room x="155" y="150" textAnchor="middle" className="font-body fill-current text-[8px] text-muted-foreground uppercase tracking-widest">Bath</text>
        <text data-room x="65" y="200" textAnchor="middle" className="font-body fill-current text-[8px] text-muted-foreground uppercase tracking-widest">Primary</text>
        <text data-room x="155" y="200" textAnchor="middle" className="font-body fill-current text-[8px] text-muted-foreground uppercase tracking-widest">Ensuite</text>
      </>
    ),
    '3br': (
      <>
        <rect data-room x="20" y="20" width="200" height="80" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <rect data-room x="20" y="100" width="65" height="55" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <rect data-room x="85" y="100" width="65" height="55" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <rect data-room x="150" y="100" width="70" height="55" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <rect data-room x="20" y="155" width="100" height="65" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <rect data-room x="120" y="155" width="100" height="65" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <text data-room x="120" y="65" textAnchor="middle" className="font-body fill-current text-[8px] text-muted-foreground uppercase tracking-widest">Great Room</text>
        <text data-room x="52" y="132" textAnchor="middle" className="font-body fill-current text-[8px] text-muted-foreground uppercase tracking-widest">Bed</text>
        <text data-room x="117" y="132" textAnchor="middle" className="font-body fill-current text-[8px] text-muted-foreground uppercase tracking-widest">Bath</text>
        <text data-room x="185" y="132" textAnchor="middle" className="font-body fill-current text-[8px] text-muted-foreground uppercase tracking-widest">Study</text>
        <text data-room x="70" y="190" textAnchor="middle" className="font-body fill-current text-[8px] text-muted-foreground uppercase tracking-widest">Primary Suite</text>
        <text data-room x="170" y="190" textAnchor="middle" className="font-body fill-current text-[8px] text-muted-foreground uppercase tracking-widest">Ensuite</text>
      </>
    ),
    penthouse: (
      <>
        <rect data-room x="20" y="20" width="220" height="90" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <rect data-room x="20" y="110" width="55" height="50" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <rect data-room x="75" y="110" width="55" height="50" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <rect data-room x="130" y="110" width="55" height="50" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <rect data-room x="185" y="110" width="55" height="50" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <rect data-room x="20" y="160" width="110" height="60" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <rect data-room x="130" y="160" width="110" height="60" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <circle data-room cx="240" cy="30" r="8" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
        <text data-room x="130" y="70" textAnchor="middle" className="font-body fill-current text-[8px] text-muted-foreground uppercase tracking-widest">Sky Lounge</text>
        <text data-room x="47" y="140" textAnchor="middle" className="font-body fill-current text-[7px] text-muted-foreground uppercase">Bed1</text>
        <text data-room x="102" y="140" textAnchor="middle" className="font-body fill-current text-[7px] text-muted-foreground uppercase">Bed2</text>
        <text data-room x="157" y="140" textAnchor="middle" className="font-body fill-current text-[7px] text-muted-foreground uppercase">Bed3</text>
        <text data-room x="212" y="140" textAnchor="middle" className="font-body fill-current text-[7px] text-muted-foreground uppercase">Bath</text>
        <text data-room x="75" y="195" textAnchor="middle" className="font-body fill-current text-[8px] text-muted-foreground uppercase tracking-widest">Primary</text>
        <text data-room x="185" y="195" textAnchor="middle" className="font-body fill-current text-[8px] text-muted-foreground uppercase tracking-widest">Ensuite</text>
      </>
    ),
  };

  return (
    <svg
      ref={ref}
      viewBox="0 0 260 230"
      className="w-full h-auto"
      fill="none"
    >
      {plans[type]}
    </svg>
  );
});
