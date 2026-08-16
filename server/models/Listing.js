import mongoose from 'mongoose';

const DefectBoxSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  w: { type: Number, required: true },
  h: { type: Number, required: true },
  color: { type: String, required: true },
  type: { type: String, required: true },
  label: { type: String, required: true }
}, { _id: false });

const ListingSchema = new mongoose.Schema({
  lotId: { type: String, required: true, unique: true, default: 'KM-8802' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  commodity: { type: String, required: true, default: 'Wheat - Sharbati' },
  quantityQuintals: { type: Number, required: true, default: 100 },
  originLocation: { type: String, required: true, default: 'Sehore, Madhya Pradesh' },
  pickupDate: { type: String, default: '2026-08-18' },
  grade: { type: String, default: 'GRADE A' },
  aiConfidence: { type: Number, default: 89 },
  qualityMetrics: {
    moisture: { type: Number, default: 12.0 },
    foreignMatter: { type: Number, default: 1.8 },
    defectDiscoloration: { type: Number, default: 3.2 },
    uniformityIndex: { type: Number, default: 87 },
    testWeight: { type: Number, default: 78.4 }
  },
  defectBoxes: [DefectBoxSchema],
  samplePhotos: [{ type: String }],
  marketValuationMin: { type: Number, default: 2350 },
  marketValuationMax: { type: Number, default: 2400 },
  reservePrice: { type: Number, default: 2300 },
  status: {
    type: String,
    enum: ['draft', 're_grade_requested', 'active_auction', 'auction_closed', 'escrow_locked', 'dispatched', 'delivered', 'cancelled'],
    default: 'active_auction'
  },
  auctionStartTime: { type: Date, default: Date.now },
  auctionEndTime: { type: Date },
  winningBid: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' },
  winningBuyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Listing', ListingSchema);
