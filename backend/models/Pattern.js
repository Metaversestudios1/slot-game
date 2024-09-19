const mongoose = require('mongoose');

const PatternSchema = new mongoose.Schema({
  symbol: {
    type: [String],//symbol _id from symbol table
    required: true,
  },
  patternType: {
    type: String,  // e.g., 'horizontal', 'vertical', 'diagonal', 'custom'
    required: true,
  },
  coordinates: {
    type: [[Number]],  // An array of arrays representing the grid positions that must match
    required: true,//Example: [[0, 0], [0, 1], [0, 2]]
  },
  minMatchesRequired: {
    type: Number,  // Minimum number of matching symbols for the win
    default: 3,  // Typically 3 symbols in a row
  },
  win_amount: {
    type: Number,  // Multiplier applied to the bet amount for this pattern
    required: true,//from symbol tale
  },
  description: {
    type: String,
    default: '',  // Optional description of the pattern
  },
}, { timestamps: true, collection: "pattern" });

module.exports = mongoose.model('Pattern', PatternSchema);

