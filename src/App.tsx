import React, { useState, useEffect } from 'react';
import { AuthGateway } from './components/AuthGateway';
import RoleSelectionGateway from './components/RoleSelectionGateway';
import FarmerLanding from './components/FarmerLanding';
import FarmerDashboard from './components/FarmerDashboard';
import FarmerCropGrading from './components/FarmerCropGrading';
import FarmerAuctionRoom from './components/FarmerAuctionRoom';
import BuyerAuctionTerminal from './components/BuyerAuctionTerminal';
import { BuyerDiscovery } from './components/BuyerDiscovery';
import { BuyerQualityDossier } from './components/BuyerQualityDossier';
import { BuyerBiddingRoom } from './components/BuyerBiddingRoom';
import { BuyerLogisticsVerification } from './components/BuyerLogisticsVerification';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('keemat_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentRole, setCurrentRole] = useState<'farmer' | 'buyer' | null>(() => {
    return (localStorage.getItem('keemat_role') as 'farmer' | 'buyer') || null;
  });

  const [currentView, setCurrentView] = useState<string>('auth-gateway');

  useEffect(() => {
    if (!currentUser || !currentRole) {
      setCurrentView('auth-gateway');
      return;
    }

    const handleHashChange = () => {
      let hash = window.location.hash.replace('#', '');
      if (!hash) {
        hash = currentRole === 'farmer' ? 'farmer-dashboard' : 'buyer-discovery';
      }

      // Enforce Protected Routes
      if (currentRole === 'farmer' && hash.startsWith('buyer-')) {
        hash = 'farmer-dashboard';
      } else if (currentRole === 'buyer' && hash.startsWith('farmer-')) {
        hash = 'buyer-discovery';
      }

      setCurrentView(hash);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentUser, currentRole]);

  const navigateTo = (view: string) => {
    // Route guard check
    if (currentRole === 'farmer' && view.startsWith('buyer-')) {
      view = 'farmer-dashboard';
    } else if (currentRole === 'buyer' && view.startsWith('farmer-')) {
      view = 'buyer-discovery';
    }
    window.location.hash = view;
    setCurrentView(view);
  };

  const handleLoginSuccess = (user: any, role: 'farmer' | 'buyer') => {
    setCurrentUser(user);
    setCurrentRole(role);
    const target = role === 'farmer' ? 'farmer-dashboard' : 'buyer-discovery';
    window.location.hash = target;
    setCurrentView(target);
  };

  const handleLogout = () => {
    localStorage.removeItem('keemat_user');
    localStorage.removeItem('keemat_role');
    localStorage.removeItem('keemat_token');
    setCurrentUser(null);
    setCurrentRole(null);
    window.location.hash = 'auth-gateway';
    setCurrentView('auth-gateway');
  };

  if (!currentUser || !currentRole || currentView === 'auth-gateway') {
    return <AuthGateway onLoginSuccess={handleLoginSuccess} />;
  }

  // Component Router Helper for Farmers
  const renderFarmerView = () => {
    switch (currentView) {
      case 'farmer-landing':
        return <FarmerLanding onNavigate={navigateTo} />;
      case 'farmer-grading':
      case 'crop-grading':
      case 'farmer-scan':
        return <FarmerCropGrading onNavigate={navigateTo} />;
      case 'farmer-auction':
        return <FarmerAuctionRoom onNavigate={navigateTo} />;
      case 'farmer-escrow':
      case 'farmer-logistics':
      case 'escrow-vault':
        return <BuyerLogisticsVerification onNavigate={navigateTo} />;
      case 'farmer-dashboard':
      case 'farmer-activity':
      case 'farmer-logs':
      default:
        return <FarmerDashboard onNavigate={navigateTo} />;
    }
  };

  // Component Router Helper for Buyers
  const renderBuyerView = () => {
    switch (currentView) {
      case 'buyer-dossier':
        return <BuyerQualityDossier onNavigate={navigateTo} />;
      case 'buyer-bidding':
      case 'buyer-auction':
        return <BuyerBiddingRoom onNavigate={navigateTo} />;
      case 'buyer-logistics':
        return <BuyerLogisticsVerification onNavigate={navigateTo} />;
      case 'buyer-discovery':
      default:
        return <BuyerDiscovery onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col font-sans">
      {/* Top Universal Header & Switcher Bar */}
      <div className="bg-[#1A1A18] text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between border-b border-gray-800 shrink-0 z-50">
        <div className="flex items-center space-x-3 font-bold tracking-tight">
          <span className="bg-[#1B4D3E] text-green-300 px-2 py-0.5 rounded text-[10px] font-mono">KEEMAT ENGINE</span>
          <span>Role: {currentRole === 'farmer' ? '🌾 Farmer Ecosystem' : '🏬 Buyer Ecosystem'}</span>
        </div>

        {/* Dedicated Navigation Links */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1 text-[11px]">
          {currentRole === 'farmer' ? (
            <>
              <button
                onClick={() => navigateTo('farmer-landing')}
                className={`px-2.5 py-1 rounded transition ${currentView === 'farmer-landing' ? 'bg-[#1B4D3E] text-white font-bold' : 'text-gray-300 hover:bg-gray-800'}`}
              >
                🌾 Farmer Landing
              </button>
              <button
                onClick={() => navigateTo('farmer-dashboard')}
                className={`px-2.5 py-1 rounded transition ${currentView === 'farmer-dashboard' ? 'bg-[#1B4D3E] text-white font-bold' : 'text-gray-300 hover:bg-gray-800'}`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => navigateTo('farmer-grading')}
                className={`px-2.5 py-1 rounded transition ${['farmer-grading', 'crop-grading', 'farmer-scan'].includes(currentView) ? 'bg-[#1B4D3E] text-white font-bold' : 'text-gray-300 hover:bg-gray-800'}`}
              >
                📷 AI Scanner
              </button>
              <button
                onClick={() => navigateTo('farmer-auction')}
                className={`px-2.5 py-1 rounded transition ${currentView === 'farmer-auction' ? 'bg-[#1B4D3E] text-white font-bold' : 'text-gray-300 hover:bg-gray-800'}`}
              >
                ⚡ Live Auction
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigateTo('buyer-discovery')}
                className={`px-2.5 py-1 rounded transition ${currentView === 'buyer-discovery' ? 'bg-[#1E3A8A] text-white font-bold' : 'text-gray-300 hover:bg-gray-800'}`}
              >
                🔍 Buyer Feed
              </button>
              <button
                onClick={() => navigateTo('buyer-dossier')}
                className={`px-2.5 py-1 rounded transition ${currentView === 'buyer-dossier' ? 'bg-[#1E3A8A] text-white font-bold' : 'text-gray-300 hover:bg-gray-800'}`}
              >
                📑 Quality Dossier
              </button>
              <button
                onClick={() => navigateTo('buyer-bidding')}
                className={`px-2.5 py-1 rounded transition ${['buyer-bidding', 'buyer-auction'].includes(currentView) ? 'bg-[#1E3A8A] text-white font-bold' : 'text-gray-300 hover:bg-gray-800'}`}
              >
                🏬 Bidding Terminal
              </button>
              <button
                onClick={() => navigateTo('buyer-logistics')}
                className={`px-2.5 py-1 rounded transition ${currentView === 'buyer-logistics' ? 'bg-[#1E3A8A] text-white font-bold' : 'text-gray-300 hover:bg-gray-800'}`}
              >
                🚚 Logistics & Escrow
              </button>
            </>
          )}

          <span className="text-gray-600 font-bold px-1">|</span>

          {/* User Account & Logout */}
          <div className="flex items-center space-x-2 pl-2">
            <span className="text-gray-300 font-semibold">{currentUser?.name || 'User'}</span>
            <button
              onClick={handleLogout}
              className="bg-red-900/80 hover:bg-red-800 text-white font-bold px-2 py-0.5 rounded text-[10px] transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main View Router Content */}
      <div className="flex-1">
        {currentRole === 'farmer' ? renderFarmerView() : renderBuyerView()}
      </div>
    </div>
  );
};

export default App;
