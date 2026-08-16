import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'assistant'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  contextSources: [{ type: String }]
}, { _id: false });

const ChatSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: [MessageSchema]
}, { timestamps: true });

export default mongoose.model('ChatSession', ChatSessionSchema);
