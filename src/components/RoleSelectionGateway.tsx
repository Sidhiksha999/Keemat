import { useState } from 'react'
import { api } from '../services/api'

const LANGUAGES = ['English', 'हिंदी', 'ਪੰਜਾਬੀ', 'मराठी', 'తెలుగు']

const FARMER_FEATURES = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1" y="3" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.25" fill="none"/>
        <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
      </svg>
    ),
    label: 'Net Profit Calculator',
    desc: 'Factor in transport, toll, & mandi fees before loading',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25"/>
        <path d="M5.5 8.5l2 2 3-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'AI Quality Assessment',
    desc: 'Instant photo-based crop grading, no lab wait',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.25" fill="none"/>
        <path d="M5 4V3a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.25"/>
        <circle cx="8" cy="9" r="1.25" fill="currentColor"/>
      </svg>
    ),
    label: 'Guaranteed Escrow Protection',
    desc: 'Zero payment defaults — funds locked before dispatch',
  },
]

const BUYER_FEATURES = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1.5" y="2" width="13" height="12" rx="1" stroke="currentColor" strokeWidth="1.25" fill="none"/>
        <path d="M4 6h8M4 9h5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
      </svg>
    ),
    label: 'Full Quality Dossiers',
    desc: 'AI defect maps, moisture % & grain purity metrics',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2 12l4-5 3 3 2-4 3 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'Dynamic Landed Cost Engine',
    desc: 'Total freight + tax calculated per quintal, live',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="3" y="6" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.25" fill="none"/>
        <path d="M5.5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.25"/>
        <path d="M8 9.5v1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    label: 'Locked Escrow Vaults',
    desc: 'Funds released only upon physical delivery check',
  },
]

const TRUST_STATS = [
  '100% Deposit-Backed Escrow',
  'Verified Buyers Only',
  'Zero Payout Fraud',
]

interface Props {
  onSelectRole: (role: 'farmer' | 'buyer') => void;
}

export default function RoleSelectionGateway({ onSelectRole }: Props) {
  const [selectedLang, setSelectedLang] = useState('English')
  const [langOpen, setLangOpen] = useState(false)
  const [farmerHovered, setFarmerHovered] = useState(false)
  const [buyerHovered, setBuyerHovered] = useState(false)

  const handleSelect = async (role: 'farmer' | 'buyer') => {
    try {
      await api.selectRole(role)
    } catch (e) {
      console.warn('Role selection API warning:', e)
    }
    onSelectRole(role)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF9F5', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Header ── */}
      <header style={{ borderBottom: '1px solid #E2E2DC', backgroundColor: '#FAF9F5' }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

          {/* Wordmark */}
          <div className="flex items-center gap-3">
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '1.125rem', letterSpacing: '-0.02em', color: '#1A1A18' }}>
              KEEMAT
            </span>
            <div style={{ width: '1px', height: '18px', backgroundColor: '#E2E2DC' }} />
            <div className="flex items-center gap-1.5">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1B4D3E', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.06em', color: '#8A8A84', textTransform: 'uppercase' }}>
                Verifiable Agri-Trade Engine
              </span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                onBlur={() => setTimeout(() => setLangOpen(false), 150)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  border: '1px solid #E2E2DC', borderRadius: '6px',
                  padding: '5px 10px', backgroundColor: 'white',
                  fontFamily: "'Inter', sans-serif", fontSize: '0.8rem',
                  color: '#1A1A18', cursor: 'pointer', fontWeight: 500,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <circle cx="6" cy="6" r="5" stroke="#4A4A46" strokeWidth="1"/>
                  <path d="M6 1C6 1 4 3.5 4 6s2 5 2 5" stroke="#4A4A46" strokeWidth="1"/>
                  <path d="M6 1C6 1 8 3.5 8 6s-2 5-2 5" stroke="#4A4A46" strokeWidth="1"/>
                  <path d="M1 6h10" stroke="#4A4A46" strokeWidth="1"/>
                </svg>
                {selectedLang}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" style={{ transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
                  <path d="M2.5 3.75L5 6.25l2.5-2.5" stroke="#4A4A46" strokeWidth="1.25" strokeLinecap="round"/>
                </svg>
              </button>
              {langOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 50,
                  border: '1px solid #E2E2DC', borderRadius: '6px', backgroundColor: 'white',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)', minWidth: '130px', overflow: 'hidden',
                }}>
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      onClick={() => { setSelectedLang(lang); setLangOpen(false) }}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '7px 12px', fontFamily: "'Inter', sans-serif",
                        fontSize: '0.8rem', color: lang === selectedLang ? '#1B4D3E' : '#1A1A18',
                        backgroundColor: lang === selectedLang ? '#F0F7F4' : 'transparent',
                        fontWeight: lang === selectedLang ? 600 : 400,
                        border: 'none', cursor: 'pointer',
                      }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ width: '1px', height: '18px', backgroundColor: '#E2E2DC' }} />

            <a
              href="#support"
              style={{
                fontFamily: "'Inter', sans-serif", fontSize: '0.8rem',
                color: '#4A4A46', textDecoration: 'none', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: '5px',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1"/>
                <path d="M6 5.5V8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                <circle cx="6" cy="4" r="0.6" fill="currentColor"/>
              </svg>
              Support / Helpline
            </a>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col" style={{ padding: '0 24px' }}>
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">

          {/* Section header */}
          <div style={{ padding: '52px 0 36px', borderBottom: '1px solid #E2E2DC', marginBottom: '40px' }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8A8A84', marginBottom: '10px' }}>
              Step 1 of 3 — Account Setup
            </p>
            <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#1A1A18', lineHeight: 1.15, marginBottom: '10px' }}>
              Select your role on Keemat
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#4A4A46', lineHeight: 1.6, maxWidth: '480px' }}>
              Your portal, features, and verification requirements differ by role. Choose the one that describes your primary activity.
            </p>
          </div>

          {/* Dual card grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '48px' }}>

            {/* ── Farmer Card ── */}
            <RoleCard
              accent="#1B4D3E"
              accentHover="#163D31"
              bgAccent="#F0F7F4"
              hovered={farmerHovered}
              onMouseEnter={() => setFarmerHovered(true)}
              onMouseLeave={() => setFarmerHovered(false)}
              tag="KISAN / SELLER PORTAL"
              title="I am a Farmer"
              titleSub="/ Seller"
              subtitle="किसान / विक्रेता"
              desc="Sell crop direct. Calculate real net earnings after transport and fees before loading the truck."
              features={FARMER_FEATURES}
              buttonLabel="Continue as Farmer / Seller"
              onClick={() => handleSelect('farmer')}
            />

            {/* ── Buyer Card ── */}
            <RoleCard
              accent="#1E3A8A"
              accentHover="#172E6E"
              bgAccent="#EEF2FB"
              hovered={buyerHovered}
              onMouseEnter={() => setBuyerHovered(true)}
              onMouseLeave={() => setBuyerHovered(false)}
              tag="TRADER / MILL OWNER PORTAL"
              title="I am a Buyer"
              titleSub="/ Trader"
              subtitle="खरीदार / व्यापारी"
              desc="Procure verified, graded crop lots directly from fields with total landed cost visibility."
              features={BUYER_FEATURES}
              buttonLabel="Continue as Buyer / Trader"
              onClick={() => handleSelect('buyer')}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '48px' }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle cx="6.5" cy="6.5" r="5.75" stroke="#8A8A84" strokeWidth="1"/>
              <path d="M6.5 5.5V8.5" stroke="#8A8A84" strokeWidth="1.25" strokeLinecap="round"/>
              <circle cx="6.5" cy="4.25" r="0.6" fill="#8A8A84"/>
            </svg>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#8A8A84', lineHeight: 1.5 }}>
              KYC verification and business documents will be required after role selection. Switching roles later requires re-verification.
            </p>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid #E2E2DC', backgroundColor: '#FAF9F5' }}>
        <div style={{ borderBottom: '1px solid #E2E2DC', backgroundColor: '#F0EFE9' }}>
          <div className="max-w-6xl mx-auto px-6" style={{ height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', flexWrap: 'wrap' }}>
            {TRUST_STATS.map((stat, i) => (
              <span key={stat} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', letterSpacing: '0.05em', color: '#4A4A46', textTransform: 'uppercase', padding: '0 20px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#1B4D3E', display: 'inline-block', flexShrink: 0 }} />
                  {stat}
                </span>
                {i < TRUST_STATS.length - 1 && (
                  <span style={{ width: '1px', height: '16px', backgroundColor: '#E2E2DC', display: 'inline-block' }} />
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6" style={{ height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', color: '#8A8A84' }}>
            © 2026 Keemat Agri Technologies Pvt. Ltd. — AGMARKNET Compliant
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', color: '#4A4A46', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Already registered?{' '}
            <button onClick={() => handleSelect('farmer')} style={{ background: 'none', border: 'none', color: '#1A1A18', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
              Sign In to Your Dashboard →
            </button>
          </p>
        </div>
      </footer>
    </div>
  )
}

type Feature = { icon: React.ReactNode; label: string; desc: string }

function RoleCard({
  accent, accentHover, bgAccent, hovered,
  onMouseEnter, onMouseLeave,
  tag, title, titleSub, subtitle, desc, features, buttonLabel, onClick
}: {
  accent: string; accentHover: string; bgAccent: string; hovered: boolean;
  onMouseEnter: () => void; onMouseLeave: () => void;
  tag: string; title: string; titleSub: string; subtitle: string;
  desc: string; features: Feature[]; buttonLabel: string; onClick: () => void;
}) {
  const [btnHovered, setBtnHovered] = useState(false)

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        border: `2px solid ${hovered ? accent : '#E2E2DC'}`,
        borderRadius: '8px',
        backgroundColor: 'white',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        boxShadow: hovered ? `0 4px 24px rgba(0,0,0,0.07)` : '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: accent, backgroundColor: bgAccent,
          padding: '3px 8px', borderRadius: '3px', fontWeight: 500,
        }}>
          {tag}
        </span>
      </div>

      <div style={{ marginBottom: '6px' }}>
        <h2 style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: '1.5rem',
          fontWeight: 700, letterSpacing: '-0.03em', color: '#1A1A18',
          lineHeight: 1.1, margin: 0,
        }}>
          {title}
          <span style={{ color: '#4A4A46', fontWeight: 500 }}> {titleSub}</span>
        </h2>
      </div>

      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', color: '#8A8A84', marginBottom: '16px' }}>
        {subtitle}
      </p>

      <div style={{ height: '1px', backgroundColor: '#E2E2DC', marginBottom: '20px' }} />

      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: '#4A4A46', lineHeight: 1.65, marginBottom: '28px' }}>
        {desc}
      </p>

      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
        {features.map(f => (
          <li key={f.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{
              color: accent, flexShrink: 0, width: '28px', height: '28px',
              border: `1px solid ${bgAccent}`, borderRadius: '5px',
              backgroundColor: bgAccent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: '1px',
            }}>
              {f.icon}
            </span>
            <div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: 600, color: '#1A1A18', margin: '0 0 2px' }}>
                {f.label}
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: '#8A8A84', margin: 0, lineHeight: 1.55 }}>
                {f.desc}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={onClick}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          width: '100%', padding: '13px 20px',
          backgroundColor: btnHovered ? accentHover : accent,
          color: 'white', border: 'none', borderRadius: '6px',
          fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem',
          fontWeight: 700, cursor: 'pointer', transition: 'background-color 0.12s',
        }}
      >
        {buttonLabel} →
      </button>
    </div>
  )
}
