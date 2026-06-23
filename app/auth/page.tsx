'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { Logo } from '@/components/shared/Logo';

type AuthTab = 'signin' | 'signup';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next');
  const wantsDealer = next === '/shop?mode=dealer';
  const { lang } = useLanguage();
  const [tab, setTab] = useState<AuthTab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const copy = {
    signin: {
      title: lang === 'th' ? 'เข้าสู่ระบบ' : 'Sign in',
      sub: lang === 'th' ? 'เข้าสู่บัญชีของคุณ' : 'Access your account',
      btn: lang === 'th' ? 'เข้าสู่ระบบ' : 'Sign in',
      switch: lang === 'th' ? 'ยังไม่มีบัญชี?' : "Don't have an account?",
      switchLink: lang === 'th' ? 'สมัครสมาชิก' : 'Sign up',
    },
    signup: {
      title: lang === 'th' ? 'สมัครสมาชิก' : 'Create account',
      sub: lang === 'th' ? 'สร้างบัญชีใหม่' : 'New to Tyre on Cloud?',
      btn: lang === 'th' ? 'สมัครสมาชิก' : 'Create account',
      switch: lang === 'th' ? 'มีบัญชีอยู่แล้ว?' : 'Already have an account?',
      switchLink: lang === 'th' ? 'เข้าสู่ระบบ' : 'Sign in',
    },
  }[tab];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const supabase = createClient();

    if (tab === 'signin') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        setMessage({ type: 'error', text: lang === 'th' ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' : 'Invalid email or password.' });
      } else {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
        const target = next ?? (profile?.role === 'dealer' ? '/shop?mode=dealer' : '/shop?mode=customer');
        router.push(target as Route);
        router.refresh();
      }
    } else {
      const redirectTarget = next ?? '/shop?mode=customer';
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTarget)}` },
      });
      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({
          type: 'success',
          text: lang === 'th'
            ? 'ส่งอีเมลยืนยันแล้ว! กรุณาตรวจสอบกล่องจดหมายของคุณ'
            : 'Confirmation email sent! Check your inbox.',
        });
      }
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col bg-ink-950">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-ink-700 px-5 py-4 sm:px-10">
        <Link href="/" aria-label="Tyre on Cloud">
          <Logo size="md" />
        </Link>
        <Link href="/" className="font-body text-sm text-steel-400 hover:text-chalk-300 transition">
          {lang === 'th' ? '← กลับหน้าหลัก' : '← Back to home'}
        </Link>
      </div>

      {/* Card */}
      <div className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          {wantsDealer && (
            <div className="mb-6 rounded-2xl border border-orange-800/60 bg-orange-950/30 px-4 py-3 font-body text-sm text-orange-300">
              {lang === 'th'
                ? 'กรุณาเข้าสู่ระบบด้วยบัญชีดีลเลอร์เพื่อดูราคาส่ง'
                : 'Sign in with a dealer account to view wholesale pricing.'}
            </div>
          )}

          {/* Tab toggle */}
          <div className="mb-8 flex rounded-2xl border border-ink-700 bg-ink-900 p-1">
            <button
              onClick={() => { setTab('signin'); setMessage(null); }}
              className={`flex-1 rounded-xl py-2.5 font-body text-sm font-semibold transition ${
                tab === 'signin' ? 'bg-brand-600 text-white' : 'text-steel-400 hover:text-chalk-300'
              }`}
            >
              {lang === 'th' ? 'เข้าสู่ระบบ' : 'Sign in'}
            </button>
            <button
              onClick={() => { setTab('signup'); setMessage(null); }}
              className={`flex-1 rounded-xl py-2.5 font-body text-sm font-semibold transition ${
                tab === 'signup' ? 'bg-brand-600 text-white' : 'text-steel-400 hover:text-chalk-300'
              }`}
            >
              {lang === 'th' ? 'สมัครสมาชิก' : 'Sign up'}
            </button>
          </div>

          <h1 className="mb-1 font-display text-3xl font-semibold text-chalk-100">{copy.title}</h1>
          <p className="mb-8 font-body text-sm text-steel-400">{copy.sub}</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-steel-400">
                {lang === 'th' ? 'อีเมล' : 'Email'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={lang === 'th' ? 'อีเมลของคุณ' : 'your@email.com'}
                className="h-12 w-full rounded-xl border border-ink-700 bg-ink-900 px-4 font-body text-sm text-chalk-100 outline-none placeholder:text-steel-600 focus-visible:border-brand-500 focus-visible:ring-1 focus-visible:ring-brand-500 transition"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-steel-400">
                {lang === 'th' ? 'รหัสผ่าน' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-xl border border-ink-700 bg-ink-900 px-4 pr-12 font-body text-sm text-chalk-100 outline-none placeholder:text-steel-600 focus-visible:border-brand-500 focus-visible:ring-1 focus-visible:ring-brand-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-steel-400 hover:text-chalk-300 transition"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {message && (
              <div
                className={`rounded-xl px-4 py-3 font-body text-sm ${
                  message.type === 'error'
                    ? 'bg-brand-900/40 text-brand-400 border border-brand-800'
                    : 'bg-green-900/40 text-green-400 border border-green-800'
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 items-center justify-center gap-2 rounded-full bg-brand-600 font-body text-sm font-semibold text-white transition hover:bg-brand-500 disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : copy.btn}
            </button>
          </form>

          {/* Dealer note */}
          <div className="mt-8 rounded-2xl border border-ink-700 bg-ink-900 p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-steel-600 mb-2">
              {lang === 'th' ? 'สำหรับดีลเลอร์' : 'For dealers'}
            </p>
            <p className="font-body text-sm text-chalk-300">
              {lang === 'th'
                ? 'หากต้องการสิทธิ์เข้าถึงราคาส่ง กรุณาสมัครสมาชิกแล้วติดต่อทีมงานผ่าน LINE เพื่อขอเลื่อนระดับบัญชีเป็น Dealer'
                : 'To access wholesale pricing, sign up then contact us via LINE to have your account upgraded to dealer access.'}
            </p>
            <a
              href="https://line.me/ti/p/@tirehub"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block font-body text-sm font-semibold text-[#06C755] hover:underline"
            >
              {lang === 'th' ? 'ติดต่อผ่าน LINE →' : 'Contact via LINE →'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-ink-950">
          <Loader2 size={28} className="animate-spin text-steel-400" />
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
