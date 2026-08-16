import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface BuyerDiscoveryProps {
  onNavigate?: (view: string) => void;
}

export const BuyerDiscovery: React.FC<BuyerDiscoveryProps> = ({ onNavigate }) => {
  const [commodityFilter, setCommodityFilter] = useState('Wheat - Sharbati');
  const [gradeFilter, setGradeFilter] = useState('Grade A/B/C');
  const [locationFilter, setLocationFilter] = useState('Sehore, MP +50km');

  const [lotData, setLotData] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [bidSuccessMsg, setBidSuccessMsg] = useState('');

  useEffect(() => {
    fetchLotDetails();
  }, []);

  const fetchLotDetails = async () => {
    try {
      setLoading(true);
      const res = await api.getListing('KM-8802');
      if (res.success) {
        setLotData(res.listing);
        setBids(res.bids || []);
      }
    } catch (err) {
      console.error('Error fetching discovery lot:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickBid = async () => {
    try {
      const topBid = bids[0]?.amountPerQuintal || 2380;
      const nextBid = topBid + 15;
      const res = await api.placeBid({
        lotId: 'KM-8802',
        amountPerQuintal: nextBid,
        buyerName: 'Arjun Patel (You)',
        buyerCity: 'Indore, MP',
        buyerRating: 5.0
      });
      if (res.success) {
        setBidSuccessMsg(`✅ Quick Bid placed successfully at ₹${nextBid}/qtl!`);
        fetchLotDetails();
        setTimeout(() => setBidSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      alert(err.message || 'Error placing quick bid');
    }
  };

  const currentPrice = bids[0]?.amountPerQuintal || 2380;
  const quantity = lotData?.quantityQuintals || 100;
  const grossBid = currentPrice * quantity;
  const freight = 4200;
  const mandiTax = Math.round(grossBid * 0.0088);
  const platformFee = Math.round(grossBid * 0.0075);
  const totalLandedCost = grossBid + freight + mandiTax + platformFee;
  const effectiveUnitRate = Math.round(totalLandedCost / quantity);

  return (
    <div className="bg-brandBg text-brandDark font-sans antialiased min-h-screen pb-12">
      {/* 1. Top Navigation Bar */}
      <header className="w-full bg-white border-b border-brandBorder px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-black tracking-tight text-brandDark">KEEMAT</span>
          <span className="bg-brandNavy text-white text-xs font-semibold px-2.5 py-0.5 rounded">Buyer Dashboard</span>
        </div>

        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <button onClick={() => onNavigate?.('buyer-discovery')} className="text-brandNavy border-b-2 border-brandNavy pb-1 font-semibold">Live Auctions</button>
          <button onClick={() => onNavigate?.('buyer-dossier')} className="text-gray-600 hover:text-brandDark">Quality Dossier</button>
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

      {/* 2. Header Stats Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-brandBorder rounded-md p-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Available Bid Balance</div>
            <div className="text-2xl font-bold text-brandDark mt-1">₹15,75,000</div>
          </div>
          <div className="bg-white border border-brandBorder rounded-md p-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lots Under Bid</div>
            <div className="text-2xl font-bold text-brandDark mt-1">5 Lots</div>
          </div>
          <div className="bg-white border border-brandBorder rounded-md p-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Awaiting Delivery</div>
            <div className="text-2xl font-bold text-green-700 mt-1 flex items-center">
              3 Lots
              <span className="ml-2 text-xs bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded border border-green-300">Escrow Locked</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Grid */}
      <main className="max-w-7xl mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: Marketplace Feed (8 Cols) */}
        <section className="lg:col-span-8 bg-white border border-brandBorder rounded-md p-5">
          <div className="flex items-center justify-between border-b border-brandBorder pb-3 mb-4">
            <h2 className="text-lg font-bold text-brandDark">
              Marketplace Discovery & Sourcing Feed
            </h2>
            {bidSuccessMsg && <span className="text-xs text-green-700 font-bold bg-green-50 px-2 py-1 rounded border border-green-200">{bidSuccessMsg}</span>}
          </div>

          {/* Quick-Filter Bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4 text-xs">
            <select value={commodityFilter} onChange={(e) => setCommodityFilter(e.target.value)} className="bg-brandBg border border-brandBorder rounded px-2 py-1.5 font-medium text-brandDark focus:outline-none">
              <option>Wheat - Sharbati</option>
              <option>Barley - Two Row</option>
              <option>Chana - Desi</option>
            </select>
            <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="bg-brandBg border border-brandBorder rounded px-2 py-1.5 font-medium text-brandDark focus:outline-none">
              <option>Grade A/B/C</option>
              <option>Grade A Only</option>
              <option>Grade B Only</option>
            </select>
            <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="bg-brandBg border border-brandBorder rounded px-2 py-1.5 font-medium text-brandDark focus:outline-none">
              <option>Sehore, MP +50km</option>
              <option>Vidisha, MP +50km</option>
              <option>Ujjain, MP +50km</option>
            </select>
            <select className="bg-brandBg border border-brandBorder rounded px-2 py-1.5 font-medium text-brandDark focus:outline-none">
              <option>10 - 50 Tonnes</option>
              <option>50+ Tonnes</option>
            </select>
            <select className="bg-brandBg border border-brandBorder rounded px-2 py-1.5 font-medium text-brandDark focus:outline-none">
              <option>Aug 2026</option>
              <option>Sep 2026</option>
            </select>
            <select className="bg-brandBg border border-brandBorder rounded px-2 py-1.5 font-medium text-brandDark focus:outline-none">
              <option>Next 3 Days</option>
              <option>Same Day</option>
            </select>
          </div>

          {/* Table Feed */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-brandBg border-y border-brandBorder text-gray-600 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-2">Verified Quality</th>
                  <th className="py-2.5 px-2">Commodity</th>
                  <th className="py-2.5 px-2">Quantity</th>
                  <th className="py-2.5 px-2">Location & Freight</th>
                  <th className="py-2.5 px-2">Current Bid / Time</th>
                  <th className="py-2.5 px-2 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brandBorder">

                {/* Selected Active Row */}
                <tr className="bg-blue-50/50">
                  <td className="py-3 px-2">
                    <span className="bg-green-100 text-green-800 border border-green-300 font-bold px-2 py-0.5 rounded inline-block text-[10px]">
                      GRADE A • 11.5% Moisture
                    </span>
                  </td>
                  <td className="py-3 px-2 font-bold text-brandDark">Wheat - Sharbati</td>
                  <td className="py-3 px-2 font-medium">10 Tonnes</td>
                  <td className="py-3 px-2">
                    <span className="font-medium">Sehore, MP</span>
                    <span className="block text-[10px] text-gray-500">₹4,200 Freight Est.</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="font-bold text-brandDark">₹{currentPrice}/qtl</span>
                    <span className="block text-[10px] text-amber-700 font-semibold">04:12 remaining</span>
                  </td>
                  <td className="py-3 px-2 text-right space-x-1">
                    <button onClick={handleQuickBid} className="bg-brandNavy hover:bg-brandNavyHover text-white font-semibold px-3 py-1.5 rounded transition">
                      Place Quick Bid
                    </button>
                    <button onClick={() => onNavigate?.('buyer-dossier')} className="border border-brandNavy text-brandNavy font-semibold px-2 py-1.5 rounded hover:bg-blue-50 transition">
                      View Dossier
                    </button>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr>
                  <td className="py-3 px-2">
                    <span className="bg-amber-100 text-amber-800 border border-amber-300 font-bold px-2 py-0.5 rounded inline-block text-[10px]">
                      GRADE B • 13.0% Moisture
                    </span>
                  </td>
                  <td className="py-3 px-2 font-bold text-brandDark">Barley - Two Row</td>
                  <td className="py-3 px-2 font-medium">25 Tonnes</td>
                  <td className="py-3 px-2">
                    <span className="font-medium">Vidisha, MP</span>
                    <span className="block text-[10px] text-gray-500">₹6,100 Freight Est.</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="font-bold text-brandDark">₹1,950/qtl</span>
                    <span className="block text-[10px] text-gray-500">12:45 remaining</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button onClick={() => onNavigate?.('buyer-dossier')} className="border border-brandNavy text-brandNavy font-semibold px-3 py-1.5 rounded hover:bg-blue-50 transition">
                      View Dossier
                    </button>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr>
                  <td className="py-3 px-2">
                    <span className="bg-green-100 text-green-800 border border-green-300 font-bold px-2 py-0.5 rounded inline-block text-[10px]">
                      GRADE A • 10.8% Moisture
                    </span>
                  </td>
                  <td className="py-3 px-2 font-bold text-brandDark">Chana - Desi</td>
                  <td className="py-3 px-2 font-medium">15 Tonnes</td>
                  <td className="py-3 px-2">
                    <span className="font-medium">Ujjain, MP</span>
                    <span className="block text-[10px] text-gray-500">₹3,800 Freight Est.</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="font-bold text-brandDark">₹4,850/qtl</span>
                    <span className="block text-[10px] text-amber-700 font-semibold">01:30 remaining</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button onClick={handleQuickBid} className="bg-brandNavy hover:bg-brandNavyHover text-white font-semibold px-3 py-1.5 rounded transition">
                      Place Quick Bid
                    </button>
                  </td>
                </tr>

                {/* Row 4 */}
                <tr>
                  <td className="py-3 px-2">
                    <span className="bg-green-100 text-green-800 border border-green-300 font-bold px-2 py-0.5 rounded inline-block text-[10px]">
                      GRADE A • 11.2% Moisture
                    </span>
                  </td>
                  <td className="py-3 px-2 font-bold text-brandDark">Soybean - Yellow</td>
                  <td className="py-3 px-2 font-medium">20 Tonnes</td>
                  <td className="py-3 px-2">
                    <span className="font-medium">Dewas, MP</span>
                    <span className="block text-[10px] text-gray-500">₹5,000 Freight Est.</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="font-bold text-brandDark">₹3,620/qtl</span>
                    <span className="block text-[10px] text-gray-500">08:20 remaining</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button onClick={() => onNavigate?.('buyer-dossier')} className="border border-brandNavy text-brandNavy font-semibold px-3 py-1.5 rounded hover:bg-blue-50 transition">
                      View Dossier
                    </button>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </section>

        {/* RIGHT COLUMN: Dynamic Landed Cost Engine (4 Cols) */}
        <section className="lg:col-span-4 bg-white border border-brandBorder rounded-md p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-brandBorder pb-3 mb-4">
              <h2 className="text-base font-bold text-brandDark">Estimated Total Landed Cost</h2>
              <span className="text-xs bg-gray-100 text-gray-700 font-mono font-semibold px-2 py-0.5 rounded border border-gray-300">Lot #KM-8802</span>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-dashed border-gray-200">
                <span className="text-gray-600">Selected Bid Price (100 qtl):</span>
                <span className="font-semibold text-brandDark">₹{grossBid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-gray-200">
                <span className="text-gray-600">Transport & Freight:</span>
                <span className="font-semibold text-brandDark">+₹{freight.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-gray-200">
                <span className="text-gray-600">Mandi Cess / State Tax:</span>
                <span className="font-semibold text-brandDark">+₹{mandiTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-gray-200">
                <span className="text-gray-600">Escrow & Platform Fee:</span>
                <span className="font-semibold text-brandDark">+₹{platformFee.toLocaleString()}</span>
              </div>

              {/* Total Result Box */}
              <div className="bg-brandBg border border-brandBorder p-3 rounded mt-4">
                <div className="text-[11px] font-semibold text-gray-500 uppercase">Total Landed Cost at Warehouse</div>
                <div className="text-2xl font-black text-brandNavy mt-0.5">₹{totalLandedCost.toLocaleString()}</div>
                <div className="text-[11px] text-gray-600 mt-1">Effective Unit Rate: <strong className="text-brandDark">₹{effectiveUnitRate.toLocaleString()} / Quintal</strong></div>
              </div>
            </div>

            {/* Escrow Protection Badge */}
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-xs text-green-900 flex items-start space-x-2">
              <span className="text-sm">🔒</span>
              <p className="leading-relaxed">
                <strong>100% Escrow Protected:</strong> Your funds remain locked in escrow until physical quality verification at your warehouse gate.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6">
            <button onClick={() => onNavigate?.('buyer-bidding')} className="w-full bg-brandNavy hover:bg-brandNavyHover text-white font-bold py-3 rounded text-sm transition flex items-center justify-center space-x-2">
              <span>Lock 10% Deposit & Bid</span>
              <span>→</span>
            </button>
          </div>
        </section>

      </main>

    </div>
  );
};
