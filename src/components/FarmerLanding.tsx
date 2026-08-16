import { useState } from 'react'

const NAV_LINKS = ['Net Profit Calculator', 'Live Bids', 'Quality Scanner', 'Escrow Safety']
const LANGUAGES = ['English', 'हिंदी', 'ਪੰਜਾਬੀ', 'मराठी', 'తెలుగు']

function ShieldIcon() {
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5L2 3.5v4c0 3.3 2.5 5.5 5.5 6 3-0.5 5.5-2.7 5.5-6v-4L7.5 1.5z" stroke="#1B4D3E" strokeWidth="1.25" fill="none"/><path d="M4.5 7.5l2 2 4-3.5" stroke="#1B4D3E" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

function LockIcon() {
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="3" y="6" width="9" height="7" rx="1" stroke="#1B4D3E" strokeWidth="1.25"/><path d="M5 6V4.5a2.5 2.5 0 015 0V6" stroke="#1B4D3E" strokeWidth="1.25"/></svg>
}

function CheckBadgeIcon() {
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6" stroke="#1B4D3E" strokeWidth="1.25"/><path d="M4.5 7.5l2 2 4-3.5" stroke="#1B4D3E" strokeWidth="1.25" strokeLinecap="round"/></svg>
}

function RupeeIcon() {
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M4 3.5h7M4 6.5h7M4 3.5c0 3 6 1.5 6 5.5s-6 3.5-6 3.5" stroke="#1B4D3E" strokeWidth="1.25" strokeLinecap="round"/></svg>
}

function CameraIcon({ color = '#1B4D3E' }) {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="10" rx="1.5" stroke={color} strokeWidth="1.25"/><circle cx="8" cy="9" r="2.5" stroke={color} strokeWidth="1.25"/><path d="M5 4l.8-1.5h4.4L11 4" stroke={color} strokeWidth="1.25"/></svg>
}

function ChartIcon({ color = '#1E3A8A' }) {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 13l4-5 3 3 5-7" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

function AuctionIcon({ color = '#C85A32' }) {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 13h10M4 9l5-5 3 3-5 5" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

function VaultIcon({ color = '#1B4D3E' }) {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2.5" y="3.5" width="11" height="9" rx="1.5" stroke={color} strokeWidth="1.25"/><circle cx="8" cy="8" r="1.5" fill={color}/></svg>
}

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

const twh = { padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: '#8A8A84', fontWeight: 500 }

interface Props {
  onNavigate: (view: string) => void;
}

export default function FarmerLanding({ onNavigate }: Props) {
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
                onClick={() => {
                  setActiveNav(link);
                  if (link === 'Quality Scanner') onNavigate('crop-grading');
                  else if (link === 'Live Bids') onNavigate('farmer-auction');
                  else onNavigate('farmer-dashboard');
                }}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', fontWeight: activeNav === link ? 600 : 400, color: activeNav === link ? '#1A1A18' : '#4A4A46', backgroundColor: 'transparent', border: 'none', padding: '0 14px', height: '54px', cursor: 'pointer', borderBottom: activeNav === link ? '2px solid #1B4D3E' : '2px solid transparent', transition: 'color 0.12s', whiteSpace: 'nowrap' }}
              >{link}</button>
            ))}
          </nav>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                onBlur={() => setTimeout(() => setLangOpen(false), 160)}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid #E2E2DC', borderRadius: '5px', padding: '5px 10px', backgroundColor: 'white', fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#1A1A18', cursor: 'pointer', fontWeight: 500 }}
              >
                {lang}
              </button>
            </div>
            <div style={{ width: '1px', height: '18px', backgroundColor: '#E2E2DC' }} />
            <button onClick={() => onNavigate('farmer-dashboard')} style={{ padding: '7px 14px', backgroundColor: '#1B4D3E', color: 'white', border: 'none', borderRadius: '5px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
              Start Selling
            </button>
            <button onClick={() => onNavigate('buyer-auction')} style={{ padding: '7px 14px', backgroundColor: 'white', color: '#1A1A18', border: '1px solid #E2E2DC', borderRadius: '5px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer' }}>
              Buyer Login
            </button>
          </div>
        </div>
      </header>

      {/* ══ HERO SECTION ══ */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 28px 72px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>

        <div>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 32px' }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L2 3.5v4c0 3.2 2.2 5.2 4.5 5.8C9.3 12.7 11.5 10.7 11.5 7.5v-4L6.5 1z" stroke="#1B4D3E" strokeWidth="1.1" fill="none"/><path d="M4 6.5l2 2 3.5-3.5" stroke="#1B4D3E" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: '#1B4D3E', fontWeight: 500 }}>100% deposit-backed escrow — ₹0 payment defaults since launch</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('farmer-dashboard')} style={{ padding: '13px 24px', backgroundColor: '#1B4D3E', color: 'white', border: 'none', borderRadius: '6px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Calculate My Net Profit →
            </button>
            <button onClick={() => onNavigate('crop-grading')} style={{ padding: '13px 20px', backgroundColor: 'white', color: '#1A1A18', border: '1px solid #E2E2DC', borderRadius: '6px', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>
              Scan Quality with AI →
            </button>
          </div>

          <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '1px solid #E2E2DC', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { n: '6,400+', l: 'Farmers registered' },
              { n: '22 states', l: 'Across India' },
              { n: '48h avg', l: 'Farm-to-payment cycle' },
            ].map(s => (
              <div key={s.n}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.15rem', fontWeight: 700, color: '#1A1A18', margin: '0 0 2px' }}>{s.n}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#8A8A84', margin: 0 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Widget */}
        <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #E2E2DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAFAF8' }}>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8A8A84', margin: '0 0 2px' }}>Live Sample Calculation</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#1A1A18', margin: 0 }}>Wheat – Sharbati · Sehore, MP</p>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: '#1B4D3E', letterSpacing: '0.05em' }}>LIVE RATES</span>
          </div>

          <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid #E2E2DC', backgroundColor: '#FAF9F5' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', fontWeight: 600, color: '#4A4A46' }}>Adjust Quantity</label>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', fontWeight: 700, color: '#1A1A18' }}>{qty} Quintals</span>
            </div>
            <input type="range" min={10} max={200} step={5} value={qty} onChange={e => setQty(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#1B4D3E', height: '3px' }}
            />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F5F5F2' }}>
                <th style={{ ...twh, textAlign: 'left' }}>Component</th>
                <th style={twh}>Local Mandi</th>
                <th style={{ ...twh, backgroundColor: '#EBF4F0', color: '#1B4D3E', borderLeft: '2px solid #C3DDD4' }}>Keemat Direct</th>
              </tr>
            </thead>
            <tbody>
              {WIDGET_ROWS.map((row, i) => (
                <tr key={row.label} style={{ borderBottom: '1px solid #E2E2DC', backgroundColor: i % 2 === 0 ? 'white' : '#FAFAF8' }}>
                  <td style={{ padding: '10px 16px', fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 500, color: '#1A1A18' }}>{row.label}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: row.mandiPos ? '#1B4D3E' : '#C85A32' }}>{row.mandi}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: '#1B4D3E', backgroundColor: '#EBF4F0', borderLeft: '2px solid #C3DDD4' }}>{row.keemat}</td>
                </tr>
              ))}
              <tr style={{ backgroundColor: '#EBF4F0', borderTop: '2px solid #1B4D3E' }}>
                <td style={{ padding: '12px 16px', fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', fontWeight: 700, color: '#1B4D3E' }}>Your Net Profit</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', fontWeight: 700, color: '#4A4A46' }}>₹{mandiNet.toLocaleString('en-IN')}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.92rem', fontWeight: 700, color: '#1B4D3E', backgroundColor: '#D5EDE3', borderLeft: '2px solid #1B4D3E' }}>₹{keematNet.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ margin: '14px 16px', padding: '11px 14px', backgroundColor: '#FFFBF0', border: '1px solid #F3D89A', borderRadius: '6px' }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#92400E', margin: 0 }}>
              <strong>You earn ₹{premium.toLocaleString('en-IN')} more</strong> selling on Keemat vs. local mandi for {qty} quintals.
            </p>
          </div>

          <div style={{ padding: '0 16px 16px' }}>
            <button onClick={() => onNavigate('farmer-dashboard')} style={{ width: '100%', padding: '11px 16px', backgroundColor: '#1B4D3E', color: 'white', border: 'none', borderRadius: '6px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
              Get my full profit breakdown →
            </button>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div style={{ borderTop: '1px solid #E2E2DC', borderBottom: '1px solid #E2E2DC', backgroundColor: '#F0EFE9' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 28px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {TRUST_ITEMS.map((item, i) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderRight: i < 3 ? '1px solid #E2E2DC' : 'none' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'white', border: '1px solid #E2E2DC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <item.icon />
              </div>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', fontWeight: 700, color: '#1A1A18', margin: '0 0 1px' }}>{item.value}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', color: '#4A4A46', margin: 0 }}>{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Matrix */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 28px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {FEATURES.map(f => (
            <div key={f.tag} style={{ border: `1px solid ${f.border}`, borderRadius: '8px', backgroundColor: 'white', padding: '24px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: f.accent, backgroundColor: f.bg, border: `1px solid ${f.border}`, borderRadius: '4px', padding: '2px 8px' }}>{f.tag}</span>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#1A1A18', margin: '12px 0 8px', whiteSpace: 'pre-line' }}>{f.title}</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: '#4A4A46', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
