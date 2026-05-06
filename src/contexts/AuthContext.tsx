import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { getSupabase, isSupabaseConfigured, fetchSalon, saveSalon, type SalonRow } from '../lib/supabase';

// ─── Types ──────────────────────────────────────────────────────────────────
interface AuthState {
  user: User | null;
  session: Session | null;
  salon: SalonRow | null;
  loading: boolean;
}

interface AuthActions {
  signUpWithEmail: (email: string, password: string, salonName: string) => Promise<{ error: string | null; needsVerification?: boolean }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshSalon: () => Promise<void>;
  updateSalon: (updates: Partial<SalonRow>) => void;
}

type AuthContextType = AuthState & AuthActions;

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [salon, setSalon] = useState<SalonRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    const sb = getSupabase()!;

    sb.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const salonData = await fetchSalon(session.user.id);
        setSalon(salonData);
      }
      setLoading(false);
    });

    const { data: { subscription } } = sb.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const salonData = await fetchSalon(session.user.id);
        setSalon(salonData);
      } else {
        setSalon(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Sign Up ───────────────────────────────────────────────────────────────
  const signUpWithEmail = useCallback(async (email: string, password: string, salonName: string) => {
    const sb = getSupabase();
    if (!sb) return { error: 'Supabase not configured' };

    const { data, error } = await sb.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { salon_name: salonName },
        // Disable email confirmation for MVP — users can use immediately
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) return { error: error.message };

    // Create salon row immediately
    if (data.user) {
      await saveSalon({
        id: data.user.id,
        wa_number: '',
        salon_name: salonName.trim(),
        salon_type: 'ladies_parlour',
        city: 'India',
        subscription_tier: 'chamak',
        credit_balance: 500,
        budget_tier: 3000,
        language: 'hi-en',
        top_services: [],
        target_customers: [],
      });
    }

    // Check if email confirmation is required
    const needsVerification = !data.session;
    return { error: null, needsVerification };
  }, []);

  // ── Sign In ───────────────────────────────────────────────────────────────
  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const sb = getSupabase();
    if (!sb) return { error: 'Supabase not configured' };

    const { error } = await sb.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    return { error: error?.message ?? null };
  }, []);

  // ── Sign Out ──────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    setUser(null);
    setSession(null);
    setSalon(null);
  }, []);

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
      user, session, salon, loading,
      signUpWithEmail, signInWithEmail, signOut, refreshSalon, updateSalon,
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
