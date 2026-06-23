'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export type UserRole = 'customer' | 'dealer';

interface SupabaseSessionContextValue {
  session: Session | null;
  role: UserRole | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const SupabaseSessionContext = createContext<SupabaseSessionContextValue>({
  session: null,
  role: null,
  isLoading: true,
  signOut: async () => {},
});

async function fetchRole(userId: string): Promise<UserRole | null> {
  const supabase = createClient();
  const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
  return (data?.role as UserRole) ?? null;
}

/**
 * Wrap this around the app in app/layout.tsx, passing `initialSession` (and
 * `initialRole`, looked up server-side from the same session) from a Server
 * Component's `supabase.auth.getSession()` call — that avoids the "flash of
 * logged-out UI" you'd get from mounting client-only and waiting for
 * onAuthStateChange to fire.
 */
export function SupabaseSessionProvider({
  initialSession,
  initialRole,
  children,
}: {
  initialSession: Session | null;
  initialRole: UserRole | null;
  children: ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [role, setRole] = useState<UserRole | null>(initialRole);
  const [isLoading, setIsLoading] = useState(initialSession === null);

  useEffect(() => {
    const supabase = createClient();
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setRole(newSession ? await fetchRole(newSession.user.id) : null);
      setIsLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return (
    <SupabaseSessionContext.Provider value={{ session, role, isLoading, signOut }}>
      {children}
    </SupabaseSessionContext.Provider>
  );
}

export function useSupabaseSession() {
  return useContext(SupabaseSessionContext);
}
