import { ethers } from "ethers";
import { CONFIG } from "../config";

export const useContract = () => {
  const getProvider = () => {
    if (typeof window === "undefined") {
      return new ethers.providers.JsonRpcProvider(CONFIG.baseRpcUrl);
    }

    if (window.ethereum) {
      return new ethers.providers.Web3Provider(window.ethereum);
    }
    
    return new ethers.providers.JsonRpcProvider(CONFIG.baseRpcUrl);
  };

  const provider = getProvider();
  const contract = new ethers.Contract(
    CONFIG.contractAddress,
    CONFIG.contractAbi,
    provider
  );

  return { contract, provider };
};
