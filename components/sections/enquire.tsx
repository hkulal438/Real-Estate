'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECT, RESIDENCES } from '@/lib/content';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type FormState = {
  name: string;
  email: string;
  phone: string;
  unitType: string;
  message: string;
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function Enquire() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    unitType: RESIDENCES[0].label,
    message: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Partial<FormState>>({});

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

    const formEl = section.querySelector('[data-form-wrap]');
    if (formEl) {
      ScrollTrigger.create({
        trigger: formEl,
        start: 'top 80%',
        onEnter: () => {
          gsap.from(formEl, {
            y: 40,
            opacity: 0,
            duration: 1,
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

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) {
      e.email = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Invalid email';
    }
    if (!form.phone.trim()) e.phone = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setForm({
        name: '',
        email: '',
        phone: '',
        unitType: RESIDENCES[0].label,
        message: '',
      });
    } catch {
      setStatus('error');
    }
  };

  const update = (field: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  return (
    <section
      ref={sectionRef}
      id="enquire"
      className="relative py-32 px-6 md:px-16 bg-foreground/[0.02]"
    >
      <div className="max-w-7xl mx-auto">
        <div data-heading className="mb-16 text-center">
          <p className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">
            Enquire
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight">
            Begin the <em className="text-gold not-italic font-normal">conversation</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-start">
          {/* Left: sticky info */}
          <div className="lg:sticky lg:top-24">
            <div className="border-l hairline pl-6">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                Availability
              </p>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="font-body text-sm text-foreground">
                  {PROJECT.availability}
                </span>
              </div>
              <p className="font-display text-2xl font-light text-foreground mb-2">
                {PROJECT.name}
              </p>
              <p className="font-body text-sm text-muted-foreground mb-6">
                {PROJECT.address}, {PROJECT.city}
              </p>
              <div className="space-y-3">
                {RESIDENCES.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-baseline justify-between border-b hairline pb-2"
                  >
                    <span className="font-body text-sm text-foreground">
                      {r.label}
                    </span>
                    <span className="font-body text-xs text-muted-foreground">
                      from {r.priceFrom}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div data-form-wrap>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
            >
              <FormField
                label="Name"
                error={errors.name}
                value={form.name}
                onChange={(v) => update('name', v)}
                placeholder="Your full name"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Email"
                  type="email"
                  error={errors.email}
                  value={form.email}
                  onChange={(v) => update('email', v)}
                  placeholder="you@example.com"
                />
                <FormField
                  label="Phone"
                  type="tel"
                  error={errors.phone}
                  value={form.phone}
                  onChange={(v) => update('phone', v)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2 block">
                  Unit Type
                </label>
                <select
                  value={form.unitType}
                  onChange={(e) => update('unitType', e.target.value)}
                  className="w-full bg-transparent border-b hairline py-3 font-body text-sm text-foreground focus:outline-none focus:border-gold transition-colors"
                >
                  {RESIDENCES.map((r) => (
                    <option key={r.id} value={r.label}>
                      {r.label} — from {r.priceFrom}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2 block">
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  rows={4}
                  placeholder="Tell us what you are looking for..."
                  className="w-full bg-transparent border-b hairline py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="self-start mt-4 px-8 py-3 border hairline rounded-full font-body text-xs tracking-[0.2em] uppercase text-foreground hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
              >
                {status === 'submitting' ? 'Sending...' : 'Submit Enquiry'}
              </button>

              {status === 'success' && (
                <p className="font-body text-sm text-gold">
                  Thank you. We will be in touch within two business days.
                </p>
              )}
              {status === 'error' && (
                <p className="font-body text-sm text-destructive">
                  Something went wrong. Please try again or call us directly.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2 block">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-b hairline py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
      />
      {error && (
        <p className="font-body text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}
