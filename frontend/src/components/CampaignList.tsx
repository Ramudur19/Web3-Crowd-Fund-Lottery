import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Campaign } from "../types";
import { formatEther, parseEther, ethers } from "ethers";
import "./CampaignList.css";

const CampaignList: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [fundAmounts, setFundAmounts] = useState<{ [key: number]: string }>({});
  const [isFunding, setIsFunding] = useState<{ [key: number]: boolean }>({});
  const backendURL = api.defaults.baseURL;

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await api.get("/api/campaigns");
        setCampaigns(res.data);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      }
    };
    fetchCampaigns();
  }, []);

  const handleInputChange = (id: number, value: string) => {
    setFundAmounts(prev => ({ ...prev, [id]: value }));
  };

  const handleFund = async (campaignId: number) => {
    try {
      setIsFunding(prev => ({ ...prev, [campaignId]: true }));

      if (!window.ethereum) {
        alert("Please connect your MetaMask wallet.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractAddress = "0x58103e73f3B8E6ACD439684B26F2303fFD22F39A";
      const contractABI = [
        "function fundCampaign(uint256 campaignId) public payable",
      ];

      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const amount = fundAmounts[campaignId] || "0";

      const tx = await contract.fundCampaign(campaignId, {
        value: parseEther(amount),
      });

      await tx.wait();

      alert(`Successfully funded ${amount} ETH to campaign #${campaignId}`);
    } catch (err) {
      console.error(err);
      alert("Funding failed. Check console for details.");
    } finally {
      setIsFunding(prev => ({ ...prev, [campaignId]: false }));
    }
  };

  return (
    <div className="campaign-page">
      <h2 className="campaign-title">Active Fundraising Campaigns</h2>

      {campaigns.length === 0 && (
        <p className="no-campaigns">No campaigns yet. 🌱</p>
      )}

      <div className="campaign-grid">
        {campaigns.map(c => (
          <div key={c.campaignId} className="campaign-card">
            {c.image && (
              <img
                src={`${backendURL}${c.image}`}
                alt={c.title}
                className="campaign-image"
              />
            )}

            <h3 className="campaign-name">{c.title}</h3>
            <p className="campaign-description">{c.description}</p>

            <div className="campaign-info">
              <p><strong>Goal:</strong> {formatEther(c.goal)} ETH</p>
              <p><strong>Collected:</strong> {formatEther(c.amountCollected || "0")} ETH</p>
              <p><strong>Deadline:</strong> {new Date(Number(c.deadline) * 1000).toLocaleDateString()}</p>
              <p><strong>Creator:</strong> {c.creator.slice(0, 6)}...{c.creator.slice(-4)}</p>
            </div>

            <details className="campaign-story">
              <summary>📖 View Story</summary>
              <p>{c.story || "No story provided."}</p>
            </details>

            <div className="fund-box">
              <input
                type="number"
                step="0.001"
                placeholder="0.01 ETH"
                value={fundAmounts[c.campaignId] || ""}
                onChange={e => handleInputChange(c.campaignId, e.target.value)}
                className="fund-input"
              />
              <button
                onClick={() => handleFund(c.campaignId)}
                disabled={isFunding[c.campaignId]}
                className={`fund-button ${isFunding[c.campaignId] ? "disabled" : ""}`}
              >
                {isFunding[c.campaignId] ? "Funding..." : "Fund Now 💸"}
              </button>
            </div>

            <div className="glow-orb" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignList;
