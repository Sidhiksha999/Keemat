import { useState, useEffect } from 'react'
import { api } from '../services/api'

const NAV_TABS = [
  { id: 'calculator', label: 'Net Profit Calculator' },
  { id: 'lots', label: 'My Active Lots' },
  { id: 'escrow', label: 'Escrow Vault' },
  { id: 'activity', label: 'My Activity Logs' },
  { id: 'advisory', label: 'AI Advisory' },
]

const COMMODITIES = [
  'Wheat - Sharbati',
  'Wheat - Lokwan',
  'Soybean',
  'Cotton - Long Staple',
  'Maize',
  'Chana (Chickpea)',
]

interface Props {
  onNavigate: (view: string, params?: any) => void;
}

export default function FarmerDashboard({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState('calculator')
  const [commodity, setCommodity] = useState('Wheat - Sharbati')
  const [quantity, setQuantity] = useState('100')
  const [origin, setOrigin] = useState('Sehore, Madhya Pradesh')
  const [pickupDate, setPickupDate] = useState('2026-08-18')
  const [reservePrice, setReservePrice] = useState('2300')
  const [isListing, setIsListing] = useState(false)

  // Live Data State
  const [myListings, setMyListings] = useState<any[]>([])
  const [escrowInfo, setEscrowInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // RAG Advisory state
  const [query, setQuery] = useState('')
  const [chatHistory, setChatHistory] = useState<Array<{ sender: string; text: string }>>([
    { sender: 'assistant', text: 'Namaste! I am your Keemat AI Advisory Assistant. Ask me anything about mandi rates, transport tariffs, moisture limits, or escrow protection.' }
  ])
  const [askingAi, setAskingAi] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const res = await api.getListings()
      if (res.listings) setMyListings(res.listings)

      const escRes = await api.getEscrow('KM-8802')
      if (escRes.escrow) setEscrowInfo(escRes.escrow)
    } catch (err) {
      console.warn('Error fetching dashboard live data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Dynamic calculations for calculator
  const qtyNum = Number(quantity.replace(/[^0-9]/g, '')) || 100
  const mandiGross = qtyNum * 2150
  const hubGross = qtyNum * 2280
  const keematGross = qtyNum * 2380

  const mandiTransport = 1200
  const hubTransport = 8500
  const keematTransport = 4200

  const mandiFees = Math.round(mandiGross * 0.02)
  const hubFees = Math.round(hubGross * 0.02)
  const keematFees = Math.round(keematGross * 0.0075)

  const mandiNet = mandiGross - mandiTransport - mandiFees
  const hubNet = hubGross - hubTransport - hubFees
  const keematNet = keematGross - keematTransport - keematFees
  const keematPremium = keematNet - mandiNet

  const handleAskRAG = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || askingAi) return

    const userText = query
    setChatHistory(prev => [...prev, { sender: 'user', text: userText }])
    setQuery('')
    setAskingAi(true)

    try {
      const res = await api.queryRagAdvisory(userText)
      const ans = res.answer || res.reply || 'No response received from advisory model.'
      setChatHistory(prev => [...prev, { sender: 'assistant', text: ans }])
    } catch (err: any) {
      setChatHistory(prev => [...prev, { sender: 'assistant', text: 'Error connecting to AI Advisory service: ' + err.message }])
    } finally {
      setAskingAi(false)
    }
  }

  const handleCreateListing = async () => {
    setIsListing(true)
    try {
      const res = await api.createListing({
        commodity,
        quantityQuintals: qtyNum,
        originLocation: origin,
        pickupDate,
        reservePrice: Number(reservePrice) || 2300
      })
      const lotId = res?.listing?.lotId || res?.lotId || 'KM-8802'
      fetchDashboardData()
      onNavigate('farmer-auction', { lotId })
    } catch (err: any) {
      alert('Error publishing listing: ' + err.message)
    } finally {
      setIsListing(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF9F5', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* ── Top Navigation ── */}
      <nav style={{ backgroundColor: '#FAF9F5', borderBottom: '1px solid #E2E2DC', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '52px', display: 'flex', alignItems: 'center', gap: '32px' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.03em', color: '#1A1A18' }}>KEEMAT</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.06em', textTransform: 'uppercase', backgroundColor: '#EBF4F0', color: '#1B4D3E', border: '1px solid #C3DDD4', borderRadius: '4px', padding: '2px 7px', fontWeight: 500 }}>
              Farmer Dashboard
            </span>
          </div>

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
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <button onClick={() => onNavigate('farmer-auction')} style={{ padding: '6px 12px', backgroundColor: '#1B4D3E', color: 'white', border: 'none', borderRadius: '5px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
              Live Auction Room →
            </button>
          </div>
        </div>
      </nav>

      {/* ── Stats Bar ── */}
      <div style={{ borderBottom: '1px solid #E2E2DC', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { label: 'Total Earnings Released', value: '₹4,82,000', meta: 'Across 6 completed lots', color: '#1B4D3E' },
            { label: 'Active Bids Pending', value: `${myListings.length || 1} Active Lots`, meta: 'Real-time live bidding', color: '#D97706' },
            { label: 'Escrow Vault Status', value: '100% Protected', meta: escrowInfo?.status === 'DISPUTED' ? '⚠️ Escrow Dispute Active' : 'All funds secured in ICICI/HDFC Escrow', color: '#1B4D3E' },
          ].map((box, i) => (
            <div key={box.label} style={{ padding: '14px 20px', borderRight: i < 2 ? '1px solid #E2E2DC' : 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A8A84', margin: '0 0 2px' }}>{box.label}</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: box.color, margin: '0 0 1px' }}>{box.value}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', color: '#8A8A84', margin: 0 }}>{box.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Workspace Tabs ── */}
      <main style={{ flex: 1, maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '24px 24px 96px' }}>

        {/* TAB 1: MY ACTIVE LOTS */}
        {activeTab === 'lots' && (
          <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E2E2DC', paddingBottom: '12px' }}>
              <div>
                <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#1A1A18', margin: 0 }}>My Published Auction Lots</h2>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#8A8A84', margin: '2px 0 0' }}>Real-time inventory and live bidding status</p>
              </div>
              <button onClick={() => setActiveTab('calculator')} style={{ padding: '8px 14px', backgroundColor: '#1B4D3E', color: 'white', border: 'none', borderRadius: '5px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                + Create New Lot
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FAF9F5', borderBottom: '1px solid #E2E2DC', color: '#8A8A84', fontSize: '0.65rem' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Lot ID</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Commodity</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Quantity</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Grade</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Reserve Price</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Auction Status</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(myListings.length > 0 ? myListings : [
                    { lotId: 'KM-8802', commodity: 'Wheat - Sharbati', quantityQuintals: 100, grade: 'GRADE A', reservePrice: 2300, status: 'active_auction' }
                  ]).map((item: any) => (
                    <tr key={item.lotId || item._id} style={{ borderBottom: '1px solid #E2E2DC' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1B4D3E', fontFamily: "'JetBrains Mono', monospace" }}>#{item.lotId}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#1A1A18' }}>{item.commodity}</td>
                      <td style={{ padding: '12px 14px' }}>{item.quantityQuintals} qtl</td>
                      <td style={{ padding: '12px 14px' }}><span style={{ backgroundColor: '#EBF4F0', color: '#1B4D3E', padding: '2px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>{item.grade || 'GRADE A'}</span></td>
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>₹{item.reservePrice}/qtl</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ backgroundColor: item.status === 'active_auction' ? '#FEF3C7' : '#EBF4F0', color: item.status === 'active_auction' ? '#B45309' : '#1B4D3E', padding: '2px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>
                          {item.status === 'active_auction' ? '⚡ LIVE AUCTION' : 'CLOSED'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <button onClick={() => onNavigate('farmer-auction', { lotId: item.lotId })} style={{ padding: '6px 12px', backgroundColor: '#1B4D3E', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}>
                          View Live Terminal →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ESCROW VAULT */}
        {activeTab === 'escrow' && (
          <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', padding: '24px' }}>
            <div style={{ borderBottom: '1px solid #E2E2DC', paddingBottom: '12px', marginBottom: '16px' }}>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#1B4D3E', margin: 0 }}>Keemat Escrow Vault Ledger</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#8A8A84', margin: '2px 0 0' }}>100% deposit-backed ICICI/HDFC regulated escrow account</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#FAF9F5', border: '1px solid #E2E2DC', borderRadius: '6px', padding: '16px' }}>
                <span style={{ fontSize: '0.68rem', color: '#8A8A84', textTransform: 'uppercase', fontWeight: 600 }}>Total Earnings Settled</span>
                <p style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1B4D3E', margin: '4px 0 0' }}>₹4,82,000</p>
              </div>
              <div style={{ backgroundColor: '#FAF9F5', border: '1px solid #E2E2DC', borderRadius: '6px', padding: '16px' }}>
                <span style={{ fontSize: '0.68rem', color: '#8A8A84', textTransform: 'uppercase', fontWeight: 600 }}>Locked Escrow (Lot KM-8802)</span>
                <p style={{ fontSize: '1.4rem', fontWeight: 700, color: '#D97706', margin: '4px 0 0' }}>₹2,46,100</p>
              </div>
              <div style={{ backgroundColor: '#EBF4F0', border: '1px solid #C3DDD4', borderRadius: '6px', padding: '16px' }}>
                <span style={{ fontSize: '0.68rem', color: '#1B4D3E', textTransform: 'uppercase', fontWeight: 600 }}>Escrow Safety Guarantee</span>
                <p style={{ fontSize: '0.78rem', color: '#1B4D3E', fontWeight: 600, margin: '4px 0 0' }}>✓ 100% Deposit Secured Before Transit</p>
              </div>
            </div>

            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1A1A18', marginBottom: '10px' }}>Escrow Transaction History</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF9F5', borderBottom: '1px solid #E2E2DC', color: '#8A8A84', fontSize: '0.65rem' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left' }}>Transaction ID</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left' }}>Lot ID</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left' }}>Buyer</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Gross Amount</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Net Payout</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E2DC' }}>
                  <td style={{ padding: '10px 12px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>ESC-99401</td>
                  <td style={{ padding: '10px 12px' }}>KM-8802</td>
                  <td style={{ padding: '10px 12px' }}>Arjun Patel (Patel Agro Traders)</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>₹2,38,000</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#1B4D3E' }}>₹2,22,500</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <span style={{ backgroundColor: '#EBF4F0', color: '#1B4D3E', padding: '2px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>
                      {escrowInfo?.status || 'FUNDS_LOCKED'}
                    </span>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E2DC' }}>
                  <td style={{ padding: '10px 12px', fontFamily: "'JetBrains Mono', monospace" }}>ESC-88120</td>
                  <td style={{ padding: '10px 12px' }}>KM-7714</td>
                  <td style={{ padding: '10px 12px' }}>Punjab Grain Exchange</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>₹2,50,000</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#1B4D3E' }}>₹2,35,000</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <span style={{ backgroundColor: '#EBF4F0', color: '#1B4D3E', padding: '2px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>
                      FUNDS_RELEASED
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: ACTIVITY LOGS */}
        {activeTab === 'activity' && (
          <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', padding: '24px' }}>
            <div style={{ borderBottom: '1px solid #E2E2DC', paddingBottom: '12px', marginBottom: '16px' }}>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#1A1A18', margin: 0 }}>Farmer Activity & Audit Logs</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#8A8A84', margin: '2px 0 0' }}>Timestamped trail of all lot creation, quality scans, bids, and escrow events</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { time: 'Today 12:40 AM', title: 'Live Bid Received', desc: 'Arjun Patel placed ₹2,380/qtl bid on Lot #KM-8802.', type: 'bid' },
                { time: 'Yesterday 08:30 PM', title: 'Quality Scanner Audit Completed', desc: 'AI Scanner assigned GRADE A (94% confidence) to Wheat Lot #KM-8802.', type: 'scan' },
                { time: 'Yesterday 08:15 PM', title: 'Auction Lot Published', desc: 'Created 100 quintal Wheat - Sharbati lot with ₹2,300/qtl reserve price.', type: 'listing' },
                { time: '15 Aug 2026', title: 'Escrow Settlement Released', desc: '₹2,35,000 payout credited to bank account for Lot #KM-7714.', type: 'escrow' }
              ].map((act, idx) => (
                <div key={idx} style={{ padding: '12px 16px', border: '1px solid #E2E2DC', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAF9F5' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1B4D3E' }}>{act.title}</span>
                      <span style={{ fontSize: '0.65rem', color: '#8A8A84', fontFamily: "'JetBrains Mono', monospace" }}>{act.time}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#4A4A46', margin: '4px 0 0' }}>{act.desc}</p>
                  </div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#1B4D3E', backgroundColor: '#EBF4F0', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>{act.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AI RAG ADVISORY */}
        {activeTab === 'advisory' && (
          <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#1B4D3E', marginBottom: '8px' }}>AI Crop Advisory Assistant (AGMARKNET RAG)</h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.82rem', color: '#4A4A46', marginBottom: '20px' }}>
              Real-time advice on APMC mandi prices, transport freight, quality moisture standards, and escrow protection.
            </p>

            <div style={{ height: '320px', overflowY: 'auto', border: '1px solid #E2E2DC', borderRadius: '6px', padding: '16px', marginBottom: '16px', backgroundColor: '#FAFAF8', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {chatHistory.map((msg, i) => (
                <div key={i} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  <div style={{
                    padding: '12px 16px', borderRadius: '8px',
                    backgroundColor: msg.sender === 'user' ? '#1B4D3E' : 'white',
                    color: msg.sender === 'user' ? 'white' : '#1A1A18',
                    border: msg.sender === 'user' ? 'none' : '1px solid #E2E2DC',
                    fontFamily: "'Inter', sans-serif", fontSize: '0.82rem', lineHeight: 1.6,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {askingAi && <div style={{ fontSize: '0.78rem', color: '#1B4D3E', fontWeight: 600 }}>Analyzing AGMARKNET database & Gemini AI model...</div>}
            </div>

            <form onSubmit={handleAskRAG} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Ask about wheat prices, transport tariffs, moisture limits..."
                style={{ flex: 1, padding: '11px 14px', border: '1px solid #E2E2DC', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' }}
              />
              <button type="submit" disabled={askingAi} style={{ padding: '11px 20px', backgroundColor: '#1B4D3E', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                Ask AI
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: CALCULATOR & LOT CREATION */}
        {activeTab === 'calculator' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '20px', alignItems: 'start' }}>

            {/* LEFT Form */}
            <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E2DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#1A1A18', margin: 0 }}>Crop & Shipment Details</h2>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#8A8A84', margin: '2px 0 0' }}>Enter lot details to compute profit matrix</p>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#D97706', backgroundColor: '#FEF9EE', border: '1px solid #F3D89A', borderRadius: '4px', padding: '2px 7px' }}>Live Estimate</span>
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#1A1A18', marginBottom: '4px' }}>Select Commodity</label>
                  <select value={commodity} onChange={e => setCommodity(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E2DC', borderRadius: '6px', fontSize: '0.82rem' }}>
                    {COMMODITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#1A1A18', marginBottom: '4px' }}>Total Quantity (Quintals)</label>
                  <input type="text" value={quantity} onChange={e => setQuantity(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E2DC', borderRadius: '6px', fontSize: '0.82rem' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#1A1A18', marginBottom: '4px' }}>Origin Farm Location</label>
                  <input type="text" value={origin} onChange={e => setOrigin(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E2DC', borderRadius: '6px', fontSize: '0.82rem' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#1A1A18', marginBottom: '4px' }}>Minimum Reserve Price (₹/qtl)</label>
                  <input type="number" value={reservePrice} onChange={e => setReservePrice(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E2DC', borderRadius: '6px', fontSize: '0.82rem' }} />
                </div>

                <div style={{ backgroundColor: '#F5FAF8', border: '1px solid #C3DDD4', borderRadius: '6px', padding: '10px 14px' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#1B4D3E', margin: '0 0 2px' }}>Lot Summary</p>
                  <p style={{ fontSize: '0.7rem', color: '#4A4A46', margin: 0 }}>
                    {commodity} · {qtyNum} qtl · {origin}
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('farmer-grading')}
                  style={{
                    width: '100%', padding: '11px 16px', backgroundColor: 'transparent',
                    border: '1px solid #1B4D3E', borderRadius: '6px', fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.85rem', fontWeight: 600, color: '#1B4D3E', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <span>📷 Scan Quality with AI Camera</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* RIGHT Profit Matrix */}
            <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E2DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#1A1A18', margin: 0 }}>Marketplace Net Profit Comparison</h2>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#8A8A84', margin: '2px 0 0' }}>Based on {commodity} · {qtyNum} qtl lot</p>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#1B4D3E' }}>Live Rates</span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F5F5F2' }}>
                    <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.65rem' }}>Metric</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: '0.65rem' }}>Local Mandi</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: '0.65rem' }}>Regional Hub</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: '0.65rem', backgroundColor: '#EBF4F0', color: '#1B4D3E' }}>Keemat Direct</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E2E2DC' }}>
                    <td style={{ padding: '12px 16px', fontSize: '0.78rem' }}>Gross Price Offered</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.8rem' }}>₹2,150/qtl</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.8rem' }}>₹2,280/qtl</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.8rem', backgroundColor: '#EBF4F0', color: '#1B4D3E', fontWeight: 700 }}>₹2,380/qtl</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E2DC' }}>
                    <td style={{ padding: '12px 16px', fontSize: '0.78rem' }}>Transport & Toll</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.8rem', color: '#C85A32' }}>−₹{mandiTransport.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.8rem', color: '#C85A32' }}>−₹{hubTransport.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.8rem', backgroundColor: '#EBF4F0', color: '#C85A32' }}>−₹{keematTransport.toLocaleString()}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E2DC' }}>
                    <td style={{ padding: '12px 16px', fontSize: '0.78rem' }}>Mandi Commission / Fee</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.8rem', color: '#C85A32' }}>−₹{mandiFees.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.8rem', color: '#C85A32' }}>−₹{hubFees.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.8rem', backgroundColor: '#EBF4F0', color: '#C85A32' }}>−₹{keematFees.toLocaleString()}</td>
                  </tr>
                  <tr style={{ backgroundColor: '#EBF4F0', borderTop: '2px solid #1B4D3E' }}>
                    <td style={{ padding: '14px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#1B4D3E' }}>YOUR NET PROFIT</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 700 }}>₹{mandiNet.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 700 }}>₹{hubNet.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '0.95rem', fontWeight: 700, color: '#1B4D3E', backgroundColor: '#D5EDE3' }}>₹{keematNet.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ margin: '16px 20px', padding: '12px 14px', backgroundColor: '#FFFBF0', border: '1px solid #F3D89A', borderRadius: '6px' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: '#1A1A18', margin: 0 }}>
                  <strong>Selling on Keemat earns you ₹{keematPremium.toLocaleString('en-IN')} MORE</strong> than local mandi after transport and fees on this {qtyNum}-quintal lot.
                </p>
              </div>

              <div style={{ padding: '0 20px 20px' }}>
                <button
                  onClick={handleCreateListing}
                  disabled={isListing}
                  style={{
                    width: '100%', padding: '13px 20px', backgroundColor: '#1B4D3E', color: 'white',
                    border: 'none', borderRadius: '6px', fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  {isListing ? 'Publishing Lot to Auction...' : `Publish ${qtyNum} qtl ${commodity} Lot for Buyer Bidding →`}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
