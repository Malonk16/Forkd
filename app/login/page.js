'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F0E8',
      display: 'flex',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    }}>

      {/* LEFT — Branding */}
      <div style={{
        width: '50%',
        background: '#1A1A1A',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '56px 64px',
      }}>
        {/* Logo */}
        <div style={{ fontSize: 22, fontWeight: 700, color: '#F5F0E8', letterSpacing: -0.5 }}>Forkd</div>

        {/* Center copy */}
        <div>
          <div style={{ fontSize: 42, fontWeight: 700, color: '#F5F0E8', letterSpacing: -1.5, lineHeight: 1.15, marginBottom: 20 }}>
            Your recipes.<br />Always with you.
          </div>
          <div style={{ fontSize: 15, color: '#8A8070', lineHeight: 1.7, maxWidth: 380 }}>
            Save recipes from Instagram and TikTok, build grocery lists automatically, and keep your personal cookbook organized.
          </div>
        </div>

        {/* Bottom tagline */}
        <div style={{ fontSize: 12, color: '#3A3A3A', letterSpacing: 0.5 }}>
          FORKD — RECIPE VAULT
        </div>
      </div>

      {/* RIGHT — Login */}
      <div style={{
        width: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '56px 64px',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', letterSpacing: -0.5, marginBottom: 8 }}>Sign in</div>
          <div style={{ fontSize: 14, color: '#8A8070', marginBottom: 48, lineHeight: 1.6 }}>
            Your personal recipe vault awaits.
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: '#1A1A1A',
              border: 'none',
              color: '#F5F0E8',
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              letterSpacing: 0.2,
            }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#F5F0E8" opacity="0.9"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#F5F0E8" opacity="0.7"/>
              <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#F5F0E8" opacity="0.5"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#F5F0E8" opacity="0.6"/>
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div style={{ marginTop: 32, padding: '20px', background: '#EDE8DC', borderLeft: '2px solid #D4CDB8' }}>
            <div style={{ fontSize: 12, color: '#8A8070', lineHeight: 1.7 }}>
              By signing in you agree to our terms of service and privacy policy. Your recipe data is private and never shared.
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}