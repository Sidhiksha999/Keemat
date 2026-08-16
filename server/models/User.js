import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'buyer', 'admin'], required: true },
  phone: { type: String, default: '+91 9876543210' },
  email: { type: String, default: 'user@keemat.agri' },
  location: {
    village: { type: String, default: 'Sehore' },
    tehsil: { type: String, default: 'Sehore' },
    district: { type: String, default: 'Sehore' },
    state: { type: String, default: 'Madhya Pradesh' }
  },
  kycVerified: { type: Boolean, default: true },
  bankAccount: {
    accountNumber: { type: String, default: 'XXXX-XXXX-4912' },
    ifsc: { type: String, default: 'SBIN0001234' },
    bankName: { type: String, default: 'State Bank of India' },
    accountHolderName: { type: String, default: 'Sidhiksha' }
  },
  escrowBalance: { type: Number, default: 50000 },
  rating: { type: Number, default: 4.9 }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
