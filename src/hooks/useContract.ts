import { useReadContract, useWriteContract } from 'wagmi';
import { Address } from 'viem';
import { ABI, CONFIG } from '@/config/constants';

interface RoundInfo {
  endTime: bigint;
  prizePool: bigint;
  ticketsSold: bigint;
  winner: Address;
}

export const useLotteryContract = () => {
  const { writeContract } = useWriteContract();

  // Чтение данных
  const { data: currentRound } = useReadContract({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'currentRoundIndex',
  });

  const { data: ticketPrice } = useReadContract({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'ticketPriceETH',
  });

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

  // Административные функции
  const cancelRound = async () => {
    return writeContract({
      address: CONFIG.CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'cancelRound',
    });
  };

  const endRound = async () => {
    return writeContract({
      address: CONFIG.CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'endRound',
    });
  };

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
    roundInfo: roundInfo as RoundInfo | undefined,
    buyTickets,
    cancelRound,
    endRound,
    startRound,
  };
};
