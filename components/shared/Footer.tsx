'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Logo } from '@/components/shared/Logo';

function LineIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="border-t border-ink-700 bg-ink-950 px-5 pt-14 pb-8 sm:px-10 lg:px-16 2xl:px-24">
      <div className="mx-auto max-w-[1600px]">
        {/* Top grid */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          {/* Brand */}
          <div className="max-w-xs">
            <Logo size="lg" />
            <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-chalk-300">
              {t.footer.tagline}
            </p>
            <a
              href="https://line.me/ti/p/@tirehub"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-line-green px-4 py-2.5 font-body text-sm font-semibold text-white transition hover:bg-line-green-dark"
            >
              <LineIcon size={16} />
              {t.footer.lineOA}
            </a>
          </div>

          {/* Link columns — always split evenly among themselves, independent of the brand column's width */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:flex lg:gap-16">
            {/* Shop links */}
            <div className="flex flex-col gap-2.5 font-body text-sm text-chalk-300">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-steel-400 mb-1">
                {t.footer.shop}
              </p>
              <Link href="/shop?mode=customer" className="transition hover:text-chalk-100">
                {t.footer.browse}
              </Link>
              <a href="#fitment" className="transition hover:text-chalk-100">
                {t.footer.fitment}
              </a>
            </div>

            {/* Dealer links */}
            <div className="flex flex-col gap-2.5 font-body text-sm text-chalk-300">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-steel-400 mb-1">
                {t.footer.dealer}
              </p>
              <Link href="/shop?mode=dealer" className="transition hover:text-chalk-100">
                {t.footer.portal}
              </Link>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-2.5 font-body text-sm text-chalk-300">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-steel-400 mb-1">
                {t.footer.contact}
              </p>
              <a
                href="https://line.me/ti/p/@tirehub"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-chalk-100"
              >
                {t.footer.lineOA}
              </a>
              <a href="tel:+6620000000" className="transition hover:text-chalk-100">
                {t.footer.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-10 border-t border-ink-700 pt-6">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-steel-600">
            {t.footer.payment}
          </p>
          <div className="flex flex-wrap gap-2">
            {['PromptPay', 'QR Code', 'Bank Transfer', 'Credit Card'].map((method) => (
              <span
                key={method}
                className="rounded-md border border-ink-700 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-steel-600"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-ink-700 pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-steel-600">
            © {new Date().getFullYear()} Tyre on Cloud. {t.footer.rights}.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-steel-600">
            {t.footer.address}
          </p>
        </div>
      </div>
    </footer>
  );
}
