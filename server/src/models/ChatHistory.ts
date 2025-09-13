import mongoose, { Document, Schema } from 'mongoose';

export interface IChatHistory extends Document {
  patientId: string;
  sessionId: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatHistorySchema = new Schema<IChatHistory>({
  patientId: { type: String, required: true },
  sessionId: { type: String, required: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

export const ChatHistory = mongoose.model<IChatHistory>('ChatHistory', ChatHistorySchema);