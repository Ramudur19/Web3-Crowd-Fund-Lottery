import { useState, useEffect } from "react";
import { BrowserProvider, Contract, Signer } from "ethers";

// Directly adding ABI here will create saperate file later
const CrowdFundingABI = [
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
  export const useCrowdFunding = (account: string | null) => {
    const [contract, setContract] = useState<Contract | null>(null);
    const [signer, setSigner] = useState<Signer | null>(null);
  
    useEffect(() => {
      const setupContract = async () => {
        if (!account || !(window as any).ethereum) return;
  
        const provider = new BrowserProvider(window.ethereum);
        const signerInstance = await provider.getSigner();
        setSigner(signerInstance);
  
        const contractAddress = "0x58103e73f3B8E6ACD439684B26F2303fFD22F39A"; // replace with your deployed contract
        const c = new Contract(contractAddress, CrowdFundingABI, signerInstance);
        setContract(c);
      };
  
      setupContract();
    }, [account]);
  
    return { contract, signer };
  };
