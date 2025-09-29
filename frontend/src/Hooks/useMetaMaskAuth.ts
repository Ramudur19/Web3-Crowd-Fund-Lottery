import { useState } from "react";
import { BrowserProvider } from "ethers";

export const useMetaMaskAuth = () => {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (!(window as any).ethereum) {
      alert("MetaMask not detected. Please install it.");
      return;
    }

    try {
      const provider = new BrowserProvider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAccount(addr);
    } catch (error) {
      console.error("MetaMask connection failed:", error);
    }
  };

  return { account, connectWallet };
};