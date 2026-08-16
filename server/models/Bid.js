import mongoose from 'mongoose';

const BidSchema = new mongoose.Schema({
  lot: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buyerName: { type: String, required: true },
  buyerCity: { type: String, required: true },
  buyerRating: { type: Number, default: 4.8 },
  amountPerQuintal: { type: Number, required: true },
  totalGrossValue: { type: Number, required: true },
  timestampStr: { type: String },
  verified: { type: Boolean, default: true },
  status: {
    type: String,
    enum: ['active', 'outbid', 'accepted', 'rejected', 'winning'],
    default: 'active'
  }
}, { timestamps: true });

export default mongoose.model('Bid', BidSchema);
