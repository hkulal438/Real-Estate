'use client';

import { PROJECT, NAV_LINKS } from '@/lib/content';

export function Footer() {
  return (
    <footer className="relative bg-foreground text-background py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h3 className="font-display text-3xl md:text-4xl font-light mb-4">
              {PROJECT.name}
            </h3>
            <p className="font-body text-sm text-background/60 max-w-sm leading-relaxed">
              {PROJECT.subtitle}. {PROJECT.address}, {PROJECT.city}.
            </p>
            <div className="w-16 h-px gold-line my-6" />
            <p className="font-body text-xs tracking-[0.2em] uppercase text-gold-light">
              {PROJECT.availability}
            </p>
          </div>

          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-background/40 mb-4">
              Explore
            </p>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-background/40 mb-4">
              Contact
            </p>
            <ul className="space-y-2">
              <li className="font-body text-sm text-background/70">
                sales@aureliantower.com
              </li>
              <li className="font-body text-sm text-background/70">
                +1 (555) 200-0100
              </li>
              <li className="font-body text-sm text-background/70">
                Mon — Sat, 10am — 6pm
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-background/40">
            &copy; {new Date().getFullYear()} {PROJECT.name}. All rights reserved.
          </p>
          <p className="font-body text-xs text-background/40">
            Prices and availability subject to change.
          </p>
        </div>
      </div>
    </footer>
  );
}
