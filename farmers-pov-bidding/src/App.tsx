import { useState, useEffect, useRef } from 'react'

const GRAIN_IMG = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=450&fit=crop&auto=format'
const GRAIN_IMG2 = 'https://images.unsplash.com/photo-1584353781226-579f0ab7c770?w=600&h=450&fit=crop&auto=format'

/* ── Bid feed seed data ── */
const SEED_BIDS = [
  { id: 1, buyer: 'Ramesh Flour Mills', city: 'Bhopal, MP', rating: 4.9, bid: 2380, ts: '14:22:08', verified: true },
  { id: 2, buyer: 'Sanjay Agro Traders', city: 'Indore, MP', rating: 4.7, bid: 2365, ts: '14:21:44', verified: true },
  { id: 3, buyer: 'Gujarat Roller Flour', city: 'Ahmedabad, GJ', rating: 4.8, bid: 2350, ts: '14:20:59', verified: true },
  { id: 4, buyer: 'Haryana FCI Hub', city: 'Hisar, HR', rating: 4.6, bid: 2330, ts: '14:20:11', verified: true },
  { id: 5, buyer: 'Kolhapur Agri Corp', city: 'Kolhapur, MH', rating: 4.5, bid: 2310, ts: '14:19:38', verified: true },
]

const NEW_BIDS = [
  { id: 6, buyer: 'Rajasthan Roller Mills', city: 'Jaipur, RJ', rating: 4.8, bid: 2395, ts: '', verified: true },
  { id: 7, buyer: 'Punjab Grain Exchange', city: 'Ludhiana, PB', rating: 5.0, bid: 2410, ts: '', verified: true },
]

const QUALITY = [
  { param: 'Moisture Content', value: '12.0%', verdict: 'Optimal', pass: true },
  { param: 'Grain Discoloration', value: '3.2%', verdict: 'Acceptable', pass: true },
  { param: 'Foreign Matter / Husk', value: '1.8%', verdict: 'Low', pass: true },
  { param: 'Uniformity Index', value: '87%', verdict: 'High', pass: true },
]

const TRANSPORT = 12400
const PLATFORM = 1800

function fmtINR(n: number) {
  return '₹' + n.toLocaleString('en-IN')
}

function nowTs() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`
}

export default function App() {
  const [bids, setBids] = useState(SEED_BIDS)
  const [newBidIdx, setNewBidIdx] = useState(0)
  const [flashId, setFlashId] = useState<number | null>(null)
  const [secsLeft, setSecsLeft] = useState(252) // 04:12
  const [accepted, setAccepted] = useState(false)
  const [reserveOpen, setReserveOpen] = useState(false)
  const [reserveVal, setReserveVal] = useState('2300')
  const [activeThumb, setActiveThumb] = useState(0)
  const feedRef = useRef<HTMLDivElement>(null)

  const topBid = bids[0]
  const gross = topBid.bid * 100
  const net = gross - TRANSPORT - PLATFORM

  /* Countdown */
  useEffect(() => {
    const t = setInterval(() => setSecsLeft(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  /* Inject new bids */
  useEffect(() => {
    if (newBidIdx >= NEW_BIDS.length) return
    const delay = newBidIdx === 0 ? 6000 : 11000
    const t = setTimeout(() => {
      const nb = { ...NEW_BIDS[newBidIdx], ts: nowTs() }
      setBids(prev => [nb, ...prev])
      setFlashId(nb.id)
      setNewBidIdx(i => i + 1)
      setTimeout(() => setFlashId(null), 1200)
    }, delay)
    return () => clearTimeout(t)
  }, [newBidIdx])

  const mins = String(Math.floor(secsLeft / 60)).padStart(2, '0')
  const secs = String(secsLeft % 60).padStart(2, '0')
  const timerUrgent = secsLeft < 60

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF9F5', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* ══ TOP LOT HEADER BAR ══ */}
      <div style={{ backgroundColor: '#1A1A18', borderBottom: '1px solid #2D2D2B' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', gap: '0' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '20px', borderRight: '1px solid #2D2D2B', flexShrink: 0 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.03em', color: 'white' }}>KEEMAT</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: '#6B6B68', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Live Auction</span>
          </div>

          {/* Lot identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '0 24px', flex: 1 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#D97706', letterSpacing: '0.06em', fontWeight: 600 }}>LOT #KM-8802</span>
            <span style={{ width: '1px', height: '14px', backgroundColor: '#2D2D2B' }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 600, color: '#E8E8E4', letterSpacing: '-0.01em' }}>10 Tonnes · Sharbati Wheat</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.06em', color: '#1B4D3E', backgroundColor: '#0D2E24', border: '1px solid #1B4D3E', borderRadius: '3px', padding: '2px 7px' }}>GRADE A · AI VERIFIED ✓</span>
            <span style={{ width: '1px', height: '14px', backgroundColor: '#2D2D2B' }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#6B6B68' }}>Sehore, Madhya Pradesh</span>
          </div>

          {/* Escrow badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', paddingLeft: '20px', borderLeft: '1px solid #2D2D2B', flexShrink: 0, marginRight: '20px' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L1.5 3v4c0 2.6 2 4.2 4.5 5 2.5-.8 4.5-2.4 4.5-5V3L6 1z" stroke="#1B4D3E" fill="#0D2E24" strokeWidth="1"/><path d="M3.5 6l2 2 3.5-3" stroke="#4CAF82" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: '#4CAF82', letterSpacing: '0.05em' }}>100% ESCROW DEPOSIT LOCKED</span>
          </div>

          {/* Countdown timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '20px', borderLeft: '1px solid #2D2D2B', flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5.5" stroke={timerUrgent ? '#C85A32' : '#D97706'} strokeWidth="1.1"/><path d="M6.5 3.5V7l2.5 1.5" stroke={timerUrgent ? '#C85A32' : '#D97706'} strokeWidth="1.1" strokeLinecap="round"/></svg>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: '#6B6B68', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 1px' }}>Closes in</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em', color: timerUrgent ? '#C85A32' : '#D97706', margin: 0, lineHeight: 1, transition: 'color 0.3s' }}>
                {mins}:{secs}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ MAIN 3-COLUMN GRID ══ */}
      <main style={{ flex: 1, maxWidth: '1440px', margin: '0 auto', width: '100%', padding: '16px 24px 20px', display: 'grid', gridTemplateColumns: '280px 1fr 300px', gap: '16px', alignItems: 'start' }}>

        {/* ══ LEFT: CROP DOSSIER ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Photo carousel */}
          <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #E2E2DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 700, color: '#1A1A18', margin: 0, letterSpacing: '-0.01em' }}>AI Assessment Photos</h3>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: '#1B4D3E', backgroundColor: '#EBF4F0', border: '1px solid #C3DDD4', borderRadius: '3px', padding: '1px 6px' }}>4 PHOTOS</span>
            </div>

            {/* Main image */}
            <div style={{ position: 'relative', aspectRatio: '4/3', backgroundColor: '#1A1A18' }}>
              <img src={activeThumb === 0 ? GRAIN_IMG : GRAIN_IMG2} alt="Crop sample" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.9 }} />
              {/* Mini bounding boxes */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 75" preserveAspectRatio="none">
                <rect x="8" y="10" width="26" height="20" fill="#1B4D3E18" stroke="#1B4D3E" strokeWidth="0.6" rx="0.5"/>
                <rect x="54" y="12" width="28" height="22" fill="#1B4D3E18" stroke="#1B4D3E" strokeWidth="0.6" rx="0.5"/>
                <rect x="18" y="58" width="16" height="12" fill="#D9770618" stroke="#D97706" strokeWidth="0.6" strokeDasharray="1.5 0.8" rx="0.5"/>
                <rect x="38" y="42" width="13" height="11" fill="#C85A3218" stroke="#C85A32" strokeWidth="0.6" strokeDasharray="1.5 0.8" rx="0.5"/>
              </svg>
              <div style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(26,26,24,0.75)', borderRadius: '3px', padding: '2px 7px' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: 'white' }}>{activeThumb + 1} / 4</span>
              </div>
            </div>

            {/* Thumbs */}
            <div style={{ padding: '10px 12px', display: 'flex', gap: '7px' }}>
              {[GRAIN_IMG, GRAIN_IMG2].map((src, i) => (
                <button key={i} onClick={() => setActiveThumb(i)} style={{ width: '48px', height: '36px', borderRadius: '3px', overflow: 'hidden', border: `1.5px solid ${activeThumb === i ? '#1B4D3E' : '#E2E2DC'}`, padding: 0, cursor: 'pointer', flexShrink: 0 }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
              {[3, 4].map(n => (
                <div key={n} style={{ width: '48px', height: '36px', borderRadius: '3px', border: '1px dashed #D1D1CC', backgroundColor: '#FAFAF8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: '#D1D1CC' }}>{n}/4</span>
                </div>
              ))}
            </div>

            {/* Legend chips */}
            <div style={{ padding: '0 12px 12px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {[['#1B4D3E', '#EBF4F0', 'Uniform grain'], ['#D97706', '#FEF9EE', 'Minor husk'], ['#C85A32', '#FDF0EB', 'Moisture']].map(([c, bg, l]) => (
                <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: bg, border: `1px solid ${c}30`, borderRadius: '3px', padding: '2px 7px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '1px', backgroundColor: c, display: 'inline-block' }} />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', color: '#4A4A46' }}>{l}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Quality summary table */}
          <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #E2E2DC' }}>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 700, color: '#1A1A18', margin: 0 }}>Quality Dossier</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {QUALITY.map((q, i) => (
                  <tr key={q.param} style={{ borderBottom: i < QUALITY.length - 1 ? '1px solid #F0F0EC' : 'none' }}>
                    <td style={{ padding: '8px 14px', fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#4A4A46' }}>{q.param}</td>
                    <td style={{ padding: '8px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', fontWeight: 700, color: '#1A1A18' }}>{q.value}</span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', color: '#1B4D3E', backgroundColor: '#EBF4F0', borderRadius: '3px', padding: '1px 5px' }}>{q.verdict}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Seller protection / Escrow terms */}
          <div style={{ border: '1px solid #C3DDD4', borderRadius: '8px', backgroundColor: '#EBF4F0', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L2 3.5v4c0 3 2 4.8 4.5 5.5 2.5-.7 4.5-2.5 4.5-5.5v-4L6.5 1z" stroke="#1B4D3E" strokeWidth="1.1" fill="#C3DDD460"/><path d="M4 6.5l2 2L10 5" stroke="#1B4D3E" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#1B4D3E' }}>Seller Protection Active</span>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', color: '#2D6B57', lineHeight: 1.6, margin: '0 0 10px' }}>
              Winning buyer's funds are held in a regulated NBFC escrow account before your vehicle departs. Released within 4 hours of delivery sign-off.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {['Funds locked before dispatch', 'Zero payout defaults since launch', 'Dispute SLA: 24-hour resolution'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2 4-4" stroke="#1B4D3E" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.67rem', color: '#1B4D3E' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ CENTER: LIVE BIDDING TERMINAL ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Top bid card */}
          <div style={{ border: '1.5px solid #1B4D3E', borderRadius: '8px', backgroundColor: 'white', padding: '18px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8A8A84', margin: '0 0 6px' }}>Current Winning Bid</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.04em', color: '#1B4D3E', lineHeight: 1 }}>{fmtINR(topBid.bid)}</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.82rem', color: '#4A4A46' }}>/ Quintal</span>
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: '#4A4A46', margin: '5px 0 0' }}>
                  Total: <strong style={{ color: '#1A1A18' }}>{fmtINR(topBid.bid * 100)}</strong> for 100 qtl
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#8A8A84', margin: '0 0 4px', letterSpacing: '0.04em' }}>WINNING BUYER</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 600, color: '#1A1A18', margin: '0 0 2px' }}>{topBid.buyer}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', color: '#4A4A46', margin: '0 0 4px' }}>{topBid.city}</p>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#D97706' }}>{'★'.repeat(Math.floor(topBid.rating))} {topBid.rating}</span>
              </div>
            </div>

            {/* Bid delta bar */}
            {bids.length > 1 && (
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E2E2DC', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 9V3M3 6l3-3 3 3" stroke="#1B4D3E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: '#1B4D3E', fontWeight: 600 }}>+{fmtINR((bids[0].bid - bids[1].bid) * 100)} vs. previous bid</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', color: '#8A8A84' }}>({fmtINR(bids[0].bid - bids[1].bid)}/qtl higher)</span>
              </div>
            )}
          </div>

          {/* Live bid feed */}
          <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', overflow: 'hidden' }}>
            <div style={{ padding: '11px 18px', borderBottom: '1px solid #E2E2DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', fontWeight: 700, color: '#1A1A18', margin: 0 }}>Live Bid Feed</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1B4D3E', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: '#1B4D3E', letterSpacing: '0.06em' }}>LIVE</span>
                </div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#8A8A84' }}>{bids.length} bids placed</span>
            </div>

            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 72px 80px 90px 70px', padding: '7px 18px', backgroundColor: '#F5F5F2', borderBottom: '1px solid #E2E2DC' }}>
              {['Buyer', 'Rating', 'Location', 'Bid / qtl', '+/− Gain'].map(h => (
                <span key={h} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.56rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#4A4A46' }}>{h}</span>
              ))}
            </div>

            <div ref={feedRef} style={{ maxHeight: '280px', overflowY: 'auto' }}>
              {bids.map((b, i) => {
                const prev = bids[i + 1]
                const delta = prev ? b.bid - prev.bid : null
                const isFlash = flashId === b.id
                const isTop = i === 0
                return (
                  <div
                    key={b.id}
                    style={{
                      display: 'grid', gridTemplateColumns: '1fr 72px 80px 90px 70px',
                      padding: '9px 18px', alignItems: 'center',
                      borderBottom: '1px solid #F0F0EC',
                      backgroundColor: isFlash ? '#EBF4F0' : isTop ? '#FAFFF8' : 'white',
                      transition: 'background-color 0.6s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      {isTop && <span style={{ width: '4px', height: '28px', backgroundColor: '#1B4D3E', borderRadius: '2px', flexShrink: 0 }} />}
                      <div>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: isTop ? 600 : 500, color: '#1A1A18', margin: '0 0 2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          {b.buyer}
                          {b.verified && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" fill="#1B4D3E"/><path d="M2.5 5l2 2 3.5-3.5" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </p>
                        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: '#8A8A84', margin: 0 }}>{b.ts}</p>
                      </div>
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: '#D97706' }}>★ {b.rating}</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', color: '#4A4A46' }}>{b.city}</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', fontWeight: 700, letterSpacing: '-0.02em', color: isTop ? '#1B4D3E' : '#1A1A18' }}>{fmtINR(b.bid)}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace', monospace", fontSize: '0.65rem', color: delta ? '#1B4D3E' : '#8A8A84', fontWeight: delta ? 600 : 400 }}>
                      {delta ? `+${fmtINR(delta)}` : '—'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action controls */}
          {!accepted ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => setAccepted(true)}
                style={{ width: '100%', padding: '14px 20px', backgroundColor: '#1B4D3E', border: 'none', borderRadius: '6px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', letterSpacing: '-0.01em', transition: 'background-color 0.12s' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#163D31')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1B4D3E')}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 7.5l4 4 7-8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Accept Current Winning Bid — {fmtINR(topBid.bid)}/qtl
                </span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>

              <div>
                <button
                  onClick={() => setReserveOpen(!reserveOpen)}
                  style={{ width: '100%', padding: '11px 20px', backgroundColor: 'transparent', border: '1px solid #1B4D3E', borderRadius: '6px', fontFamily: "'Inter', sans-serif", fontSize: '0.82rem', fontWeight: 500, color: '#1B4D3E', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background-color 0.12s' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#EBF4F0')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Set Minimum Reserve Price
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: reserveOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}><path d="M2 4.5L6 8l4-3.5" stroke="#1B4D3E" strokeWidth="1.2" strokeLinecap="round"/></svg>
                </button>
                {reserveOpen && (
                  <div style={{ marginTop: '6px', padding: '12px 14px', border: '1px solid #E2E2DC', borderRadius: '6px', backgroundColor: 'white' }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', color: '#4A4A46', margin: '0 0 8px' }}>Bids below this price will be automatically rejected.</p>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', color: '#1A1A18', fontWeight: 600 }}>₹</span>
                      <input type="number" value={reserveVal} onChange={e => setReserveVal(e.target.value)}
                        style={{ flex: 1, padding: '7px 10px', border: '1px solid #E2E2DC', borderRadius: '5px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', color: '#1A1A18', outline: 'none' }}
                      />
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#8A8A84' }}>/qtl</span>
                      <button style={{ padding: '7px 12px', backgroundColor: '#1B4D3E', border: 'none', borderRadius: '5px', fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: 'white', cursor: 'pointer', fontWeight: 600 }}>Set</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ border: '1.5px solid #1B4D3E', borderRadius: '8px', backgroundColor: '#EBF4F0', padding: '18px 20px', textAlign: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1B4D3E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10l5 5 8-9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#1B4D3E', margin: '0 0 4px' }}>Bid Accepted!</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#2D6B57', margin: '0 0 10px' }}>Escrow release initiated. Buyer notified for pickup coordination.</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#1B4D3E', fontWeight: 700, margin: 0 }}>
                Net to bank: {fmtINR(net)} ✓
              </p>
            </div>
          )}
        </div>

        {/* ══ RIGHT: NET PROFIT CALCULATOR ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'sticky', top: '20px' }}>

          {/* Calculator card */}
          <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E2DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', fontWeight: 700, color: '#1A1A18', margin: 0 }}>Live Net Profit</h3>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: '#1B4D3E', backgroundColor: '#EBF4F0', border: '1px solid #C3DDD4', borderRadius: '3px', padding: '2px 6px', letterSpacing: '0.05em' }}>AUTO-UPDATES</span>
            </div>

            <div style={{ padding: '16px' }}>
              {/* Gross bid */}
              <div style={{ marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', backgroundColor: '#FAFAF8', border: '1px solid #F0F0EC', borderRadius: '5px', marginBottom: '4px' }}>
                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', color: '#4A4A46', margin: '0 0 2px' }}>Gross Bid Value</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#8A8A84', margin: 0 }}>{topBid.bid}/qtl × 100 qtl</p>
                  </div>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.92rem', fontWeight: 700, color: '#1A1A18', letterSpacing: '-0.02em' }}>{fmtINR(gross)}</span>
                </div>

                {/* Deductions */}
                {[
                  { label: 'Est. Transport & Logistics', sub: 'Sehore → Bhopal, 148 km', val: TRANSPORT },
                  { label: 'Platform & Handling Fee', sub: '0.75% of gross value', val: PLATFORM },
                ].map(d => (
                  <div key={d.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderBottom: '1px dashed #E2E2DC' }}>
                    <div>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', color: '#4A4A46', margin: '0 0 2px' }}>{d.label}</p>
                      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: '#8A8A84', margin: 0 }}>{d.sub}</p>
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', fontWeight: 500, color: '#C85A32' }}>−{fmtINR(d.val)}</span>
                  </div>
                ))}
              </div>

              {/* NET PROFIT highlight */}
              <div style={{ padding: '14px 12px', backgroundColor: '#EBF4F0', border: '1.5px solid #1B4D3E', borderRadius: '6px', marginTop: '8px' }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2D6B57', margin: '0 0 5px' }}>Net Profit to Bank</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.04em', color: '#1B4D3E', margin: '0 0 4px', lineHeight: 1 }}>{fmtINR(net)}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', color: '#2D6B57', margin: 0 }}>After transport & all fees · escrow-guaranteed</p>
              </div>

              {/* Per-quintal breakdown */}
              <div style={{ marginTop: '10px', padding: '10px 12px', border: '1px solid #E2E2DC', borderRadius: '5px', backgroundColor: '#FAFAF8' }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#8A8A84', margin: '0 0 8px' }}>Per Quintal Breakdown</p>
                {[
                  { l: 'Gross', v: fmtINR(topBid.bid), c: '#1A1A18' },
                  { l: 'Transport', v: `−₹${(TRANSPORT / 100).toFixed(0)}`, c: '#C85A32' },
                  { l: 'Platform', v: `−₹${(PLATFORM / 100).toFixed(0)}`, c: '#C85A32' },
                  { l: 'Net / qtl', v: fmtINR(Math.round(net / 100)), c: '#1B4D3E' },
                ].map(row => (
                  <div key={row.l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', color: '#4A4A46' }}>{row.l}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', fontWeight: row.l === 'Net / qtl' ? 700 : 400, color: row.c }}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mandi comparison */}
          <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', padding: '14px 16px' }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8A8A84', margin: '0 0 10px' }}>Keemat vs. Local Mandi</p>
            {[
              { l: 'Keemat net', v: fmtINR(net), c: '#1B4D3E', bold: true },
              { l: 'Mandi net (est.)', v: fmtINR(Math.round(net * 0.925)), c: '#4A4A46', bold: false },
            ].map(r => (
              <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#4A4A46' }}>{r.l}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: r.bold ? 700 : 400, color: r.c, letterSpacing: '-0.01em' }}>{r.v}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #E2E2DC', paddingTop: '8px', marginTop: '2px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', fontWeight: 600, color: '#1A1A18' }}>You earn MORE</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.92rem', fontWeight: 700, color: '#1B4D3E', letterSpacing: '-0.02em' }}>+{fmtINR(Math.round(net * 0.075))}</span>
              </div>
            </div>
          </div>

          {/* Auction meta */}
          <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', padding: '12px 16px' }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8A8A84', margin: '0 0 8px' }}>Auction Stats</p>
            {[
              { l: 'Total bids placed', v: String(bids.length) },
              { l: 'Unique bidders', v: String(bids.length) },
              { l: 'Bid range', v: `${fmtINR(bids[bids.length - 1].bid)} – ${fmtINR(topBid.bid)}` },
              { l: 'Lot opened at', v: '14:18:00' },
            ].map(s => (
              <div key={s.l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', color: '#4A4A46' }}>{s.l}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: '#1A1A18', fontWeight: 500 }}>{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
