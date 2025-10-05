const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema(
{
  title: { type: String, required: true },
  description: { type: String },
  story: { type: String }, // detailed content (rich text or long description)
  image: { type: String }, // image URL or file path
  campaignId: { type: Number, required: true, unique: true }, // on-chain campaign ID
  creator: { type: String, required: true },
  goal: { type: String, required: true }, // store as string (wei)
  deadline: { type: Number, required: true },
  amountCollected: { type: String, default: "0" },
},
{ timestamps: true }
);

module.exports = mongoose.model("Campaign", CampaignSchema);
