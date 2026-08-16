const API_BASE_URL = '/api';

export const api = {
  // Auth & Roles
  async loginUser(data: { identifier?: string; phone?: string; email?: string; password?: string; role: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async registerUser(data: any) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async login(phone: string, role: string) {
    return this.loginUser({ phone, role });
  },

  async selectRole(role: string) {
    return this.login('', role);
  },

  // Listings & Crop Quality
  async getListings() {
    const res = await fetch(`${API_BASE_URL}/listings`);
    return res.json();
  },

  async getListing(lotId: string) {
    const res = await fetch(`${API_BASE_URL}/listings/${lotId}`);
    return res.json();
  },

  async createListing(data: any) {
    const res = await fetch(`${API_BASE_URL}/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async setReservePrice(lotId: string, reservePrice: number) {
    const res = await fetch(`${API_BASE_URL}/listings/${lotId}/set-reserve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservePrice })
    });
    return res.json();
  },

  async acceptWinningBid(lotId: string) {
    const res = await fetch(`${API_BASE_URL}/listings/${lotId}/accept-bid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  },

  async acceptBid(lotId: string) {
    return this.acceptWinningBid(lotId);
  },

  async requestReGrade(lotId: string, reason: string) {
    const res = await fetch(`${API_BASE_URL}/listings/${lotId}/re-grade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    return res.json();
  },

  async requestPhysicalSample(lotId: string, buyerId = 'usr_buyer1') {
    const res = await fetch(`${API_BASE_URL}/listings/${lotId}/sample-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buyerId })
    });
    return res.json();
  },

  async getAssayerReport(lotId: string) {
    const res = await fetch(`${API_BASE_URL}/listings/${lotId}/assayer-report`);
    return res.json();
  },

  // Bids & Auto-Bids
  async getBids(lotId: string) {
    const res = await fetch(`${API_BASE_URL}/bids/${lotId}`);
    return res.json();
  },

  async placeBid(data: {
    lotId: string;
    amountPerQuintal: number;
    buyerName?: string;
    buyerCity?: string;
    buyerRating?: number;
  }) {
    const res = await fetch(`${API_BASE_URL}/bids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async setAutoBid(lotId: string, maxCeiling: number, stepIncrement = 10, buyerName = 'Arjun Patel') {
    const res = await fetch(`${API_BASE_URL}/bids/auto-bid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lotId, maxCeiling, stepIncrement, buyerName })
    });
    return res.json();
  },

  // Escrow & Logistics
  async getEscrow(lotId: string) {
    const res = await fetch(`${API_BASE_URL}/escrow/${lotId}`);
    return res.json();
  },

  async getLogistics(lotId: string) {
    const res = await fetch(`${API_BASE_URL}/escrow/${lotId}/logistics`);
    return res.json();
  },

  async depositEscrow(lotId: string) {
    const res = await fetch(`${API_BASE_URL}/escrow/${lotId}/deposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  },

  async confirmDelivery(lotId: string) {
    const res = await fetch(`${API_BASE_URL}/escrow/${lotId}/confirm-delivery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  },

  async fileDispute(lotId: string, reason: string, type = 'quality_mismatch') {
    const res = await fetch(`${API_BASE_URL}/escrow/${lotId}/dispute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, type })
    });
    return res.json();
  },

  // AI Services
  async scanCropQuality(formData: FormData) {
    const res = await fetch(`${API_BASE_URL}/ai/crop-scan`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },

  async queryRagAdvisory(question: string, history: any[] = []) {
    const res = await fetch(`${API_BASE_URL}/ai/rag-advisory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, history })
    });
    return res.json();
  },

  async askRAGAdvisory(question: string, history: any[] = []) {
    return this.queryRagAdvisory(question, history);
  }
};
