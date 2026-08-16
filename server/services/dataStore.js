import mongoose from 'mongoose';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import Bid from '../models/Bid.js';
import EscrowTransaction from '../models/EscrowTransaction.js';
import Dispute from '../models/Dispute.js';
import ChatSession from '../models/ChatSession.js';

// Fallback in-memory state store
const memoryStore = {
  users: [
    {
      _id: 'usr_farmer1',
      name: 'Sidhiksha',
      role: 'farmer',
      phone: '+91 9876543210',
      email: 'sidhiksha@keemat.agri',
      password: 'password123',
      location: { village: 'Sehore', district: 'Sehore', state: 'Madhya Pradesh' },
      kycVerified: true,
      escrowBalance: 482000,
      rating: 4.9
    },
    {
      _id: 'usr_buyer1',
      name: 'Arjun Patel',
      companyName: 'Patel Agro Traders',
      role: 'buyer',
      phone: '+91 98260-11223',
      email: 'arjun.patel@trader.agri',
      password: 'password123',
      location: { village: 'Indore', district: 'Indore', state: 'Madhya Pradesh' },
      kycVerified: true,
      escrowBalance: 1575000,
      rating: 5.0
    }
  ],
  listings: [
    {
      _id: 'lst_8802',
      lotId: 'KM-8802',
      seller: 'usr_farmer1',
      commodity: 'Wheat - Sharbati',
      quantityQuintals: 100,
      originLocation: 'Sehore, Madhya Pradesh',
      pickupDate: '2026-08-18',
      harvestDate: '15 Aug 2026',
      grade: 'GRADE A (PRIME QUALITY)',
      aiConfidence: 94,
      qualityMetrics: {
        moisture: 11.8,
        foreignMatter: 1.2,
        defectDiscoloration: 2.5,
        uniformityIndex: 89.4,
        testWeight: 78.4
      },
      defectBoxes: [
        { x: 6, y: 8, w: 28, h: 22, color: '#1B4D3E', type: 'uniform', label: 'Uniform Grain Size · 94% match' },
        { x: 52, y: 10, w: 30, h: 26, color: '#1B4D3E', type: 'uniform', label: 'Uniform Grain Size · 91% match' },
        { x: 62, y: 55, w: 20, h: 18, color: '#1B4D3E', type: 'uniform', label: 'Uniform Grain Size · 89% match' },
        { x: 16, y: 60, w: 18, h: 14, color: '#D97706', type: 'husk', label: 'Foreign Matter / Husk (1.2%)' },
        { x: 36, y: 42, w: 14, h: 12, color: '#C85A32', type: 'moisture', label: 'Discoloration Spot (2.5%)' }
      ],
      samplePhotos: [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=450&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1584353781226-579f0ab7c770?w=600&h=450&fit=crop&auto=format'
      ],
      marketValuationMin: 2350,
      marketValuationMax: 2400,
      reservePrice: 2300,
      status: 'active_auction',
      winningBid: null,
      winningBuyer: null,
      autoBidCeilings: [],
      physicalSampleRequests: [],
      assayerReport: {
        assayerName: 'APMC Certified Central Lab #APMC-770',
        certificationId: 'CERT-WM-9941',
        result: 'PASSED - GRADE A SHARBATI WHEAT',
        issuedDate: '16 Aug 2026'
      }
    }
  ],
  bids: [],
  escrows: [
    {
      transactionId: 'ESC-99401',
      lotId: 'KM-8802',
      grossAmount: 238000,
      buyerDepositAmount: 23800,
      transportCost: 12000,
      stateTaxCess: 2500,
      platformFee: 1500,
      netSellerPayout: 222500,
      landedCostPerQuintal: 2540,
      status: 'FUNDS_LOCKED',
      stateHistory: [
        { state: 'PENDING_DEPOSIT', timestamp: new Date(Date.now() - 3600000), note: 'Auction opened' },
        { state: 'FUNDS_LOCKED', timestamp: new Date(), note: '10% Escrow deposit locked (₹23,800)' }
      ]
    }
  ],
  logistics: {
    'KM-8802': {
      orderId: 'ORD-8802',
      lotId: 'KM-8802',
      vehicleNumber: 'MP-04-HE-9821',
      vehicleType: '10-Ton Eicher Truck',
      driverName: 'Ramesh Singh',
      driverPhone: '+91 98260-88123',
      gpsId: '#GPS-9921',
      origin: 'Sehore Farm',
      destination: 'Indore Warehouse',
      distanceRemainingKm: 38,
      speedKmH: 42,
      etaMins: 45,
      currentStep: 2,
      milestones: [
        { step: 1, title: 'Step 1: Farm Gate Dispatch & Weighbridge Verification', subtitle: 'Completed at Sehore Mandi • Dispatched 08:30 AM', status: 'completed' },
        { step: 2, title: 'Step 2: Transit In-Progress via NH-46', subtitle: 'Active • ETA: 01:30 PM (On Time)', status: 'active' },
        { step: 3, title: 'Step 3: Gate Entry & Arrival Quality Verification', subtitle: 'Pending Arrival at Indore Facility', status: 'pending' },
        { step: 4, title: 'Step 4: Final Escrow Settlement & Gate Pass Generation', subtitle: 'Awaiting Quality Confirmation', status: 'pending' }
      ]
    }
  },
  disputes: [],
  chats: []
};

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

export const dataStore = {
  // Auth
  async registerUser(userData) {
    if (isMongoConnected()) {
      return await User.create(userData);
    }
    const newUser = {
      _id: `usr_${Date.now()}`,
      ...userData,
      kycVerified: true,
      escrowBalance: userData.role === 'buyer' ? 1500000 : 500000,
      rating: 5.0
    };
    memoryStore.users.push(newUser);
    return newUser;
  },

  async findUserByIdentifier(identifier, role) {
    if (!identifier) return null;
    const cleanId = identifier.trim().toLowerCase();

    if (isMongoConnected()) {
      return await User.findOne({
        $or: [{ phone: identifier }, { email: cleanId }],
        role
      });
    }

    return memoryStore.users.find(u =>
      (u.phone === identifier || u.email?.toLowerCase() === cleanId) && u.role === role
    ) || null;
  },

  // Listings
  async getListings() {
    if (isMongoConnected()) return await Listing.find().sort({ createdAt: -1 }).populate('winningBid');
    return memoryStore.listings;
  },

  async getListing(lotId) {
    if (isMongoConnected()) {
      return await Listing.findOne({ lotId }).populate('winningBid winningBuyer seller');
    }
    return memoryStore.listings.find(l => l.lotId === lotId) || memoryStore.listings[0];
  },

  async createListing(data) {
    if (isMongoConnected()) {
      return await Listing.create(data);
    }
    const lotId = data.lotId || `KM-${Math.floor(1000 + Math.random() * 9000)}`;
    const listing = {
      _id: `lst_${Date.now()}`,
      lotId,
      seller: 'usr_farmer1',
      commodity: data.commodity || 'Wheat - Sharbati',
      quantityQuintals: Number(data.quantityQuintals) || 100,
      originLocation: data.originLocation || 'Sehore, Madhya Pradesh',
      pickupDate: data.pickupDate || '2026-08-18',
      harvestDate: '15 Aug 2026',
      grade: data.grade || 'GRADE A (PRIME QUALITY)',
      aiConfidence: 94,
      qualityMetrics: data.qualityMetrics || { moisture: 11.8, foreignMatter: 1.2, defectDiscoloration: 2.5, uniformityIndex: 89.4, testWeight: 78.4 },
      defectBoxes: memoryStore.listings[0].defectBoxes,
      samplePhotos: data.samplePhotos || memoryStore.listings[0].samplePhotos,
      marketValuationMin: 2350,
      marketValuationMax: 2400,
      reservePrice: Number(data.reservePrice) || 2300,
      status: 'active_auction',
      autoBidCeilings: [],
      physicalSampleRequests: [],
      assayerReport: memoryStore.listings[0].assayerReport
    };
    memoryStore.listings.unshift(listing);
    return listing;
  },

  async setReservePrice(lotId, reservePrice) {
    if (isMongoConnected()) {
      return await Listing.findOneAndUpdate({ lotId }, { reservePrice: Number(reservePrice) }, { new: true });
    }
    const listing = memoryStore.listings.find(l => l.lotId === lotId);
    if (listing) listing.reservePrice = Number(reservePrice);
    return listing;
  },

  async requestPhysicalSample(lotId, buyerId = 'usr_buyer1') {
    const listing = await this.getListing(lotId);
    if (listing) {
      if (!listing.physicalSampleRequests) listing.physicalSampleRequests = [];
      const reqObj = { buyerId, requestDate: new Date().toISOString(), status: 'SAMPLE_DISPATCHED' };
      listing.physicalSampleRequests.push(reqObj);
      return reqObj;
    }
    return { status: 'SAMPLE_DISPATCHED' };
  },

  // Bids
  async getBids(lotId) {
    if (isMongoConnected()) {
      const listing = await Listing.findOne({ lotId });
      if (listing) return await Bid.find({ lot: listing._id }).sort({ amountPerQuintal: -1 });
    }
    return memoryStore.bids.filter(b => b.lotId === lotId);
  },

  async addBid(data) {
    const targetLotId = data.lotId || 'KM-8802';

    if (isMongoConnected()) {
      const listing = await Listing.findOne({ lotId: targetLotId });
      let buyer = await User.findOne({ role: 'buyer' });
      if (!buyer) buyer = await User.create({ name: data.buyerName || 'Buyer', role: 'buyer' });

      await Bid.updateMany({ lot: listing._id, status: 'active' }, { status: 'outbid' });

      const d = new Date();
      const tsStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;

      const newBid = await Bid.create({
        lot: listing._id,
        bidder: buyer._id,
        buyerName: data.buyerName || buyer.name,
        buyerCity: data.buyerCity || 'Ludhiana, PB',
        buyerRating: data.buyerRating || 5.0,
        amountPerQuintal: data.amountPerQuintal,
        totalGrossValue: data.amountPerQuintal * listing.quantityQuintals,
        timestampStr: tsStr,
        verified: true,
        status: 'active'
      });

      listing.winningBid = newBid._id;
      await listing.save();
      return { newBid, listing };
    }

    // Memory Store
    const d = new Date();
    const tsStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    const newBid = {
      id: `b_${Date.now()}`,
      lotId: targetLotId,
      buyerName: data.buyerName || 'Arjun Patel',
      buyerCity: data.buyerCity || 'Indore, MP',
      buyerRating: data.buyerRating || 5.0,
      amountPerQuintal: data.amountPerQuintal,
      totalGrossValue: data.amountPerQuintal * 100,
      timestampStr: tsStr,
      verified: true,
      status: 'active'
    };

    memoryStore.bids.forEach(b => b.status = 'outbid');
    memoryStore.bids.unshift(newBid);

    const listing = memoryStore.listings.find(l => l.lotId === targetLotId);
    if (listing) {
      listing.winningBid = newBid;
    }

    return { newBid, listing };
  },

  async setAutoBidCeiling(lotId, maxCeiling, stepIncrement = 10, buyerName = 'Arjun Patel') {
    const listing = await this.getListing(lotId);
    if (listing) {
      if (!listing.autoBidCeilings) listing.autoBidCeilings = [];
      const existing = listing.autoBidCeilings.find(a => a.buyerName === buyerName);
      if (existing) {
        existing.maxCeiling = Number(maxCeiling);
        existing.stepIncrement = Number(stepIncrement);
        existing.active = true;
      } else {
        listing.autoBidCeilings.push({ buyerName, maxCeiling: Number(maxCeiling), stepIncrement: Number(stepIncrement), active: true });
      }
    }
    return { success: true, maxCeiling, stepIncrement };
  },

  // Escrow & Disputes
  async getEscrow(lotId) {
    if (isMongoConnected()) {
      const listing = await Listing.findOne({ lotId });
      if (listing) return await EscrowTransaction.findOne({ lot: listing._id });
    }
    return memoryStore.escrows.find(e => e.lotId === lotId) || memoryStore.escrows[0];
  },

  async transitionEscrow(lotId, targetState, note = '') {
    const escrow = await this.getEscrow(lotId);
    if (escrow) {
      escrow.status = targetState;
      if (!escrow.stateHistory) escrow.stateHistory = [];
      escrow.stateHistory.push({
        state: targetState,
        timestamp: new Date(),
        note
      });
    }
    return escrow;
  },

  async fileDispute(lotId, reason, type = 'quality_mismatch') {
    const escrow = await this.transitionEscrow(lotId, 'DISPUTED', `Escrow frozen due to quality deviation dispute: ${reason}`);
    const disputeId = `DSP-${Math.floor(1000 + Math.random() * 9000)}`;
    const dispute = { disputeId, lotId, type, reason, status: 'pending_review', createdAt: new Date() };
    memoryStore.disputes.unshift(dispute);
    return { dispute, escrow };
  },

  // Logistics
  getLogistics(lotId) {
    return memoryStore.logistics[lotId] || memoryStore.logistics['KM-8802'];
  }
};
