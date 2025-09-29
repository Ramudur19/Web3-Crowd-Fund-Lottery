import { useState, useEffect } from "react";
import { BrowserProvider, Contract, AbstractSigner } from "ethers";
//import CrowdFundingABI from "./CrowdFunding.json";

const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

export const useCrowdFunding = () => {
  const [contract, setContract] = useState<Contract | null>(null);
  const [signer, setSigner] = useState<AbstractSigner | null>(null);

  useEffect(() => {
    if (!window.ethereum) return;

    const provider = new BrowserProvider(window.ethereum as any);
    provider.getSigner().then(s => setSigner(s));

    //const c = new Contract(CONTRACT_ADDRESS, CrowdFundingABI, provider);
    //setContract(c);
  }, []);

  return { contract, signer };
};
