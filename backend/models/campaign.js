const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  campaignId: { type: Number, required: true, unique: true }, // on-chain ID
  creator: { type: String, required: true },
  goal: { type: String, required: true }, // store as string to match on-chain wei
  deadline: { type: Number, required: true },
  amountCollected: { type: String, default: "0" }
});

module.exports = mongoose.model("Campaign", CampaignSchema);
