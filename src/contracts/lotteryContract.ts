import { ABI, CONFIG } from '@/config/constants';
import { useContractRead, usePrepareContractWrite } from 'wagmi';

export const useLotteryContract = () => {
  // Read contract data
  const { data: currentRoundIndex } = useContractRead({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'currentRoundIndex',
  });

  const { data: roundInfo, refetch: refetchRoundInfo } = useContractRead({
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

  // Prepare write functions
  const { config: buyTicketsConfig } = usePrepareContractWrite({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'buyTickets',
  });

  const { config: cancelRoundConfig } = usePrepareContractWrite({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'cancelRound',
  });

  const { config: endRoundConfig } = usePrepareContractWrite({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'endRound',
  });

  return {
    currentRoundIndex,
    roundInfo,
    ticketPrice,
    buyTicketsConfig,
    cancelRoundConfig,
    endRoundConfig,
    refetchRoundInfo,
  };
};

export const getContractConfig = () => ({
  address: CONFIG.CONTRACT_ADDRESS,
  abi: ABI,
});
