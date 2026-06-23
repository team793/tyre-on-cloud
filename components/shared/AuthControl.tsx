'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSupabaseSession } from '@/context/SupabaseSessionProvider';

interface AuthControlProps {
  onNavigate?: () => void;
  fullWidth?: boolean;
  /** 'dark' for dark backgrounds (ink-950 navbar, slate-950 dealer header); 'light' for the white retail header. */
  theme?: 'dark' | 'light';
}

export function AuthControl({ onNavigate, fullWidth = false, theme = 'dark' }: AuthControlProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { session, role, signOut } = useSupabaseSession();

  const sizing = fullWidth
    ? 'justify-center py-3.5 text-base rounded-2xl'
    : 'px-3.5 py-2 text-xs rounded-full';

  const colors =
    theme === 'dark'
      ? 'border-white/15 text-white/70 hover:border-white/40 hover:text-white'
      : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900';

  if (!session) {
    return (
      <Link
        href="/auth"
        onClick={onNavigate}
        className={`flex items-center gap-1.5 border font-body font-semibold transition ${sizing} ${colors}`}
      >
        {t.nav.signIn}
      </Link>
    );
  }

  return (
    <button
      onClick={async () => {
        await signOut();
        onNavigate?.();
        router.push('/');
        router.refresh();
      }}
      className={`flex items-center gap-1.5 border font-body font-semibold transition ${sizing} ${colors}`}
      title={session.user.email ?? undefined}
    >
      <LogOut size={fullWidth ? 18 : 13} />
      {t.nav.signOut}
      {role === 'dealer' && <span className="text-brand-400">· {t.nav.dealers}</span>}
    </button>
  );
}
