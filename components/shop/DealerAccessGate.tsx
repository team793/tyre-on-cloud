'use client';

import { Building2 } from 'lucide-react';

export function DealerAccessGate() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
        <Building2 size={22} className="text-orange-400" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-white">Dealer access required</h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-400">
          This account doesn&apos;t have wholesale access yet. Contact us via LINE to have it upgraded to a dealer
          account.
        </p>
      </div>
      <a
        href="https://line.me/ti/p/@tirehub"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-line-green px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-line-green-dark"
      >
        Contact via LINE
      </a>
    </div>
  );
}
