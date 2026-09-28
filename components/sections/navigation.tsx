'use client';

import { useState, useEffect } from 'react';
import { NAV_LINKS, PROJECT } from '@/lib/content';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-background/90 backdrop-blur-md py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-16 flex items-center justify-between">
          <a
            href="#hero"
            className={`font-display text-xl md:text-2xl font-light tracking-wide transition-colors ${
              scrolled ? 'text-foreground' : 'text-bone'
            }`}
          >
            {PROJECT.name}
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`font-body text-xs tracking-[0.2em] uppercase transition-colors ${
                  scrolled
                    ? 'text-muted-foreground hover:text-foreground'
                    : 'text-bone/70 hover:text-bone'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex flex-col gap-1.5 z-50"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <span
              className={`w-6 h-px transition-all ${
                open ? 'rotate-45 translate-y-[6px] bg-foreground' : scrolled ? 'bg-foreground' : 'bg-bone'
              }`}
            />
            <span
              className={`w-6 h-px transition-all ${
                open ? 'opacity-0' : scrolled ? 'bg-foreground' : 'bg-bone'
              }`}
            />
            <span
              className={`w-6 h-px transition-all ${
                open ? '-rotate-45 -translate-y-[6px] bg-foreground' : scrolled ? 'bg-foreground' : 'bg-bone'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-30 bg-background flex flex-col items-center justify-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-display text-3xl font-light text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
