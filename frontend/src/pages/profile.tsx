import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { api } from "../api/axios";
import "./profile.css";

const contractABI = [
    {
      "type": "function",
      "name": "campaignCount",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "campaigns",
      "inputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        { "name": "creator", "type": "address", "internalType": "address" },
        { "name": "goal", "type": "uint256", "internalType": "uint256" },
        { "name": "deadline", "type": "uint256", "internalType": "uint256" },
        { "name": "amountCollected", "type": "uint256", "internalType": "uint256" },
        { "name": "withdrawn", "type": "bool", "internalType": "bool" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "contributions",
      "inputs": [
        { "name": "", "type": "uint256", "internalType": "uint256" },
        { "name": "", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "createCampaign",
      "inputs": [
        { "name": "_goal", "type": "uint256", "internalType": "uint256" },
        { "name": "_durationInDays", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "fundCampaign",
      "inputs": [
        { "name": "_id", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "refundFunds",
      "inputs": [
        { "name": "_id", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "withdrawFunds",
      "inputs": [
        { "name": "_id", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "ChampaignCreated",
      "inputs": [
        { "name": "id", "type": "uint256", "indexed": false, "internalType": "uint256" },
        { "name": "creator", "type": "address", "indexed": false, "internalType": "address" },
        { "name": "goal", "type": "uint256", "indexed": false, "internalType": "uint256" },
        { "name": "deadline", "type": "uint256", "indexed": false, "internalType": "uint256" }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ChampaignFunded",
      "inputs": [
        { "name": "id", "type": "uint256", "indexed": false, "internalType": "uint256" },
        { "name": "funder", "type": "address", "indexed": false, "internalType": "address" },
        { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ChampaignRefunded",
      "inputs": [
        { "name": "id", "type": "uint256", "indexed": false, "internalType": "uint256" },
        { "name": "funder", "type": "address", "indexed": false, "internalType": "address" },
        { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ChampaignWithdrawn",
      "inputs": [
        { "name": "id", "type": "uint256", "indexed": false, "internalType": "uint256" },
        { "name": "creator", "type": "address", "indexed": false, "internalType": "address" },
        { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
      ],
      "anonymous": false
    }
  ]; 

const CONTRACT_ADDRESS = "0x58103e73f3B8E6ACD439684B26F2303fFD22F39A"; // update this

interface Campaign {
  _id: string;
  campaignId: number;
  title: string;
  goal: string;
  amountCollected: string;
  deadline: number;
  withdrawn?: boolean;
}

const Profile: React.FC = () => {
  const [address, setAddress] = useState("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const getAddress = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);
      return addr;
    }
    return "";
  };

  const fetchCampaigns = async (addr: string) => {
    try {
      const res = await api.get(`/campaigns/creator/${addr}`);
      setCampaigns(res.data);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (campaignId: number) => {
    try {
      if (!window.ethereum) return alert("Please connect wallet");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      const tx = await contract.withdrawFunds(campaignId);
      await tx.wait();

      alert("Funds withdrawn successfully!");
      fetchCampaigns(address);
    } catch (err: any) {
      console.error(err);
      alert(err.reason || "Withdraw failed");
    }
  };

  useEffect(() => {
    (async () => {
      const addr = await getAddress();
      if (addr) await fetchCampaigns(addr);
    })();
  }, []);

  return (
    <div className="profile-container">
      <h2 className="profile-heading">👤 My Profile</h2>

      {address && <p className="wallet-address">Wallet: {address}</p>}

      {loading ? (
        <p>Loading your campaigns...</p>
      ) : campaigns.length === 0 ? (
        <p>No campaigns created yet.</p>
      ) : (
        <div className="campaigns-grid">
          {campaigns.map(c => (
            <div key={c._id} className="campaign-card">
              <h3>{c.title}</h3>
              <p><strong>Goal:</strong> {ethers.formatEther(c.goal)} ETH</p>
              <p><strong>Collected:</strong> {ethers.formatEther(c.amountCollected)} ETH</p>
              <p><strong>Deadline:</strong> {new Date(Number(c.deadline) * 1000).toLocaleDateString()}</p>

              {Number(c.amountCollected) > 0 && !c.withdrawn && (
                <button
                  className="withdraw-btn"
                  onClick={() => handleWithdraw(c.campaignId)}
                >
                  Withdraw Funds
                </button>
              )}
              {c.withdrawn && <p className="withdrawn-text">Withdrawn</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
