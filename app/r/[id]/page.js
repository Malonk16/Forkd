'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SharedRecipePage({ params }) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', params.id)
        .single();
      if (data) setRecipe(data);
      else setNotFound(true);
      setLoading(false);
    };
    load();
  }, [params.id]);

  const s = { fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' };

  if (loading) return <div style={{ ...s, minHeight: '100vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A8070', fontSize: 13 }}>Loading...</div>;
  if (notFound) return <div style={{ ...s, minHeight: '100vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A8070', fontSize: 13 }}>Recipe not found.</div>;

  return (
    <div style={{ ...s, minHeight: '100vh', background: '#F5F0E8' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #D4CDB8', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', letterSpacing: -0.3 }}>Forkd</div>
        <a href="/login" style={{ background: '#1A1A1A', color: '#F5F0E8', padding: '7px 16px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          Save to my Forkd →
        </a>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px' }}>
        {recipe.image_url && (
          <div style={{ height: 280, overflow: 'hidden', marginBottom: 32 }}>
            <img src={recipe.image_url} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ fontSize: 11, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>{recipe.category} · {recipe.source_platform}</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1A1A1A', letterSpacing: -0.5, marginBottom: 32, marginTop: 0 }}>{recipe.title}</h1>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 14 }}>Ingredients</div>
          {(recipe.ingredients || []).map((ing, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #D4CDB8' }}>
              <span style={{ fontSize: 14, color: '#1A1A1A' }}>{ing.name}</span>
              <span style={{ fontSize: 14, color: '#8A8070' }}>{ing.amount}</span>
            </div>
          ))}
        </div>

        {recipe.instructions && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 14 }}>Instructions</div>
            <div style={{ fontSize: 14, color: '#1A1A1A', lineHeight: 1.7 }}>{recipe.instructions}</div>
          </div>
        )}

        {/* CTA */}
        <div style={{ background: '#1A1A1A', padding: '28px 24px', textAlign: 'center', marginTop: 40 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#F5F0E8', marginBottom: 8 }}>Save this recipe to your Forkd cookbook</div>
          <div style={{ fontSize: 13, color: '#8A8070', marginBottom: 20 }}>Plan meals, build grocery lists, and organize recipes from TikTok & Instagram.</div>
          <a href="/login" style={{ background: '#F5F0E8', color: '#1A1A1A', padding: '12px 28px', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
            Get Forkd — It's Free
          </a>
        </div>
      </div>
    </div>
  );
}