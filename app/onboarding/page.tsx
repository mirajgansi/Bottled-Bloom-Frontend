'use client';
import Image from 'next/image';
import Link from 'next/link';

const OnBoarding = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-8 px-6 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* soft golden glow behind the bottle, echoing the dust-swirl lighting */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(201,161,93,0.18) 0%, rgba(201,161,93,0) 70%)',
        }}
      />

      {/* faint ring accents */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20 pointer-events-none"
        style={{ border: '1px solid var(--gold-muted)' }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ border: '1px solid var(--gold-muted)' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div
          className="rounded-[2rem] overflow-hidden"
          style={{
            border: '1px solid var(--border-strong)',
            boxShadow: 'var(--shadow-glow), var(--shadow-deep)',
          }}
        >
        <Image
  src="/perfume.jpg"
  width={220}
  height={320}
  alt="Bottled Bloom signature fragrance"
  className="object-cover w-[220px] h-[320px]"
  priority
/>
        </div>

        {/* gold divider icon (svg, not emoji) */}
        <svg width="48" height="16" viewBox="0 0 48 16" fill="none">
          <line x1="0" y1="8" x2="18" y2="8" stroke="#C9A15D" strokeWidth="1" />
          <circle cx="24" cy="8" r="3" fill="#C9A15D" />
          <line x1="30" y1="8" x2="48" y2="8" stroke="#C9A15D" strokeWidth="1" />
        </svg>

        <div className="text-center">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: 'var(--gold-primary)' }}
          >
            Bottled Bloom
          </p>
          <h1
            className="text-4xl font-semibold text-center leading-tight"
            style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Welcome to <br /> your signature scent
          </h1>
          <p className="mt-4 text-sm max-w-xs mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Discover fragrances crafted to be remembered.
          </p>
        </div>
      </div>

      <Link
        className="relative z-10 text-base font-medium tracking-wide rounded-full px-12 py-3.5 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
        style={{
          backgroundColor: 'var(--gold-primary)',
          color: 'var(--text-on-gold)',
          boxShadow: '0 10px 30px -8px rgba(201, 161, 93, 0.4)',
        }}
        href={'/login'}
      >
        Get Started
      </Link>
    </div>
  );
};

export default OnBoarding;