import { useState, useEffect } from 'react';
import { CONFIG } from '../config';

export const useEthPrice = () => {
  const [ethPrice, setEthPrice] = useState<number>(CONFIG.ethPriceUSD);

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        );
        const data = await response.json();
        setEthPrice(data.ethereum.usd);
      } catch (error) {
        console.error('Failed to fetch ETH price:', error);
        // Используем значение по умолчанию из CONFIG
      }
    };

    fetchEthPrice();
  }, []);

  return { ethPrice };
};

export default useEthPrice;
