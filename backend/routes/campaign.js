const express = require("express");
const router = express.Router();
const Campaign = require("../models/campaign");

// Get all campaigns
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single campaign by campaignId
router.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ campaignId: req.params.id });
    if (!campaign) return res.status(404).json({ msg: "Not found" });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a campaign (store metadata)
router.post("/", async (req, res) => {
  try {
    const { title, description, image, campaignId, creator, goal, deadline } = req.body;
    const newCampaign = new Campaign({ title, description, image, campaignId, creator, goal, deadline });
    await newCampaign.save();
    res.status(201).json(newCampaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
