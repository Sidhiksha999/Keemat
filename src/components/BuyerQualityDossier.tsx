import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface BuyerQualityDossierProps {
  onNavigate?: (view: string) => void;
}

export const BuyerQualityDossier: React.FC<BuyerQualityDossierProps> = ({ onNavigate }) => {
  const [layers, setLayers] = useState({
    breakage: true,
    foreignMatter: true,
    discoloration: true,
    colorUniformity: true
  });

  const [activeSample, setActiveSample] = useState(1);
  const [lotData, setLotData] = useState<any>(null);
  const [sampleMsg, setSampleMsg] = useState('');
  const [assayerModal, setAssayerModal] = useState(false);
  const [assayerReport, setAssayerReport] = useState<any>(null);

  useEffect(() => {
    fetchDossier();
  }, []);

  const fetchDossier = async () => {
    try {
      const res = await api.getListing('KM-8802');
      if (res.success) {
        setLotData(res.listing);
      }
    } catch (err) {
      console.error('Error fetching dossier:', err);
    }
  };

  const handleRequestSample = async () => {
    try {
      const res = await api.requestPhysicalSample('KM-8802');
      if (res.success) {
        setSampleMsg('✅ Physical sample request submitted! APMC assayer will dispatch sample box within 24h.');
        setTimeout(() => setSampleMsg(''), 5000);
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting sample request');
    }
  };

  const handleViewAssayerReport = async () => {
    try {
      const res = await api.getAssayerReport('KM-8802');
      if (res.success) {
        setAssayerReport(res.assayerReport);
        setAssayerModal(true);
      }
    } catch (err: any) {
      alert(err.message || 'Error fetching assayer report');
    }
  };

  return (
    <div className="bg-brandBg text-brandDark font-sans antialiased min-h-screen pb-12">
      {/* 1. Top Navigation Bar */}
      <header className="w-full bg-white border-b border-brandBorder px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-black tracking-tight text-brandDark">KEEMAT</span>
          <span className="bg-brandNavy text-white text-xs font-semibold px-2.5 py-0.5 rounded">Buyer Dashboard</span>
        </div>

        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <button onClick={() => onNavigate?.('buyer-discovery')} className="text-gray-600 hover:text-brandDark">Live Auctions</button>
          <button onClick={() => onNavigate?.('buyer-dossier')} className="text-brandNavy border-b-2 border-brandNavy pb-1 font-semibold">Quality Dossier</button>
          <button onClick={() => onNavigate?.('buyer-bidding')} className="text-gray-600 hover:text-brandDark">Bidding Terminal</button>
          <button onClick={() => onNavigate?.('buyer-logistics')} className="text-gray-600 hover:text-brandDark">Logistics & Escrow</button>
        </nav>

        <div className="flex items-center space-x-4 text-xs font-medium">
          <span className="text-gray-600 border border-brandBorder bg-brandBg px-2 py-1 rounded">English | हिंदी</span>
          <div className="flex items-center space-x-2 border border-brandBorder px-3 py-1 rounded bg-white">
            <span className="w-2 h-2 rounded-full bg-green-600"></span>
            <span className="font-bold text-brandDark">Arjun Patel</span>
            <span className="text-gray-500">(Verified Trader)</span>
          </div>
        </div>
      </header>

      {/* 2. Lot Summary Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-white border border-brandBorder rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-brandDark">Lot #{lotData?.lotId || 'KM-8802'}</h1>
              <span className="bg-green-100 text-green-800 border border-green-300 text-xs font-bold px-2.5 py-0.5 rounded">
                {lotData?.grade || 'GRADE A (PRIME QUALITY)'}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              10 Tonnes Sharbati Wheat • Origin: Sehore, Madhya Pradesh • Harvest Date: 15 Aug 2026
            </p>
          </div>

          <div className="flex items-center space-x-6 text-xs">
            <div className="border-l border-brandBorder pl-4">
              <span className="text-gray-500 block">AI Confidence Score</span>
              <span className="font-bold text-brandDark text-sm">{lotData?.aiConfidence || 94}% <span className="text-[10px] text-gray-500 font-normal">(12 sample photos)</span></span>
            </div>
            <div className="border-l border-brandBorder pl-4">
              <span className="text-gray-500 block">Current Top Bid</span>
              <span className="font-bold text-brandDark text-sm">₹2,38,000 <span className="text-[10px] text-gray-500 font-normal">(₹2,380/qtl)</span></span>
            </div>
            <div className="bg-amber-50 border border-amber-300 px-3 py-1.5 rounded text-amber-900 font-bold">
              ⏱ 04:12 remaining
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Grid (50/50 Split Canvas) */}
      <main className="max-w-7xl mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT PANEL: Image Feed & Bounding Boxes */}
        <section className="bg-white border border-brandBorder rounded-md p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-brandDark border-b border-brandBorder pb-3 mb-4">
              Raw Image Feed & Defect Detection Visuals
            </h2>

            {/* Interactive Layer Toggles */}
            <div className="flex flex-wrap gap-2 text-[11px] mb-4">
              <label className="flex items-center space-x-1.5 bg-green-50 border border-green-300 text-green-900 px-2 py-1 rounded cursor-pointer">
                <input type="checkbox" checked={layers.colorUniformity} onChange={(e) => setLayers({ ...layers, colorUniformity: e.target.checked })} className="accent-green-700" />
                <span>Grain Breakage</span>
              </label>
              <label className="flex items-center space-x-1.5 bg-amber-50 border border-amber-300 text-amber-900 px-2 py-1 rounded cursor-pointer">
                <input type="checkbox" checked={layers.foreignMatter} onChange={(e) => setLayers({ ...layers, foreignMatter: e.target.checked })} className="accent-amber-700" />
                <span>Foreign Matter (1.2%)</span>
              </label>
              <label className="flex items-center space-x-1.5 bg-red-50 border border-red-300 text-red-900 px-2 py-1 rounded cursor-pointer">
                <input type="checkbox" checked={layers.discoloration} onChange={(e) => setLayers({ ...layers, discoloration: e.target.checked })} className="accent-red-700" />
                <span>Discoloration (2.5%)</span>
              </label>
              <label className="flex items-center space-x-1.5 bg-blue-50 border border-blue-300 text-blue-900 px-2 py-1 rounded cursor-pointer">
                <input type="checkbox" checked={layers.breakage} onChange={(e) => setLayers({ ...layers, breakage: e.target.checked })} className="accent-blue-700" />
                <span>Color Uniformity</span>
              </label>
            </div>

            {/* High-Res Image Container with Overlay Bounding Boxes */}
            <div className="relative w-full h-64 bg-gray-100 border border-brandBorder rounded-md overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px] bg-amber-50/40"></div>
              
              <div className="relative z-10 text-center text-xs text-gray-500 font-medium">
                [ High-Resolution Field Photo Sample #{activeSample} ]
              </div>

              {/* Bounding Box Overlays */}
              {layers.colorUniformity && (
                <div className="absolute top-8 left-12 border-2 border-green-600 bg-green-500/10 text-[9px] font-bold text-green-900 px-1 py-0.5 rounded">
                  Uniform Size (94%)
                </div>
              )}
              {layers.foreignMatter && (
                <div className="absolute bottom-10 left-28 border-2 border-amber-600 bg-amber-500/10 text-[9px] font-bold text-amber-900 px-1 py-0.5 rounded">
                  Foreign Matter / Husk
                </div>
              )}
              {layers.discoloration && (
                <div className="absolute top-16 right-16 border-2 border-red-600 bg-red-500/10 text-[9px] font-bold text-red-900 px-1 py-0.5 rounded">
                  Discoloration Spot
                </div>
              )}
            </div>

            {/* Sample Photo Thumbnails */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[1, 2, 3, 4].map((sNum) => (
                <button
                  key={sNum}
                  onClick={() => setActiveSample(sNum)}
                  className={`border rounded h-14 flex items-center justify-center text-[10px] font-bold transition ${activeSample === sNum ? 'border-2 border-brandNavy bg-amber-100/50 text-brandNavy' : 'border-brandBorder bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  Sample #{sNum} {activeSample === sNum ? '(Active)' : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-brandBorder text-[11px] text-gray-500 flex justify-between">
            <span>Captured via Field Scanner App</span>
            <span>GPS Tagged: 23.1004° N, 77.0850° E</span>
          </div>
        </section>

        {/* RIGHT PANEL: Lab Metrics & Verification Audit Log */}
        <section className="bg-white border border-brandBorder rounded-md p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-brandDark border-b border-brandBorder pb-3 mb-4">
              Lab Inspection Metrics & Quality Audit
            </h2>

            {/* Full Lab Metric Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brandBg border-y border-brandBorder text-gray-600 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Quality Parameter</th>
                    <th className="py-2.5 px-3">Detected Value</th>
                    <th className="py-2.5 px-3">Standard Threshold</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brandBorder">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-brandDark">Moisture Content</td>
                    <td className="py-2.5 px-3 font-bold text-brandNavy">11.8%</td>
                    <td className="py-2.5 px-3 text-gray-500">Optimal (&lt; 12.0%)</td>
                    <td className="py-2.5 px-3 text-right text-green-700 font-bold">Pass ✓</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-brandDark">Foreign Matter / Husk</td>
                    <td className="py-2.5 px-3 font-bold text-brandNavy">1.2%</td>
                    <td className="py-2.5 px-3 text-gray-500">Max Allowed (&lt; 2.0%)</td>
                    <td className="py-2.5 px-3 text-right text-green-700 font-bold">Pass ✓</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-brandDark">Admixture / Other Grains</td>
                    <td className="py-2.5 px-3 font-bold text-brandNavy">0.8%</td>
                    <td className="py-2.5 px-3 text-gray-500">Max Allowed (&lt; 1.5%)</td>
                    <td className="py-2.5 px-3 text-right text-green-700 font-bold">Pass ✓</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-brandDark">Damage / Discoloration</td>
                    <td className="py-2.5 px-3 font-bold text-brandNavy">2.5%</td>
                    <td className="py-2.5 px-3 text-gray-500">Max Allowed (&lt; 3.5%)</td>
                    <td className="py-2.5 px-3 text-right text-green-700 font-bold">Pass ✓</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-brandDark">Grain Size Uniformity</td>
                    <td className="py-2.5 px-3 font-bold text-brandNavy">89.4%</td>
                    <td className="py-2.5 px-3 text-gray-500">Min Threshold (&gt; 85.0%)</td>
                    <td className="py-2.5 px-3 text-right text-green-700 font-bold">Pass ✓</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {sampleMsg && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-900 rounded text-xs font-semibold">
                {sampleMsg}
              </div>
            )}

            {/* Physical Inspection Options */}
            <div className="bg-brandBg border border-brandBorder rounded p-4">
              <h3 className="text-xs font-bold text-brandDark">Physical Inspection & Sampling Options</h3>
              <p className="text-[11px] text-gray-600 mt-1">For high-volume bids, request on-ground physical sampling or view certified mandi assayer reports.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                <button onClick={handleRequestSample} className="border border-brandNavy text-brandNavy hover:bg-blue-50 font-semibold py-2 px-3 rounded text-xs transition">
                  Request Physical Sampling
                </button>
                <button onClick={handleViewAssayerReport} className="border border-brandNavy text-brandNavy hover:bg-blue-50 font-semibold py-2 px-3 rounded text-xs transition">
                  View Assayer Audit Report
                </button>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-6 pt-4 border-t border-brandBorder flex items-center justify-between">
            <div>
              <span className="text-[11px] text-gray-500 block">Estimated Landed Cost</span>
              <span className="text-base font-bold text-brandNavy">₹2,46,100 <span className="text-xs font-normal text-gray-600">(₹2,461/qtl)</span></span>
            </div>
            <button onClick={() => onNavigate?.('buyer-bidding')} className="bg-brandNavy hover:bg-brandNavyHover text-white font-bold py-2.5 px-5 rounded text-xs transition">
              Proceed to Place Escrow-Backed Bid →
            </button>
          </div>
        </section>

      </main>

      {/* Assayer Report Modal */}
      {assayerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-brandBorder rounded-lg p-6 max-w-md w-full">
            <h3 className="text-base font-bold text-brandDark border-b pb-2">APMC Certified Assayer Audit Report</h3>
            <div className="mt-4 space-y-2 text-xs">
              <p><strong>Assayer Lab:</strong> {assayerReport?.assayerName || 'APMC Certified Central Lab #APMC-770'}</p>
              <p><strong>Certificate ID:</strong> {assayerReport?.certificationId || 'CERT-WM-9941'}</p>
              <p><strong>Issued Date:</strong> {assayerReport?.issuedDate || '16 Aug 2026'}</p>
              <p><strong>Final Classification:</strong> <span className="text-green-700 font-bold">{assayerReport?.result || 'PASSED - GRADE A SHARBATI WHEAT'}</span></p>
            </div>
            <button onClick={() => setAssayerModal(false)} className="mt-6 w-full bg-brandNavy text-white font-bold py-2 rounded text-xs">
              Close Report
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
