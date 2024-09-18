const mongoose = require("mongoose");
const GameHistorySchema = new mongoose.Schema(
  {
    userId: {type: String},
    game_id: { type: String, required: true },
    game_time: { type: String, required: true },
    bet: { type: String },
    profit: { type: String },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, collection: "gamehistory" }
);

module.exports = mongoose.model("GameHistory", GameHistorySchema);