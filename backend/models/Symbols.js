const mongoose = require("mongoose");

const SymbolSchema = new mongoose.Schema(
  {
    symbol_name: {
      type: String,
    },
    win_amount: {
      type: Number,
    },
    win_percentage: {type: String},
    rarity: {
      type: String, //determines frquency of apperance
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, collection: "symbol" }
);

module.exports = mongoose.model("Symbol", SymbolSchema);
