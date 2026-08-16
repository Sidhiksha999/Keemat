import { useState } from 'react'
import { api } from '../services/api'

const GRAIN_IMG = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=900&h=675&fit=crop&auto=format'

const STEPS = [
  { n: 1, label: 'Upload Photo', done: true },
  { n: 2, label: 'AI Analysis', done: false, active: true },
  { n: 3, label: 'Review & Override', done: false },
  { n: 4, label: 'Publish to Auction', done: false },
]

type Verdict = 'pass' | 'warn' | 'fail'

const DEFAULT_METRICS: { name: string; value: string; reading: number; max: number; threshold: string; verdict: Verdict; unit: string }[] = [
  { name: 'Moisture Content', value: '12.0%', reading: 12.0, max: 15, threshold: '< 12.5% Optimal', verdict: 'pass', unit: '%' },
  { name: 'Foreign Matter / Husk', value: '1.8%', reading: 1.8, max: 5, threshold: '< 2.0% Low', verdict: 'pass', unit: '%' },
  { name: 'Defect / Discoloration', value: '3.2%', reading: 3.2, max: 10, threshold: '< 3.5% Acceptable', verdict: 'pass', unit: '%' },
  { name: 'Uniformity Index', value: '87%', reading: 87, max: 100, threshold: '> 80% High', verdict: 'pass', unit: '%' },
  { name: 'Test Weight (Hectolitre)', value: '78.4 kg', reading: 78.4, max: 85, threshold: '> 76 kg Standard', verdict: 'pass', unit: 'kg' },
]

const DEFAULT_BOXES = [
  { x: 6, y: 8, w: 28, h: 22, color: '#1B4D3E', type: 'uniform', label: 'Uniform Grain Size · 94% match' },
  { x: 52, y: 10, w: 30, h: 26, color: '#1B4D3E', type: 'uniform', label: 'Uniform Grain Size · 91% match' },
  { x: 62, y: 55, w: 20, h: 18, color: '#1B4D3E', type: 'uniform', label: 'Uniform Grain Size · 89% match' },
  { x: 16, y: 60, w: 18, h: 14, color: '#D97706', type: 'husk', label: 'Minor Husk / Foreign Matter' },
  { x: 70, y: 35, w: 14, h: 12, color: '#D97706', type: 'husk', label: 'Minor Husk / Foreign Matter' },
  { x: 36, y: 42, w: 14, h: 12, color: '#C85A32', type: 'moisture', label: 'Moisture Spot / Discoloration' },
]

const SAMPLE_THUMBS = [
  'https://images.unsplash.com/photo-1584353781226-579f0ab7c770?w=80&h=80&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=80&h=80&fit=crop&auto=format',
]

interface Props {
  onNavigate: (view: string, params?: any) => void;
}

export default function FarmerCropGrading({ onNavigate }: Props) {
  const [sampleImage, setSampleImage] = useState(GRAIN_IMG)
  const [overlay, setOverlay] = useState(true)
  const [activeBox, setActiveBox] = useState<number | null>(null)
  const [activeThumb, setActiveThumb] = useState(1)
  const [overrideOpen, setOverrideOpen] = useState(false)
  const [overrideReason, setOverrideReason] = useState('')
  const [overrideSent, setOverrideSent] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'uniform' | 'husk' | 'moisture'>('all')

  const [scanning, setScanning] = useState(false)
  const [grade, setGrade] = useState('GRADE A')
  const [confidence, setConfidence] = useState(89)
  const [metrics, setMetrics] = useState(DEFAULT_METRICS)
  const [boxes, setBoxes] = useState(DEFAULT_BOXES)

  const visibleBoxes = boxes.filter(b => activeFilter === 'all' || b.type === activeFilter)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    const previewUrl = URL.createObjectURL(file)
    setSampleImage(previewUrl)
    setScanning(true)

    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await api.scanCropQuality(formData)
      if (res.analysis) {
        setGrade(res.analysis.grade || 'GRADE A')
        setConfidence(res.analysis.aiConfidence || 91)
        if (res.analysis.defectBoxes) setBoxes(res.analysis.defectBoxes)
      }
    } catch (err: any) {
      console.warn('AI Vision Scan Fallback:', err.message)
    } finally {
      setScanning(false)
    }
  }

  const handleDisputeSubmit = async () => {
    try {
      await api.requestReGrade('KM-8802', overrideReason)
      setOverrideSent(true)
      setOverrideOpen(false)
    } catch (err: any) {
      alert('Error submitting dispute: ' + err.message)
    }
  }

  const handlePublish = async () => {
    try {
      const res = await api.createListing({
        commodity: 'Wheat - Sharbati',
        quantityQuintals: 100,
        grade,
        reservePrice: 2300
      })
      const lotId = res?.listing?.lotId || res?.lotId || 'KM-8802'
      onNavigate('farmer-auction', { lotId })
    } catch (err: any) {
      alert('Error publishing lot: ' + err.message)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF9F5', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* ══ HEADER ══ */}
      <header style={{ backgroundColor: '#FAF9F5', borderBottom: '1px solid #E2E2DC', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 28px', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.03em', color: '#1A1A18' }}>KEEMAT</span>
            <div style={{ width: '1px', height: '16px', backgroundColor: '#E2E2DC' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#8A8A84' }}>Quality Assessment</span>
          </div>

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
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', fontWeight: 700, color: step.active ? '#1B4D3E' : '#8A8A84' }}>{step.n}</span>
                  </div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', fontWeight: step.active ? 600 : 400, color: step.active ? '#1B4D3E' : '#8A8A84' }}>
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: '32px', height: '1px', margin: '0 10px', backgroundColor: '#E2E2DC' }} />
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #E2E2DC', borderRadius: '5px', padding: '5px 10px', backgroundColor: 'white' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#8A8A84' }}>Lot</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 600, color: '#1A1A18' }}>Wheat–Sharbati · 100 qtl</span>
          </div>
        </div>
      </header>

      {/* ══ MAIN WORKSPACE ══ */}
      <main style={{ flex: 1, maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '20px 28px 88px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

        {/* LEFT Image workspace */}
        <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', overflow: 'hidden' }}>

          <div style={{ padding: '13px 18px', borderBottom: '1px solid #E2E2DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', fontWeight: 700, color: '#1A1A18', margin: 0 }}>Sample Photo & Defect Map</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.67rem', color: '#8A8A84', margin: '2px 0 0' }}>{scanning ? 'Analyzing photo with AI Vision...' : 'Click any box for detection detail · AI model verified'}</p>
            </div>
            <button
              onClick={() => setOverlay(!overlay)}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid #E2E2DC', borderRadius: '5px', padding: '4px 10px', backgroundColor: overlay ? '#EBF4F0' : 'white', color: overlay ? '#1B4D3E' : '#4A4A46', fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', fontWeight: 500, cursor: 'pointer' }}
            >
              {overlay ? 'Overlay ON' : 'Overlay OFF'}
            </button>
          </div>

          <div style={{ position: 'relative', aspectRatio: '4/3', backgroundColor: '#1A1A18', margin: '16px 16px 0' }}>
            <img
              src={sampleImage}
              alt="Wheat grain sample"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: scanning ? 0.4 : 0.92 }}
            />

            {overlay && !scanning && (
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 75" preserveAspectRatio="none">
                {visibleBoxes.map((box, i) => {
                  const isActive = activeBox === i
                  return (
                    <g key={i} style={{ cursor: 'pointer' }} onClick={() => setActiveBox(isActive ? null : i)}>
                      <rect x={box.x} y={box.y} width={box.w} height={box.h}
                        fill={`${box.color}20`}
                        stroke={box.color} strokeWidth={isActive ? 0.8 : 0.5}
                        rx="0.5"
                      />
                    </g>
                  )
                })}
              </svg>
            )}

            {activeBox !== null && overlay && (
              <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(26,26,24,0.88)', borderRadius: '4px', padding: '5px 12px' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', color: 'white', margin: 0 }}>{boxes[activeBox]?.label}</p>
              </div>
            )}
          </div>

          <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <label style={{ padding: '10px 14px', backgroundColor: '#1B4D3E', borderRadius: '6px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 600, color: 'white', cursor: 'pointer', textAlign: 'center' }}>
              📷 Upload & Scan Crop Photo
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            <button onClick={() => setScanning(true)} style={{ padding: '10px 14px', backgroundColor: 'transparent', border: '1px solid #1B4D3E', borderRadius: '6px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 600, color: '#1B4D3E', cursor: 'pointer' }}>
              {scanning ? 'Scanning...' : '⚡ Re-Run AI Model'}
            </button>
          </div>
        </div>

        {/* RIGHT Results & Parameters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Grade Card */}
          <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#8A8A84' }}>Assigned Quality Grade</span>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#1B4D3E', margin: '4px 0 0' }}>{grade}</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#4A4A46', margin: '4px 0 0' }}>AI Confidence Score: <strong>{confidence}%</strong></p>
            </div>
            <div style={{ backgroundColor: '#EBF4F0', border: '1px solid #C2E2D6', borderRadius: '6px', padding: '8px 14px', textAlign: 'right' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#1B4D3E', fontWeight: 700 }}>VALUATION</span>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#1B4D3E', margin: '2px 0 0' }}>₹2,350–2,400/qtl</p>
            </div>
          </div>

          {/* Metrics Table */}
          <div style={{ border: '1px solid #E2E2DC', borderRadius: '8px', backgroundColor: 'white', padding: '18px' }}>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#1A1A18', margin: '0 0 14px' }}>Detected Quality Parameters</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {metrics.map((m) => (
                <div key={m.name} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid #FAF9F5' }}>
                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 600, color: '#1A1A18', margin: 0 }}>{m.name}</p>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', color: '#8A8A84' }}>{m.threshold}</span>
                  </div>
                  <div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', fontWeight: 700, color: '#1A1A18' }}>{m.value}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-block', padding: '2px 8px', borderRadius: '4px',
                      fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', fontWeight: 700,
                      backgroundColor: m.verdict === 'pass' ? '#EBF4F0' : '#FEF3C7',
                      color: m.verdict === 'pass' ? '#1B4D3E' : '#B45309',
                    }}>
                      {m.verdict === 'pass' ? 'PASS ✓' : 'WARNING ⚠️'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setOverrideOpen(true)}
              style={{ flex: 1, padding: '12px', backgroundColor: 'white', border: '1px solid #D97706', borderRadius: '6px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 600, color: '#D97706', cursor: 'pointer' }}
            >
              ⚠️ Request APMC Re-Grade
            </button>
            <button
              onClick={handlePublish}
              style={{ flex: 1.5, padding: '12px', backgroundColor: '#1B4D3E', border: 'none', borderRadius: '6px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 700, color: 'white', cursor: 'pointer' }}
            >
              Accept Grade & Open Auction →
            </button>
          </div>

          {overrideSent && (
            <div style={{ padding: '10px 14px', backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '6px', color: '#92400E', fontFamily: "'Inter', sans-serif", fontSize: '0.72rem' }}>
              ✓ Re-grade request submitted to APMC Sehore Lab Assayer #772.
            </div>
          )}

        </div>

      </main>

      {/* Override Modal */}
      {overrideOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: 'white', border: '1px solid #E2E2DC', borderRadius: '8px', padding: '24px', maxWidth: '440px', width: '100%' }}>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', fontWeight: 700, color: '#1A1A18', margin: 0 }}>Request APMC Lab Re-Grade</h3>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#4A4A46', margin: '6px 0 16px' }}>If you believe the AI classification is incorrect, submit for official lab re-inspection at your local mandi.</p>
            <textarea
              rows={3}
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="State reason (e.g., Grain sample collected from dry upper section)..."
              style={{ width: '100%', padding: '10px', border: '1px solid #E2E2DC', borderRadius: '6px', fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', marginBottom: '16px', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleDisputeSubmit} style={{ flex: 1, padding: '10px', backgroundColor: '#D97706', color: 'white', border: 'none', borderRadius: '6px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                Submit Request
              </button>
              <button onClick={() => setOverrideOpen(false)} style={{ padding: '10px 16px', backgroundColor: 'white', border: '1px solid #E2E2DC', borderRadius: '6px', fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
