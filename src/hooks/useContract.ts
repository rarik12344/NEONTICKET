import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { CONFIG, ABI } from '@/config/constants';
import { Address } from 'viem';

export const useLotteryContract = () => {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  // Чтение данных с контракта
  const { data: currentRound } = useReadContract({
    abi: ABI,
    address: CONFIG.CONTRACT_ADDRESS,
    functionName: 'currentRoundIndex',
  });

  const { data: ticketPrice } = useReadContract({
    abi: ABI,
    address: CONFIG.CONTRACT_ADDRESS,
    functionName: 'ticketPriceETH',
  });

  const { data: roundInfo } = useReadContract({
    abi: ABI,
    address: CONFIG.CONTRACT_ADDRESS,
    functionName: 'getCurrentRoundInfo',
  });

  // Запись в контракт
  const buyTickets = async (ticketAmount: number) => {
    if (!ticketPrice) return;
    
    const totalPrice = BigInt(ticketAmount) * ticketPrice;
    return writeContract({
      address: CONFIG.CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'buyTickets',
      args: [ticketAmount],
      value: totalPrice,
    });
  };

  const cancelRound = () => writeContract({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'cancelRound',
  });

  const endRound = () => writeContract({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'endRound',
  });

  const startRound = () => writeContract({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'startRound',
  });

  return {
    address,
    currentRound,
    ticketPrice,
    roundInfo,
    buyTickets,
    cancelRound,
    endRound,
    startRound,
  };
};
