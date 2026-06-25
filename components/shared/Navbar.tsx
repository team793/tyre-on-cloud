'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Menu } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Logo } from '@/components/shared/Logo';

function LineIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}

function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center rounded-full border border-ink-700 p-0.5">
      <button
        onClick={() => setLang('th')}
        className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wider transition ${
          lang === 'th'
            ? 'bg-brand-600 text-chalk-100'
            : 'text-steel-400 hover:text-chalk-300'
        }`}
      >
        TH
      </button>
      <button
        onClick={() => setLang('en')}
        className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wider transition ${
          lang === 'en'
            ? 'bg-brand-600 text-chalk-100'
            : 'text-steel-400 hover:text-chalk-300'
        }`}
      >
        EN
      </button>
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-3.5 sm:px-10 lg:px-16 2xl:px-24">
          {/* Logo */}
          <Link href="/" aria-label="Tyre on Cloud">
            <Logo size="md" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 font-body text-sm text-chalk-300 md:flex">
            <Link href="/shop?mode=customer" className="transition hover:text-chalk-100">
              {t.nav.shop}
            </Link>
            <Link href="/shop?mode=dealer" className="transition hover:text-chalk-100">
              {t.nav.dealers}
            </Link>
            <a href="#contact" className="transition hover:text-chalk-100">
              {t.nav.contact}
            </a>
          </nav>

          {/* Desktop right cluster */}
          <div className="hidden items-center gap-3 md:flex">
            <LanguageToggle />
            <a
              href="https://line.me/ti/p/@tirehub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-line-green px-3.5 py-2 font-body text-xs font-semibold text-white transition hover:bg-line-green-dark"
            >
              <LineIcon size={15} />
              LINE
            </a>
            <Link
              href="/shop?mode=customer"
              className="rounded-full bg-brand-600 px-4 py-2 font-body text-sm font-semibold text-white transition hover:bg-brand-500"
            >
              {t.nav.shopNow}
            </Link>
          </div>

          {/* Mobile: lang toggle + burger */}
          <div className="flex items-center gap-3 md:hidden">
            <LanguageToggle />
            <button
              onClick={() => setOpen(true)}
              aria-label={t.nav.menu}
              className="rounded-md p-1.5 text-chalk-300 hover:text-chalk-100"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink-950 md:hidden">
          <div className="flex items-center justify-between border-b border-ink-700 px-5 py-3.5">
            <Link href="/" onClick={() => setOpen(false)} aria-label="Tyre on Cloud">
              <Logo size="md" />
            </Link>
            <button
              onClick={() => setOpen(false)}
              aria-label={t.nav.close}
              className="rounded-md p-1.5 text-chalk-300 hover:text-chalk-100"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="flex flex-col gap-1 px-5 pt-6 font-body text-lg font-medium text-chalk-100">
            <Link
              href="/shop?mode=customer"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-4 transition hover:bg-ink-900"
            >
              {t.nav.shop}
            </Link>
            <Link
              href="/shop?mode=dealer"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-4 transition hover:bg-ink-900"
            >
              {t.nav.dealers}
            </Link>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-4 transition hover:bg-ink-900"
            >
              {t.nav.contact}
            </a>
          </nav>

          <div className="mt-auto flex flex-col gap-3 p-5">
            <a
              href="https://line.me/ti/p/@tirehub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-line-green py-3.5 font-body text-base font-semibold text-white"
            >
              <LineIcon size={20} />
              {t.nav.contact} LINE
            </a>
            <Link
              href="/shop?mode=customer"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center rounded-2xl bg-brand-600 py-3.5 font-body text-base font-semibold text-white transition hover:bg-brand-500"
            >
              {t.nav.shopNow}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
