const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Campaign = require("../models/campaign");

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Create a new campaign
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, story, campaignId, creator, goal, deadline } = req.body;

    const newCampaign = new Campaign({
      title,
      description,
      story,
      campaignId,
      creator,
      goal,
      deadline,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newCampaign.save();
    res.status(201).json({ message: "Campaign created successfully", campaign: newCampaign });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while creating campaign" });
  }
});

// Get all campaigns
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while fetching campaigns" });
  }
});

// Get single campaign by ID
router.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });
    res.json(campaign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /campaigns/creator/:address
router.get("/creator/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const campaigns = await Campaign.find({
      creator: { $regex: new RegExp(`^${address}$`, "i") }
    }).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
