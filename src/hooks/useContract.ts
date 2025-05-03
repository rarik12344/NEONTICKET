import { useReadContract, useWriteContract } from 'wagmi';
import { Address } from 'viem';
import { ABI, CONFIG } from '@/config/constants';

export const useLotteryContract = () => {
  const { writeContract } = useWriteContract();

  // Чтение текущего раунда
  const { data: currentRound } = useReadContract({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'currentRoundIndex',
  });

  // Чтение цены билета
  const { data: ticketPrice } = useReadContract({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'ticketPriceETH',
  });

  // Чтение информации о раунде
  const { data: roundInfo } = useReadContract({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getCurrentRoundInfo',
  });

  // Покупка билетов
  const buyTickets = async (ticketAmount: number) => {
    if (!ticketPrice) return;
    
    return writeContract({
      address: CONFIG.CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'buyTickets',
      args: [BigInt(ticketAmount)],
      value: BigInt(ticketAmount) * BigInt(ticketPrice as bigint),
    });
  };

  // Отмена раунда
  const cancelRound = async () => {
    return writeContract({
      address: CONFIG.CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'cancelRound',
    });
  };

  // Завершение раунда
  const endRound = async () => {
    return writeContract({
      address: CONFIG.CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'endRound',
    });
  };

  // Старт нового раунда
  const startRound = async () => {
    return writeContract({
      address: CONFIG.CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'startRound',
    });
  };

  return {
    currentRound: currentRound as bigint | undefined,
    ticketPrice: ticketPrice as bigint | undefined,
    roundInfo,
    buyTickets,
    cancelRound,
    endRound,
    startRound,
  };
};
