import { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { ABI, CONFIG } from '@/config/constants';

export const useLotteryContract = () => {
  const { address } = useAccount();
  const [currentRound, setCurrentRound] = useState<any>(null);
  const [userTickets, setUserTickets] = useState<number>(0);

  // Чтение данных контракта
  const { data: currentRoundIndex } = useContractRead({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'currentRoundIndex',
  });

  const { data: roundInfo } = useContractRead({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getCurrentRoundInfo',
    watch: true,
  });

  const { data: ticketPrice } = useContractRead({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'ticketPriceETH',
  });

  // Подготовка транзакции покупки билетов
  const { config: buyTicketsConfig } = usePrepareContractWrite({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'buyTickets',
  });

  const { write: buyTickets } = useContractWrite(buyTicketsConfig);

  // Обновление состояния текущего раунда
  useEffect(() => {
    if (roundInfo) {
      setCurrentRound({
        endTime: Number(roundInfo[1]),
        prizePool: roundInfo[2],
        participantsCount: Number(roundInfo[3]),
      });
    }
  }, [roundInfo]);

  // Получение билетов пользователя
  useEffect(() => {
    const fetchUserTickets = async () => {
      if (!address || !currentRoundIndex) return;
      
      // Здесь должна быть логика получения билетов пользователя
      // Это сложная операция, возможно потребуется The Graph или другой индексер
      setUserTickets(0); // Временное значение
    };

    fetchUserTickets();
  }, [address, currentRoundIndex]);

  return {
    currentRound,
    ticketPrice,
    userTickets,
    buyTickets,
  };
};
