'use client';
import { useEffect, useState, useRef } from 'react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isVisible = (id) => visibleSections.has(id);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --cream: #F5F0E8;
          --cream-mid: #EDE8DC;
          --cream-dark: #D4CDB8;
          --ink: #1A1A1A;
          --ink-mid: #3A3A3A;
          --muted: #8A8070;
          --accent: #C8A96E;
        }

        body { background: var(--ink); }

        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 48px; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          transition: all 0.4s ease;
        }
        .nav.scrolled {
          background: rgba(26,26,26,0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .nav-logo {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: var(--cream); letter-spacing: -0.5px;
        }
        .nav-cta {
          background: var(--cream); color: var(--ink);
          padding: 9px 22px; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500; text-decoration: none;
          transition: all 0.2s;
        }
        .nav-cta:hover { background: var(--accent); }

        /* HERO */
        .hero {
          min-height: 100vh; background: var(--ink);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 120px 24px 80px;
          position: relative; overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(200,169,110,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 3px; text-transform: uppercase;
          color: var(--accent); margin-bottom: 28px;
          opacity: 0; animation: fadeUp 0.8s ease 0.2s forwards;
        }
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(52px, 8vw, 96px);
          font-weight: 900; line-height: 1.0;
          color: var(--cream); letter-spacing: -2px;
          margin-bottom: 12px;
          opacity: 0; animation: fadeUp 0.8s ease 0.4s forwards;
        }
        .hero-title em {
          font-style: italic; color: var(--accent);
        }
        .hero-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(16px, 2.5vw, 20px);
          color: var(--muted); font-weight: 300;
          max-width: 520px; line-height: 1.7; margin-bottom: 48px;
          opacity: 0; animation: fadeUp 0.8s ease 0.6s forwards;
        }
        .hero-actions {
          display: flex; gap: 14px; align-items: center; flex-wrap: wrap; justify-content: center;
          opacity: 0; animation: fadeUp 0.8s ease 0.8s forwards;
        }
        .btn-primary {
          background: var(--cream); color: var(--ink);
          padding: 16px 36px; font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 500; text-decoration: none;
          transition: all 0.25s; display: inline-block;
        }
        .btn-primary:hover { background: var(--accent); transform: translateY(-1px); }
        .btn-ghost {
          color: var(--muted); font-family: 'DM Sans', sans-serif;
          font-size: 14px; text-decoration: none;
          border-bottom: 1px solid rgba(138,128,112,0.4);
          padding-bottom: 2px; transition: all 0.2s;
        }
        .btn-ghost:hover { color: var(--cream); border-color: var(--cream); }

        .hero-scroll {
          position: absolute; bottom: 40px; left: 50%;
          transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          opacity: 0; animation: fadeIn 1s ease 1.4s forwards;
        }
        .hero-scroll span {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; letter-spacing: 2px;
          text-transform: uppercase; color: var(--muted);
        }
        .scroll-line {
          width: 1px; height: 40px; background: linear-gradient(to bottom, var(--muted), transparent);
          animation: scrollPulse 2s ease infinite;
        }

        /* FEATURES */
        .features {
          background: var(--cream); padding: 120px 48px;
        }
        .section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 3px; text-transform: uppercase;
          color: var(--muted); margin-bottom: 20px;
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 700; color: var(--ink);
          letter-spacing: -1px; line-height: 1.1;
          margin-bottom: 64px; max-width: 560px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2px;
        }
        .feature-card {
          background: var(--cream-mid);
          border: 1px solid var(--cream-dark);
          padding: 40px 36px;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(26,26,26,0.08);
        }
        .feature-icon {
          font-size: 28px; margin-bottom: 20px; display: block;
        }
        .feature-name {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 700;
          color: var(--ink); margin-bottom: 12px; letter-spacing: -0.3px;
        }
        .feature-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: var(--muted);
          line-height: 1.7; font-weight: 300;
        }

        /* HOW IT WORKS */
        .how {
          background: var(--ink); padding: 120px 48px;
        }
        .how .section-label { color: var(--accent); }
        .how .section-title { color: var(--cream); margin: 0 auto 80px; text-align: center; max-width: none; }
        .steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2px; max-width: 960px; margin: 0 auto;
        }
        .step {
          padding: 40px 32px; position: relative;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
        }
        .step-num {
          font-family: 'Playfair Display', serif;
          font-size: 72px; font-weight: 900;
          color: rgba(200,169,110,0.15);
          line-height: 1; margin-bottom: 20px;
          display: block;
        }
        .step-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 700;
          color: var(--cream); margin-bottom: 12px;
        }
        .step-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: var(--muted);
          line-height: 1.7; font-weight: 300;
        }

        /* PRICING */
        .pricing {
          background: var(--cream); padding: 120px 48px;
          text-align: center;
        }
        .pricing .section-title { margin: 0 auto 16px; text-align: center; max-width: none; }
        .pricing-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; color: var(--muted);
          margin-bottom: 64px; font-weight: 300;
        }
        .pricing-cards {
          display: flex; gap: 2px; justify-content: center;
          flex-wrap: wrap; max-width: 760px; margin: 0 auto;
        }
        .pricing-card {
          flex: 1; min-width: 280px; max-width: 360px;
          border: 1px solid var(--cream-dark);
          padding: 48px 40px; text-align: left;
          background: var(--cream-mid);
        }
        .pricing-card.featured {
          background: var(--ink); border-color: var(--ink);
        }
        .pricing-tier {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 3px; text-transform: uppercase;
          color: var(--muted); margin-bottom: 20px;
        }
        .pricing-card.featured .pricing-tier { color: var(--accent); }
        .pricing-price {
          font-family: 'Playfair Display', serif;
          font-size: 52px; font-weight: 900;
          color: var(--ink); letter-spacing: -2px;
          line-height: 1; margin-bottom: 6px;
        }
        .pricing-card.featured .pricing-price { color: var(--cream); }
        .pricing-period {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: var(--muted);
          margin-bottom: 36px;
        }
        .pricing-features {
          list-style: none; margin-bottom: 40px;
        }
        .pricing-features li {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: var(--muted);
          padding: 10px 0; border-bottom: 1px solid rgba(212,205,184,0.3);
          display: flex; align-items: center; gap: 10px;
          font-weight: 300;
        }
        .pricing-card.featured .pricing-features li {
          color: rgba(245,240,232,0.7);
          border-bottom-color: rgba(255,255,255,0.06);
        }
        .pricing-features li::before { content: '—'; color: var(--accent); font-size: 12px; flex-shrink: 0; }
        .btn-pricing {
          display: block; width: 100%; padding: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500;
          text-align: center; text-decoration: none;
          transition: all 0.2s; cursor: pointer;
          border: none;
        }
        .btn-pricing-outline {
          background: transparent; color: var(--ink);
          border: 1px solid var(--cream-dark);
        }
        .btn-pricing-outline:hover { border-color: var(--ink); }
        .btn-pricing-filled {
          background: var(--cream); color: var(--ink);
        }
        .btn-pricing-filled:hover { background: var(--accent); }

        /* FOOTER */
        .footer {
          background: var(--ink); padding: 48px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 20px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .footer-logo {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700;
          color: var(--cream); letter-spacing: -0.3px;
        }
        .footer-copy {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; color: var(--muted);
        }

        /* ANIMATIONS */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; } 50% { opacity: 1; }
        }
        .animate-up {
          opacity: 0; transform: translateY(32px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .animate-up.visible {
          opacity: 1; transform: translateY(0);
        }
        .animate-up:nth-child(2) { transition-delay: 0.1s; }
        .animate-up:nth-child(3) { transition-delay: 0.2s; }
        .animate-up:nth-child(4) { transition-delay: 0.3s; }

        @media (max-width: 768px) {
          .nav { padding: 0 20px; }
          .features, .how, .pricing { padding: 80px 24px; }
          .footer { padding: 32px 24px; }
          .hero-title { letter-spacing: -1px; }
        }
      `}</style>

      {/* NAV */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo">Forkd</div>
        <a href="/login" className="nav-cta">Get Started Free</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-eyebrow">Eat clean. Cook smarter.</div>
        <h1 className="hero-title">
          Your recipes,<br /><em>finally</em> organized.
        </h1>
        <p className="hero-subtitle">
          Save recipes from TikTok and Instagram, plan your meals for the week, and build your grocery list automatically — all in one place.
        </p>
        <div className="hero-actions">
          <a href="/login" className="btn-primary">Start for free →</a>
          <a href="#how" className="btn-ghost">See how it works</a>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-label">Why Forkd</div>
          <h2 className="section-title">Built for people who take food seriously.</h2>
          <div className="features-grid">
            {[
              {
                icon: '◈',
                name: 'AI Recipe Extraction',
                desc: 'Paste any TikTok or Instagram caption — or upload a screenshot — and AI pulls out every ingredient and instruction automatically.',
              },
              {
                icon: '◫',
                name: 'Weekly Meal Planning',
                desc: 'Drag recipes into your weekly calendar. Breakfast, lunch, dinner — planned in minutes, not hours.',
              },
              {
                icon: '◻',
                name: 'Smart Grocery Lists',
                desc: 'Add a whole week\'s meals to your grocery list in one tap. Ingredients merge automatically so you never buy duplicates.',
              },
              {
                icon: '◎',
                name: 'Nutrition Per Recipe',
                desc: 'Get AI-estimated calories, protein, carbs, and fat for any recipe. Scales with serving size so your macros are always accurate.',
              },
              {
                icon: '★',
                name: 'Favorites & Collections',
                desc: 'Star your go-to recipes and organize them into collections — Bulk Season, Cut Phase, Meal Prep Sunday. Share any collection with a link.',
              },
              {
                icon: '⊕',
                name: 'Works on Any Device',
                desc: 'Install Forkd on your phone like a native app. Pull it up at the grocery store, in the kitchen, anywhere.',
              },
            ].map((f, i) => (
              <div key={i} className={`feature-card animate-up ${isVisible('features') ? 'visible' : ''}`}
                id={i === 0 ? 'features' : undefined} data-animate="">
                <span className="feature-icon">{f.icon}</span>
                <div className="feature-name">{f.name}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="how">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-label" style={{ textAlign: 'center' }}>How it works</div>
          <h2 className="section-title">From scroll to table in three steps.</h2>
          <div className="steps">
            {[
              {
                num: '01',
                title: 'Save the recipe',
                desc: 'See something delicious on TikTok or Instagram? Paste the caption or upload a screenshot. AI extracts every ingredient and instruction instantly.',
              },
              {
                num: '02',
                title: 'Plan your week',
                desc: 'Open your meal calendar and assign recipes to any slot. Forkd shows you the full week at a glance — breakfast through dinner.',
              },
              {
                num: '03',
                title: 'Shop and cook',
                desc: 'Hit "Add week to grocery list" and everything merges into a single clean list. Check items off as you shop, right from your phone.',
              },
            ].map((step, i) => (
              <div key={i} className={`step animate-up ${isVisible('how') ? 'visible' : ''}`}
                id={i === 0 ? 'how' : undefined} data-animate="">
                <span className="step-num">{step.num}</span>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="pricing">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-label">Pricing</div>
          <h2 className="section-title">Simple. No subscriptions.</h2>
          <p className="pricing-sub">Try it free. Unlock everything once, keep it forever.</p>
          <div className="pricing-cards">
            <div className="pricing-card">
              <div className="pricing-tier">Free</div>
              <div className="pricing-price">$0</div>
              <div className="pricing-period">forever</div>
              <ul className="pricing-features">
                <li>Up to 15 recipes</li>
                <li>AI caption extraction</li>
                <li>Meal planning</li>
                <li>Grocery list</li>
              </ul>
              <a href="/login" className="btn-pricing btn-pricing-outline">Get started free</a>
            </div>
            <div className="pricing-card featured">
              <div className="pricing-tier">Pro</div>
              <div className="pricing-price">$24</div>
              <div className="pricing-period">one-time payment — yours forever</div>
              <ul className="pricing-features">
                <li>Unlimited recipes</li>
                <li>AI nutrition per recipe</li>
                <li>Collections + sharing</li>
                <li>Screenshot import</li>
                <li>Priority support</li>
              </ul>
              <a href="/login" className="btn-pricing btn-pricing-filled">Get Pro →</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">Forkd</div>
        <div className="footer-copy">© 2026 Forkd. Built for people who eat with intention.</div>
      </footer>
    </>
  );
}