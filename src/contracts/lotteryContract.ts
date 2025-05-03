import { Lottery } from '@/types';
import ABI from './lottery-abi.json';
import { useWriteContract } from 'wagmi';
import { Address } from 'viem';

export const useLotteryContract = (contractAddress: Address): Lottery => {
  const { writeContract: buyTickets } = useWriteContract();
  const { writeContract: cancelRound } = useWriteContract();
  const { writeContract: endRound } = useWriteContract();

  return {
    buyTickets: (ticketAmount: number, ticketPrice: number) => {
      return buyTickets({
        address: contractAddress,
        abi: ABI,
        functionName: 'buyTickets',
        args: [BigInt(ticketAmount)],
        value: BigInt(Math.floor(ticketPrice * ticketAmount)),
      });
    },
    cancelRound: () => cancelRound({
      address: contractAddress,
      abi: ABI,
      functionName: 'cancelRound',
    }),
    claimPrize: () => endRound({
      address: contractAddress,
      abi: ABI,
      functionName: 'endRound',
    }),
  };
};
