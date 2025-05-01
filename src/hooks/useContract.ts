// src/hooks/useContract.ts
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../config';

export const useWeb3 = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<any>(null); // Используйте конкретный тип контракта, если есть

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return [];
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const web3Instance = new Web3(window.ethereum);
      const contractInstance = new web3Instance.eth.Contract(
        CONTRACT_ABI as AbiItem[],
        CONTRACT_ADDRESS
      );

      setWeb3(web3Instance);
      setContract(contractInstance);
      setAccount(accounts[0]);
      
      return accounts;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      return [];
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setWeb3(null);
    setContract(null);
  };

  // Проверяем подключенный кошелек при загрузке
  useEffect(() => {
    const checkConnectedWallet = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          connectWallet();
        }
      }
    };

    checkConnectedWallet();
  }, []);

  return {
    web3,
    account,
    contract,
    connectWallet,
    disconnectWallet
  };
};
