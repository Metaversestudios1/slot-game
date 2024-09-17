
const mongoose = require("mongoose");

const SymbolSchema = new mongoose.Schema(
  {
    symbol: {
        type: String,
      },
     value: {
      type: Number,
    },
   symbol_type:{
    type: String  
    },
    // Type of symbol (e.g., "fruit", "wild")
    rarity: {
        type: String,//determines frquency of apperance
    },
    game_id:{
      type:String,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, collection: "symbol" }
);

module.exports = mongoose.model("Symbol", SymbolSchema);
