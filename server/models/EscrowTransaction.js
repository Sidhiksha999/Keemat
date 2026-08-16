import mongoose from 'mongoose';

const StateHistorySchema = new mongoose.Schema({
  state: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  triggeredBy: { type: String, default: 'system' },
  note: { type: String }
}, { _id: false });

const EscrowTransactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true, default: 'ESC-99401' },
  lot: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  grossAmount: { type: Number, required: true },
  buyerDepositAmount: { type: Number, required: true, default: 18000 },
  transportCost: { type: Number, default: 12400 },
  platformFee: { type: Number, default: 1800 },
  netSellerPayout: { type: Number, required: true },
  landedCostPerQuintal: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      'PENDING_DEPOSIT',
      'FUNDS_LOCKED',
      'HELD_IN_ESCROW',
      'DISPATCH_APPROVED',
      'DELIVERY_CONFIRMED',
      'FUNDS_RELEASED',
      'DISPUTED',
      'REFUNDED'
    ],
    default: 'FUNDS_LOCKED'
  },
  stateHistory: [StateHistorySchema],
  dispute: { type: mongoose.Schema.Types.ObjectId, ref: 'Dispute' }
}, { timestamps: true });

export default mongoose.model('EscrowTransaction', EscrowTransactionSchema);
