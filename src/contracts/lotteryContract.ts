import { Lottery } from '@/types';
import ABI from './lottery-abi.json';
import { Address, useContractWrite, usePrepareContractWrite } from 'wagmi';

export const useLotteryContract = (contractAddress: Address): Lottery => {
  const { config: buyTicketsConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi: ABI,
    functionName: 'buyTickets',
  });

  const { config: cancelRoundConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi: ABI,
    functionName: 'cancelRound',
  });

  const { config: claimPrizeConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi: ABI,
    functionName: 'endRound', // Изменил на endRound согласно ABI
  });

  const { write: buyTickets } = useContractWrite(buyTicketsConfig);
  const { write: cancelRound } = useContractWrite(cancelRoundConfig);
  const { write: claimPrize } = useContractWrite(claimPrizeConfig);

  return {
    buyTickets: (ticketAmount: number, ticketPrice: number) => {
      return buyTickets?.({
        args: [ticketAmount],
        value: BigInt(Math.floor(ticketPrice * ticketAmount)),
      });
    },
    cancelRound: () => cancelRound?.(),
    claimPrize: () => claimPrize?.(),
  };
};
