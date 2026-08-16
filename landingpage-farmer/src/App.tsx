import { useState } from 'react'

const NAV_LINKS = ['Net Profit Calculator', 'Live Bids', 'Quality Scanner', 'Escrow Safety']
const LANGUAGES = ['English', 'हिंदी', 'ਪੰਜਾਬੀ', 'मराठी', 'తెలుగు']

const TRUST_ITEMS = [
  { value: '₹0', label: 'Payment Defaults', icon: ShieldIcon },
  { value: '100%', label: 'Escrow-Backed Lots', icon: LockIcon },
  { value: '4,200+', label: 'Verified Regional Buyers', icon: CheckBadgeIcon },
  { value: '₹38 Cr+', label: 'Earnings Released to Farmers', icon: RupeeIcon },
]

const WIDGET_ROWS = [
  { label: 'Gross Market Price', mandi: '₹2,150/qtl', keemat: '₹2,380/qtl', mandiPos: false, keematPos: true },
  { label: 'Transport & Toll', mandi: '−₹600', keemat: '−₹4,200', mandiPos: false, keematPos: false, note: 'for 50 qtl' },
  { label: 'Mandi Commission', mandi: '−₹2,150', keemat: '−₹900', mandiPos: false, keematPos: false },
  { label: 'Platform Fee (0.75%)', mandi: '—', keemat: '−₹893', mandiPos: false, keematPos: false },
]

const FEATURES = [
  {
    tag: '01 · QUALITY',
    title: 'AI Photo\nQuality Grading',
    desc: 'Photograph your crop on your phone. Our model returns a verified quality dossier — moisture %, defect map, and uniformity index — in under 90 seconds. No lab. No middleman.',
    stat: '91% avg confidence',
    statLabel: 'across 12,000+ scans',
    accent: '#1B4D3E',
    bg: '#EBF4F0',
    border: '#C3DDD4',
    icon: CameraIcon,
    items: ['Moisture & husk detection', 'Defect bounding-box map', 'Grade A / B / C dossier', 'Farmer-disputable score'],
  },
  {
    tag: '02 · PROFIT',
    title: 'Multi-Market\nProfit Engine',
    desc: 'Enter quantity and origin. The engine pulls live transport tariffs, APMC mandi rates, and toll data to show you the exact rupee difference between channels before you load.',
    stat: '₹17,060 avg premium',
    statLabel: 'vs. local mandi (50 qtl wheat)',
    accent: '#1E3A8A',
    bg: '#EEF2FB',
    border: '#BFD0F0',
    icon: ChartIcon,
    items: ['Live mandi rate feed', 'Toll & freight calculus', 'Per-quintal net yield', 'Multi-channel comparison'],
  },
  {
    tag: '03 · BIDDING',
    title: 'Live Bidding\nAuction Room',
    desc: 'Once your lot is graded and listed, registered mill owners and aggregators compete in a timed open auction. Price discovery happens transparently in front of you.',
    stat: '22 min avg',
    statLabel: 'to first competing bid',
    accent: '#C85A32',
    bg: '#FDF0EB',
    border: '#F0C4B4',
    icon: AuctionIcon,
    items: ['Open competitive auction', 'Timed bid countdown', 'Buyer identity verified', 'Reserve price control'],
  },
  {
    tag: '04 · ESCROW',
    title: 'Secure\nEscrow Vault',
    desc: 'Buyer deposits 100% of the lot value before your truck moves. Funds are held in a regulated escrow account and released to you only after delivery is confirmed.',
    stat: '₹0 payout failures',
    statLabel: 'since platform launch',
    accent: '#1B4D3E',
    bg: '#EBF4F0',
    border: '#C3DDD4',
    icon: VaultIcon,
    items: ['Pre-transport fund lock', 'Regulated NBFC escrow', 'Delivery-triggered release', 'Dispute resolution SLA'],
  },
]

export default function App() {
  const [lang, setLang] = useState('English')
  const [langOpen, setLangOpen] = useState(false)
  const [activeNav, setActiveNav] = useState<string | null>(null)
  const [qty, setQty] = useState(50)

  const mandiNet = qty * 2150 - 600 - 2150
  const keematNet = qty * 2380 - 4200 - 900 - Math.round(qty * 2380 * 0.0075)
  const premium = keematNet - mandiNet

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF9F5', fontFamily: "'Inter', sans-serif" }}>

      {/* ══ NAVIGATION ══ */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#FAF9F5', borderBottom: '1px solid #E2E2DC' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 28px', height: '54px', display: 'flex', alignItems: 'center', gap: '0' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, marginRight: '40px' }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.03em', color: '#1A1A18' }}>KEEMAT</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1B4D3E', display: 'inline-block', boxShadow: '0 0 0 2px #C3DDD4' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.07em', color: '#8A8A84', textTransform: 'uppercase' }}>Live Mandi Rates Syncing</span>
            </div>
          </div>

          {/* Center nav */}
          <nav style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0' }}>
            {NAV_LINKS.map(link => (
              <button
                key={link}
                onClick={() => setActiveNav(link)}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', fontWeight: activeNav === link ? 600 : 400, color: activeNav === link ? '#1A1A18' : '#4A4A46', backgroundColor: 'transparent', border: 'none', padding: '0 14px', height: '54px', cursor: 'pointer', borderBottom: activeNav === link ? '2px solid #1B4D3E' : '2px solid transparent', transition: 'color 0.12s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { if (activeNav !== link) (e.currentTarget as HTMLElement).style.color = '#1A1A18' }}
                onMouseLeave={e => { if (activeNav !== link) (e.currentTarget as HTMLElement).style.color = '#4A4A46' }}
              >{link}</button>
            ))}
          </nav>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {/* Lang */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                onBlur={() => setTimeout(() => setLangOpen(false), 160)}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid #E2E2DC', borderRadius: '5px', padding: '5px 10px', backgroundColor: 'white', fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#1A1A18', cursor: 'pointer', fontWeight: 500 }}
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="#4A4A46" strokeWidth="0.9"/><path d="M5.5 1C5.5 1 3.5 3 3.5 5.5s2 4.5 2 4.5" stroke="#4A4A46" strokeWidth="0.9"/><path d="M5.5 1C5.5 1 7.5 3 7.5 5.5s-2 4.5-2 4.5" stroke="#4A4A46" strokeWidth="0.9"/><path d="M1 5.5h9" stroke="#4A4A46" strokeWidth="0.9"/></svg>
                {lang}
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" style={{ transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}><path d="M2 3.5L4.5 6 7 3.5" stroke="#4A4A46" strokeWidth="1.1" strokeLinecap="round"/></svg>
              </button>
              {langOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 60, border: '1px solid #E2E2DC', borderRadius: '6px', backgroundColor: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', minWidth: '120px', overflow: 'hidden' }}>
                  {LANGUAGES.map(l => (
                    <button key={l} onClick={() => { setLang(l); setLangOpen(false) }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 12px', fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: l === lang ? '#1B4D3E' : '#1A1A18', backgroundColor: l === lang ? '#EBF4F0' : 'transparent', fontWeight: l === lang ? 600 : 400, border: 'none', cursor: 'pointer' }}
                      onMouseEnter={e => { if (l !== lang) (e.currentTarget as HTMLElement).style.backgroundColor = '#FAF9F5' }}
                      onMouseLeave={e => { if (l !== lang) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                    >{l}</button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ width: '1px', height: '18px', backgroundColor: '#E2E2DC' }} />
            <a href="#seller" style={{ textDecoration: 'none', padding: '7px 14px', backgroundColor: '#1B4D3E', color: 'white', borderRadius: '5px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', transition: 'background-color 0.12s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#163D31'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#1B4D3E'}
            >
              Start Selling
            </a>
            <a href="#buyer" style={{ textDecoration: 'none', padding: '7px 14px', backgroundColor: 'white', color: '#1A1A18', border: '1px solid #E2E2DC', borderRadius: '5px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 500, transition: 'border-color 0.12s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#1A1A18'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#E2E2DC'}
            >
              Buyer Login
            </a>
          </div>
        </div>
      </header>

      {/* ══ HERO SECTION ══ */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 28px 72px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>

        {/* Left: Headline + value prop */}
        <div>
          {/* Pre-badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', border: '1px solid #C3DDD4', borderRadius: '5px', padding: '4px 10px', backgroundColor: '#EBF4F0', marginBottom: '24px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#1B4D3E', display: 'inline-block' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1B4D3E', fontWeight: 500 }}>Direct Farmer-to-Buyer · No Middleman</span>
          </div>

          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 700, letterSpacing: '-0.04em', color: '#1A1A18', lineHeight: 1.1, margin: '0 0 20px' }}>
            Sell crop direct.<br />
            <span style={{ color: '#1B4D3E' }}>Know your real profit</span><br />
            before you transport.
          </h1>

          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', color: '#4A4A46', lineHeight: 1.7, margin: '0 0 12px', maxWidth: '440px' }}>
            Keemat connects farmers directly to verified mills and traders. Your payment is locked in a regulated escrow account before your truck moves — guaranteed, no exceptions.
          </p>

          {/* Trust micro-line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 32px' }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L2 3.5v4c0 3.2 2.2 5.2 4.5 5.8C9.3 12.7 11.5 10.7 11.5 7.5v-4L6.5 1z" stroke="#1B4D3E" strokeWidth="1.1" fill="none"/><path d="M4 6.5l2 2 3.5-3.5" stroke="#1B4D3E" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: '#1B4D3E', fontWeight: 500 }}>100% deposit-backed escrow — ₹0 payment defaults since launch</span>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <a href="#calculator" style={{ textDecoration: 'none', padding: '13px 24px', backgroundColor: '#1B4D3E', color: 'white', borderRadius: '6px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', fontWeight: 700, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background-color 0.12s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#163D31'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#1B4D3E'}
            >
              Calculate My Net Profit
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M7.5 3L11 6.5 7.5 10" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <a href="#how" style={{ textDecoration: 'none', padding: '13px 20px', backgroundColor: 'white', color: '#1A1A18', border: '1px solid #E2E2DC', borderRadius: '6px', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: 500, transition: 'border-color 0.12s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#1A1A18'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#E2E2DC'}
            >
              See how it works →
            </a>
          </div>

          {/* Social proof strip */}
          <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '1px solid #E2E2DC', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { n: '6,400+', l: 'Farmers registered' },
              { n: '22 states', l: 'Across India' },
              { n: '48h avg', l: 'Farm-to-payment cycle' },
            ].map(s => (
              <div key={s.n}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#1A1A18', margin: '0 0 2px' }}>{s.n}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#8A8A84', margin: 0 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Interactive profit widget */}
        <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          {/* Widget header */}
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #E2E2DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAFAF8' }}>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8A8A84', margin: '0 0 2px' }}>Live Sample Calculation</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#1A1A18', margin: 0, letterSpacing: '-0.02em' }}>Wheat – Sharbati · Sehore, MP</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#1B4D3E', display: 'inline-block' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: '#1B4D3E', letterSpacing: '0.05em' }}>LIVE RATES</span>
            </div>
          </div>

          {/* Quantity slider */}
          <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid #E2E2DC', backgroundColor: '#FAF9F5' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', fontWeight: 600, color: '#4A4A46' }}>Adjust Quantity</label>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', fontWeight: 700, color: '#1A1A18' }}>{qty} Quintals</span>
            </div>
            <input type="range" min={10} max={200} step={5} value={qty} onChange={e => setQty(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#1B4D3E', height: '3px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: '#8A8A84' }}>10 qtl</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: '#8A8A84' }}>200 qtl</span>
            </div>
          </div>

          {/* Comparison table */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F5F5F2' }}>
                <th style={{ ...twh, textAlign: 'left' }}>Component</th>
                <th style={twh}>Local Mandi</th>
                <th style={{ ...twh, backgroundColor: '#EBF4F0', color: '#1B4D3E', borderLeft: '2px solid #C3DDD4' }}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#1B4D3E', display: 'inline-block' }} />
                    Keemat Direct
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {WIDGET_ROWS.map((row, i) => (
                <tr key={row.label} style={{ borderBottom: '1px solid #E2E2DC', backgroundColor: i % 2 === 0 ? 'white' : '#FAFAF8' }}>
                  <td style={{ padding: '10px 16px', fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 500, color: '#1A1A18' }}>
                    {row.label}
                    {row.note && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#8A8A84', marginLeft: '5px' }}>{row.note}</span>}
                  </td>
                  <td style={{ padding: '10px 16px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: row.mandiPos ? '#1B4D3E' : row.mandi === '—' ? '#D1D1CC' : '#C85A32' }}>{row.mandi}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: row.keematPos ? '#1B4D3E' : '#C85A32', backgroundColor: '#EBF4F0', borderLeft: '2px solid #C3DDD4' }}>{row.keemat}</td>
                </tr>
              ))}
              {/* Net profit row */}
              <tr style={{ backgroundColor: '#EBF4F0', borderTop: '2px solid #1B4D3E' }}>
                <td style={{ padding: '12px 16px', fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', fontWeight: 700, color: '#1B4D3E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Your Net Profit</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', fontWeight: 700, color: '#4A4A46' }}>
                  ₹{mandiNet.toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.92rem', fontWeight: 700, color: '#1B4D3E', backgroundColor: '#D5EDE3', borderLeft: '2px solid #1B4D3E' }}>
                  ₹{keematNet.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Premium callout */}
          <div style={{ margin: '14px 16px', padding: '11px 14px', backgroundColor: '#FFFBF0', border: '1px solid #F3D89A', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', flexShrink: 0 }}>💡</span>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#92400E', margin: 0, lineHeight: 1.55 }}>
              <strong>You earn ₹{premium.toLocaleString('en-IN')} more</strong> selling on Keemat vs. local mandi for {qty} quintals of Sharbati wheat.
            </p>
          </div>

          {/* Widget CTA */}
          <div style={{ padding: '0 16px 16px' }}>
            <a href="#calculator" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', padding: '11px 16px', backgroundColor: '#1B4D3E', color: 'white', borderRadius: '6px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', fontWeight: 600, transition: 'background-color 0.12s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#163D31'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#1B4D3E'}
            >
              Get my full profit breakdown
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M7.5 3L11 6.5 7.5 10" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ══ TRUST BAR ══ */}
      <div style={{ borderTop: '1px solid #E2E2DC', borderBottom: '1px solid #E2E2DC', backgroundColor: '#F0EFE9' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 28px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {TRUST_ITEMS.map((item, i) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderRight: i < 3 ? '1px solid #E2E2DC' : 'none' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'white', border: '1px solid #E2E2DC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <item.icon />
              </div>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#1A1A18', margin: '0 0 1px' }}>{item.value}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', color: '#4A4A46', margin: 0 }}>{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ FEATURE MATRIX ══ */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 28px 80px' }}>
        {/* Section header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'end', marginBottom: '40px' }}>
          <div>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8A8A84', margin: '0 0 10px' }}>Platform Capabilities</p>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, letterSpacing: '-0.04em', color: '#1A1A18', lineHeight: 1.1, margin: 0 }}>
              No hidden algorithms.<br />No opaque deductions.
            </h2>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#4A4A46', lineHeight: 1.7, margin: 0 }}>
            Every tool on Keemat shows you the exact numbers, in plain language, before you commit. The platform is designed for farmers who distrust black-box systems — because you should.
          </p>
        </div>

        {/* 2×2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {FEATURES.map(f => (
            <FeatureCard key={f.tag} feature={f} />
          ))}
        </div>
      </section>

      {/* ══ FOOTER CTA STRIP ══ */}
      <div style={{ backgroundColor: '#1B4D3E', borderTop: '1px solid #163D31' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'white', margin: '0 0 6px' }}>Ready to sell your next lot?</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.82rem', color: '#A8C8BC', margin: 0 }}>
              Registration takes under 5 minutes. KYC via Aadhaar + bank account.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a href="#register" style={{ textDecoration: 'none', padding: '12px 24px', backgroundColor: 'white', color: '#1B4D3E', borderRadius: '6px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', fontWeight: 700, transition: 'background-color 0.12s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#EBF4F0'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'white'}
            >
              Register as Farmer →
            </a>
            <a href="#buyer-register" style={{ textDecoration: 'none', padding: '12px 20px', backgroundColor: 'transparent', color: '#A8C8BC', border: '1px solid #2D6B57', borderRadius: '6px', fontFamily: "'Inter', sans-serif", fontSize: '0.82rem', fontWeight: 500 }}>
              Buyer / Mill Owner
            </a>
          </div>
        </div>
        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #2D6B57' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: '#6B9E8E', letterSpacing: '0.04em', margin: 0 }}>© 2026 KEEMAT AGRI TECHNOLOGIES PVT. LTD. — AGMARKNET COMPLIANT · NBFC ESCROW REGULATED</p>
            <div style={{ display: 'flex', gap: '20px' }}>
              {['Privacy', 'Terms', 'Grievance Officer'].map(l => (
                <a key={l} href="#" style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', color: '#6B9E8E', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#A8C8BC'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#6B9E8E'}
                >{l}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Feature Card ── */
function FeatureCard({ feature: f }: { feature: typeof FEATURES[0] }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ border: `1px solid ${hovered ? f.border : '#E2E2DC'}`, borderRadius: '8px', backgroundColor: 'white', padding: '24px', transition: 'border-color 0.15s, box-shadow 0.15s', boxShadow: hovered ? '0 4px 20px rgba(0,0,0,0.06)' : 'none', display: 'flex', flexDirection: 'column', gap: '0' }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: f.accent, backgroundColor: f.bg, border: `1px solid ${f.border}`, borderRadius: '4px', padding: '2px 8px', fontWeight: 500 }}>{f.tag}</span>
        <div style={{ width: '34px', height: '34px', borderRadius: '6px', backgroundColor: f.bg, border: `1px solid ${f.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <f.icon color={f.accent} />
        </div>
      </div>

      {/* Title */}
      <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#1A1A18', lineHeight: 1.2, margin: '0 0 10px', whiteSpace: 'pre-line' }}>{f.title}</h3>

      {/* Desc */}
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: '#4A4A46', lineHeight: 1.65, margin: '0 0 16px' }}>{f.desc}</p>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: '#E2E2DC', margin: '0 0 16px' }} />

      {/* Feature bullets */}
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {f.items.map(item => (
          <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#1A1A18' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: f.bg, border: `1px solid ${f.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="7" height="7" viewBox="0 0 7 7" fill="none"><path d="M1 3.5l1.5 1.5 3.5-3" stroke={f.accent} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            {item}
          </li>
        ))}
      </ul>

      {/* Stat chip */}
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '16px', borderTop: '1px solid #E2E2DC' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em', color: f.accent, margin: 0 }}>{f.stat}</p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', color: '#8A8A84', margin: 0 }}>{f.statLabel}</p>
      </div>
    </div>
  )
}

/* ── Inline SVG icons ── */
function ShieldIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L2.5 3.5v4c0 3 2.5 5 4.5 5.5C9 12.5 11.5 10.5 11.5 7.5v-4L7 1z" stroke="#1B4D3E" strokeWidth="1.1"/><path d="M4.5 7l2 2 3.5-3.5" stroke="#1B4D3E" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function LockIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2.5" y="6" width="9" height="7" rx="1" stroke="#1B4D3E" strokeWidth="1.1"/><path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" stroke="#1B4D3E" strokeWidth="1.1"/><circle cx="7" cy="9.5" r="1" fill="#1B4D3E"/></svg>
}
function CheckBadgeIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#1B4D3E" strokeWidth="1.1"/><path d="M4.5 7l2 2 3.5-3" stroke="#1B4D3E" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function RupeeIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 3h6M4 6h6M7 6l-3 5" stroke="#1B4D3E" strokeWidth="1.1" strokeLinecap="round"/><path d="M4 4.5c0 0 .5 1.5 3 1.5s3-1.5 3-1.5" stroke="#1B4D3E" strokeWidth="1.1" strokeLinecap="round"/></svg>
}
function CameraIcon({ color }: { color: string }) {
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="4" width="12" height="9" rx="1.5" stroke={color} strokeWidth="1.2"/><circle cx="7.5" cy="8.5" r="2.2" stroke={color} strokeWidth="1.2"/><path d="M5 4V3a1 1 0 011-1h3a1 1 0 011 1v1" stroke={color} strokeWidth="1.2"/></svg>
}
function ChartIcon({ color }: { color: string }) {
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 11l3-4 3 2.5 2.5-5 2.5 3" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 13h11" stroke={color} strokeWidth="1.2" strokeLinecap="round"/></svg>
}
function AuctionIcon({ color }: { color: string }) {
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 12l4-4" stroke={color} strokeWidth="1.2" strokeLinecap="round"/><rect x="6" y="4" width="6" height="4" rx="1" transform="rotate(-45 6 4)" stroke={color} strokeWidth="1.2"/><circle cx="3" cy="12" r="1" fill={color}/></svg>
}
function VaultIcon({ color }: { color: string }) {
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="2" y="3" width="11" height="9" rx="1.5" stroke={color} strokeWidth="1.2"/><circle cx="7.5" cy="7.5" r="2" stroke={color} strokeWidth="1.2"/><circle cx="7.5" cy="7.5" r="0.8" fill={color}/><path d="M2 6h1M2 9h1M12 6h1M12 9h1" stroke={color} strokeWidth="1.2" strokeLinecap="round"/></svg>
}

const twh: React.CSSProperties = {
  padding: '8px 16px', textAlign: 'center',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.6rem', letterSpacing: '0.08em',
  textTransform: 'uppercase', color: '#4A4A46',
  fontWeight: 500, borderBottom: '1px solid #E2E2DC',
  whiteSpace: 'nowrap',
}
