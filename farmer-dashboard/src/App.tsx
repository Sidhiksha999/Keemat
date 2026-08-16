import { useState } from 'react'

const NAV_TABS = [
  { id: 'calculator', label: 'Net Profit Calculator' },
  { id: 'lots', label: 'My Active Lots' },
  { id: 'escrow', label: 'Escrow Vault' },
  { id: 'settings', label: 'Settings' },
]

const COMMODITIES = [
  'Wheat - Sharbati',
  'Wheat - Lokwan',
  'Soybean',
  'Cotton - Long Staple',
  'Maize',
  'Chana (Chickpea)',
]

const MATRIX_ROWS = [
  {
    metric: 'Gross Price Offered',
    sub: 'per quintal',
    mandi: '₹2,150/qtl',
    hub: '₹2,280/qtl',
    keemat: '₹2,380/qtl',
    highlight: false,
  },
  {
    metric: 'Transport & Toll Cost',
    sub: 'for 100 qtl lot',
    mandi: '−₹1,200',
    hub: '−₹8,500',
    keemat: '−₹4,200',
    highlight: false,
    negative: true,
  },
  {
    metric: 'Mandi Commission & Fees',
    sub: 'aggregated total',
    mandi: '−₹4,300',
    hub: '−₹4,560',
    keemat: '−₹1,800',
    highlight: false,
    negative: true,
  },
  {
    metric: 'YOUR NET PROFIT',
    sub: 'after all deductions',
    mandi: '₹2,09,500',
    hub: '₹2,14,940',
    keemat: '₹2,32,000',
    highlight: true,
  },
]

const STAT_BOXES = [
  {
    label: 'Total Earnings Released',
    value: '₹4,82,000',
    meta: 'Across 6 completed lots',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1.5" y="3" width="12" height="9" rx="1.5" stroke="#1B4D3E" strokeWidth="1.25"/>
        <path d="M5 7.5h5M7.5 5v5" stroke="#1B4D3E" strokeWidth="1.25" strokeLinecap="round"/>
      </svg>
    ),
    valueColor: '#1B4D3E',
  },
  {
    label: 'Active Bids Pending',
    value: '2 Lots',
    meta: 'Closes in 4h 22m',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="6" stroke="#D97706" strokeWidth="1.25"/>
        <path d="M7.5 4.5V8l2.5 1.5" stroke="#D97706" strokeWidth="1.25" strokeLinecap="round"/>
      </svg>
    ),
    valueColor: '#D97706',
  },
  {
    label: 'Escrow Status',
    value: '100% Protected',
    meta: 'All funds secured',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 1.5L2 3.5v4c0 3.3 2.5 5.5 5.5 6 3-0.5 5.5-2.7 5.5-6v-4L7.5 1.5z" stroke="#1B4D3E" strokeWidth="1.25" fill="none"/>
        <path d="M4.5 7.5l2 2 4-3.5" stroke="#1B4D3E" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    valueColor: '#1B4D3E',
  },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('calculator')
  const [commodity, setCommodity] = useState('Wheat - Sharbati')
  const [quantity, setQuantity] = useState('10 Tonnes / 100 Quintals')
  const [origin, setOrigin] = useState('Sehore, Madhya Pradesh')
  const [pickupDate, setPickupDate] = useState('2026-08-18')
  const [langOpen, setLangOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF9F5', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* ── Top Navigation ── */}
      <nav style={{ backgroundColor: '#FAF9F5', borderBottom: '1px solid #E2E2DC', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '52px', display: 'flex', alignItems: 'center', gap: '32px' }}>

          {/* Logo + badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.03em', color: '#1A1A18' }}>KEEMAT</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.06em', textTransform: 'uppercase', backgroundColor: '#EBF4F0', color: '#1B4D3E', border: '1px solid #C3DDD4', borderRadius: '4px', padding: '2px 7px', fontWeight: 500 }}>
              Farmer Dashboard
            </span>
          </div>

          {/* Nav tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0', flex: 1, justifyContent: 'center' }}>
            {NAV_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.8rem',
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  color: activeTab === tab.id ? '#1B4D3E' : '#4A4A46',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #1B4D3E' : '2px solid transparent',
                  padding: '0 16px',
                  height: '52px',
                  cursor: 'pointer',
                  transition: 'color 0.12s, border-color 0.12s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (activeTab !== tab.id) (e.currentTarget as HTMLElement).style.color = '#1A1A18' }}
                onMouseLeave={e => { if (activeTab !== tab.id) (e.currentTarget as HTMLElement).style.color = '#4A4A46' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            {/* Language */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                onBlur={() => setTimeout(() => setLangOpen(false), 150)}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid #E2E2DC', borderRadius: '5px', padding: '4px 9px', backgroundColor: 'white', fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#1A1A18', cursor: 'pointer', fontWeight: 500 }}
              >
                English | हिंदी
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M2 3.5L4.5 6 7 3.5" stroke="#4A4A46" strokeWidth="1.2" strokeLinecap="round"/></svg>
              </button>
              {langOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 50, border: '1px solid #E2E2DC', borderRadius: '6px', backgroundColor: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', minWidth: '110px', overflow: 'hidden' }}>
                  {['English', 'हिंदी', 'ਪੰਜਾਬੀ', 'मराठी'].map(l => (
                    <button key={l} onClick={() => setLangOpen(false)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 12px', fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: '#1A1A18', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FAF9F5')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >{l}</button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ width: '1px', height: '18px', backgroundColor: '#E2E2DC' }} />

            {/* Profile badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', border: '1px solid #E2E2DC', borderRadius: '5px', padding: '4px 10px', backgroundColor: 'white' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#1B4D3E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', fontWeight: 700, color: 'white' }}>S</span>
              </div>
              <div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', fontWeight: 600, color: '#1A1A18', margin: 0, lineHeight: 1 }}>Sidhiksha</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: '#1B4D3E', margin: '1px 0 0', lineHeight: 1 }}>✓ Verified Seller</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Stats Bar ── */}
      <div style={{ borderBottom: '1px solid #E2E2DC', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {STAT_BOXES.map((box, i) => (
            <div key={box.label} style={{ padding: '14px 20px', borderRight: i < 2 ? '1px solid #E2E2DC' : 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '6px', backgroundColor: '#F5FAF8', border: '1px solid #E2E2DC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {box.icon}
              </div>
              <div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A8A84', margin: '0 0 2px' }}>{box.label}</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em', color: box.valueColor, margin: '0 0 1px' }}>{box.value}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', color: '#8A8A84', margin: 0 }}>{box.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Workspace ── */}
      <main style={{ flex: 1, maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '24px 24px 96px', display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '20px', alignItems: 'start' }}>

        {/* ── LEFT: Input Form ── */}
        <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', overflow: 'hidden' }}>
          {/* Card header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E2DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#1A1A18', margin: 0 }}>Crop & Shipment Details</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#8A8A84', margin: '2px 0 0' }}>Enter lot details to compute profit matrix</p>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#D97706', backgroundColor: '#FEF9EE', border: '1px solid #F3D89A', borderRadius: '4px', padding: '2px 7px' }}>Live Estimate</span>
          </div>

          {/* Form */}
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormField label="Select Commodity" hint="MSP-listed crop category">
              <select
                value={commodity}
                onChange={e => setCommodity(e.target.value)}
                style={inputStyle}
              >
                {COMMODITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </FormField>

            <FormField label="Total Quantity" hint="Tonnes or quintals">
              <input
                type="text"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                style={inputStyle}
              />
            </FormField>

            <FormField label="Origin Farm Location" hint="Village / Tehsil / District">
              <input
                type="text"
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                style={inputStyle}
              />
            </FormField>

            <FormField label="Expected Pickup Date" hint="APMC calendar will be checked">
              <input
                type="date"
                value={pickupDate}
                onChange={e => setPickupDate(e.target.value)}
                style={inputStyle}
              />
            </FormField>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: '#E2E2DC', margin: '4px 0' }} />

            {/* Crop summary chip */}
            <div style={{ backgroundColor: '#F5FAF8', border: '1px solid #C3DDD4', borderRadius: '6px', padding: '10px 14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginTop: '1px', flexShrink: 0 }}>
                <circle cx="7" cy="7" r="6" stroke="#1B4D3E" strokeWidth="1.2"/>
                <path d="M7 4.5V7.5l2 1" stroke="#1B4D3E" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', fontWeight: 600, color: '#1B4D3E', margin: '0 0 2px' }}>Lot summary computed</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', color: '#4A4A46', margin: 0, lineHeight: 1.5 }}>
                  {commodity} · 100 qtl · {origin} · Pickup 18 Aug 2026
                </p>
              </div>
            </div>

            {/* AI Scan button */}
            <button
              style={{
                width: '100%', padding: '11px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #1B4D3E', borderRadius: '6px',
                fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem',
                fontWeight: 600, color: '#1B4D3E', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'background-color 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#EBF4F0')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <rect x="2" y="2" width="11" height="11" rx="2" stroke="#1B4D3E" strokeWidth="1.2"/>
                  <circle cx="7.5" cy="7.5" r="2.5" stroke="#1B4D3E" strokeWidth="1.2"/>
                  <path d="M7.5 1.5V2.5M7.5 12.5v1M1.5 7.5h1M12.5 7.5h1" stroke="#1B4D3E" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                Scan Quality with AI Camera
              </span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* ── RIGHT: Profit Matrix ── */}
        <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', overflow: 'hidden' }}>
          {/* Card header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E2DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#1A1A18', margin: 0 }}>Marketplace Net Profit Comparison</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#8A8A84', margin: '2px 0 0' }}>Based on {commodity} · 100 qtl lot · {origin}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1B4D3E', display: 'inline-block' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#1B4D3E', letterSpacing: '0.05em' }}>Live Rates</span>
            </div>
          </div>

          {/* Matrix table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F5F5F2' }}>
                  <th style={thStyle('left')}>Metric</th>
                  <th style={thStyle('right')}>Local Mandi</th>
                  <th style={thStyle('right')}>Regional Hub</th>
                  <th style={{ ...thStyle('right'), backgroundColor: '#EBF4F0', color: '#1B4D3E', borderLeft: '2px solid #C3DDD4' }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#1B4D3E', flexShrink: 0 }} />
                      Keemat Direct
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {MATRIX_ROWS.map((row, i) => (
                  <tr
                    key={row.metric}
                    style={{
                      backgroundColor: row.highlight ? '#EBF4F0' : i % 2 === 0 ? 'white' : '#FAFAF8',
                      borderTop: row.highlight ? '2px solid #C3DDD4' : '1px solid #E2E2DC',
                    }}
                  >
                    {/* Metric label */}
                    <td style={{ padding: '13px 20px', fontFamily: "'Inter', sans-serif", verticalAlign: 'middle' }}>
                      <p style={{ fontSize: row.highlight ? '0.78rem' : '0.8rem', fontWeight: row.highlight ? 700 : 500, color: row.highlight ? '#1B4D3E' : '#1A1A18', margin: 0, letterSpacing: row.highlight ? '0.04em' : '0', textTransform: row.highlight ? 'uppercase' : 'none' }}>{row.metric}</p>
                      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: '#8A8A84', margin: '1px 0 0' }}>{row.sub}</p>
                    </td>

                    {/* Local Mandi */}
                    <td style={{ padding: '13px 20px', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: row.highlight ? '0.9rem' : '0.82rem', fontWeight: row.highlight ? 700 : 400, color: row.highlight ? '#4A4A46' : row.negative ? '#C85A32' : '#1A1A18', verticalAlign: 'middle' }}>
                      {row.mandi}
                    </td>

                    {/* Regional Hub */}
                    <td style={{ padding: '13px 20px', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: row.highlight ? '0.9rem' : '0.82rem', fontWeight: row.highlight ? 700 : 400, color: row.highlight ? '#4A4A46' : row.negative ? '#C85A32' : '#1A1A18', verticalAlign: 'middle' }}>
                      {row.hub}
                    </td>

                    {/* Keemat Direct */}
                    <td style={{ padding: '13px 20px', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: row.highlight ? '1rem' : '0.82rem', fontWeight: row.highlight ? 700 : 500, color: row.highlight ? '#1B4D3E' : row.negative ? '#C85A32' : '#1B4D3E', borderLeft: '2px solid #C3DDD4', backgroundColor: row.highlight ? '#D5EDE3' : '#EBF4F0', verticalAlign: 'middle' }}>
                      {row.keemat}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Insight badge */}
          <div style={{ margin: '16px 20px', padding: '12px 14px', backgroundColor: '#FFFBF0', border: '1px solid #F3D89A', borderRadius: '6px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', flexShrink: 0, marginTop: '1px' }}>💡</span>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: '#1A1A18', margin: 0, lineHeight: 1.55 }}>
              <strong>Selling on Keemat earns you ₹17,060 MORE</strong> than your local mandi after transport and commission costs on this 100-quintal lot.
            </p>
          </div>

          {/* Mini breakdown row */}
          <div style={{ margin: '0 20px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { label: 'Keemat vs. Mandi', delta: '+₹17,060 more', color: '#1B4D3E', bg: '#EBF4F0', border: '#C3DDD4' },
              { label: 'Keemat vs. Reg. Hub', delta: '+₹12,060 more', color: '#1B4D3E', bg: '#EBF4F0', border: '#C3DDD4' },
              { label: 'Platform Fee', delta: '0.75% only', color: '#D97706', bg: '#FEF9EE', border: '#F3D89A' },
            ].map(item => (
              <div key={item.label} style={{ backgroundColor: item.bg, border: `1px solid ${item.border}`, borderRadius: '6px', padding: '9px 12px' }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: '#8A8A84', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px' }}>{item.label}</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', fontWeight: 700, color: item.color, margin: 0, letterSpacing: '-0.01em' }}>{item.delta}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ── Sticky Bottom Action Bar ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30,
        backgroundColor: 'white', borderTop: '1px solid #E2E2DC',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', fontWeight: 600, color: '#1A1A18', margin: 0, letterSpacing: '-0.01em' }}>
              Ready to list this 10-Tonne {commodity} lot for buyer bidding?
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#8A8A84', margin: '2px 0 0' }}>
              Next: AI photo grading → Quality dossier generation → Live bidding activation
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <button
              style={{
                padding: '11px 18px', backgroundColor: 'transparent',
                border: '1px solid #E2E2DC', borderRadius: '6px',
                fontFamily: "'Inter', sans-serif", fontSize: '0.8rem',
                color: '#4A4A46', cursor: 'pointer', fontWeight: 500,
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#1A1A18')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#E2E2DC')}
            >
              Save Draft
            </button>
            <button
              style={{
                padding: '11px 22px', backgroundColor: '#1B4D3E',
                border: 'none', borderRadius: '6px',
                fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem',
                fontWeight: 700, color: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                letterSpacing: '-0.01em', transition: 'background-color 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#163D31')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1B4D3E')}
            >
              Proceed to AI Quality Grading
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Helpers ── */
function FormField({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 600, color: '#1A1A18' }}>{label}</label>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#8A8A84', letterSpacing: '0.03em' }}>{hint}</span>
      </div>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 11px',
  border: '1px solid #E2E2DC', borderRadius: '6px',
  fontFamily: "'Inter', sans-serif", fontSize: '0.82rem',
  color: '#1A1A18', backgroundColor: 'white',
  outline: 'none', appearance: 'auto',
}

function thStyle(align: 'left' | 'right'): React.CSSProperties {
  return {
    padding: '10px 20px',
    textAlign: align,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.62rem',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: '#4A4A46',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    borderBottom: '1px solid #E2E2DC',
  }
}
