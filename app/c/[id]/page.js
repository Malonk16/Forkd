'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { use } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SharedCollectionPage({ params }) {
  const { id } = use(params);
  const [collection, setCollection] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: col } = await supabase
        .from('collections')
        .select('*, collection_recipes(recipe_id)')
        .eq('id', id)
        .single();

      if (!col) { setNotFound(true); setLoading(false); return; }
      setCollection(col);

      const ids = (col.collection_recipes || []).map(r => r.recipe_id);
      if (ids.length > 0) {
        const { data: recipeData } = await supabase.from('recipes').select('*').in('id', ids);
        if (recipeData) setRecipes(recipeData);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const s = { fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' };

  if (loading) return <div style={{ ...s, minHeight: '100vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A8070', fontSize: 13 }}>Loading...</div>;
  if (notFound) return <div style={{ ...s, minHeight: '100vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A8070', fontSize: 13 }}>Collection not found.</div>;

  return (
    <div style={{ ...s, minHeight: '100vh', background: '#F5F0E8' }}>
      <div style={{ borderBottom: '1px solid #D4CDB8', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', letterSpacing: -0.3 }}>Forkd</div>
        <a href="/login" style={{ background: '#1A1A1A', color: '#F5F0E8', padding: '7px 16px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          Save to my Forkd →
        </a>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 13, color: '#8A8070', marginBottom: 6 }}>{recipes.length} recipes</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1A1A1A', letterSpacing: -1, marginTop: 0 }}>{collection.name}</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 2, marginBottom: 48 }}>
          {recipes.map(r => (
            <a key={r.id} href={`/r/${r.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#EDE8DC', border: '1px solid #D4CDB8', overflow: 'hidden' }}>
                <div style={{ height: 140, background: '#D4CDB8', overflow: 'hidden' }}>
                  {r.image_url
                    ? <img src={r.image_url} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#B8B0A0' }}>▲</div>}
                </div>
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{r.category}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: '#8A8070', marginTop: 4 }}>{(r.ingredients || []).length} ingredients</div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div style={{ background: '#1A1A1A', padding: '28px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#F5F0E8', marginBottom: 8 }}>Save this collection to your Forkd cookbook</div>
          <div style={{ fontSize: 13, color: '#8A8070', marginBottom: 20 }}>Plan meals, build grocery lists, and organize recipes from TikTok & Instagram.</div>
          <a href="/login" style={{ background: '#F5F0E8', color: '#1A1A1A', padding: '12px 28px', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
            Get Forkd — It's Free
          </a>
        </div>
      </div>
    </div>
  );
}