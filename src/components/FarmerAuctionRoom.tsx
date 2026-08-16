import { useState, useEffect, useRef } from 'react'
import { api } from '../services/api'
import { joinAuctionRoom } from '../services/socket'

const GRAIN_IMG = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=450&fit=crop&auto=format'
const GRAIN_IMG2 = 'https://images.unsplash.com/photo-1584353781226-579f0ab7c770?w=600&h=450&fit=crop&auto=format'

const QUALITY = [
  { param: 'Moisture Content', value: '12.0%', verdict: 'Optimal' },
  { param: 'Grain Discoloration', value: '3.2%', verdict: 'Acceptable' },
  { param: 'Foreign Matter / Husk', value: '1.8%', verdict: 'Low' },
  { param: 'Uniformity Index', value: '87%', verdict: 'High' },
]

function fmtINR(n: number) {
  return '₹' + Math.round(n).toLocaleString('en-IN')
}

interface Props {
  lotId?: string;
  onNavigate: (view: string, params?: any) => void;
}

export default function FarmerAuctionRoom({ lotId = 'KM-8802', onNavigate }: Props) {
  const [bids, setBids] = useState<any[]>([])
  const [listing, setListing] = useState<any>(null)
  const [secsLeft, setSecsLeft] = useState(252)
  const [accepted, setAccepted] = useState(false)
  const [reserveOpen, setReserveOpen] = useState(false)
  const [reserveVal, setReserveVal] = useState('2300')
  const [activeThumb, setActiveThumb] = useState(0)
  const [escrowStatus, setEscrowStatus] = useState('PENDING_DEPOSIT')
  const feedRef = useRef<HTMLDivElement>(null)

  // Fetch listing data & subscribe to Socket.io live updates
  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getListing(lotId)
        if (res.listing) setListing(res.listing)
        if (res.bids) setBids(res.bids)
        if (res.escrow) setEscrowStatus(res.escrow.status)
        if (res.listing?.status === 'auction_closed') setAccepted(true)
      } catch (err) {
        console.warn('Listing fetch warning:', err)
      }
    }
    loadData()

    // Join real-time socket room
    const unsubscribe = joinAuctionRoom(lotId, (event) => {
      if (event.type === 'state') {
        if (event.bids) setBids(event.bids)
        if (event.listing) setListing(event.listing)
        if (event.escrow) setEscrowStatus(event.escrow.status)
      } else if (event.type === 'new_bid') {
        if (event.bids) setBids(event.bids)
        else if (event.bid) setBids(prev => [event.bid, ...prev])
      } else if (event.type === 'bid_accepted') {
        setAccepted(true)
      } else if (event.type === 'escrow_state_changed') {
        if (event.escrow) setEscrowStatus(event.escrow.status)
      }
    })

    return () => unsubscribe()
  }, [lotId])

  // Countdown timer
  useEffect(() => {
    const t = setInterval(() => setSecsLeft(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  const hasBids = bids.length > 0
  const topBid = bids[0]
  const qty = listing?.quantityQuintals || 100
  const topAmount = topBid ? topBid.amountPerQuintal : 0
  const gross = topAmount * qty
  const transport = hasBids ? 12400 : 0
  const platform = Math.round(gross * 0.0075)
  const net = gross - transport - platform

  const mins = String(Math.floor(secsLeft / 60)).padStart(2, '0')
  const secs = String(secsLeft % 60).padStart(2, '0')
  const timerUrgent = secsLeft < 60

  const handleAcceptBid = async () => {
    if (!hasBids) {
      alert('Cannot accept bid: No bids have been placed yet on this lot.')
      return
    }
    try {
      await api.acceptBid(lotId)
      setAccepted(true)
    } catch (err: any) {
      alert('Error accepting bid: ' + err.message)
    }
  }

  const handleUpdateReserve = async () => {
    try {
      await api.setReservePrice(lotId, Number(reserveVal))
      setReserveOpen(false)
      if (listing) setListing({ ...listing, reservePrice: Number(reserveVal) })
    } catch (err: any) {
      alert('Error setting reserve price: ' + err.message)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF9F5', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* ── Top Bar ── */}
      <header style={{ backgroundColor: '#FAF9F5', borderBottom: '1px solid #E2E2DC', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Back Button (Issue 5) */}
            <button
              onClick={() => onNavigate('farmer-dashboard')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                border: '1px solid #E2E2DC', borderRadius: '5px', padding: '5px 12px',
                backgroundColor: 'white', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem',
                fontWeight: 600, color: '#1B4D3E', cursor: 'pointer'
              }}
            >
              ← Back to Dashboard
            </button>

            <div style={{ width: '1px', height: '16px', backgroundColor: '#E2E2DC' }} />

            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.03em', color: '#1A1A18' }}>KEEMAT</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A8A84' }}>Live Auction Terminal</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: accepted ? '#10B981' : '#E11D48', display: 'inline-block' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', fontWeight: 700, color: accepted ? '#10B981' : '#E11D48', letterSpacing: '0.05em' }}>
                {accepted ? 'AUCTION CLOSED' : 'LIVE AUCTION'}
              </span>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              border: `1px solid ${timerUrgent ? '#FCA5A5' : '#E2E2DC'}`,
              borderRadius: '5px', padding: '4px 10px',
              backgroundColor: timerUrgent ? '#FEF2F2' : 'white',
            }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#8A8A84' }}>ENDS IN</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', fontWeight: 700, color: timerUrgent ? '#DC2626' : '#1A1A18' }}>
                {mins}:{secs}
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* ── Main Workspace ── */}
      <main style={{ flex: 1, maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '20px 24px 88px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start' }}>

        {/* LEFT Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Top Banner */}
          <div style={{
            border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', padding: '20px',
            display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '16px', alignItems: 'center'
          }}>
            <div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#8A8A84' }}>
                Lot #{listing?.lotId || lotId} · {listing?.commodity || 'Wheat - Sharbati'}
              </span>
              <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: '#1A1A18', margin: '3px 0 0' }}>
                {qty} Quintals
              </h1>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#4A4A46', margin: '2px 0 0' }}>
                {listing?.originLocation || 'Sehore, MP'} · Reserve: ₹{listing?.reservePrice || 2300}/qtl
              </p>
            </div>

            <div style={{ borderLeft: '1px solid #E2E2DC', borderRight: '1px solid #E2E2DC', padding: '0 16px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#8A8A84' }}>Highest Active Bid</span>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: hasBids ? '#1B4D3E' : '#8A8A84', margin: '3px 0 0' }}>
                {hasBids ? `${fmtINR(topAmount)}/qtl` : 'No Bids Yet'}
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#4A4A46', margin: '2px 0 0' }}>
                {hasBids ? `Gross: ${fmtINR(gross)}` : 'Waiting for buyers...'}
              </p>
            </div>

            <div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#8A8A84' }}>Net Farmer Payout</span>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: hasBids ? '#1B4D3E' : '#8A8A84', margin: '3px 0 0' }}>
                {hasBids ? fmtINR(net) : 'Awaiting Bids'}
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#1B4D3E', fontWeight: 600, margin: '2px 0 0' }}>
                {hasBids ? 'Escrow Protected ✓' : 'Escrow Deposit Ready'}
              </p>
            </div>
          </div>

          {/* Live Bid Feed (Issue 3: Real Bids Only) */}
          <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #E2E2DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', fontWeight: 700, color: '#1A1A18', margin: 0 }}>
                Live Bidding Stream ({bids.length} Active Bids)
              </h2>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: '#1B4D3E' }}>
                ⚡ REAL-TIME WEBSOCKET FEED
              </span>
            </div>

            <div ref={feedRef} style={{ maxHeight: '280px', overflowY: 'auto' }}>
              {bids.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#8A8A84' }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#4A4A46', margin: '0 0 4px' }}>
                    No Bids Placed Yet
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', margin: 0 }}>
                    This lot is active in the buyer marketplace. Incoming live bids will stream here automatically.
                  </p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF9F5', borderBottom: '1px solid #E2E2DC', color: '#8A8A84', fontSize: '0.65rem' }}>
                      <th style={{ padding: '8px 16px', textAlign: 'left' }}>Time</th>
                      <th style={{ padding: '8px 16px', textAlign: 'left' }}>Buyer / Mill</th>
                      <th style={{ padding: '8px 16px', textAlign: 'left' }}>City</th>
                      <th style={{ padding: '8px 16px', textAlign: 'right' }}>Bid / Quintal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bids.map((b, i) => (
                      <tr key={b.id || i} style={{ borderBottom: '1px solid #FAF9F5', backgroundColor: i === 0 ? '#EBF4F0' : 'white' }}>
                        <td style={{ padding: '10px 16px', color: '#8A8A84', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem' }}>
                          {b.timestampStr || 'Just now'}
                        </td>
                        <td style={{ padding: '10px 16px', fontWeight: 600, color: '#1A1A18' }}>
                          {b.buyerName} {i === 0 && <span style={{ fontSize: '0.6rem', backgroundColor: '#1B4D3E', color: 'white', padding: '1px 5px', borderRadius: '3px', marginLeft: '4px' }}>HIGHEST</span>}
                        </td>
                        <td style={{ padding: '10px 16px', color: '#4A4A46' }}>{b.buyerCity || 'MP'}</td>
                        <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: i === 0 ? '#1B4D3E' : '#1A1A18', fontSize: '0.85rem' }}>
                          ₹{b.amountPerQuintal}/qtl
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setReserveOpen(true)}
              style={{ flex: 1, padding: '12px', backgroundColor: 'white', border: '1px solid #E2E2DC', borderRadius: '6px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 600, color: '#1A1A18', cursor: 'pointer' }}
            >
              ⚙ Adjust Reserve Price (Current: ₹{listing?.reservePrice || 2300})
            </button>
            <button
              onClick={handleAcceptBid}
              disabled={accepted || !hasBids}
              style={{
                flex: 1.5, padding: '12px',
                backgroundColor: accepted ? '#10B981' : hasBids ? '#1B4D3E' : '#9CA3AF',
                border: 'none', borderRadius: '6px', fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.82rem', fontWeight: 700, color: 'white',
                cursor: (accepted || !hasBids) ? 'not-allowed' : 'pointer'
              }}
            >
              {accepted ? '✓ Bid Accepted & Escrow Locked' : hasBids ? `Accept Top Bid (${fmtINR(topAmount)}/qtl) →` : 'Waiting for Bids...'}
            </button>
          </div>

        </div>

        {/* RIGHT Column: Lot Quality & Financial Audit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Quality Dossier Summary */}
          <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', padding: '18px' }}>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#1A1A18', margin: '0 0 12px' }}>
              Verified Quality Parameters
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
              {QUALITY.map((q) => (
                <div key={q.param} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #FAF9F5', paddingBottom: '6px' }}>
                  <span style={{ color: '#4A4A46' }}>{q.param}:</span>
                  <span style={{ fontWeight: 700, color: '#1B4D3E' }}>{q.value} ({q.verdict})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', padding: '18px' }}>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#1A1A18', margin: '0 0 12px' }}>
              Net Payout Audit Breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#4A4A46' }}>Gross Auction Value:</span>
                <span style={{ fontWeight: 600 }}>{hasBids ? fmtINR(gross) : '₹0'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#C85A32' }}>
                <span>Transport & Freight:</span>
                <span>{hasBids ? `−${fmtINR(transport)}` : '₹0'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#C85A32' }}>
                <span>Escrow & Platform Fee (0.75%):</span>
                <span>{hasBids ? `−${fmtINR(platform)}` : '₹0'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #E2E2DC', fontWeight: 700, color: '#1B4D3E', fontSize: '0.85rem' }}>
                <span>Net Credit Payout:</span>
                <span>{hasBids ? fmtINR(net) : '₹0'}</span>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Adjust Reserve Modal */}
      {reserveOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: 'white', border: '1px solid #E2E2DC', borderRadius: '8px', padding: '24px', maxWidth: '380px', width: '100%' }}>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', fontWeight: 700, color: '#1A1A18', margin: 0 }}>Adjust Minimum Reserve Price</h3>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#4A4A46', margin: '6px 0 16px' }}>Bids below your reserve price will not be auto-accepted.</p>
            <input
              type="number"
              value={reserveVal}
              onChange={(e) => setReserveVal(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #E2E2DC', borderRadius: '6px', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', marginBottom: '16px', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleUpdateReserve} style={{ flex: 1, padding: '10px', backgroundColor: '#1B4D3E', color: 'white', border: 'none', borderRadius: '6px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                Update Reserve
              </button>
              <button onClick={() => setReserveOpen(false)} style={{ padding: '10px 16px', backgroundColor: 'white', border: '1px solid #E2E2DC', borderRadius: '6px', fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
