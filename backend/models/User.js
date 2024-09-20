const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    u_id: {
      type: String,
      unique: true,
    },
    contact: { type: String, required: true },
    password: {
      type: String,
    },
    email: {
      type: String,
      unique:true
    },
    balance: {
      type: Number,
      default:0
    },
    resetOtp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    status: {
      type: Number,
      default: 1, // Tinyint equivalent
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, collection: "user" }
);

module.exports = mongoose.model("user", UserSchema);
