const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  username: String,
  type: String, // success, fail, logout
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Log", logSchema);