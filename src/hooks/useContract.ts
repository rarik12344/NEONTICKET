import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONFIG } from '../config';

export const useContract = () => {
  const [contract, setContract] = useState<any>(null);
  const [web3, setWeb3] = useState<any>(null);

  useEffect(() => {
    const initContract = async () => {
      try {
        let provider;
        
        if (typeof window !== 'undefined' && window.ethereum) {
          provider = new ethers.providers.Web3Provider(window.ethereum);
        } else {
          provider = new ethers.providers.JsonRpcProvider(CONFIG.baseRpcUrl);
        }
        
        const lotteryContract = new ethers.Contract(
          CONFIG.contractAddress,
          CONFIG.contractAbi,
          provider
        );
        
        setContract(lotteryContract);
        setWeb3(provider);
      } catch (error) {
        console.error("Error initializing contract:", error);
      }
    };

    initContract();
  }, []);

  return { contract, web3 };
};
