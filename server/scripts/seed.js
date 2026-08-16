import dotenv from 'dotenv';
dotenv.config();

import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import Bid from '../models/Bid.js';
import EscrowTransaction from '../models/EscrowTransaction.js';
import Dispute from '../models/Dispute.js';

export async function seedDatabase() {
  console.log('[Seed] Seeding database with initial platform data...');

  await User.deleteMany({});
  await Listing.deleteMany({});
  await Bid.deleteMany({});
  await EscrowTransaction.deleteMany({});
  await Dispute.deleteMany({});

  // 1. Create Users
  const farmer = await User.create({
    name: 'Sidhiksha',
    role: 'farmer',
    phone: '+91 9876543210',
    email: 'sidhiksha@keemat.agri',
    location: { village: 'Sehore', tehsil: 'Sehore', district: 'Sehore', state: 'Madhya Pradesh' },
    kycVerified: true,
    escrowBalance: 482000,
    rating: 4.9
  });

  const buyer1 = await User.create({
    name: 'Arjun Patel',
    companyName: 'Patel Agro Traders',
    role: 'buyer',
    phone: '+91 98260-11223',
    email: 'arjun.patel@trader.agri',
    location: { village: 'Indore', tehsil: 'Indore', district: 'Indore', state: 'Madhya Pradesh' },
    kycVerified: true,
    escrowBalance: 1575000,
    rating: 5.0
  });

  // 2. Create Listing Lot KM-8802 (Zero Initial Bids)
  const listing = await Listing.create({
    lotId: 'KM-8802',
    seller: farmer._id,
    commodity: 'Wheat - Sharbati',
    quantityQuintals: 100,
    originLocation: 'Sehore, Madhya Pradesh',
    pickupDate: '2026-08-18',
    grade: 'GRADE A',
    aiConfidence: 89,
    qualityMetrics: {
      moisture: 12.0,
      foreignMatter: 1.8,
      defectDiscoloration: 3.2,
      uniformityIndex: 87,
      testWeight: 78.4
    },
    defectBoxes: [
      { x: 6, y: 8, w: 28, h: 22, color: '#1B4D3E', type: 'uniform', label: 'Uniform Grain Size · 94% match' },
      { x: 52, y: 10, w: 30, h: 26, color: '#1B4D3E', type: 'uniform', label: 'Uniform Grain Size · 91% match' },
      { x: 62, y: 55, w: 20, h: 18, color: '#1B4D3E', type: 'uniform', label: 'Uniform Grain Size · 89% match' },
      { x: 16, y: 60, w: 18, h: 14, color: '#D97706', type: 'husk', label: 'Minor Husk / Foreign Matter' },
      { x: 70, y: 35, w: 14, h: 12, color: '#D97706', type: 'husk', label: 'Minor Husk / Foreign Matter' },
      { x: 36, y: 42, w: 14, h: 12, color: '#C85A32', type: 'moisture', label: 'Moisture Spot / Discoloration' }
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
    assayerReport: {
      assayerName: 'APMC Certified Central Lab #APMC-770',
      certificationId: 'CERT-WM-9941',
      result: 'PASSED - GRADE A SHARBATI WHEAT',
      issuedDate: '16 Aug 2026'
    }
  });

  // 3. Create Escrow Transaction
  const escrow = await EscrowTransaction.create({
    transactionId: 'ESC-99401',
    lot: listing._id,
    buyer: buyer1._id,
    seller: farmer._id,
    grossAmount: 241000,
    buyerDepositAmount: 18000,
    transportCost: 12400,
    platformFee: 1808,
    netSellerPayout: 226792,
    landedCostPerQuintal: 2552.08,
    status: 'PENDING_DEPOSIT',
    stateHistory: [
      { state: 'PENDING_DEPOSIT', note: 'Auction opened - Waiting for winning bid deposit' }
    ]
  });

  console.log('[Seed] Database successfully seeded with demo listing KM-8802 (Zero initial mock bids)!');
}

if (process.argv[1].endsWith('seed.js')) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error('[Seed Error]', err);
      process.exit(1);
    }
  })();
}
