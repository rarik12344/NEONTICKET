// src/hooks/useContract.ts
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../config';

export const useContract = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask!');
    }

    try {
      // Инициализация провайдера
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);

      // Запрос доступа к аккаунтам
      const accounts = await web3Provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);

      // Получаем подписывающего (signer)
      const web3Signer = web3Provider.getSigner();
      setSigner(web3Signer);

      // Инициализация контракта
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        web3Signer
      );
      setContract(contractInstance);

      return { provider: web3Provider, signer: web3Signer, contract: contractInstance, account: accounts[0] };
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  };

  // Проверяем подключенный кошелек при загрузке
  useEffect(() => {
    const checkConnectedWallet = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const signer = provider.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
          setProvider(provider);
          setSigner(signer);
          setContract(contract);
          setAccount(accounts[0]);
        }
      }
    };

    checkConnectedWallet();
  }, []);

  return {
    provider,
    signer,
    contract,
    account,
    connectWallet,
  };
};
