import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Campaign } from "../types";
import { formatEther } from "ethers";

const CampaignList: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    api.get("/campaigns").then(res => setCampaigns(res.data));
  }, []);

  return (
    <div>
      <h2>All Campaigns</h2>
      {campaigns.map(c => (
        <div key={c.campaignId} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
          <h3>{c.title}</h3>
          <p>{c.description}</p>
          <p>Goal: {formatEther(c.goal)} ETH</p>
          <p>Collected: {formatEther(c.amountCollected)} ETH</p>
          <p>Deadline: {new Date(c.deadline * 1000).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default CampaignList;
