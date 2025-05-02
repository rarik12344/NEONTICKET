import { ABI, CONFIG } from '@/config/constants';
import { useReadContract, useWriteContract } from 'wagmi';

export const useLotteryContract = () => {
  // Read contract data
  const { data: currentRoundIndex } = useReadContract({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'currentRoundIndex',
  });

  const { data: roundInfo, refetch: refetchRoundInfo } = useReadContract({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getCurrentRoundInfo',
  });

  const { data: ticketPrice } = useReadContract({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'ticketPriceETH',
  });

  // Write functions
  const { writeContract: buyTickets } = useWriteContract();
  const { writeContract: cancelRound } = useWriteContract();
  const { writeContract: endRound } = useWriteContract();

  return {
    currentRoundIndex,
    roundInfo,
    ticketPrice,
    buyTickets: (ticketAmount: number) => buyTickets({
      address: CONFIG.CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'buyTickets',
      args: [BigInt(ticketAmount)],
      value: BigInt(Number(ticketPrice) * ticketAmount),
    }),
    cancelRound: () => cancelRound({
      address: CONFIG.CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'cancelRound',
    }),
    endRound: () => endRound({
      address: CONFIG.CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'endRound',
    }),
    refetchRoundInfo,
  };
};
