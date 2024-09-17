const mongoose = require("mongoose")
const gameSchema = new mongoose.Schema({
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    betAmount: { type: Number, required: true },
    payout: { type: Number },
    result: { type: String, enum: ['win', 'lose'], required: true },
    symbols: { type: [String], required: true },  // Stores 3 symbols (e.g., ['🍒', '🍒', '🍒'])
    timestamp: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Game', gameSchema);