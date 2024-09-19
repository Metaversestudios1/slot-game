const mongoose = require("mongoose")
const GlobalGameSchema = new mongoose.Schema({
        gameId: { type: mongoose.Schema.Types.ObjectId, required: true },
        win_percentage: {type: String},
        win_amount: {type: Number},
  });
  
  module.exports = mongoose.model('GlobalGame', GlobalGameSchema);