const mongoose = require("mongoose");
const betSchema = new mongoose.Schema(
  {
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bet_size: { type: Number },
    bet_line: { type: Number },
    bet_amount: { type: Number },
    bet_level: { type: Number },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, collection: "bet" }
);

module.exports = mongoose.model("Bet", betSchema);
