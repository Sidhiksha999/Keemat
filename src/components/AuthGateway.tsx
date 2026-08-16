import React, { useState } from 'react';
import { api } from '../services/api';

interface AuthGatewayProps {
  onLoginSuccess: (user: any, role: 'farmer' | 'buyer') => void;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({ onLoginSuccess }) => {
  const [roleTab, setRoleTab] = useState<'farmer' | 'buyer'>('farmer');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [stateName, setStateName] = useState('Madhya Pradesh');
  const [kycNumber, setKycNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSwitch = (newRole: 'farmer' | 'buyer') => {
    setRoleTab(newRole);
    setError('');
    setIdentifier('');
    setPassword('');
  };

  const handleQuickFillDemo = () => {
    setError('');
    if (roleTab === 'farmer') {
      setIdentifier('+91 9876543210');
      setPassword('password123');
    } else {
      setIdentifier('+91 98260-11223');
      setPassword('password123');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your registered mobile number/email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.loginUser({
        identifier: identifier.trim(),
        password: password.trim(),
        role: roleTab
      });

      if (res.success) {
        localStorage.setItem('keemat_user', JSON.stringify(res.user));
        localStorage.setItem('keemat_role', res.user.role);
        localStorage.setItem('keemat_token', res.token);
        onLoginSuccess(res.user, res.user.role);
      } else {
        setError(res.error || 'Invalid credentials. Please check your mobile number and password.');
      }
    } catch (err: any) {
      setError(err.message || 'Login request failed. Server error.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const regPhone = phone.trim() || identifier.trim();
    if (!regPhone || !password.trim()) {
      setError('Please provide a mobile number and password to register.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.registerUser({
        name: fullName || (roleTab === 'farmer' ? 'Sidhiksha' : 'Arjun Patel'),
        companyName: roleTab === 'buyer' ? (companyName || 'Patel Agro Traders') : undefined,
        phone: regPhone,
        email: email || `${regPhone}@keemat.agri`,
        password: password.trim(),
        role: roleTab,
        location: { village: village || 'Sehore', district: district || 'Sehore', state: stateName },
        kycNumber: kycNumber || 'KYC-998210',
        gstNumber: gstNumber || 'GSTIN-23AAAAA0000A1Z5'
      });

      if (res.success) {
        localStorage.setItem('keemat_user', JSON.stringify(res.user));
        localStorage.setItem('keemat_role', res.user.role);
        localStorage.setItem('keemat_token', res.token);
        onLoginSuccess(res.user, res.user.role);
      } else {
        setError(res.error || 'Registration failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Registration request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-4 font-sans text-[#1A1A18]">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-black tracking-tight text-[#1A1A18]">KEEMAT</h1>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">
          Direct Fair-Price Agri Bidding & Escrow Marketplace
        </p>
      </div>

      {/* Auth Container Card */}
      <div className="bg-white border border-[#E2E2DC] rounded-xl shadow-sm max-w-lg w-full overflow-hidden">
        
        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 text-center text-sm font-bold border-b border-[#E2E2DC]">
          <button
            onClick={() => handleRoleSwitch('farmer')}
            className={`py-3.5 transition flex items-center justify-center space-x-2 ${roleTab === 'farmer' ? 'bg-[#1B4D3E] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
          >
            <span>🌾 Farmer Gateway</span>
          </button>
          <button
            onClick={() => handleRoleSwitch('buyer')}
            className={`py-3.5 transition flex items-center justify-center space-x-2 ${roleTab === 'buyer' ? 'bg-[#1E3A8A] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
          >
            <span>🏬 Buyer & Trader Gateway</span>
          </button>
        </div>

        <div className="p-6">

          {/* Mode Switcher */}
          <div className="flex items-center justify-between border-b border-[#E2E2DC] pb-3 mb-5">
            <h2 className="text-lg font-bold text-[#1A1A18]">
              {roleTab === 'farmer' ? 'Farmer Sign In' : 'Buyer Business Sign In'}
            </h2>
            <div className="flex space-x-2 text-xs font-semibold">
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className={`px-3 py-1 rounded ${mode === 'login' ? 'bg-gray-200 text-[#1A1A18]' : 'text-gray-500 hover:text-[#1A1A18]'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode('signup'); setError(''); }}
                className={`px-3 py-1 rounded ${mode === 'signup' ? 'bg-gray-200 text-[#1A1A18]' : 'text-gray-500 hover:text-[#1A1A18]'}`}
              >
                Register
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-gray-700">
                    {roleTab === 'farmer' ? 'Registered Mobile Number (+91)' : 'Mobile Number or Email Address'}
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickFillDemo}
                    className="text-[10px] text-blue-700 hover:underline font-bold"
                  >
                    ⚡ Quick-Fill Registered Demo Account
                  </button>
                </div>
                <input
                  type="text"
                  placeholder={roleTab === 'farmer' ? '+91 9876543210' : '+91 98260-11223'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E2E2DC] rounded p-2.5 font-medium text-[#1A1A18] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Account Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E2E2DC] rounded p-2.5 font-medium text-[#1A1A18] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white font-bold py-3 rounded text-sm transition shadow-sm ${roleTab === 'farmer' ? 'bg-[#1B4D3E] hover:bg-[#153e32]' : 'bg-[#1E3A8A] hover:bg-[#162B66]'}`}
              >
                {loading ? 'Authenticating...' : `Sign In as ${roleTab === 'farmer' ? 'Farmer' : 'Buyer'} →`}
              </button>

              <div className="text-center pt-2 text-[11px] text-gray-500">
                <span>Need a new account? Switch to the <strong>Register</strong> tab above.</span>
              </div>
            </form>
          )}

          {/* SIGNUP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              {roleTab === 'farmer' ? (
                <>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Full Name (Kisan Name)</label>
                    <input
                      type="text"
                      placeholder="Sidhiksha Mishra"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-[#E2E2DC] rounded p-2 font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Mobile Number (+91)</label>
                      <input
                        type="text"
                        placeholder="+91 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-[#E2E2DC] rounded p-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Aadhar / Kisan KYC ID</label>
                      <input
                        type="text"
                        placeholder="KYC-889102"
                        value={kycNumber}
                        onChange={(e) => setKycNumber(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-[#E2E2DC] rounded p-2 font-medium"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Village</label>
                      <input
                        type="text"
                        placeholder="Sehore"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-[#E2E2DC] rounded p-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">District</label>
                      <input
                        type="text"
                        placeholder="Sehore"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-[#E2E2DC] rounded p-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        placeholder="Madhya Pradesh"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-[#E2E2DC] rounded p-2 font-medium"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Business / Company Name</label>
                      <input
                        type="text"
                        placeholder="Patel Agro Traders Ltd"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-[#E2E2DC] rounded p-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Contact Person Name</label>
                      <input
                        type="text"
                        placeholder="Arjun Patel"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-[#E2E2DC] rounded p-2 font-medium"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Mobile Number (+91)</label>
                      <input
                        type="text"
                        placeholder="+91 98260-11223"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-[#E2E2DC] rounded p-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">GSTIN / Mandi License</label>
                      <input
                        type="text"
                        placeholder="GSTIN-23AAAAA0000A1Z5"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-[#E2E2DC] rounded p-2 font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Business Email Address</label>
                    <input
                      type="email"
                      placeholder="arjun.patel@trader.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-[#E2E2DC] rounded p-2 font-medium"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Create Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E2E2DC] rounded p-2 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white font-bold py-3 rounded text-sm transition shadow-sm ${roleTab === 'farmer' ? 'bg-[#1B4D3E] hover:bg-[#153e32]' : 'bg-[#1E3A8A] hover:bg-[#162B66]'}`}
              >
                {loading ? 'Creating Account...' : `Register & Verify ${roleTab === 'farmer' ? 'Farmer KYC' : 'Buyer GST'} →`}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
