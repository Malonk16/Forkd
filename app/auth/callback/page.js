'use client';
import { useEffect } from 'react';

export const dynamic = 'force-dynamic';

export default function AuthCallback() {
  useEffect(() => {
    const initSupabase = async () => {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          window.location.href = '/';
        }
      });
      return () => subscription.unsubscribe();
    };
    initSupabase();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, sans-serif' }}>
      <div style={{ fontSize: 13, color: '#8A8070' }}>Signing you in...</div>
    </div>
  );
}