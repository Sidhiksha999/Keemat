import { useState } from 'react'

const GRAIN_IMG = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=900&h=675&fit=crop&auto=format'

const STEPS = [
  { n: 1, label: 'Upload Photo', done: true },
  { n: 2, label: 'AI Analysis', done: false, active: true },
  { n: 3, label: 'Review & Override', done: false },
  { n: 4, label: 'Publish to Auction', done: false },
]

type Verdict = 'pass' | 'warn' | 'fail'

const METRICS: { name: string; value: string; reading: number; max: number; threshold: string; verdict: Verdict; unit: string }[] = [
  { name: 'Moisture Content', value: '12.0%', reading: 12.0, max: 15, threshold: '< 12.5% Optimal', verdict: 'pass', unit: '%' },
  { name: 'Foreign Matter / Husk', value: '1.8%', reading: 1.8, max: 5, threshold: '< 2.0% Low', verdict: 'pass', unit: '%' },
  { name: 'Defect / Discoloration', value: '3.2%', reading: 3.2, max: 10, threshold: '< 3.5% Acceptable', verdict: 'pass', unit: '%' },
  { name: 'Uniformity Index', value: '87%', reading: 87, max: 100, threshold: '> 80% High', verdict: 'pass', unit: '%' },
  { name: 'Test Weight (Hectolitre)', value: '78.4 kg', reading: 78.4, max: 85, threshold: '> 76 kg Standard', verdict: 'pass', unit: 'kg' },
]

const BOXES = [
  { x: 6, y: 8, w: 28, h: 22, color: '#1B4D3E', type: 'uniform', label: 'Uniform Grain Size · 94% match' },
  { x: 52, y: 10, w: 30, h: 26, color: '#1B4D3E', type: 'uniform', label: 'Uniform Grain Size · 91% match' },
  { x: 62, y: 55, w: 20, h: 18, color: '#1B4D3E', type: 'uniform', label: 'Uniform Grain Size · 89% match' },
  { x: 16, y: 60, w: 18, h: 14, color: '#D97706', type: 'husk', label: 'Minor Husk / Foreign Matter' },
  { x: 70, y: 35, w: 14, h: 12, color: '#D97706', type: 'husk', label: 'Minor Husk / Foreign Matter' },
  { x: 36, y: 42, w: 14, h: 12, color: '#C85A32', type: 'moisture', label: 'Moisture Spot / Discoloration' },
]

const LEGEND = [
  { color: '#1B4D3E', bg: '#EBF4F0', border: '#C3DDD4', label: 'Uniform Grain (18 zones)' },
  { color: '#D97706', bg: '#FEF9EE', border: '#F3D89A', label: 'Minor Husk (3 zones)' },
  { color: '#C85A32', bg: '#FDF0EB', border: '#F0C4B4', label: 'Moisture Flag (1 zone)' },
]

const SAMPLE_THUMBS = [
  'https://images.unsplash.com/photo-1584353781226-579f0ab7c770?w=80&h=80&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=80&h=80&fit=crop&auto=format',
]

export default function App() {
  const [overlay, setOverlay] = useState(true)
  const [activeBox, setActiveBox] = useState<number | null>(null)
  const [activeThumb, setActiveThumb] = useState(1)
  const [overrideOpen, setOverrideOpen] = useState(false)
  const [overrideReason, setOverrideReason] = useState('')
  const [overrideSent, setOverrideSent] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'uniform' | 'husk' | 'moisture'>('all')

  const visibleBoxes = BOXES.filter(b =>
    activeFilter === 'all' || b.type === activeFilter
  )

  const verdictStyle = (v: Verdict) =>
    v === 'pass'
      ? { color: '#1B4D3E', bg: '#EBF4F0', border: '#C3DDD4', label: 'PASS' }
      : v === 'warn'
      ? { color: '#D97706', bg: '#FEF9EE', border: '#F3D89A', label: 'WARN' }
      : { color: '#C85A32', bg: '#FDF0EB', border: '#F0C4B4', label: 'FAIL' }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF9F5', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* ══ HEADER / STEP TRACKER ══ */}
      <header style={{ backgroundColor: '#FAF9F5', borderBottom: '1px solid #E2E2DC', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 28px', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.03em', color: '#1A1A18' }}>KEEMAT</span>
            <div style={{ width: '1px', height: '16px', backgroundColor: '#E2E2DC' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#8A8A84' }}>Quality Assessment</span>
          </div>

          {/* Step tracker */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {STEPS.map((step, i) => (
              <div key={step.n} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    backgroundColor: step.done ? '#1B4D3E' : step.active ? '#EBF4F0' : 'white',
                    border: `1.5px solid ${step.done || step.active ? '#1B4D3E' : '#D1D1CC'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {step.done
                      ? <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5l2.5 2.5L9 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      : <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', fontWeight: 700, color: step.active ? '#1B4D3E' : '#8A8A84' }}>{step.n}</span>
                    }
                  </div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', fontWeight: step.active ? 600 : 400, color: step.done ? '#1B4D3E' : step.active ? '#1B4D3E' : '#8A8A84', whiteSpace: 'nowrap' }}>
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: '32px', height: '1px', margin: '0 10px', backgroundColor: step.done ? '#1B4D3E' : '#E2E2DC' }} />
                )}
              </div>
            ))}
          </div>

          {/* Lot tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #E2E2DC', borderRadius: '5px', padding: '5px 10px', backgroundColor: 'white', flexShrink: 0 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#8A8A84', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Lot</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 600, color: '#1A1A18' }}>Wheat–Sharbati · 100 qtl</span>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#D97706', display: 'inline-block' }} />
          </div>
        </div>
      </header>

      {/* ══ MAIN WORKSPACE ══ */}
      <main style={{ flex: 1, maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '20px 28px 88px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

        {/* ══ LEFT: IMAGE WORKSPACE ══ */}
        <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', overflow: 'hidden' }}>

          {/* Panel header */}
          <div style={{ padding: '13px 18px', borderBottom: '1px solid #E2E2DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', fontWeight: 700, color: '#1A1A18', margin: 0, letterSpacing: '-0.02em' }}>Sample Photo & Defect Map</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.67rem', color: '#8A8A84', margin: '2px 0 0' }}>Click any box for detection detail · 4 photos analyzed</p>
            </div>
            <button
              onClick={() => setOverlay(!overlay)}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid #E2E2DC', borderRadius: '5px', padding: '4px 10px', backgroundColor: overlay ? '#EBF4F0' : 'white', color: overlay ? '#1B4D3E' : '#4A4A46', fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.12s' }}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><rect x="1" y="1" width="9" height="9" rx="1.2" stroke="currentColor" strokeWidth="1"/><circle cx="5.5" cy="5.5" r="1.8" stroke="currentColor" strokeWidth="1"/></svg>
              {overlay ? 'Overlay ON' : 'Overlay OFF'}
            </button>
          </div>

          {/* Image viewer */}
          <div style={{ position: 'relative', aspectRatio: '4/3', backgroundColor: '#1A1A18', margin: '16px 16px 0' }}>
            <img
              src={GRAIN_IMG}
              alt="Wheat grain sample for AI quality analysis"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.92 }}
            />

            {/* SVG overlay */}
            {overlay && (
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 75" preserveAspectRatio="none">
                {/* Scan grid */}
                <g opacity="0.1">
                  <line x1="33" y1="0" x2="33" y2="75" stroke="#fff" strokeWidth="0.3"/>
                  <line x1="66" y1="0" x2="66" y2="75" stroke="#fff" strokeWidth="0.3"/>
                  <line x1="0" y1="25" x2="100" y2="25" stroke="#fff" strokeWidth="0.3"/>
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#fff" strokeWidth="0.3"/>
                </g>
                {visibleBoxes.map((box, i) => {
                  const globalIdx = BOXES.indexOf(box)
                  const isActive = activeBox === globalIdx
                  return (
                    <g key={i} style={{ cursor: 'pointer' }} onClick={() => setActiveBox(isActive ? null : globalIdx)}>
                      <rect x={box.x} y={box.y} width={box.w} height={box.h}
                        fill={`${box.color}20`}
                        stroke={box.color} strokeWidth={isActive ? 0.8 : 0.5}
                        strokeDasharray={box.color === '#C85A32' ? '2 1' : 'none'} rx="0.5"
                      />
                      {/* Corner marks */}
                      {[
                        `M${box.x},${box.y+3}L${box.x},${box.y}L${box.x+3},${box.y}`,
                        `M${box.x+box.w-3},${box.y}L${box.x+box.w},${box.y}L${box.x+box.w},${box.y+3}`,
                        `M${box.x},${box.y+box.h-3}L${box.x},${box.y+box.h}L${box.x+3},${box.y+box.h}`,
                        `M${box.x+box.w-3},${box.y+box.h}L${box.x+box.w},${box.y+box.h}L${box.x+box.w},${box.y+box.h-3}`,
                      ].map((d, k) => <path key={k} d={d} stroke={box.color} strokeWidth="0.9" fill="none"/>)}
                    </g>
                  )
                })}
              </svg>
            )}

            {/* Active tooltip */}
            {activeBox !== null && overlay && (
              <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(26,26,24,0.88)', borderRadius: '4px', padding: '5px 12px', pointerEvents: 'none' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', color: 'white', margin: 0, whiteSpace: 'nowrap' }}>{BOXES[activeBox].label}</p>
              </div>
            )}

            {/* Photo badge */}
            <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(26,26,24,0.72)', borderRadius: '4px', padding: '3px 8px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: 'white', letterSpacing: '0.04em' }}>2 / 4</span>
            </div>
          </div>

          {/* Filter chips */}
          {overlay && (
            <div style={{ padding: '10px 16px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {([['all', '#4A4A46', '#F5F5F2', '#E2E2DC', 'All Detections'],
                ['uniform', '#1B4D3E', '#EBF4F0', '#C3DDD4', '18 Uniform'],
                ['husk', '#D97706', '#FEF9EE', '#F3D89A', '3 Husk'],
                ['moisture', '#C85A32', '#FDF0EB', '#F0C4B4', '1 Moisture'],
              ] as const).map(([type, color, bg, border, label]) => (
                <button key={type}
                  onClick={() => setActiveFilter(type as typeof activeFilter)}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', border: `1px solid ${activeFilter === type ? border : '#E2E2DC'}`, borderRadius: '4px', padding: '3px 9px', backgroundColor: activeFilter === type ? bg : 'white', color: activeFilter === type ? color : '#4A4A46', fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', fontWeight: activeFilter === type ? 600 : 400, cursor: 'pointer' }}
                >
                  {type !== 'all' && <span style={{ width: '6px', height: '6px', borderRadius: '1px', backgroundColor: color, display: 'inline-block' }} />}
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Thumbnail strip */}
          <div style={{ padding: '0 16px 14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            {SAMPLE_THUMBS.map((src, i) => (
              <button key={i} onClick={() => setActiveThumb(i)}
                style={{ width: '56px', height: '42px', borderRadius: '4px', overflow: 'hidden', border: `1.5px solid ${activeThumb === i ? '#1B4D3E' : '#E2E2DC'}`, padding: 0, cursor: 'pointer', flexShrink: 0 }}
              >
                <img src={src} alt={`Sample ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </button>
            ))}
            {/* Add photo placeholder */}
            {[3, 4].map(n => (
              <div key={n} style={{ width: '56px', height: '42px', borderRadius: '4px', border: '1px dashed #D1D1CC', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAF8', flexShrink: 0 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#D1D1CC' }}>{n}/4</span>
              </div>
            ))}
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', color: '#8A8A84', margin: '0 0 0 4px' }}>Add up to 4 photos for higher confidence</p>
          </div>

          {/* Camera actions */}
          <div style={{ margin: '0 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button style={{ padding: '10px 14px', backgroundColor: '#1B4D3E', border: 'none', borderRadius: '6px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 600, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', transition: 'background-color 0.12s' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#163D31')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1B4D3E')}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="3.5" width="11" height="9" rx="1.5" stroke="white" strokeWidth="1.1"/><circle cx="7" cy="8" r="2.2" stroke="white" strokeWidth="1.1"/><path d="M4.5 3.5l.7-1.5h3.6l.7 1.5" stroke="white" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Take New Photo
            </button>
            <button style={{ padding: '10px 14px', backgroundColor: 'transparent', border: '1px solid #1B4D3E', borderRadius: '6px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 600, color: '#1B4D3E', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', transition: 'background-color 0.12s' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#EBF4F0')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5v8M4 6l3 4 3-4" stroke="#1B4D3E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 11h10" stroke="#1B4D3E" strokeWidth="1.2" strokeLinecap="round"/></svg>
              Upload Sample Photos
            </button>
          </div>
        </div>

        {/* ══ RIGHT: GRADE SCORECARD ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Grade badge */}
          <div style={{ border: '1.5px solid #1B4D3E', borderRadius: '8px', backgroundColor: '#EBF4F0', padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2D6B57', margin: '0 0 6px' }}>AI Assessment Result · 4 photos</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.04em', color: '#1B4D3E', margin: 0, lineHeight: 1 }}>GRADE A</h1>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.82rem', fontWeight: 600, color: '#2D6B57' }}>Prime Quality</span>
                </div>
              </div>
              {/* Shield */}
              <div style={{ width: '48px', height: '48px', backgroundColor: '#1B4D3E', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 5.5v6c0 6 4 9.5 8 11 4-1.5 8-5 8-11v-6L12 2z" stroke="white" strokeWidth="1.3"/><path d="M8 12l3 3 5-6" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>

            {/* Confidence bar */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', color: '#2D6B57' }}>AI Confidence Score</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', fontWeight: 700, color: '#1B4D3E' }}>89%</span>
              </div>
              <div style={{ height: '5px', backgroundColor: '#C3DDD4', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '89%', height: '100%', backgroundColor: '#1B4D3E', borderRadius: '3px' }} />
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', color: '#4A7A66', margin: '5px 0 0' }}>Add 2 more photos to push confidence above 95%</p>
            </div>
          </div>

          {/* Metric breakdown */}
          <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', overflow: 'hidden' }}>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid #E2E2DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#1A1A18', margin: 0, letterSpacing: '-0.02em' }}>Quality Parameter Breakdown</h2>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: '#1B4D3E', backgroundColor: '#EBF4F0', border: '1px solid #C3DDD4', borderRadius: '3px', padding: '2px 7px', letterSpacing: '0.06em' }}>5 / 5 PASS</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F5F5F2' }}>
                  {['Parameter', 'Value', 'Threshold', 'Result'].map((h, i) => (
                    <th key={h} style={{ padding: '8px 14px', textAlign: i === 0 ? 'left' : 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#4A4A46', fontWeight: 500, borderBottom: '1px solid #E2E2DC' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {METRICS.map((m, i) => {
                  const vs = verdictStyle(m.verdict)
                  const pct = Math.min((m.reading / m.max) * 100, 100)
                  return (
                    <tr key={m.name} style={{ borderBottom: i < METRICS.length - 1 ? '1px solid #F0F0EC' : 'none', backgroundColor: i % 2 === 0 ? 'white' : '#FAFAF8' }}>
                      <td style={{ padding: '11px 14px', verticalAlign: 'middle' }}>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.77rem', fontWeight: 500, color: '#1A1A18', margin: '0 0 5px' }}>{m.name}</p>
                        <div style={{ width: '72px', height: '3px', backgroundColor: '#E2E2DC', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: vs.color, borderRadius: '2px' }} />
                        </div>
                      </td>
                      <td style={{ padding: '11px 14px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', fontWeight: 700, color: '#1A1A18', verticalAlign: 'middle' }}>{m.value}</td>
                      <td style={{ padding: '11px 14px', textAlign: 'center', fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', color: '#4A4A46', verticalAlign: 'middle', lineHeight: 1.4 }}>{m.threshold}</td>
                      <td style={{ padding: '11px 14px', textAlign: 'center', verticalAlign: 'middle' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: vs.bg, border: `1px solid ${vs.border}`, borderRadius: '4px', padding: '2px 8px' }}>
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4l2 2 4-4" stroke={vs.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: vs.color, fontWeight: 700, letterSpacing: '0.05em' }}>{vs.label}</span>
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Detection summary chips */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { label: 'Uniform regions', count: '18 zones', color: '#1B4D3E', bg: '#EBF4F0', border: '#C3DDD4' },
              { label: 'Husk / Matter', count: '3 zones', color: '#D97706', bg: '#FEF9EE', border: '#F3D89A' },
              { label: 'Moisture flags', count: '1 zone', color: '#C85A32', bg: '#FDF0EB', border: '#F0C4B4' },
            ].map(d => (
              <div key={d.label} style={{ backgroundColor: d.bg, border: `1px solid ${d.border}`, borderRadius: '6px', padding: '10px 12px' }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', fontWeight: 700, color: d.color, margin: '0 0 3px' }}>{d.count}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', color: '#4A4A46', margin: 0 }}>{d.label}</p>
              </div>
            ))}
          </div>

          {/* Override / Re-grade */}
          <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', fontWeight: 700, color: '#1A1A18', margin: '0 0 3px' }}>Disagree with this grade?</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', color: '#4A4A46', margin: 0, lineHeight: 1.5 }}>
                  Request a certified APMC lab re-grade. Your lot stays in draft until confirmed. Typical SLA: 18–24 hours.
                </p>
              </div>
              <button
                onClick={() => setOverrideOpen(!overrideOpen)}
                style={{ flexShrink: 0, padding: '8px 13px', backgroundColor: 'transparent', border: '1px solid #E2E2DC', borderRadius: '5px', fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', fontWeight: 500, color: '#4A4A46', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'border-color 0.12s, color 0.12s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1A1A18'; (e.currentTarget as HTMLElement).style.color = '#1A1A18' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E2E2DC'; (e.currentTarget as HTMLElement).style.color = '#4A4A46' }}
              >
                Override / Request Re-grade
              </button>
            </div>

            {overrideOpen && !overrideSent && (
              <div style={{ borderTop: '1px solid #E2E2DC', padding: '14px 18px', backgroundColor: '#FAFAF8' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', fontWeight: 600, color: '#1A1A18', margin: '0 0 8px' }}>Reason for dispute (optional)</p>
                <textarea
                  value={overrideReason}
                  onChange={e => setOverrideReason(e.target.value)}
                  placeholder="e.g. Moisture reading seems high — field sample taken after rain, grain was stored under shade for 48h..."
                  rows={3}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #E2E2DC', borderRadius: '5px', fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#1A1A18', backgroundColor: 'white', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button
                    onClick={() => { setOverrideSent(true); setOverrideOpen(false) }}
                    style={{ padding: '8px 16px', backgroundColor: '#D97706', border: 'none', borderRadius: '5px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', fontWeight: 600, color: 'white', cursor: 'pointer' }}
                  >
                    Submit Re-grade Request →
                  </button>
                  <button
                    onClick={() => setOverrideOpen(false)}
                    style={{ padding: '8px 14px', backgroundColor: 'transparent', border: '1px solid #E2E2DC', borderRadius: '5px', fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#4A4A46', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {overrideSent && (
              <div style={{ borderTop: '1px solid #C3DDD4', padding: '12px 18px', backgroundColor: '#EBF4F0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#1B4D3E" strokeWidth="1.1"/><path d="M4 7l2.5 2.5L10 5" stroke="#1B4D3E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#1B4D3E', margin: 0, fontWeight: 500 }}>Re-grade request sent. You'll be notified within 24 hours.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ══ STICKY BOTTOM ACTION BAR ══ */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30, backgroundColor: 'white', borderTop: '1px solid #E2E2DC', boxShadow: '0 -4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 28px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>

          {/* Market valuation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: '#EBF4F0', border: '1px solid #C3DDD4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 11l3.5-5 3 3L12 4" stroke="#1B4D3E" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.5 4H13v2.5" stroke="#1B4D3E" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: '#8A8A84', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px' }}>Market Valuation · Grade A · 100 qtl</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#1B4D3E', margin: 0 }}>
                ₹2,350 – ₹2,400 <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', fontWeight: 400, color: '#4A4A46' }}>per quintal</span>
              </p>
            </div>
            <div style={{ width: '1px', height: '32px', backgroundColor: '#E2E2DC' }} />
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: '#8A8A84', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px' }}>Total Lot Value</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#1A1A18', margin: 0 }}>₹2,35,000 – ₹2,40,000</p>
            </div>
            <div style={{ width: '1px', height: '32px', backgroundColor: '#E2E2DC' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L2 3.5v3.5c0 2.5 1.8 4.2 4 4.8 2.2-.6 4-2.3 4-4.8V3.5L6 1z" stroke="#1B4D3E" strokeWidth="1" fill="none"/><path d="M3.5 6l2 2 3.5-3" stroke="#1B4D3E" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', color: '#1B4D3E', fontWeight: 500 }}>Buyer deposits before your truck moves</span>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              style={{ padding: '10px 16px', backgroundColor: 'transparent', border: '1px solid #E2E2DC', borderRadius: '5px', fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: '#4A4A46', cursor: 'pointer', fontWeight: 500 }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#1A1A18')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#E2E2DC')}
            >
              ← Back
            </button>
            <button
              style={{ padding: '11px 22px', backgroundColor: '#1B4D3E', border: 'none', borderRadius: '6px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', fontWeight: 700, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.01em', transition: 'background-color 0.12s' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#163D31')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1B4D3E')}
            >
              Post Lot to Live Bidding
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
