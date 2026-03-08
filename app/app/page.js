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
    { id: 'collections', label: 'Collections' },
    { id: 'mealplan', label: 'Meal Plan' },
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

function RecipeCard({ recipe, onClick, isFavorite, onToggleFavorite }) {
  return (
    <div onClick={() => onClick(recipe)}
      style={{ background: '#EDE8DC', border: '1px solid #D4CDB8', cursor: 'pointer', overflow: 'hidden', transition: 'transform 0.15s, box-shadow 0.15s', position: 'relative' }}
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
        <button
          onClick={e => { e.stopPropagation(); onToggleFavorite(recipe.id); }}
          style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(245,240,232,0.85)', border: 'none', borderRadius: 0, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 15, lineHeight: 1, transition: 'all 0.15s' }}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
      <div style={{ padding: '16px 18px' }}>
        <div style={{ fontSize: 11, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{recipe.category}</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A', marginBottom: 10, lineHeight: 1.3 }}>{recipe.title}</div>
        <div style={{ fontSize: 12, color: '#8A8070' }}>{(recipe.ingredients || []).length} ingredients</div>
      </div>
    </div>
  );
}

function RecipeModal({ recipe, onClose, onAddToGrocery, onEdit, onDelete, onNutritionSaved }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [servings, setServings] = useState(1);
  const [nutrition, setNutrition] = useState(recipe.nutrition || null);
  const [loadingNutrition, setLoadingNutrition] = useState(false);

  // Parse a quantity string into { value, unit }
  const parseAmount = (str) => {
    if (!str) return { value: null, unit: str || '' };
    const s = str.trim();
    const fracMatch = s.match(/^(\d+)\s*\/\s*(\d+)\s*(.*)/);
    if (fracMatch) return { value: parseInt(fracMatch[1]) / parseInt(fracMatch[2]), unit: fracMatch[3].trim() };
    const mixedMatch = s.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)\s*(.*)/);
    if (mixedMatch) return { value: parseInt(mixedMatch[1]) + parseInt(mixedMatch[2]) / parseInt(mixedMatch[3]), unit: mixedMatch[4].trim() };
    const numMatch = s.match(/^([\d.]+)\s*(.*)/);
    if (numMatch) return { value: parseFloat(numMatch[1]), unit: numMatch[2].trim() };
    return { value: null, unit: s };
  };

  const formatValue = (val) => {
    if (Number.isInteger(val)) return String(val);
    const fracs = [[1,4],[1,3],[1,2],[2,3],[3,4]];
    for (const [n, d] of fracs) {
      if (Math.abs(val - n/d) < 0.01) return `${n}/${d}`;
    }
    const whole = Math.floor(val);
    const rem = val - whole;
    for (const [n, d] of fracs) {
      if (Math.abs(rem - n/d) < 0.01) return whole > 0 ? `${whole} ${n}/${d}` : `${n}/${d}`;
    }
    return parseFloat(val.toFixed(2)).toString();
  };

  const scaleAmount = (amount, factor) => {
    if (factor === 1) return amount;
    const { value, unit } = parseAmount(amount);
    if (value === null) return amount; // can't scale text-only amounts
    return `${formatValue(value * factor)}${unit ? ' ' + unit : ''}`.trim();
  };

  const scaledIngredients = (recipe.ingredients || []).map(ing => ({
    ...ing,
    amount: scaleAmount(ing.amount, servings),
  }));

  const scaledRecipe = { ...recipe, ingredients: scaledIngredients };

  if (!recipe) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) { setConfirmDelete(false); onClose(); } }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={async () => {
              const shareUrl = `${window.location.origin}/r/${recipe.share_id || recipe.id}`;
              if (navigator.share) {
                try { await navigator.share({ title: recipe.title, url: shareUrl }); } catch (e) { /* user cancelled */ }
              } else {
                await navigator.clipboard.writeText(shareUrl);
                alert('Link copied to clipboard!');
              }
            }} style={{ background: 'transparent', border: '1px solid #D4CDB8', color: '#8A8070', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '5px 12px', fontFamily: 'inherit', letterSpacing: 0.2 }}>
              Share
            </button>
            <button onClick={() => { onEdit(recipe); onClose(); }}
              style={{ background: 'transparent', border: '1px solid #D4CDB8', color: '#8A8070', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '5px 12px', fontFamily: 'inherit', letterSpacing: 0.2 }}>
              Edit
            </button>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: 22, color: '#8A8070', cursor: 'pointer', padding: 4, lineHeight: 1 }}>×</button>
          </div>
        </div>
        <div style={{ padding: '24px 28px' }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>Ingredients</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.8 }}>Servings</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid #D4CDB8' }}>
                  <button onClick={() => setServings(s => Math.max(0.5, s - (s <= 1 ? 0.5 : 1)))}
                    style={{ width: 28, height: 28, background: '#EDE8DC', border: 'none', color: '#1A1A1A', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>−</button>
                  <span style={{ minWidth: 32, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#1A1A1A', padding: '0 4px' }}>
                    {servings % 1 === 0 ? servings : servings.toString()}×
                  </span>
                  <button onClick={() => setServings(s => s + (s < 1 ? 0.5 : 1))}
                    style={{ width: 28, height: 28, background: '#EDE8DC', border: 'none', color: '#1A1A1A', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>+</button>
                </div>
              </div>
            </div>
            {scaledIngredients.map((ing, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #D4CDB8' }}>
                <span style={{ fontSize: 14, color: '#1A1A1A' }}>{ing.name}</span>
                <span style={{ fontSize: 14, color: servings !== 1 ? '#1A1A1A' : '#8A8070', fontWeight: servings !== 1 ? 600 : 400, transition: 'all 0.15s' }}>{ing.amount}</span>
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

          {/* Nutrition */}
          <div style={{ marginBottom: 24 }}>
            {nutrition ? (
              <div>
                <div style={{ fontSize: 11, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12, fontWeight: 600 }}>
                  Nutrition <span style={{ fontWeight: 400 }}>· {servings === 1 ? 'per serving' : `${servings} servings`}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, marginBottom: 10 }}>
                  {[
                    { label: 'Calories', value: Math.round(nutrition.calories * servings), unit: 'kcal' },
                    { label: 'Protein', value: Math.round(nutrition.protein * servings), unit: 'g' },
                    { label: 'Carbs', value: Math.round(nutrition.carbs * servings), unit: 'g' },
                    { label: 'Fat', value: Math.round(nutrition.fat * servings), unit: 'g' },
                  ].map(n => (
                    <div key={n.label} style={{ background: '#EDE8DC', border: '1px solid #D4CDB8', padding: '12px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: servings !== 1 ? '#1A1A1A' : '#1A1A1A', lineHeight: 1 }}>{n.value}</div>
                      <div style={{ fontSize: 10, color: '#8A8070', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{n.label}</div>
                      <div style={{ fontSize: 10, color: '#B8B0A0' }}>{n.unit}</div>
                    </div>
                  ))}
                </div>
                <button onClick={async () => {
                  setLoadingNutrition(true);
                  setNutrition(null);
                  try {
                    const res = await fetch('/api/nutrition', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ingredients: recipe.ingredients, title: recipe.title }) });
                    const data = await res.json();
                    if (data.calories) { setNutrition(data); onNutritionSaved(recipe.id, data); }
                  } catch(e) { console.error(e); }
                  setLoadingNutrition(false);
                }} style={{ fontSize: 11, color: '#B8B0A0', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                  Recalculate
                </button>
              </div>
            ) : (
              <button onClick={async () => {
                setLoadingNutrition(true);
                try {
                  const res = await fetch('/api/nutrition', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ingredients: recipe.ingredients, title: recipe.title }) });
                  const data = await res.json();
                  if (data.calories) { setNutrition(data); onNutritionSaved(recipe.id, data); }
                } catch(e) { console.error(e); }
                setLoadingNutrition(false);
              }} disabled={loadingNutrition}
                style={{ width: '100%', padding: '11px', background: 'transparent', border: '1px solid #D4CDB8', color: loadingNutrition ? '#B8B0A0' : '#8A8070', fontSize: 13, cursor: loadingNutrition ? 'default' : 'pointer', fontFamily: 'inherit', marginBottom: 0 }}>
                {loadingNutrition ? 'Calculating nutrition...' : 'Calculate Nutrition'}
              </button>
            )}
          </div>

          <button onClick={() => { onAddToGrocery(scaledRecipe); onClose(); }}
            style={{ width: '100%', padding: '13px', background: '#1A1A1A', border: 'none', color: '#F5F0E8', fontSize: 14, fontWeight: 600, cursor: 'pointer', letterSpacing: 0.2, marginBottom: 10 }}>
            Add to Grocery List{servings !== 1 ? ` (${servings}×)` : ''}
          </button>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)}
              style={{ width: '100%', padding: '11px', background: 'transparent', border: '1px solid #D4CDB8', color: '#8A8070', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              Delete Recipe
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { onDelete(recipe.id); onClose(); }}
                style={{ flex: 1, padding: '11px', background: '#1A1A1A', border: 'none', color: '#F5F0E8', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Yes, delete it
              </button>
              <button onClick={() => setConfirmDelete(false)}
                style={{ flex: 1, padding: '11px', background: 'transparent', border: '1px solid #D4CDB8', color: '#8A8070', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddRecipeView({ onSave, onCancel, session, editRecipe, sharedUrl, onClearSharedUrl }) {
  const [form, setForm] = useState(editRecipe ? {
    title: editRecipe.title || '',
    category: editRecipe.category || 'Dinner',
    source_url: editRecipe.source_url || '',
    instructions: editRecipe.instructions || '',
    ingredients: editRecipe.ingredients?.length ? editRecipe.ingredients : [{ name: '', amount: '' }],
  } : { title: '', category: 'Dinner', source_url: '', instructions: '', ingredients: [{ name: '', amount: '' }] });
  const [caption, setCaption] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [extractError, setExtractError] = useState('');
  const [extractingUrl, setExtractingUrl] = useState(false);
  const fileRef = useRef();
  const screenshotRef = useRef();
  const [extractingScreenshot, setExtractingScreenshot] = useState(false);

  // Auto-extract when a sharedUrl is passed in
  useEffect(() => {
    if (sharedUrl) {
      handleExtractFromUrl(sharedUrl);
    }
  }, [sharedUrl]);

  const handleExtractFromScreenshot = async (file) => {
    if (!file) return;
    setExtractingScreenshot(true);
    setExtractError('');
    try {
      // Convert image to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const mediaType = file.type || 'image/jpeg';

      const res = await fetch('/api/extract-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mediaType }),
      });
      const data = await res.json();
      if (data.error) {
        setExtractError('Could not find a recipe in this screenshot. Try a clearer image of the caption.');
      } else if (data.title || data.ingredients) {
        setForm(f => ({
          ...f,
          title: data.title || f.title,
          ingredients: data.ingredients?.length ? data.ingredients : f.ingredients,
          instructions: data.instructions || f.instructions,
        }));
      }
    } catch (e) {
      setExtractError('Failed to read screenshot.');
      console.error(e);
    }
    setExtractingScreenshot(false);
  };

  const handleExtractFromUrl = async (url) => {
    setExtractingUrl(true);
    setExtractError('');
    try {
      const res = await fetch('/api/extract-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.error) {
        setExtractError('Could not extract recipe from this link. Try pasting the caption manually.');
      } else if (data.title || data.ingredients) {
        setForm(f => ({
          ...f,
          title: data.title || f.title,
          ingredients: data.ingredients?.length ? data.ingredients : f.ingredients,
          instructions: data.instructions || f.instructions,
          source_url: url,
          source_platform: data.platform || f.source_platform,
        }));
      }
    } catch (e) {
      setExtractError('Failed to extract from URL.');
    }
    setExtractingUrl(false);
    if (onClearSharedUrl) onClearSharedUrl();
  };

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
    setExtractError('');
    try {
      const res = await fetch('/api/extract-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption }),
      });
      const data = await res.json();
      if (data.error) { setExtractError(data.error); }
      else if (data.title || data.ingredients) {
        setForm(f => ({
          ...f,
          title: data.title || f.title,
          ingredients: data.ingredients?.length ? data.ingredients : f.ingredients,
          instructions: data.instructions || f.instructions,
        }));
      }
    } catch (e) {
      setExtractError('Failed to extract — check your API key.');
      console.error(e);
    }
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
    let image_url = editRecipe?.image_url || null;
    if (imageFile && session) {
      setUploadingImage(true);
      const ext = imageFile.name.split('.').pop();
      const path = `${session.user.id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('recipe-images').upload(path, imageFile);
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('recipe-images').getPublicUrl(path);
        image_url = publicUrl;
      }
      setUploadingImage(false);
    }
    const platform = form.source_url ? detectPlatform(form.source_url) : 'Manual';
    const cleanIngredients = form.ingredients
      .filter(i => i && (i.name || '').trim())
      .map(i => ({ name: (i.name || '').trim(), amount: (i.amount || '').trim() }));
    await onSave({ ...form, source_platform: platform, image_url, ingredients: cleanIngredients }, editRecipe?.id);
    setSaving(false);
  };

  const inputStyle = { width: '100%', background: '#EDE8DC', border: '1px solid #D4CDB8', padding: '11px 14px', fontSize: 14, color: '#1A1A1A', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' };
  const labelStyle = { fontSize: 11, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, display: 'block', fontWeight: 600 };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {extractingUrl && (
        <div style={{ padding: '12px 16px', background: '#EDE8DC', borderLeft: '2px solid #1A1A1A', marginBottom: 20, fontSize: 13, color: '#1A1A1A' }}>
          Extracting recipe from shared link...
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1A1A1A', letterSpacing: -0.5 }}>{editRecipe ? 'Edit Recipe' : 'Add Recipe'}</h1>
        <button onClick={onCancel} style={{ background: 'transparent', border: '1px solid #D4CDB8', color: '#8A8070', padding: '8px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
      </div>

      <div style={{ background: '#EDE8DC', border: '1px solid #D4CDB8', marginBottom: 28 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #D4CDB8' }}>
          {[{ key: 'caption', label: 'Paste Caption' }, { key: 'screenshot', label: '📷 Screenshot' }].map(tab => (
            <button key={tab.key} onClick={() => setForm(f => ({ ...f, _tab: tab.key }))}
              style={{ flex: 1, padding: '12px 8px', background: (form._tab || 'caption') === tab.key ? '#F5F0E8' : 'transparent', border: 'none', borderBottom: (form._tab || 'caption') === tab.key ? '2px solid #1A1A1A' : '2px solid transparent', fontSize: 11, fontWeight: 600, color: (form._tab || 'caption') === tab.key ? '#1A1A1A' : '#8A8070', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap', minWidth: 0 }}>
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{ padding: '20px' }}>
          {(form._tab || 'caption') === 'caption' ? (
            <>
              <textarea value={caption} onChange={e => setCaption(e.target.value)}
                placeholder="Paste the recipe caption here and AI will extract the ingredients automatically..."
                rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, marginBottom: 12 }} />
              {extractError && (
                <div style={{ fontSize: 13, color: '#8A8070', marginBottom: 10, borderLeft: '2px solid #D4CDB8', paddingLeft: 10 }}>{extractError}</div>
              )}
              <button onClick={handleExtract} disabled={extracting || !caption.trim()}
                style={{ background: extracting || !caption.trim() ? '#B8B0A0' : '#1A1A1A', border: 'none', color: '#F5F0E8', padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: extracting || !caption.trim() ? 'default' : 'pointer', fontFamily: 'inherit' }}>
                {extracting ? 'Extracting...' : 'Extract with AI'}
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 13, color: '#8A8070', lineHeight: 1.6, marginBottom: 14 }}>
                On Instagram, tap <strong style={{ color: '#1A1A1A' }}>···</strong> on a post → <strong style={{ color: '#1A1A1A' }}>Screenshot</strong> the caption, then upload it here.
              </div>
              <div onClick={() => screenshotRef.current.click()}
                style={{ border: '1px dashed #D4CDB8', background: '#F5F0E8', cursor: 'pointer', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#8A8070' }}>
                  {extractingScreenshot ? 'Reading screenshot...' : 'Tap to upload screenshot'}
                </span>
              </div>
              <input ref={screenshotRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => { if (e.target.files[0]) handleExtractFromScreenshot(e.target.files[0]); }} />
              {extractError && (
                <div style={{ fontSize: 13, color: '#8A8070', borderLeft: '2px solid #D4CDB8', paddingLeft: 10 }}>{extractError}</div>
              )}
            </>
          )}
        </div>
      </div>

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
        {uploadingImage ? 'Uploading photo...' : saving ? 'Saving...' : editRecipe ? 'Save Changes' : 'Save Recipe'}
      </button>
    </div>
  );
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = ['breakfast', 'lunch', 'dinner'];

function getWeekDays(offset) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + offset * 7);
  return DAYS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function MealPlanView({ recipes, mealPlan, onAssign, onAddWeekToGrocery, onAddMealToGrocery, onRemoveMealFromGrocery, groceryItems, weekOffset, setWeekOffset }) {
  const [pickerSlot, setPickerSlot] = useState(null); // slot key being assigned
  const [pickerSearch, setPickerSearch] = useState('');
  const [addedSlots, setAddedSlots] = useState({});
  const weekDays = getWeekDays(weekOffset);

  const fmt = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const weekLabel = `${fmt(weekDays[0])} – ${fmt(weekDays[6])}`;

  const slotKey = (date, meal) => `${date.toISOString().split('T')[0]}_${meal}`;

  const isToday = (date) => {
    const t = new Date();
    return date.toDateString() === t.toDateString();
  };

  const filteredRecipes = recipes.filter(r =>
    r.title.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  const slotKeys = weekDays.map(d => MEALS.map(m => slotKey(d, m))).flat();

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1A1A1A', letterSpacing: -0.5 }}>Meal Plan</h1>
        <button
          onClick={() => onAddWeekToGrocery(slotKeys)}
          style={{ background: '#1A1A1A', border: 'none', color: '#F5F0E8', padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 0.2 }}>
          Add Week to Grocery List
        </button>
      </div>

      {/* Week nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <button onClick={() => setWeekOffset(w => w - 1)}
          style={{ background: 'transparent', border: '1px solid #D4CDB8', color: '#8A8070', width: 32, height: 32, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>‹</button>
        <span style={{ fontSize: 13, color: '#8A8070', minWidth: 140, textAlign: 'center' }}>{weekLabel}</span>
        <button onClick={() => setWeekOffset(w => w + 1)}
          style={{ background: 'transparent', border: '1px solid #D4CDB8', color: '#8A8070', width: 32, height: 32, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>›</button>
        {weekOffset !== 0 && (
          <button onClick={() => setWeekOffset(0)}
            style={{ background: 'transparent', border: 'none', color: '#8A8070', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>
            This week
          </button>
        )}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '72px repeat(3, 1fr)', gap: 2, marginBottom: 2 }}>
        <div />
        {MEALS.map(m => (
          <div key={m} style={{ fontSize: 11, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, paddingBottom: 10, textAlign: 'center' }}>{m}</div>
        ))}
      </div>

      {weekDays.map((date, di) => {
        const today = isToday(date);
        return (
          <div key={di} style={{ display: 'grid', gridTemplateColumns: '72px repeat(3, 1fr)', gap: 2, marginBottom: 2 }}>
            {/* Day label */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 8 }}>
              <div style={{ fontSize: 11, fontWeight: today ? 700 : 600, color: today ? '#1A1A1A' : '#8A8070', textTransform: 'uppercase', letterSpacing: 0.5 }}>{DAYS[di].slice(0, 3)}</div>
              <div style={{ fontSize: 12, color: today ? '#1A1A1A' : '#B8B0A0' }}>{date.getDate()}</div>
            </div>

            {/* Meal slots */}
            {MEALS.map(meal => {
              const key = slotKey(date, meal);
              const entry = mealPlan[key];
              const recipe = entry?.recipes;
              return (
                <div key={meal}
                  onClick={() => { setPickerSlot(key); setPickerSearch(''); }}
                  style={{
                    minHeight: 72,
                    background: recipe ? '#EDE8DC' : '#F5F0E8',
                    border: `1px solid ${today ? '#B8B0A0' : '#D4CDB8'}`,
                    cursor: 'pointer',
                    padding: '10px 12px',
                    position: 'relative',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#EDE8DC'}
                  onMouseLeave={e => e.currentTarget.style.background = recipe ? '#EDE8DC' : '#F5F0E8'}>
                  {recipe ? (
                    <>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1A1A', lineHeight: 1.3, marginBottom: 4, paddingRight: 16 }}>{recipe.title}</div>
                      <div style={{ fontSize: 11, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{recipe.category}</div>
                      {(() => {
                        const inGrocery = (recipe.ingredients || []).some(ing =>
                          groceryItems.some(g => g.name.toLowerCase() === ing.name.toLowerCase())
                        );
                        const justAdded = addedSlots[key];
                        if (inGrocery) {
                          return (
                            <div style={{ display: 'flex', gap: 4 }}>
                              <span style={{ fontSize: 10, color: '#4A7C59', background: '#E8F0EA', border: '1px solid #A8C4B0', padding: '2px 7px', letterSpacing: 0.3 }}>
                                {justAdded ? '✓ added' : '✓ in list'}
                              </span>
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  onRemoveMealFromGrocery(recipe);
                                }}
                                style={{ fontSize: 10, color: '#B8705A', background: 'transparent', border: '1px solid #D4C4BC', padding: '2px 7px', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 0.3 }}>
                                remove
                              </button>
                            </div>
                          );
                        }
                        return (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onAddMealToGrocery(recipe);
                              setAddedSlots(prev => ({ ...prev, [key]: true }));
                              setTimeout(() => setAddedSlots(prev => { const n = {...prev}; delete n[key]; return n; }), 2500);
                            }}
                            style={{ fontSize: 10, color: '#8A8070', background: 'transparent', border: '1px solid #D4CDB8', padding: '2px 7px', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 0.3 }}>
                            + grocery
                          </button>
                        );
                      })()}
                      <button
                        onClick={e => { e.stopPropagation(); onAssign(key, null); }}
                        style={{ position: 'absolute', top: 6, right: 6, background: 'transparent', border: 'none', color: '#B8B0A0', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 2 }}>×</button>
                    </>
                  ) : (
                    <div style={{ fontSize: 12, color: '#B8B0A0', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 50 }}>+ Add</div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Recipe picker modal */}
      {pickerSlot && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) setPickerSlot(null); }}>
          <div style={{ background: '#F5F0E8', width: '100%', maxWidth: 480, maxHeight: '70vh', display: 'flex', flexDirection: 'column', border: '1px solid #D4CDB8' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #D4CDB8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A' }}>Choose a Recipe</div>
              <button onClick={() => setPickerSlot(null)} style={{ background: 'transparent', border: 'none', fontSize: 20, color: '#8A8070', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: '12px 24px', borderBottom: '1px solid #D4CDB8' }}>
              <input
                autoFocus
                value={pickerSearch}
                onChange={e => setPickerSearch(e.target.value)}
                placeholder="Search recipes..."
                style={{ width: '100%', background: '#EDE8DC', border: '1px solid #D4CDB8', padding: '9px 12px', fontSize: 13, color: '#1A1A1A', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {filteredRecipes.length === 0 && (
                <div style={{ padding: '32px', textAlign: 'center', fontSize: 13, color: '#8A8070' }}>No recipes found</div>
              )}
              {filteredRecipes.map(recipe => (
                <div key={recipe.id}
                  onClick={() => { onAssign(pickerSlot, recipe); setPickerSlot(null); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 24px', borderBottom: '1px solid #D4CDB8', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#EDE8DC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ width: 40, height: 40, background: '#D4CDB8', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#B8B0A0', overflow: 'hidden' }}>
                    {recipe.image_url
                      ? <img src={recipe.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : (recipe.category === 'Breakfast' ? '☀' : recipe.category === 'Dessert' ? '◇' : '▲')}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{recipe.title}</div>
                    <div style={{ fontSize: 11, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.5 }}>{recipe.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function GroceryView({ items, onClear, onToggle }) {
  const grouped = items.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const checkedCount = items.filter(i => i.checked).length;

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1A1A1A', letterSpacing: -0.5 }}>Grocery List</h1>
        {items.length > 0 && (
          <button onClick={onClear} style={{ background: 'transparent', border: '1px solid #D4CDB8', color: '#8A8070', padding: '8px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Clear All</button>
        )}
      </div>
      {items.length > 0 && (
        <div style={{ fontSize: 13, color: '#8A8070', marginBottom: 28 }}>{checkedCount} of {items.length} checked</div>
      )}
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
                <div key={item.id} onClick={() => onToggle(item.id, !item.checked)}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px', borderBottom: i < catItems.length - 1 ? '1px solid #D4CDB8' : 'none', cursor: 'pointer' }}>
                  <div style={{ width: 18, height: 18, border: '1.5px solid', borderColor: item.checked ? '#1A1A1A' : '#B8B0A0', background: item.checked ? '#1A1A1A' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                    {item.checked && <div style={{ width: 8, height: 8, background: '#F5F0E8' }} />}
                  </div>
                  <span style={{ fontSize: 14, color: item.checked ? '#B8B0A0' : '#1A1A1A', textDecoration: item.checked ? 'line-through' : 'none', flex: 1, transition: 'all 0.15s' }}>{item.name}</span>
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

function CollectionsView({ collections, recipes, selectedCollection, onSelectCollection, onCreateCollection, onDeleteCollection, onAddRecipeToCollection, onRemoveRecipeFromCollection, onShareCollection, onViewRecipe }) {
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [search, setSearch] = useState('');

  const collectionRecipeIds = new Set((selectedCollection?.collection_recipes || []).map(r => r.recipe_id));
  const collectionRecipes = recipes.filter(r => collectionRecipeIds.has(r.id));
  const filteredAll = recipes.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) && !collectionRecipeIds.has(r.id));

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, color: '#8A8070', marginBottom: 6 }}>{collections.length} collections</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1A1A1A', letterSpacing: -1 }}>Collections</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedCollection ? '260px 1fr' : '1fr', gap: 24, alignItems: 'start' }}>
        {/* Left: collection list */}
        <div>
          {/* Create new */}
          {creating ? (
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input autoFocus value={newName} onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && newName.trim()) { onCreateCollection(newName.trim()); setNewName(''); setCreating(false); } if (e.key === 'Escape') { setCreating(false); setNewName(''); } }}
                placeholder="Collection name..." style={{ flex: 1, background: '#EDE8DC', border: '1px solid #1A1A1A', padding: '8px 12px', fontSize: 13, color: '#1A1A1A', outline: 'none', fontFamily: 'inherit' }} />
              <button onClick={() => { if (newName.trim()) { onCreateCollection(newName.trim()); setNewName(''); setCreating(false); } }}
                style={{ background: '#1A1A1A', border: 'none', color: '#F5F0E8', padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>+</button>
            </div>
          ) : (
            <button onClick={() => setCreating(true)}
              style={{ width: '100%', padding: '10px 14px', background: 'transparent', border: '1px dashed #D4CDB8', color: '#8A8070', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 12, textAlign: 'left' }}>
              + New Collection
            </button>
          )}

          {collections.length === 0 && !creating && (
            <div style={{ fontSize: 13, color: '#B8B0A0', padding: '20px 0' }}>No collections yet</div>
          )}

          {collections.map(col => {
            const count = (col.collection_recipes || []).length;
            const isActive = selectedCollection?.id === col.id;
            return (
              <div key={col.id} onClick={() => onSelectCollection(isActive ? null : col)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', marginBottom: 2, background: isActive ? '#1A1A1A' : '#EDE8DC', border: '1px solid', borderColor: isActive ? '#1A1A1A' : '#D4CDB8', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: isActive ? '#F5F0E8' : '#1A1A1A' }}>{col.name}</div>
                  <div style={{ fontSize: 11, color: isActive ? '#B8B0A0' : '#8A8070', marginTop: 2 }}>{count} recipe{count !== 1 ? 's' : ''}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => onShareCollection(col)}
                    style={{ background: 'transparent', border: `1px solid ${isActive ? '#555' : '#D4CDB8'}`, color: isActive ? '#B8B0A0' : '#8A8070', fontSize: 11, padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Share
                  </button>
                  <button onClick={() => { if (confirm(`Delete "${col.name}"?`)) onDeleteCollection(col.id); }}
                    style={{ background: 'transparent', border: 'none', color: isActive ? '#666' : '#B8B0A0', fontSize: 16, cursor: 'pointer', padding: '0 2px', lineHeight: 1 }}>×</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: collection contents */}
        {selectedCollection && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A' }}>{selectedCollection.name}</div>
              <button onClick={() => setShowAddRecipe(v => !v)}
                style={{ background: '#1A1A1A', border: 'none', color: '#F5F0E8', padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                {showAddRecipe ? 'Done' : '+ Add Recipe'}
              </button>
            </div>

            {showAddRecipe && (
              <div style={{ background: '#EDE8DC', border: '1px solid #D4CDB8', padding: 16, marginBottom: 20 }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search recipes to add..."
                  style={{ width: '100%', background: '#F5F0E8', border: '1px solid #D4CDB8', padding: '8px 12px', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 10 }} />
                <div style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {filteredAll.map(r => (
                    <div key={r.id} onClick={() => onAddRecipeToCollection(selectedCollection.id, r.id)}
                      style={{ padding: '8px 12px', background: '#F5F0E8', border: '1px solid #D4CDB8', cursor: 'pointer', fontSize: 13, color: '#1A1A1A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{r.title}</span>
                      <span style={{ fontSize: 11, color: '#8A8070' }}>{r.category}</span>
                    </div>
                  ))}
                  {filteredAll.length === 0 && <div style={{ fontSize: 13, color: '#B8B0A0' }}>All recipes already added</div>}
                </div>
              </div>
            )}

            {collectionRecipes.length === 0 ? (
              <div style={{ fontSize: 13, color: '#B8B0A0', padding: '32px 0' }}>No recipes in this collection yet — add some above.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
                {collectionRecipes.map(r => (
                  <div key={r.id} style={{ position: 'relative' }}>
                    <div onClick={() => onViewRecipe(r)} style={{ cursor: 'pointer' }}>
                      <div style={{ height: 120, background: '#D4CDB8', overflow: 'hidden', position: 'relative' }}>
                        {r.image_url ? <img src={r.image_url} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#B8B0A0' }}>▲</div>}
                      </div>
                      <div style={{ background: '#EDE8DC', border: '1px solid #D4CDB8', borderTop: 'none', padding: '10px 12px' }}>
                        <div style={{ fontSize: 11, color: '#8A8070', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{r.category}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{r.title}</div>
                      </div>
                    </div>
                    <button onClick={() => onRemoveRecipeFromCollection(selectedCollection.id, r.id)}
                      style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(26,26,26,0.7)', border: 'none', color: '#F5F0E8', width: 22, height: 22, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
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
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [mealPlan, setMealPlan] = useState({});
  const [weekOffset, setWeekOffset] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [sharedUrl, setSharedUrl] = useState('');
  const [extractingUrl, setExtractingUrl] = useState(false);
  const [extractUrlError, setExtractUrlError] = useState('');
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (code) {
          try { await supabase.auth.exchangeCodeForSession(code); } catch (e) { console.error(e); }
          window.history.replaceState({}, '', '/');
        }
      }

      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession) { window.location.href = '/login'; return; }
      setSession(currentSession);
      setAuthChecked(true);

      // Handle Web Share Target
      if (typeof window !== 'undefined') {
        const sp = new URLSearchParams(window.location.search);
        const shareUrl = sp.get('share');
        const shareText = sp.get('sharetext');
        if (shareUrl) {
          setSharedUrl(shareUrl);
          setView('add');
          window.history.replaceState({}, '', '/');
        } else if (shareText) {
          setView('add');
          window.history.replaceState({}, '', '/');
        }
      }

      // Load recipes
      try {
        const { data } = await supabase.from('recipes').select('*').eq('user_id', currentSession.user.id).order('created_at', { ascending: false });
        if (data && data.length > 0) {
          setRecipes(data);
        } else {
          // Only show demo if user has truly never saved a recipe
          const { count } = await supabase.from('recipes').select('*', { count: 'exact', head: true }).eq('user_id', currentSession.user.id);
          if (count === 0) { setRecipes(SAMPLE_RECIPES); setUsingDemo(true); }
          else { setRecipes([]); }
        }
      } catch (e) { setRecipes(SAMPLE_RECIPES); setUsingDemo(true); }

      // Load grocery items
      try {
        const { data: groceryData } = await supabase
          .from('grocery_items')
          .select('*')
          .eq('user_id', currentSession.user.id)
          .order('created_at', { ascending: true });
        if (groceryData) setGroceryItems(groceryData);
      } catch (e) { console.error('Grocery load error:', e); }

      // Load meal plan
      try {
        const { data: mealData } = await supabase
          .from('meal_plan')
          .select('*, recipes(*)')
          .eq('user_id', currentSession.user.id);
        if (mealData) {
          const map = {};
          mealData.forEach(entry => { map[entry.slot_key] = entry; });
          setMealPlan(map);
        }
      } catch (e) { console.error('Meal plan load error:', e); }

      // Load favorites
      try {
        const { data: favData } = await supabase
          .from('favorites')
          .select('recipe_id')
          .eq('user_id', currentSession.user.id);
        if (favData) setFavoriteIds(new Set(favData.map(f => f.recipe_id)));
      } catch (e) { console.error('Favorites load error:', e); }

      // Check onboarding
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_done')
          .eq('id', currentSession.user.id)
          .single();
        if (!profile?.onboarding_done) setShowWelcomeModal(true);
      } catch (e) {
        // Profile doesn't exist yet — first login
        setShowWelcomeModal(true);
      }

      // Load collections
      try {
        const { data: colData } = await supabase
          .from('collections')
          .select('*, collection_recipes(recipe_id)')
          .eq('user_id', currentSession.user.id)
          .order('created_at', { ascending: true });
        if (colData) setCollections(colData);
      } catch (e) { console.error('Collections load error:', e); }

      setLoading(false);
    };
    init();
  }, []);

  const handleSaveRecipe = async (form, editId) => {
    // Re-fetch session in case it expired
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    const activeSession = currentSession || session;
    if (!activeSession) { alert('Not logged in — please refresh and log in again.'); return; }

    const { _tab, ...cleanForm } = form;
    if (editId) {
      await handleUpdateRecipe(cleanForm, editId);
    } else {
      const { data, error } = await supabase.from('recipes')
        .insert({ ...cleanForm, user_id: activeSession.user.id })
        .select()
        .single();
      if (error) {
        alert('Save failed: ' + error.message);
        console.error('Save error:', JSON.stringify(error));
        return;
      }
      if (data) {
        setRecipes(prev => [data, ...prev.filter(r => typeof r.id !== 'number')]);
        setUsingDemo(false);
      }
      setView('cookbook');
    }
  };

  const handleUpdateRecipe = async (form, id) => {
    if (!session || !id) return;
    const { _tab, ...cleanForm } = form;
    const { data, error } = await supabase.from('recipes').update(cleanForm).eq('id', id).select().single();
    if (error) { console.error('Update error:', error); alert('Failed to update recipe: ' + error.message); return; }
    if (data) { setRecipes(prev => prev.map(r => r.id === id ? data : r)); }
    setEditingRecipe(null);
    setView('cookbook');
  };

  const mergeAmounts = (existing, incoming) => {
    // Parse a quantity string like "2 lbs", "1/2 cup", "3" into { value, unit }
    const parse = (str) => {
      if (!str) return { value: 0, unit: '' };
      const s = str.trim();
      // Handle fractions like 1/2
      const fracMatch = s.match(/^(\d+)\s*\/\s*(\d+)\s*(.*)/);
      if (fracMatch) return { value: parseInt(fracMatch[1]) / parseInt(fracMatch[2]), unit: fracMatch[3].trim() };
      // Handle mixed numbers like 1 1/2
      const mixedMatch = s.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)\s*(.*)/);
      if (mixedMatch) return { value: parseInt(mixedMatch[1]) + parseInt(mixedMatch[2]) / parseInt(mixedMatch[3]), unit: mixedMatch[4].trim() };
      // Handle decimals/integers
      const numMatch = s.match(/^([\d.]+)\s*(.*)/);
      if (numMatch) return { value: parseFloat(numMatch[1]), unit: numMatch[2].trim() };
      return { value: 0, unit: s };
    };

    const formatValue = (val) => {
      if (Number.isInteger(val)) return String(val);
      // Convert back to a friendly fraction if close
      const fracs = [[1,4],[1,3],[1,2],[2,3],[3,4]];
      for (const [n, d] of fracs) {
        if (Math.abs(val - n/d) < 0.01) return `${n}/${d}`;
      }
      const whole = Math.floor(val);
      const rem = val - whole;
      for (const [n, d] of fracs) {
        if (Math.abs(rem - n/d) < 0.01) return whole > 0 ? `${whole} ${n}/${d}` : `${n}/${d}`;
      }
      return parseFloat(val.toFixed(2)).toString();
    };

    const a = parse(existing);
    const b = parse(incoming);
    // Only sum if units match or one is empty
    const aUnit = a.unit.toLowerCase().replace(/s$/, ''); // normalize plural
    const bUnit = b.unit.toLowerCase().replace(/s$/, '');
    if (aUnit === bUnit || !b.unit || !a.unit) {
      const total = a.value + b.value;
      const unit = a.unit || b.unit;
      return `${formatValue(total)}${unit ? ' ' + unit : ''}`.trim();
    }
    // Units differ — fall back to concatenation
    return `${existing} + ${incoming}`;
  };

  const handleAddToMealPlan = async (slotKey, recipe) => {
    if (!session) return;
    const existing = mealPlan[slotKey];
    if (existing) {
      await supabase.from('meal_plan').delete().eq('id', existing.id);
    }
    if (!recipe) {
      setMealPlan(prev => { const n = {...prev}; delete n[slotKey]; return n; });
      return;
    }
    const { data } = await supabase.from('meal_plan')
      .insert({ user_id: session.user.id, slot_key: slotKey, recipe_id: recipe.id })
      .select('*, recipes(*)')
      .single();
    if (data) setMealPlan(prev => ({ ...prev, [slotKey]: data }));
  };

  const handleAddWeekToGrocery = async (slotKeys) => {
    if (!session) return;
    // Collect all unique recipes assigned this week
    const seen = new Set();
    const allRecipes = [];
    slotKeys.forEach(key => {
      const entry = mealPlan[key];
      if (entry?.recipes && !seen.has(entry.recipes.id)) {
        seen.add(entry.recipes.id);
        allRecipes.push(entry.recipes);
      }
    });
    if (allRecipes.length === 0) return;

    // Build full merged ingredient list across all recipes at once
    const newItems = [];
    allRecipes.forEach(recipe => {
      (recipe.ingredients || []).forEach(ing => {
        newItems.push({ name: ing.name, amount: ing.amount, category: recipe.category });
      });
    });

    // Merge with existing grocery items
    const toInsert = [];
    const updatedLocal = [...groceryItems];
    for (const item of newItems) {
      const existingIdx = updatedLocal.findIndex(i => i.name.toLowerCase() === item.name.toLowerCase());
      if (existingIdx >= 0) {
        const existing = updatedLocal[existingIdx];
        const newAmount = mergeAmounts(existing.amount, item.amount);
        updatedLocal[existingIdx] = { ...existing, amount: newAmount };
        await supabase.from('grocery_items').update({ amount: newAmount }).eq('id', existing.id);
      } else {
        toInsert.push({ ...item, checked: false, user_id: session.user.id });
      }
    }
    if (toInsert.length > 0) {
      const { data: inserted } = await supabase.from('grocery_items').insert(toInsert).select();
      if (inserted) setGroceryItems([...updatedLocal, ...inserted]);
    } else {
      setGroceryItems(updatedLocal);
    }
    setView('grocery');
  };

  const handleToggleFavorite = async (recipeId) => {
    if (!session) return;
    const isFav = favoriteIds.has(recipeId);
    if (isFav) {
      await supabase.from('favorites').delete().eq('user_id', session.user.id).eq('recipe_id', recipeId);
      setFavoriteIds(prev => { const n = new Set(prev); n.delete(recipeId); return n; });
    } else {
      await supabase.from('favorites').insert({ user_id: session.user.id, recipe_id: recipeId });
      setFavoriteIds(prev => new Set([...prev, recipeId]));
    }
  };

  const handleCompleteOnboarding = async () => {
    setShowWelcomeModal(false);
    setShowTooltip(true);
    if (session) {
      await supabase.from('profiles').upsert({ id: session.user.id, onboarding_done: true });
    }
  };

  const handleReplayOnboarding = () => {
    setShowWelcomeModal(true);
    setShowTooltip(false);
  };

  const handleDeleteRecipe = async (id) => {
    await supabase.from('recipes').delete().eq('id', id);
    setRecipes(prev => {
      const updated = prev.filter(r => r.id !== id);
      // Never fall back to sample recipes after a real delete
      return updated;
    });
    setUsingDemo(false);
  };

  const handleAddToGrocery = async (recipe, redirect = true) => {
    if (!session) return;
    const newItems = (recipe.ingredients || []).map((ing) => ({
      name: ing.name,
      amount: ing.amount,
      category: recipe.category,
      checked: false,
      user_id: session.user.id,
    }));

    const toInsert = [];
    const updatedLocal = [...groceryItems];

    for (const item of newItems) {
      const existingIdx = updatedLocal.findIndex(i => i.name.toLowerCase() === item.name.toLowerCase());
      if (existingIdx >= 0) {
        const existing = updatedLocal[existingIdx];
        const newAmount = mergeAmounts(existing.amount, item.amount);
        updatedLocal[existingIdx] = { ...existing, amount: newAmount };
        await supabase.from('grocery_items').update({ amount: newAmount }).eq('id', existing.id);
      } else {
        toInsert.push(item);
      }
    }

    if (toInsert.length > 0) {
      const { data: inserted } = await supabase.from('grocery_items').insert(toInsert).select();
      if (inserted) setGroceryItems([...updatedLocal, ...inserted]);
    } else {
      setGroceryItems(updatedLocal);
    }

    if (redirect) setView('grocery');
  };

  const handleRemoveRecipeFromGrocery = async (recipe) => {
    if (!session) return;
    const names = (recipe.ingredients || []).map(i => i.name.toLowerCase());
    const toRemove = groceryItems.filter(i => names.includes(i.name.toLowerCase()));
    const ids = toRemove.map(i => i.id);
    if (ids.length === 0) return;
    await supabase.from('grocery_items').delete().in('id', ids);
    setGroceryItems(prev => prev.filter(i => !ids.includes(i.id)));
  };

  const handleToggleGroceryItem = async (id, checked) => {
    setGroceryItems(prev => prev.map(i => i.id === id ? { ...i, checked } : i));
    await supabase.from('grocery_items').update({ checked }).eq('id', id);
  };

  const handleClearGrocery = async () => {
    if (!session) return;
    await supabase.from('grocery_items').delete().eq('user_id', session.user.id);
    setGroceryItems([]);
  };

  const filtered = recipes.filter(r => {
    const matchCat = category === 'All' || r.category === category;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchFav = !showFavoritesOnly || favoriteIds.has(r.id);
    return matchCat && matchSearch && matchFav;
  });

  if (!authChecked || loading) return (
    <div style={{ minHeight: '100vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, sans-serif' }}>
      <div style={{ fontSize: 13, color: '#8A8070' }}>Loading...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0E8', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} active={view} onNavigate={setView} />

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
          <button onClick={handleReplayOnboarding}
            title="Show onboarding"
            style={{ background: 'transparent', border: '1px solid #D4CDB8', color: '#8A8070', width: 32, height: 32, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>?</button>
          <div style={{ position: 'relative' }}>
            <button onClick={() => { setView('add'); setShowTooltip(false); }}
              style={{ background: '#1A1A1A', border: 'none', color: '#F5F0E8', padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', letterSpacing: 0.2, fontFamily: 'inherit', position: 'relative', zIndex: showTooltip ? 102 : 1 }}>
              + Add Recipe
            </button>
            {showTooltip && (
              <>
                {/* Backdrop */}
                <div onClick={() => setShowTooltip(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,0.4)', zIndex: 100 }} />
                {/* Pulsing ring */}
                <div style={{ position: 'absolute', inset: -4, border: '2px solid #1A1A1A', zIndex: 101, animation: 'pulse 1.5s ease-in-out infinite', pointerEvents: 'none' }} />
                {/* Callout */}
                <div style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, background: '#1A1A1A', color: '#F5F0E8', padding: '16px 20px', width: 280, zIndex: 102, boxShadow: '0 8px 32px rgba(26,26,26,0.3)' }}>
                  <div style={{ position: 'absolute', top: -6, right: 20, width: 12, height: 12, background: '#1A1A1A', transform: 'rotate(45deg)' }} />
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Add your first recipe</div>
                  <div style={{ fontSize: 12, color: '#B8B0A0', lineHeight: 1.6, marginBottom: 14 }}>
                    Paste a TikTok or Instagram caption and AI will automatically extract the ingredients and instructions for you.
                  </div>
                  <button onClick={() => { setView('add'); setShowTooltip(false); }}
                    style={{ background: '#F5F0E8', border: 'none', color: '#1A1A1A', padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}>
                    Let's add a recipe →
                  </button>
                  <button onClick={() => setShowTooltip(false)}
                    style={{ background: 'transparent', border: 'none', color: '#666', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', width: '100%', marginTop: 8, padding: '4px 0' }}>
                    Skip for now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.04); }
        }
      `}</style>

      <div style={{ padding: '40px 32px', maxWidth: 1200, margin: '0 auto' }}>
        {view === 'cookbook' && (
          <>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 13, color: '#8A8070', marginBottom: 6 }}>{filtered.length} recipes</div>
              <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1A1A1A', letterSpacing: -1 }}>Cookbook</h1>
            </div>
            {usingDemo && (
              <div style={{ padding: '12px 16px', background: '#EDE8DC', borderLeft: '2px solid #D4CDB8', marginBottom: 28, fontSize: 13, color: '#8A8070' }}>
                Showing sample recipes — add your own to get started
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  style={{ padding: '6px 14px', background: category === cat ? '#1A1A1A' : '#EDE8DC', border: '1px solid', borderColor: category === cat ? '#1A1A1A' : '#D4CDB8', color: category === cat ? '#F5F0E8' : '#8A8070', fontSize: 13, fontWeight: category === cat ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {cat}
                </button>
              ))}
              <button onClick={() => setShowFavoritesOnly(f => !f)}
                style={{ padding: '6px 14px', background: showFavoritesOnly ? '#1A1A1A' : '#EDE8DC', border: '1px solid', borderColor: showFavoritesOnly ? '#1A1A1A' : '#D4CDB8', color: showFavoritesOnly ? '#F5F0E8' : '#8A8070', fontSize: 13, fontWeight: showFavoritesOnly ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>
                ★ Favorites{favoriteIds.size > 0 ? ` (${favoriteIds.size})` : ''}
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 2 }}>
              {filtered.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} onClick={setSelectedRecipe} isFavorite={favoriteIds.has(recipe.id)} onToggleFavorite={handleToggleFavorite} />)}
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '64px', color: '#8A8070', fontSize: 14 }}>No recipes found</div>
            )}
          </>
        )}
        {view === 'collections' && <CollectionsView
            collections={collections}
            recipes={recipes}
            selectedCollection={selectedCollection}
            onSelectCollection={setSelectedCollection}
            onCreateCollection={async (name) => {
              const { data: { session: s } } = await supabase.auth.getSession();
              if (!s) return;
              const { data } = await supabase.from('collections').insert({ name, user_id: s.user.id }).select().single();
              if (data) setCollections(prev => [...prev, { ...data, collection_recipes: [] }]);
            }}
            onDeleteCollection={async (id) => {
              await supabase.from('collections').delete().eq('id', id);
              setCollections(prev => prev.filter(c => c.id !== id));
              if (selectedCollection?.id === id) setSelectedCollection(null);
            }}
            onAddRecipeToCollection={async (collectionId, recipeId) => {
              const { error } = await supabase.from('collection_recipes').insert({ collection_id: collectionId, recipe_id: recipeId });
              if (!error) setCollections(prev => prev.map(c => c.id === collectionId ? { ...c, collection_recipes: [...(c.collection_recipes || []), { recipe_id: recipeId }] } : c));
            }}
            onRemoveRecipeFromCollection={async (collectionId, recipeId) => {
              await supabase.from('collection_recipes').delete().eq('collection_id', collectionId).eq('recipe_id', recipeId);
              setCollections(prev => prev.map(c => c.id === collectionId ? { ...c, collection_recipes: (c.collection_recipes || []).filter(r => r.recipe_id !== recipeId) } : c));
            }}
            onShareCollection={async (collection) => {
              const shareUrl = `${window.location.origin}/c/${collection.id}`;
              if (navigator.share) {
                try { await navigator.share({ title: collection.name, url: shareUrl }); } catch (e) { /* user cancelled */ }
              } else {
                await navigator.clipboard.writeText(shareUrl);
                alert('Collection link copied!');
              }
            }}
            onViewRecipe={setSelectedRecipe}
          />}
        {view === 'add' && <AddRecipeView onSave={handleSaveRecipe} onCancel={() => { setEditingRecipe(null); setView('cookbook'); }} session={session} editRecipe={editingRecipe} sharedUrl={sharedUrl} onClearSharedUrl={() => setSharedUrl('')} />}
        {view === 'mealplan' && <MealPlanView recipes={recipes} mealPlan={mealPlan} onAssign={handleAddToMealPlan} onAddWeekToGrocery={handleAddWeekToGrocery} onAddMealToGrocery={(recipe) => handleAddToGrocery(recipe, false)} onRemoveMealFromGrocery={handleRemoveRecipeFromGrocery} groceryItems={groceryItems} weekOffset={weekOffset} setWeekOffset={setWeekOffset} />}
        {view === 'grocery' && <GroceryView items={groceryItems} onClear={handleClearGrocery} onToggle={handleToggleGroceryItem} />}
      </div>

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#F5F0E8', width: '100%', maxWidth: 480, border: '1px solid #D4CDB8', padding: '48px 40px', textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#1A1A1A', letterSpacing: -1.5, marginBottom: 12 }}>Forkd</div>
            <div style={{ width: 40, height: 2, background: '#D4CDB8', margin: '0 auto 24px' }} />
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A', letterSpacing: -0.5, marginBottom: 12 }}>
              Your recipes, finally organized.
            </div>
            <div style={{ fontSize: 14, color: '#8A8070', lineHeight: 1.7, marginBottom: 32 }}>
              Save recipes from TikTok and Instagram, plan your meals for the week, and auto-build your grocery list — all in one place.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {[
                { icon: '◈', text: 'Paste any recipe caption — AI extracts ingredients instantly' },
                { icon: '◫', text: 'Plan your week with a drag-and-drop meal calendar' },
                { icon: '◻', text: 'Build your grocery list automatically from your meal plan' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, textAlign: 'left', padding: '12px 16px', background: '#EDE8DC', border: '1px solid #D4CDB8' }}>
                  <span style={{ fontSize: 16, color: '#8A8070', flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, color: '#1A1A1A', lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
            <button onClick={handleCompleteOnboarding}
              style={{ width: '100%', padding: '14px', background: '#1A1A1A', border: 'none', color: '#F5F0E8', fontSize: 14, fontWeight: 600, cursor: 'pointer', letterSpacing: 0.2, fontFamily: 'inherit', marginBottom: 12 }}>
              Get Started →
            </button>
            <button onClick={() => setShowWelcomeModal(false)}
              style={{ background: 'transparent', border: 'none', color: '#B8B0A0', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
              I know what I'm doing, skip this
            </button>
          </div>
        </div>
      )}

      {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} onAddToGrocery={handleAddToGrocery} onEdit={(recipe) => { setEditingRecipe(recipe); setView('add'); }} onDelete={(id) => { handleDeleteRecipe(id); setSelectedRecipe(null); }} onNutritionSaved={(id, nutrition) => { supabase.from('recipes').update({ nutrition }).eq('id', id); setRecipes(prev => prev.map(r => r.id === id ? { ...r, nutrition } : r)); }} />}
    </div>
  );
}