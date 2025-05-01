import { ethers } from "ethers";
import { CONFIG } from "../config";

export const useContract = () => {
  const getProvider = () => {
    // Для серверного рендеринга
    if (typeof window === "undefined") {
      return new ethers.providers.JsonRpcProvider(CONFIG.baseRpcUrl);
    }

    // Для клиентского рендеринга
    const ethereum = (window as any).ethereum;
    
    if (ethereum) {
      // Явное приведение типа для совместимости с ethers.js
      return new ethers.providers.Web3Provider(
        ethereum as ethers.providers.ExternalProvider
      );
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
