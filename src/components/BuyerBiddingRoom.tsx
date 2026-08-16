import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { subscribeToLot, unsubscribeFromLot } from '../services/socket';

interface BuyerBiddingRoomProps {
  onNavigate?: (view: string) => void;
}

export const BuyerBiddingRoom: React.FC<BuyerBiddingRoomProps> = ({ onNavigate }) => {
  const [bids, setBids] = useState<any[]>([]);
  const [lotData, setLotData] = useState<any>(null);
  const [bidInput, setBidInput] = useState(2380);
  const [autoBidCeiling, setAutoBidCeiling] = useState(2450);
  const [stepIncrement, setStepIncrement] = useState(10);
  const [autoBidMsg, setAutoBidMsg] = useState('');
  const [placeBidMsg, setPlaceBidMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();

    subscribeToLot('KM-8802', (eventData: any) => {
      if (eventData.bids) setBids(eventData.bids);
      if (eventData.listing) setLotData(eventData.listing);
    });

    return () => {
      unsubscribeFromLot('KM-8802');
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.getListing('KM-8802');
      if (res.success) {
        setLotData(res.listing);
        setBids(res.bids || []);
        if (res.bids?.length > 0) {
          setBidInput(res.bids[0].amountPerQuintal + 10);
        }
      }
    } catch (err) {
      console.error('Error fetching bidding room:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnableAutoBid = async () => {
    try {
      const res = await api.setAutoBid('KM-8802', autoBidCeiling, stepIncrement, 'Arjun Patel');
      if (res.success) {
        setAutoBidMsg(`✅ Auto-bidding active up to ₹${autoBidCeiling}/qtl (+₹${stepIncrement} step).`);
        setTimeout(() => setAutoBidMsg(''), 5000);
      }
    } catch (err: any) {
      alert(err.message || 'Error enabling auto-bid');
    }
  };

  const handlePlaceBid = async () => {
    try {
      const res = await api.placeBid({
        lotId: 'KM-8802',
        amountPerQuintal: Number(bidInput),
        buyerName: 'Arjun Patel',
        buyerCity: 'Indore, MP',
        buyerRating: 5.0
      });
      if (res.success) {
        await api.depositEscrow('KM-8802');
        setPlaceBidMsg(`🎉 Bid ₹${bidInput}/qtl placed & 10% Escrow Deposit Locked!`);
        fetchData();
        setTimeout(() => setPlaceBidMsg(''), 5000);
      }
    } catch (err: any) {
      alert(err.message || 'Error placing bid');
    }
  };

  const quantity = lotData?.quantityQuintals || 100;
  const grossValue = bidInput * quantity;
  const freight = 12000;
  const mandiTax = 2500;
  const platformFee = 1500;
  const totalOutflow = grossValue + freight + mandiTax + platformFee;
  const landedCostPerQtl = Math.round(totalOutflow / quantity);
  const deposit10Pct = Math.round(grossValue * 0.10);

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
          <button onClick={() => onNavigate?.('buyer-bidding')} className="text-brandNavy border-b-2 border-brandNavy pb-1 font-semibold">Bidding Terminal</button>
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

      {/* 2. Auction Header Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-white border border-brandBorder rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-brandDark">Lot #KM-8802</h1>
              <span className="bg-blue-100 text-brandNavy border border-blue-300 text-xs font-bold px-2.5 py-0.5 rounded">
                Wheat (Sharbati) • 10 Tonnes (100 qtl)
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Grade A Quality • Moisture: 11.5% • Location: Sehore, MP</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right text-xs">
              <span className="text-gray-500 block">Auction Status</span>
              <span className="font-bold text-red-600 flex items-center justify-end">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse mr-1"></span> 🔴 HIGH ACTIVITY
              </span>
            </div>
            <div className="bg-amber-100 border border-amber-400 px-4 py-2 rounded text-amber-900 font-extrabold text-lg">
              ⏱ 02:45 remaining
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Grid (50/50 Split Canvas) */}
      <main className="max-w-7xl mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT PANEL: Live Bid Ladder & Auto-Bidding */}
        <section className="bg-white border border-brandBorder rounded-md p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-brandDark border-b border-brandBorder pb-3 mb-4">
              Live Auction Room & Bid History
            </h2>

            {/* Auto-Bidding Control Box */}
            <div className="bg-brandBg border border-brandBorder rounded p-4 mb-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-brandDark">Set Max Auto-Bid Ceiling</h3>
                <span className="text-[10px] text-gray-500">Automated incremental bidding</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={`₹${autoBidCeiling} / qtl`}
                  onChange={(e) => setAutoBidCeiling(Number(e.target.value.replace(/[^0-9]/g, '')))}
                  className="bg-white border border-brandBorder rounded px-3 py-1.5 text-xs font-bold text-brandDark focus:outline-none"
                />
                <select
                  value={stepIncrement}
                  onChange={(e) => setStepIncrement(Number(e.target.value))}
                  className="bg-white border border-brandBorder rounded px-2 py-1.5 text-xs text-brandDark font-medium"
                >
                  <option value={10}>+₹10 / qtl step</option>
                  <option value={20}>+₹20 / qtl step</option>
                  <option value={50}>+₹50 / qtl step</option>
                </select>
                <button onClick={handleEnableAutoBid} className="bg-brandNavy hover:bg-brandNavyHover text-white font-bold py-1.5 px-3 rounded text-xs transition">
                  Enable Auto-Bid
                </button>
              </div>
              {autoBidMsg && <p className="text-[11px] text-green-700 font-bold mt-2">{autoBidMsg}</p>}
            </div>

            {/* Live Bid Ladder */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brandBg border-y border-brandBorder text-gray-600 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Bidder ID</th>
                    <th className="py-2.5 px-3">Qty</th>
                    <th className="py-2.5 px-3 text-right">Bid / Quintal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brandBorder">
                  {bids.map((b, idx) => {
                    const isTop = idx === 0;
                    return (
                      <tr key={b.id || idx} className={isTop ? 'bg-green-50/60 font-bold' : ''}>
                        <td className="py-2.5 px-3 text-gray-500">{b.timestampStr || '12:40 AM'}</td>
                        <td className="py-2.5 px-3 text-brandDark">
                          {b.buyerName} {isTop && <span className="text-[10px] bg-green-200 text-green-800 px-1.5 py-0.2 rounded ml-1">Highest</span>}
                        </td>
                        <td className="py-2.5 px-3">100 qtl</td>
                        <td className={`py-2.5 px-3 text-right ${isTop ? 'text-green-900 font-extrabold' : 'text-brandDark'}`}>
                          ₹{b.amountPerQuintal} / qtl
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-brandBorder text-[11px] text-gray-500 text-center">
            ⚡ Bids are refreshed in real-time over secure websockets.
          </div>
        </section>

        {/* RIGHT PANEL: Landed Cost Calculator & Action */}
        <section className="bg-white border border-brandBorder rounded-md p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-brandDark border-b border-brandBorder pb-3 mb-4">
              Landed Cost Calculator & Escrow Lock
            </h2>

            {placeBidMsg && (
              <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-900 rounded text-xs font-bold">
                {placeBidMsg}
              </div>
            )}

            {/* Bid Input Adjuster */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Your Proposed Bid Amount (Per Quintal):</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={`₹${bidInput}`}
                  onChange={(e) => setBidInput(Number(e.target.value.replace(/[^0-9]/g, '')))}
                  className="w-full bg-brandBg border border-brandBorder rounded px-3 py-2 font-black text-lg text-brandNavy focus:outline-none"
                />
                <button onClick={() => setBidInput(prev => prev - 10)} className="bg-brandBg border border-brandBorder px-3 font-bold hover:bg-gray-100 rounded text-xs">-10</button>
                <button onClick={() => setBidInput(prev => prev + 10)} className="bg-brandBg border border-brandBorder px-3 font-bold hover:bg-gray-100 rounded text-xs">+10</button>
              </div>
            </div>

            {/* Dynamic Cost Breakdown Table */}
            <div className="bg-brandBg border border-brandBorder rounded p-4 space-y-2 text-xs mb-4">
              <div className="flex justify-between py-1 border-b border-dashed border-gray-200">
                <span className="text-gray-600">Your Bid Amount:</span>
                <span className="font-bold text-brandDark">₹{bidInput} / qtl <span className="text-gray-500 font-normal">(₹{grossValue.toLocaleString()})</span></span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-gray-200">
                <span className="text-gray-600">Estimated Transport & Freight:</span>
                <span className="font-bold text-brandDark">+₹120 / qtl <span className="text-gray-500 font-normal">(+₹{freight.toLocaleString()})</span></span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-gray-200">
                <span className="text-gray-600">Mandi Tax / Cess (MP State):</span>
                <span className="font-bold text-brandDark">+₹25 / qtl <span className="text-gray-500 font-normal">(+₹{mandiTax.toLocaleString()})</span></span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-gray-200">
                <span className="text-gray-600">Escrow & Platform Fee:</span>
                <span className="font-bold text-brandDark">+₹15 / qtl <span className="text-gray-500 font-normal">(+₹{platformFee.toLocaleString()})</span></span>
              </div>

              {/* Total Landed Result Box */}
              <div className="bg-white border border-brandNavy p-3 rounded mt-3">
                <div className="text-[10px] font-bold text-brandNavy uppercase tracking-wider">TOTAL LANDED COST AT WAREHOUSE</div>
                <div className="text-2xl font-black text-brandNavy mt-0.5">₹{landedCostPerQtl.toLocaleString()} / Quintal</div>
                <div className="text-xs text-gray-600 mt-0.5">Total Outflow for 10 Tonnes: <strong className="text-brandDark">₹{totalOutflow.toLocaleString()}</strong></div>
              </div>
            </div>

            {/* Escrow Protection Guarantee Micro-copy */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 leading-relaxed">
              <strong>🔒 Escrow Safety Guarantee:</strong> Your <strong>₹{deposit10Pct.toLocaleString()} deposit (10%)</strong> is held safely in escrow. It is only transferred to the seller upon your physical acceptance of the delivery at your warehouse.
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 space-y-2">
            <button onClick={handlePlaceBid} className="w-full bg-brandNavy hover:bg-brandNavyHover text-white font-extrabold py-3.5 rounded text-sm transition shadow-sm">
              Lock 10% Deposit (₹{deposit10Pct.toLocaleString()}) & Place Bid →
            </button>
            <button onClick={() => onNavigate?.('buyer-logistics')} className="w-full border border-brandNavy text-brandNavy hover:bg-blue-50 font-bold py-2 rounded text-xs transition">
              View Active Logistics & Delivery →
            </button>
          </div>
        </section>

      </main>

    </div>
  );
};
