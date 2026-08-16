import mongoose from 'mongoose';

const DisputeSchema = new mongoose.Schema({
  disputeId: { type: String, required: true, unique: true },
  lot: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: {
    type: String,
    enum: ['re_grade_request', 'quality_mismatch', 'delivery_delay', 'non_payment'],
    default: 're_grade_request'
  },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending_review', 'under_investigation', 'resolved_approved', 'resolved_rejected'],
    default: 'pending_review'
  },
  resolutionNote: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Dispute', DisputeSchema);
