'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Meal Prep', 'Drinks'];

const SAMPLE_RECIPES = [
  { id: 1, title: 'Crispy Smash Burgers', category: 'Dinner', source_platform: 'TikTok', source_url: '#', image_url: null, ingredients: [{ name: 'Ground beef', amount: '1 lb' }, { name: 'American cheese', amount: '4 slices' }, { name: 'Brioche buns', amount: '4' }], instructions: 'Form loose balls, smash on griddle, cook 2 min per side, add cheese.' },
  { id: 2, title: 'Overnight Oats', category: 'Breakfast', source_platform: 'Instagram', source_url: '#', image_url: null, ingredients: [{ name: 'Rolled oats', amount: '1 cup' }, { name: 'Almond milk', amount: '1 cup' }, { name: 'Chia seeds', amount: '2 tbsp' }], instructions: 'Mix all ingredients, refrigerate overnight, top with fruit.' },
  { id: 3, title: 'Chicken Stir Fry', category: 'Dinner', source_platform: 'TikTok', source_url: '#', image_url: null, ingredients: [{ name: 'Chicken breast', amount: '2 lbs' }, { name: 'Soy sauce', amount: '3 tbsp' }, { name: 'Mixed vegetables', amount: '2 cups' }], instructions: 'Slice chicken, stir fry with vegetables, add sauce, serve over rice.' },
  { id: 4, title: 'Avocado Toast', category: 'Breakfast', source_platform: 'Instagram', source_url: '#', image_url: null, ingredients: [{ name: 'Sourdough bread', amount: '2 slices' }, { name: 'Avocado', amount: '1' }, { name: 'Everything bagel seasoning', amount: '1 tsp' }], instructions: 'Toast bread, mash avocado, season and serve.' },
];

function Sidebar({ open, onClose, active, onNavigate }) {
  const NAV = [
    { id: 'cookbook', label: 'Cookbook' },
    { id: 'grocery', label: 'Grocery List' },
    { id: 'add', label: 'Add Recipe' },
  ];
  return (
    <>
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,0.3)', zIndex: 40 }} />}
      <div style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: 240, background: '#1A1A1A', zIndex: 50, transform: open ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.25s ease', display: 'flex', flexDirection: 'column', padding: '40px 0' }}>
        <div style={{ padding: '0 28px', marginBottom: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#F5F0E8', letterSpacing: -0.5 }}>Forkd</div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 4 }}>×</button>
        </div>
        {NAV.map(item => (
          <button key={item.id} onClick={() => { onNavigate(item.id); onClose(); }}
            style={{ padding: '11px 20px', margin: '1px 8px', background: active === item.id ? '#2A2A2A' : 'transparent', border: 'none', borderLeft: active === item.id ? '2px solid #F5F0E8' : '2px solid transparent', color: active === item.id ? '#F5F0E8' : '#666', fontSize: 14, fontWeight: active === item.id ? 600 : 400, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
            {item.label}
          </button>
        ))}
        <div style={{ marginTop: 'auto', padding: '0 28px' }}>
          <div style={{ height: 1, background: '#2A2A2A', marginBottom: 20 }} />
          <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login'; }}
            style={{ background: 'transparent', border: 'none', color: '#555', fontSize: 13, cursor: 'pointer', padding: 0 }}>
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}

function RecipeCard({ recipe, onClick }) {
  return (
    <div onClick={() => onClick(recipe)}
      style={{ background: '#EDE8DC', border: '1px solid #D4CDB8', cursor: 'pointer', overflow: 'hidden', transition: 'transform 0.15s, box-shadow 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,26,26,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
      <div style={{ height: 160, background: '#D4CDB8', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {recipe.image_url ? (
          <img src={recipe.image_url} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ fontSize: 32, color: '#B8B0A0' }}>
            {recipe.category === 'Breakfast' ? '☀' : recipe.category === 'Dessert' ? '◇' : '▲'}
          </div>
        )}
        <div style={{ position: 'absolute', top: 12, right: 12, background: '#1A1A1A', color: '#F5F0E8', fontSize: 10, fontWeight: 600, letterSpacing: 0.8, padding: '4px 8px', textTransform: 'uppercase' }}>
          {recipe.source_platform || 'Manual'}
        </div>
      </div>
      <div style={{ padding: '16px 18px' }}>
        <div style={{ fontSize: 11, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{recipe.category}</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A', marginBottom: 10, lineHeight: 1.3 }}>{recipe.title}</div>
        <div style={{ fontSize: 12, color: '#8A8070' }}>{(recipe.ingredients || []).length} ingredients</div>
      </div>
    </div>
  );
}

function RecipeModal({ recipe, onClose, onAddToGrocery }) {
  if (!recipe) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#F5F0E8', width: '100%', maxWidth: 600, maxHeight: '85vh', overflowY: 'auto', border: '1px solid #D4CDB8' }}>
        {recipe.image_url && (
          <div style={{ height: 220, overflow: 'hidden' }}>
            <img src={recipe.image_url} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #D4CDB8', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{recipe.category} · {recipe.source_platform}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', letterSpacing: -0.5 }}>{recipe.title}</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: 22, color: '#8A8070', cursor: 'pointer', padding: 4, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: '24px 28px' }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14, fontWeight: 600 }}>Ingredients</div>
            {(recipe.ingredients || []).map((ing, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #D4CDB8' }}>
                <span style={{ fontSize: 14, color: '#1A1A1A' }}>{ing.name}</span>
                <span style={{ fontSize: 14, color: '#8A8070' }}>{ing.amount}</span>
              </div>
            ))}
          </div>
          {recipe.instructions && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14, fontWeight: 600 }}>Instructions</div>
              <div style={{ fontSize: 14, color: '#1A1A1A', lineHeight: 1.7 }}>{recipe.instructions}</div>
            </div>
          )}
          {recipe.source_url && recipe.source_url !== '#' && (
            <a href={recipe.source_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#8A8070', textDecoration: 'underline', display: 'block', marginBottom: 24 }}>
              View original source
            </a>
          )}
          <button onClick={() => { onAddToGrocery(recipe); onClose(); }}
            style={{ width: '100%', padding: '13px', background: '#1A1A1A', border: 'none', color: '#F5F0E8', fontSize: 14, fontWeight: 600, cursor: 'pointer', letterSpacing: 0.2 }}>
            Add to Grocery List
          </button>
        </div>
      </div>
    </div>
  );
}

function AddRecipeView({ onSave, onCancel, session }) {
  const [form, setForm] = useState({ title: '', category: 'Dinner', source_url: '', instructions: '', ingredients: [{ name: '', amount: '' }] });
  const [caption, setCaption] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileRef = useRef();

  const addIngredient = () => setForm(f => ({ ...f, ingredients: [...f.ingredients, { name: '', amount: '' }] }));
  const removeIngredient = (i) => setForm(f => ({ ...f, ingredients: f.ingredients.filter((_, idx) => idx !== i) }));
  const updateIngredient = (i, field, value) => setForm(f => ({ ...f, ingredients: f.ingredients.map((ing, idx) => idx === i ? { ...ing, [field]: value } : ing) }));

  const detectPlatform = (url) => {
    if (url.includes('tiktok')) return 'TikTok';
    if (url.includes('instagram')) return 'Instagram';
    if (url.includes('youtube')) return 'YouTube';
    return 'Other';
  };

  const handleExtract = async () => {
    if (!caption.trim()) return;
    setExtracting(true);
    try {
      const res = await fetch('/api/extract-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption }),
      });
      const data = await res.json();
      if (data.title || data.ingredients) {
        setForm(f => ({
          ...f,
          title: data.title || f.title,
          ingredients: data.ingredients?.length ? data.ingredients : f.ingredients,
          instructions: data.instructions || f.instructions,
        }));
      }
    } catch (e) { console.error(e); }
    setExtracting(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.title) return;
    setSaving(true);

    let image_url = null;
    if (imageFile && session) {
      setUploadingImage(true);
      const ext = imageFile.name.split('.').pop();
      const path = `${session.user.id}/${Date.now()}.${ext}`;
      const { data: uploadData, error } = await supabase.storage.from('recipe-images').upload(path, imageFile);
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('recipe-images').getPublicUrl(path);
        image_url = publicUrl;
      }
      setUploadingImage(false);
    }

    const platform = form.source_url ? detectPlatform(form.source_url) : 'Manual';
    await onSave({ ...form, source_platform: platform, image_url, ingredients: form.ingredients.filter(i => i.name) });
    setSaving(false);
  };

  const inputStyle = { width: '100%', background: '#EDE8DC', border: '1px solid #D4CDB8', padding: '11px 14px', fontSize: 14, color: '#1A1A1A', outline: 'none', fontFamily: 'inherit' };
  const labelStyle = { fontSize: 11, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, display: 'block', fontWeight: 600 };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1A1A1A', letterSpacing: -0.5 }}>Add Recipe</h1>
        <button onClick={onCancel} style={{ background: 'transparent', border: '1px solid #D4CDB8', color: '#8A8070', padding: '8px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
      </div>

      {/* AI EXTRACTION */}
      <div style={{ background: '#EDE8DC', border: '1px solid #D4CDB8', padding: '20px', marginBottom: 28 }}>
        <label style={labelStyle}>Paste Caption from TikTok or Instagram</label>
        <textarea value={caption} onChange={e => setCaption(e.target.value)}
          placeholder="Paste the recipe caption here and AI will extract the ingredients automatically..."
          rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, marginBottom: 12 }} />
        <button onClick={handleExtract} disabled={extracting || !caption.trim()}
          style={{ background: extracting || !caption.trim() ? '#B8B0A0' : '#1A1A1A', border: 'none', color: '#F5F0E8', padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: extracting || !caption.trim() ? 'default' : 'pointer', fontFamily: 'inherit' }}>
          {extracting ? 'Extracting...' : 'Extract with AI'}
        </button>
      </div>

      {/* IMAGE UPLOAD */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Recipe Photo (optional)</label>
        <div onClick={() => fileRef.current.click()}
          style={{ border: '1px solid #D4CDB8', background: '#EDE8DC', cursor: 'pointer', overflow: 'hidden', height: imagePreview ? 'auto' : 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {imagePreview ? (
            <img src={imagePreview} alt="preview" style={{ width: '100%', maxHeight: 220, objectFit: 'cover' }} />
          ) : (
            <div style={{ fontSize: 13, color: '#8A8070' }}>Click to upload photo</div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
        {imagePreview && (
          <button onClick={() => { setImageFile(null); setImagePreview(null); }}
            style={{ background: 'transparent', border: 'none', color: '#8A8070', fontSize: 12, cursor: 'pointer', marginTop: 6, padding: 0, fontFamily: 'inherit' }}>
            Remove photo
          </button>
        )}
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Recipe Title</label>
        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Crispy Smash Burgers" style={inputStyle} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div>
          <label style={labelStyle}>Category</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
            {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Source URL (optional)</label>
          <input value={form.source_url} onChange={e => setForm(f => ({ ...f, source_url: e.target.value }))} placeholder="Paste Instagram or TikTok link" style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Ingredients</label>
          <button onClick={addIngredient} style={{ background: 'transparent', border: 'none', color: '#1A1A1A', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>+ Add</button>
        </div>
        {form.ingredients.map((ing, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 32px', gap: 8, marginBottom: 8 }}>
            <input value={ing.name} onChange={e => updateIngredient(i, 'name', e.target.value)} placeholder="Ingredient name" style={inputStyle} />
            <input value={ing.amount} onChange={e => updateIngredient(i, 'amount', e.target.value)} placeholder="Amount" style={inputStyle} />
            <button onClick={() => removeIngredient(i)} style={{ background: '#EDE8DC', border: '1px solid #D4CDB8', color: '#8A8070', cursor: 'pointer', fontSize: 16 }}>×</button>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 32 }}>
        <label style={labelStyle}>Instructions</label>
        <textarea value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} placeholder="Write steps here..." rows={5}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
      </div>

      <button onClick={handleSave} disabled={saving || !form.title}
        style={{ width: '100%', padding: '14px', background: saving || !form.title ? '#8A8070' : '#1A1A1A', border: 'none', color: '#F5F0E8', fontSize: 14, fontWeight: 600, cursor: saving || !form.title ? 'default' : 'pointer', letterSpacing: 0.2, fontFamily: 'inherit' }}>
        {uploadingImage ? 'Uploading photo...' : saving ? 'Saving...' : 'Save Recipe'}
      </button>
    </div>
  );
}

function GroceryView({ items, onClear }) {
  const [checked, setChecked] = useState({});
  const grouped = items.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});
  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1A1A1A', letterSpacing: -0.5 }}>Grocery List</h1>
        {items.length > 0 && (
          <button onClick={onClear} style={{ background: 'transparent', border: '1px solid #D4CDB8', color: '#8A8070', padding: '8px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Clear All</button>
        )}
      </div>
      {items.length === 0 ? (
        <div style={{ background: '#EDE8DC', border: '1px solid #D4CDB8', padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#8A8070', marginBottom: 8 }}>No items yet</div>
          <div style={{ fontSize: 13, color: '#B8B0A0' }}>Open a recipe and tap "Add to Grocery List"</div>
        </div>
      ) : (
        Object.entries(grouped).map(([cat, catItems]) => (
          <div key={cat} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, fontWeight: 600 }}>{cat}</div>
            <div style={{ background: '#EDE8DC', border: '1px solid #D4CDB8' }}>
              {catItems.map((item, i) => (
                <div key={item.id} onClick={() => toggle(item.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px', borderBottom: i < catItems.length - 1 ? '1px solid #D4CDB8' : 'none', cursor: 'pointer' }}>
                  <div style={{ width: 18, height: 18, border: '1.5px solid', borderColor: checked[item.id] ? '#1A1A1A' : '#B8B0A0', background: checked[item.id] ? '#1A1A1A' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {checked[item.id] && <div style={{ width: 8, height: 8, background: '#F5F0E8' }} />}
                  </div>
                  <span style={{ fontSize: 14, color: checked[item.id] ? '#B8B0A0' : '#1A1A1A', textDecoration: checked[item.id] ? 'line-through' : 'none', flex: 1 }}>{item.name}</span>
                  <span style={{ fontSize: 13, color: '#8A8070' }}>{item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState('cookbook');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [groceryItems, setGroceryItems] = useState([]);
  const [usingDemo, setUsingDemo] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/login'; return; }
      setSession(session);
      setAuthChecked(true);
      try {
        const { data } = await supabase.from('recipes').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
        if (data && data.length > 0) { setRecipes(data); }
        else { setRecipes(SAMPLE_RECIPES); setUsingDemo(true); }
      } catch (e) { setRecipes(SAMPLE_RECIPES); setUsingDemo(true); }
      setLoading(false);
    };
    init();
  }, []);

  const handleSaveRecipe = async (form) => {
    if (!session) return;
    const { data } = await supabase.from('recipes').insert({ ...form, user_id: session.user.id }).select().single();
    if (data) { setRecipes(prev => [data, ...prev.filter(r => typeof r.id !== 'number')]); setUsingDemo(false); }
    setView('cookbook');
  };

  const handleAddToGrocery = (recipe) => {
    const newItems = (recipe.ingredients || []).map((ing, i) => ({ id: `${recipe.id}-${i}`, name: ing.name, amount: ing.amount, category: recipe.category }));
    setGroceryItems(prev => {
      const existing = new Set(prev.map(i => i.name.toLowerCase()));
      const merged = [...prev];
      newItems.forEach(item => {
        if (existing.has(item.name.toLowerCase())) {
          const idx = merged.findIndex(i => i.name.toLowerCase() === item.name.toLowerCase());
          merged[idx] = { ...merged[idx], amount: `${merged[idx].amount} + ${item.amount}` };
        } else { merged.push(item); }
      });
      return merged;
    });
    setView('grocery');
  };

  const filtered = recipes.filter(r => {
    const matchCat = category === 'All' || r.category === category;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (!authChecked || loading) return (
    <div style={{ minHeight: '100vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, sans-serif' }}>
      <div style={{ fontSize: 13, color: '#8A8070' }}>Loading...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0E8', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} active={view} onNavigate={setView} />

      {/* TOP BAR */}
      <div style={{ position: 'sticky', top: 0, background: '#F5F0E8', borderBottom: '1px solid #D4CDB8', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ width: 20, height: 1.5, background: '#1A1A1A' }} />
            <div style={{ width: 14, height: 1.5, background: '#1A1A1A' }} />
            <div style={{ width: 20, height: 1.5, background: '#1A1A1A' }} />
          </button>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', letterSpacing: -0.3 }}>Forkd</div>
        </div>
        {view === 'cookbook' && (
          <div style={{ position: 'relative' }}>
            <input type="text" placeholder="Search recipes..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: '#EDE8DC', border: '1px solid #D4CDB8', padding: '7px 14px 7px 32px', fontSize: 13, color: '#1A1A1A', outline: 'none', width: 220, fontFamily: 'inherit' }} />
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#8A8070', fontSize: 13 }}>⌕</span>
          </div>
        )}
        <button onClick={() => setView('add')} style={{ background: '#1A1A1A', border: 'none', color: '#F5F0E8', padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', letterSpacing: 0.2, fontFamily: 'inherit' }}>
          + Add Recipe
        </button>
      </div>

      {/* MAIN */}
      <div style={{ padding: '40px 32px', maxWidth: 1200, margin: '0 auto' }}>
        {view === 'cookbook' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
              <div>
                <div style={{ fontSize: 13, color: '#8A8070', marginBottom: 6 }}>{filtered.length} recipes</div>
                <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1A1A1A', letterSpacing: -1 }}>Cookbook</h1>
              </div>
            </div>
            {usingDemo && (
              <div style={{ padding: '12px 16px', background: '#EDE8DC', borderLeft: '2px solid #D4CDB8', marginBottom: 28, fontSize: 13, color: '#8A8070' }}>
                Showing sample recipes — add your own to get started
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  style={{ padding: '6px 14px', background: category === cat ? '#1A1A1A' : '#EDE8DC', border: '1px solid', borderColor: category === cat ? '#1A1A1A' : '#D4CDB8', color: category === cat ? '#F5F0E8' : '#8A8070', fontSize: 13, fontWeight: category === cat ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {cat}
                </button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 2 }}>
              {filtered.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} onClick={setSelectedRecipe} />)}
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '64px', color: '#8A8070', fontSize: 14 }}>No recipes found</div>
            )}
          </>
        )}
        {view === 'add' && <AddRecipeView onSave={handleSaveRecipe} onCancel={() => setView('cookbook')} session={session} />}
        {view === 'grocery' && <GroceryView items={groceryItems} onClear={() => setGroceryItems([])} />}
      </div>

      {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} onAddToGrocery={handleAddToGrocery} />}
    </div>
  );
}