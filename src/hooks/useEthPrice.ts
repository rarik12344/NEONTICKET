import { useEffect, useState } from 'react';

export const useEthPrice = () => {
  const [ethPrice, setEthPrice] = useState<number>(0);

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        );
        const data = await response.json();
        setEthPrice(data.ethereum.usd);
      } catch (error) {
        console.error('Error fetching ETH price:', error);
      }
    };

    fetchEthPrice();
    const interval = setInterval(fetchEthPrice, 60000); // Обновлять каждую минуту

    return () => clearInterval(interval);
  }, []);

  return ethPrice;
};
