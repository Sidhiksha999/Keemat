import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { subscribeToLot, unsubscribeFromLot } from '../services/socket';

interface BuyerLogisticsVerificationProps {
  onNavigate?: (view: string) => void;
}

export const BuyerLogisticsVerification: React.FC<BuyerLogisticsVerificationProps> = ({ onNavigate }) => {
  const [logistics, setLogistics] = useState<any>(null);
  const [escrow, setEscrow] = useState<any>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [disputeModal, setDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogisticsData();

    subscribeToLot('KM-8802', (eventData: any) => {
      if (eventData.escrow) setEscrow(eventData.escrow);
    });

    return () => {
      unsubscribeFromLot('KM-8802');
    };
  }, []);

  const fetchLogisticsData = async () => {
    try {
      setLoading(true);
      const resLog = await api.getLogistics('KM-8802');
      if (resLog.success) setLogistics(resLog.logistics);

      const resEsc = await api.getEscrow('KM-8802');
      if (resEsc.success) setEscrow(resEsc.escrow);
    } catch (err) {
      console.error('Error fetching logistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelivery = async () => {
    try {
      const res = await api.confirmDelivery('KM-8802');
      if (res.success) {
        setStatusMsg('🎉 Quality confirmed! Escrow funds ₹2,46,100 released to seller account.');
        fetchLogisticsData();
      }
    } catch (err: any) {
      alert(err.message || 'Error confirming delivery');
    }
  };

  const handleFileDispute = async () => {
    if (!disputeReason.trim()) {
      alert('Please provide a reason for the quality dispute.');
      return;
    }
    try {
      const res = await api.fileDispute('KM-8802', disputeReason, 'quality_mismatch');
      if (res.success) {
        setStatusMsg('⚠️ Quality deviation dispute filed! Escrow funds frozen immediately.');
        setDisputeModal(false);
        fetchLogisticsData();
      }
    } catch (err: any) {
      alert(err.message || 'Error filing dispute');
    }
  };

  const isReleased = escrow?.status === 'FUNDS_RELEASED';
  const isDisputed = escrow?.status === 'DISPUTED';

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
          <button onClick={() => onNavigate?.('buyer-dossier')} className="text-gray-600 hover:text-brandDark">Quality Dossier</button>
          <button onClick={() => onNavigate?.('buyer-bidding')} className="text-gray-600 hover:text-brandDark">Bidding Terminal</button>
          <button onClick={() => onNavigate?.('buyer-logistics')} className="text-brandNavy border-b-2 border-brandNavy pb-1 font-semibold">Logistics & Escrow</button>
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

      {/* 2. Order Summary Header Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-white border border-brandBorder rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-brandDark">Order #{logistics?.orderId || 'ORD-8802'}</h1>
              {isDisputed ? (
                <span className="bg-red-100 text-red-900 border border-red-300 text-xs font-bold px-2.5 py-0.5 rounded flex items-center">
                  ⚠️ ESCROW FROZEN • QUALITY DISPUTE FILED
                </span>
              ) : isReleased ? (
                <span className="bg-green-100 text-green-900 border border-green-300 text-xs font-bold px-2.5 py-0.5 rounded flex items-center">
                  ✓ DELIVERED • ESCROW SETTLED
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-2.5 py-0.5 rounded flex items-center">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse mr-1.5"></span> IN TRANSIT • ARRIVING IN {logistics?.etaMins || 45} MINS
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1">10 Tonnes Wheat (Sharbati) • Escrow Balance Held: <strong className="text-brandDark">₹2,46,100</strong></p>
          </div>

          <div className="flex items-center space-x-6 text-xs">
            <div className="border-l border-brandBorder pl-4">
              <span className="text-gray-500 block">Transport Vehicle</span>
              <span className="font-bold text-brandDark">{logistics?.vehicleNumber || 'MP-04-HE-9821'} <span className="text-gray-500 font-normal">({logistics?.vehicleType || '10-Ton Eicher'})</span></span>
            </div>
            <div className="border-l border-brandBorder pl-4">
              <span className="text-gray-500 block">Driver Contact</span>
              <span className="font-bold text-brandDark">{logistics?.driverName || 'Ramesh Singh'} <span className="text-brandNavy font-normal">({logistics?.driverPhone || '+91 98260-XXXXX'})</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Grid (50/50 Split Canvas) */}
      <main className="max-w-7xl mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT PANEL: Live GPS Tracker & Dispatch Timeline */}
        <section className="bg-white border border-brandBorder rounded-md p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-brandDark border-b border-brandBorder pb-3 mb-4">
              Live Vehicle GPS Tracker & Dispatch Timeline
            </h2>

            {/* Interactive Map Container */}
            <div className="relative w-full h-56 bg-amber-50/30 border border-brandBorder rounded-md overflow-hidden mb-5 flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px]"></div>

              {/* Mock Route Graphics */}
              <div className="relative z-10 w-3/4 flex items-center justify-between">
                <div className="text-center">
                  <span className="w-4 h-4 bg-gray-800 rounded-full inline-block border-2 border-white"></span>
                  <span className="block text-[10px] font-bold text-gray-700 mt-1">{logistics?.origin || 'Sehore Farm'}</span>
                </div>
                <div className="flex-1 h-0.5 bg-brandNavy relative mx-2">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brandNavy text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                    🚚 {logistics?.distanceRemainingKm || 38} km remaining ({logistics?.speedKmH || 42} km/h)
                  </div>
                </div>
                <div className="text-center">
                  <span className="w-4 h-4 bg-brandNavy rounded-full inline-block border-2 border-white"></span>
                  <span className="block text-[10px] font-bold text-brandNavy mt-1">{logistics?.destination || 'Indore Warehouse'}</span>
                </div>
              </div>
            </div>

            {/* Milestone Logistics Checklist */}
            <div className="space-y-3 text-xs">
              {(logistics?.milestones || [
                { step: 1, title: 'Step 1: Farm Gate Dispatch & Weighbridge Verification', subtitle: 'Completed at Sehore Mandi • Dispatched 08:30 AM', status: 'completed' },
                { step: 2, title: 'Step 2: Transit In-Progress via NH-46', subtitle: 'Active • ETA: 01:30 PM (On Time)', status: 'active' },
                { step: 3, title: 'Step 3: Gate Entry & Arrival Quality Verification', subtitle: 'Pending Arrival at Indore Facility', status: 'pending' },
                { step: 4, title: 'Step 4: Final Escrow Settlement & Gate Pass Generation', subtitle: 'Awaiting Quality Confirmation', status: 'pending' }
              ]).map((m: any) => {
                const isDone = m.status === 'completed' || isReleased;
                const isActive = m.status === 'active' && !isReleased;
                return (
                  <div key={m.step} className={`flex items-start space-x-3 ${m.status === 'pending' && !isReleased ? 'opacity-50' : ''}`}>
                    <span className={`w-5 h-5 rounded-full border font-bold flex items-center justify-center text-[10px] shrink-0 ${isDone ? 'bg-green-100 text-green-800 border-green-300' : isActive ? 'bg-amber-100 text-amber-900 border-amber-400' : 'bg-gray-100 text-gray-600 border-gray-300'}`}>
                      {isDone ? '✓' : m.step}
                    </span>
                    <div>
                      <p className="font-bold text-brandDark">{m.title}</p>
                      <p className={`text-[11px] ${isActive ? 'text-amber-800 font-semibold' : 'text-gray-500'}`}>{m.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-brandBorder text-[11px] text-gray-500 flex justify-between">
            <span>Telemetry Updated 1 min ago</span>
            <span>GPS Hardware ID: {logistics?.gpsId || '#GPS-9921'}</span>
          </div>
        </section>

        {/* RIGHT PANEL: Quality Verification & Escrow Release Workflow */}
        <section className="bg-white border border-brandBorder rounded-md p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-brandDark border-b border-brandBorder pb-3 mb-4">
              Arrival Inspection & Escrow Settlement
            </h2>

            {statusMsg && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded text-xs font-bold">
                {statusMsg}
              </div>
            )}

            {/* Step-by-Step Arrival Instructions */}
            <div className="bg-brandBg border border-brandBorder rounded p-4 mb-5 text-xs space-y-2">
              <p className="font-bold text-brandDark">Arrival Protocol for Warehouse Supervisor:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Verify gross vehicle weight on arrival weighbridge slip (Target: 10.00 Tonnes).</li>
                <li>Take physical grain sample and verify against original Dossier (Grade A • 11.5% Moisture).</li>
              </ul>
            </div>

            {/* Dual Confirmation Actions */}
            <div className="space-y-4">

              {/* Option A: Release Escrow */}
              <div className="border border-green-300 bg-green-50/50 rounded p-4">
                <button
                  disabled={isReleased || isDisputed}
                  onClick={handleConfirmDelivery}
                  className={`w-full text-white font-bold py-3 rounded text-xs transition ${isReleased ? 'bg-green-700 cursor-not-allowed' : 'bg-brandNavy hover:bg-brandNavyHover'}`}
                >
                  {isReleased ? '✓ Escrow Funds Released' : 'Confirm Quality & Release Escrow Payment'}
                </button>
                <p className="text-[11px] text-gray-600 mt-2 text-center">
                  ⚡ Instantly transfers <strong>₹2,46,100</strong> from escrow to seller account and issues final gate pass.
                </p>
              </div>

              {/* Option B: File Quality Dispute */}
              <div className="border border-red-200 bg-red-50/30 rounded p-4">
                <button
                  disabled={isReleased || isDisputed}
                  onClick={() => setDisputeModal(true)}
                  className={`w-full border font-bold py-2.5 rounded text-xs transition ${isDisputed ? 'border-red-500 text-red-700 bg-red-100 cursor-not-allowed' : 'border-red-700 text-red-800 hover:bg-red-50'}`}
                >
                  {isDisputed ? '⚠️ Dispute Active - Escrow Frozen' : 'Dispute Grade / File Quality Deviation'}
                </button>
                <p className="text-[11px] text-gray-600 mt-2 text-center">
                  ⚠️ Freezes escrow funds immediately. Routes case to an independent on-ground mandi assayer within 24 hours.
                </p>
              </div>

            </div>
          </div>

          {/* Footer Security Note */}
          <div className="mt-6 pt-3 border-t border-brandBorder text-[11px] text-gray-500 text-center">
            🔒 Payment is protected under Keemat Escrow Policy 2026.
          </div>
        </section>

      </main>

      {/* Dispute Modal */}
      {disputeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-brandBorder rounded-lg p-6 max-w-md w-full">
            <h3 className="text-base font-bold text-red-800 border-b pb-2">File Quality Deviation Dispute</h3>
            <p className="text-xs text-gray-600 mt-2">Filing a dispute will freeze escrow funds (₹2,46,100) immediately and alert APMC assayer.</p>
            <textarea
              rows={3}
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Explain quality deviation (e.g. Moisture detected 14% vs 11.5% in dossier)..."
              className="w-full bg-brandBg border border-brandBorder rounded p-2 text-xs mt-3 focus:outline-none"
            />
            <div className="flex space-x-2 mt-4">
              <button onClick={handleFileDispute} className="flex-1 bg-red-700 text-white font-bold py-2 rounded text-xs hover:bg-red-800 transition">
                Confirm & Freeze Escrow
              </button>
              <button onClick={() => setDisputeModal(false)} className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2 rounded text-xs">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
