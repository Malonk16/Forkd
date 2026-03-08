'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ShareHandler() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const url = params.get('url') || '';
    const text = params.get('text') || '';
    const title = params.get('title') || '';

    // Find the best URL — prefer the url param, fall back to extracting from text
    let sharedUrl = url;
    if (!sharedUrl) {
      const match = text.match(/https?:\/\/[^\s]+/);
      if (match) sharedUrl = match[0];
    }

    // Redirect to home with the shared URL as a query param
    if (sharedUrl) {
      router.replace(`/?share=${encodeURIComponent(sharedUrl)}`);
    } else if (text) {
      router.replace(`/?sharetext=${encodeURIComponent(text)}`);
    } else {
      router.replace('/');
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F0E8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, sans-serif',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>Forkd</div>
        <div style={{ fontSize: 13, color: '#8A8070' }}>Opening recipe...</div>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense>
      <ShareHandler />
    </Suspense>
  );
}
