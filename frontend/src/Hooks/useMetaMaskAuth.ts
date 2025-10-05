import { useState, useEffect } from "react";

export const useMetaMaskAuth = () => {
  const [account, setAccount] = useState<string | null>(null);

  const SEPOLIA_CHAIN_ID = "0xaa36a7"; // Sepolia chainId in hex

  const connectWallet = async () => {
    if (!(window as any).ethereum) return alert("MetaMask not detected");

    const provider = (window as any).ethereum;

    try {
      // Check current network
      const chainId = await provider.request({ method: "eth_chainId" });
      if (chainId !== SEPOLIA_CHAIN_ID) {
        try {
          // Request network switch
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
        } catch (switchError: any) {
          alert("Please switch your MetaMask network to Sepolia!");
          return;
        }
      }

      // Request accounts
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  useEffect(() => {
    const checkWallet = async () => {
      if (!(window as any).ethereum) return;
      const accounts = await (window as any).ethereum.request({ method: "eth_accounts" });
      if (accounts.length) setAccount(accounts[0]);
    };
    checkWallet();
  }, []);

  return { account, connectWallet };
};
