const mongoose = require('mongoose');

// Transfer Schema
const transferSchema = new mongoose.Schema({
  transferId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  sender: {
    type: String,
    required: true,
    lowercase: true
  },
  recipient: {
    type: String,
    required: true,
    lowercase: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  sourceChain: {
    type: String,
    required: true,
    enum: ['ethereum', 'base', 'arbitrum']
  },
  destinationChain: {
    type: String,
    required: true,
    enum: ['ethereum', 'base', 'arbitrum']
  },
  intent: {
    type: String,
    required: true,
    enum: ['standard', 'maximize_yield', 'minimize_fees'],
    default: 'standard'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  estimatedFees: {
    type: Number,
    default: 0.001
  },
  suggestedActions: [{
    type: String
  }],
  txHash: String,
  destinationTxHash: String,
  cctpTransferId: String,
  error: String,
  email: String,
  note: String,
  completedAt: Date
}, {
  timestamps: true
});

// Create indexes for better query performance
transferSchema.index({ sender: 1, createdAt: -1 });
transferSchema.index({ recipient: 1, createdAt: -1 });
transferSchema.index({ status: 1 });
transferSchema.index({ createdAt: -1 });

// In-memory fallback storage
let inMemoryTransfers = new Map();

// Fallback Transfer class for when MongoDB is unavailable
class InMemoryTransfer {
  constructor(data) {
    this.transferId = data.transferId;
    this.sender = data.sender;
    this.recipient = data.recipient;
    this.amount = data.amount;
    this.sourceChain = data.sourceChain;
    this.destinationChain = data.destinationChain;
    this.intent = data.intent;
    this.status = data.status || 'pending';
    this.estimatedFees = data.estimatedFees || 0.001;
    this.suggestedActions = data.suggestedActions || [];
    this.txHash = data.txHash;
    this.destinationTxHash = data.destinationTxHash;
    this.cctpTransferId = data.cctpTransferId;
    this.error = data.error;
    this.email = data.email;
    this.note = data.note;
    this.completedAt = data.completedAt;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  toObject() {
    return {
      transferId: this.transferId,
      sender: this.sender,
      recipient: this.recipient,
      amount: this.amount,
      sourceChain: this.sourceChain,
      destinationChain: this.destinationChain,
      intent: this.intent,
      status: this.status,
      estimatedFees: this.estimatedFees,
      suggestedActions: this.suggestedActions,
      txHash: this.txHash,
      destinationTxHash: this.destinationTxHash,
      cctpTransferId: this.cctpTransferId,
      error: this.error,
      email: this.email,
      note: this.note,
      completedAt: this.completedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// Check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Transfer model with fallback
class TransferModel {
  static async create(data) {
    if (isMongoConnected()) {
      try {
        const Transfer = mongoose.model('Transfer', transferSchema);
        return await Transfer.create(data);
      } catch (error) {
        console.log('📝 MongoDB create failed, using in-memory storage');
        return this.createInMemory(data);
      }
    } else {
      console.log('📝 Using in-memory storage for transfer creation');
      return this.createInMemory(data);
    }
  }

  static createInMemory(data) {
    const transfer = new InMemoryTransfer(data);
    inMemoryTransfers.set(transfer.transferId, transfer);
    return transfer;
  }

  static async findOne(query) {
    if (isMongoConnected()) {
      try {
        const Transfer = mongoose.model('Transfer', transferSchema);
        return await Transfer.findOne(query);
      } catch (error) {
        console.log('📝 MongoDB findOne failed, using in-memory storage');
        return this.findOneInMemory(query);
      }
    } else {
      console.log('📝 Using in-memory storage for transfer lookup');
      return this.findOneInMemory(query);
    }
  }

  static findOneInMemory(query) {
    const transferId = query.transferId || query.cctpTransferId;
    return inMemoryTransfers.get(transferId) || null;
  }

  static async findOneAndUpdate(query, update, options = {}) {
    if (isMongoConnected()) {
      try {
        const Transfer = mongoose.model('Transfer', transferSchema);
        return await Transfer.findOneAndUpdate(query, update, options);
      } catch (error) {
        console.log('📝 MongoDB update failed, using in-memory storage');
        return this.findOneAndUpdateInMemory(query, update, options);
      }
    } else {
      console.log('📝 Using in-memory storage for transfer update');
      return this.findOneAndUpdateInMemory(query, update, options);
    }
  }

  static findOneAndUpdateInMemory(query, update, options = {}) {
    const transferId = query.transferId || query.cctpTransferId;
    const transfer = inMemoryTransfers.get(transferId);
    if (transfer) {
      Object.assign(transfer, update.$set || update);
      transfer.updatedAt = new Date();
      return options.new ? transfer : transfer;
    }
    return null;
  }

  static async find(query) {
    if (isMongoConnected()) {
      try {
        const Transfer = mongoose.model('Transfer', transferSchema);
        return await Transfer.find(query).sort({ createdAt: -1 });
      } catch (error) {
        console.log('📝 MongoDB find failed, using in-memory storage');
        return this.findInMemory(query);
      }
    } else {
      console.log('📝 Using in-memory storage for transfer search');
      return this.findInMemory(query);
    }
  }

  static findInMemory(query) {
    const transfers = Array.from(inMemoryTransfers.values());
    
    // Apply filters
    if (query.$or) {
      const conditions = query.$or;
      return transfers.filter(transfer => 
        conditions.some(condition => {
          if (condition.sender) return transfer.sender === condition.sender.toLowerCase();
          if (condition.recipient) return transfer.recipient === condition.recipient.toLowerCase();
          return false;
        })
      );
    }
    
    return transfers;
  }

  // Get transfer count for demo purposes
  static async count() {
    if (isMongoConnected()) {
      try {
        const Transfer = mongoose.model('Transfer', transferSchema);
        return await Transfer.countDocuments();
      } catch (error) {
        return inMemoryTransfers.size;
      }
    } else {
      return inMemoryTransfers.size;
    }
  }
}

// Export both the mongoose model and the fallback model
module.exports = {
  Transfer: TransferModel,
  transferSchema
}; 