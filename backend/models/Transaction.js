const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      unique: true,
    },
    transaction_type: { type: String, required: true },
    amount: {
      type: Number,
    },
    transaction_status: {
      type: String,
      unique:true
    },
    game_id:{
      type:String,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, collection: "transaction" }
);

module.exports = mongoose.model("Transaction", TransactionSchema);

