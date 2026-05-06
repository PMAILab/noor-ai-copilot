import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { getSupabase, isSupabaseConfigured, fetchSalon, saveSalon, type SalonRow } from '../lib/supabase';

// ─── Types ──────────────────────────────────────────────────────────────────
interface AuthState {
  user: User | null;
  session: Session | null;
  salon: SalonRow | null;
  loading: boolean;
  isMockMode: boolean;
}

interface AuthActions {
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signInWithPhone: (phone: string) => Promise<{ error: string | null }>;
  verifyOTP: (phone: string, token: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshSalon: () => Promise<void>;
  updateSalon: (updates: Partial<SalonRow>) => void;
}

type AuthContextType = AuthState & AuthActions;

// ─── Context ─────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isMockMode = !isSupabaseConfigured();

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [salon, setSalon] = useState<SalonRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isMockMode) {
      setLoading(false);
      return;
    }

    const sb = getSupabase()!;

    // Initialize from existing session (also handles OAuth redirect callback)
    sb.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const salonData = await fetchSalon(session.user.id);
        // If no salon row yet (new Google user), create a basic one
        if (!salonData) {
          const email = session.user.email || '';
          const displayName = session.user.user_metadata?.full_name || email.split('@')[0] || 'My Salon';
          await saveSalon({
            id: session.user.id,
            wa_number: session.user.phone || '',
            salon_name: displayName,
            salon_type: 'ladies_parlour',
            city: 'India',
            subscription_tier: 'chamak',
            credit_balance: 500,
            budget_tier: 3000,
            language: 'hi-en',
            top_services: [],
            target_customers: [],
          });
          const freshSalon = await fetchSalon(session.user.id);
          setSalon(freshSalon);
        } else {
          setSalon(salonData);
        }
      }
      setLoading(false);
    });

    // Listen for auth state changes (includes OAuth sign-in)
    const { data: { subscription } } = sb.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const salonData = await fetchSalon(session.user.id);
        if (!salonData && event === 'SIGNED_IN') {
          const email = session.user.email || '';
          const displayName = session.user.user_metadata?.full_name || email.split('@')[0] || 'My Salon';
          await saveSalon({
            id: session.user.id,
            wa_number: session.user.phone || '',
            salon_name: displayName,
            salon_type: 'ladies_parlour',
            city: 'India',
            subscription_tier: 'chamak',
            credit_balance: 500,
            budget_tier: 3000,
            language: 'hi-en',
            top_services: [],
            target_customers: [],
          });
          const freshSalon = await fetchSalon(session.user.id);
          setSalon(freshSalon);
        } else {
          setSalon(salonData);
        }
      } else {
        setSalon(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [isMockMode]);

  // ── Actions ──────────────────────────────────────────────────────────────

  const signInWithGoogle = useCallback(async () => {
    if (isMockMode) return { error: 'Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' };
    const sb = getSupabase()!;
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
    return { error: error?.message ?? null };
  }, [isMockMode]);

  const signInWithPhone = useCallback(async (phone: string) => {
    if (isMockMode) return { error: null };
    const sb = getSupabase()!;
    const normalized = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
    const { error } = await sb.auth.signInWithOtp({
      phone: normalized,
      options: { channel: 'sms' },
    });
    return { error: error?.message ?? null };
  }, [isMockMode]);

  const verifyOTP = useCallback(async (phone: string, token: string) => {
    if (isMockMode) return { error: null };
    const sb = getSupabase()!;
    const normalized = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
    const { error } = await sb.auth.verifyOtp({ phone: normalized, token, type: 'sms' });
    return { error: error?.message ?? null };
  }, [isMockMode]);

  const signOut = useCallback(async () => {
    if (!isMockMode) {
      const sb = getSupabase()!;
      await sb.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setSalon(null);
  }, [isMockMode]);

  const refreshSalon = useCallback(async () => {
    if (!user) return;
    const updated = await fetchSalon(user.id);
    if (updated) setSalon(updated);
  }, [user]);

  const updateSalon = useCallback((updates: Partial<SalonRow>) => {
    setSalon(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, session, salon, loading, isMockMode,
      signInWithGoogle, signInWithPhone, verifyOTP, signOut, refreshSalon, updateSalon,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
