import mongoose, { Schema, Document } from 'mongoose';

export interface ITransfer extends Document {
  transferId: string;
  sender: string;
  recipient: string;
  amount: number;
  sourceChain: string;
  destinationChain: string;
  intent: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  estimatedFees: number;
  suggestedActions: string[];
  txHash?: string;
  destinationTxHash?: string;
  email?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransferSchema = new Schema<ITransfer>({
  transferId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  sender: { 
    type: String, 
    required: true,
    index: true 
  },
  recipient: { 
    type: String, 
    required: true,
    index: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  sourceChain: { 
    type: String, 
    required: true 
  },
  destinationChain: { 
    type: String, 
    required: true 
  },
  intent: { 
    type: String, 
    enum: ['standard', 'maximize_yield', 'minimize_fees'],
    default: 'standard'
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
    index: true
  },
  estimatedFees: { 
    type: Number, 
    default: 0 
  },
  suggestedActions: [{ 
    type: String 
  }],
  txHash: { 
    type: String 
  },
  destinationTxHash: { 
    type: String 
  },
  email: { 
    type: String 
  },
  note: { 
    type: String 
  }
}, {
  timestamps: true
});

// Indexes for better query performance
TransferSchema.index({ sender: 1, createdAt: -1 });
TransferSchema.index({ recipient: 1, createdAt: -1 });
TransferSchema.index({ status: 1, createdAt: -1 });
TransferSchema.index({ sourceChain: 1, destinationChain: 1 });

export const Transfer = mongoose.model<ITransfer>('Transfer', TransferSchema); 