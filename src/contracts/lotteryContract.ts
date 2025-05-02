import { Lottery } from '@/types';
import ABI from './lottery-abi.json';
import { Address, useContractWrite, usePrepareContractWrite } from 'wagmi';

export const useLotteryContract = (contractAddress: Address): Lottery => {
  const { config: buyTicketsConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi: ABI,
    functionName: 'buyTickets',
    args: [Number(ticketAmount)], // Изменено с BigInt на Number
    value: Number(ticketPrice) * ticketAmount, // Изменено с BigInt на Number
  });

  const { config: cancelRoundConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi: ABI,
    functionName: 'cancelRound',
  });

  const { config: claimPrizeConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi: ABI,
    functionName: 'claimPrize',
  });

  const { write: buyTickets } = useContractWrite(buyTicketsConfig);
  const { write: cancelRound } = useContractWrite(cancelRoundConfig);
  const { write: claimPrize } = useContractWrite(claimPrizeConfig);

  return {
    buyTickets: (ticketAmount: number, ticketPrice: number) => buyTickets?.({
      args: [Number(ticketAmount)], // Изменено с BigInt на Number
      value: Number(ticketPrice) * ticketAmount, // Изменено с BigInt на Number
    }),
    cancelRound,
    claimPrize,
  };
};
