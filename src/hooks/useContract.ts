import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { ABI, CONFIG } from '@/config/constants';
import { Address } from 'viem';

export const useLotteryContract = () => {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  
  // Пример использования useReadContract
  const { data: currentRound } = useReadContract({
    abi: ABI,
    address: CONFIG.contractAddress,
    functionName: 'currentRoundIndex',
  });

  const buyTickets = async (ticketAmount: number, ticketPrice: bigint) => {
    try {
      await writeContract({
        address: CONFIG.contractAddress,
        abi: ABI,
        functionName: 'buyTickets',
        args: [BigInt(ticketAmount)],
        value: ticketPrice * BigInt(ticketAmount),
      });
    } catch (error) {
      console.error('Error buying tickets:', error);
    }
  };

  const cancelRound = async () => {
    try {
      await writeContract({
        address: CONFIG.contractAddress,
        abi: ABI,
        functionName: 'cancelRound',
      });
    } catch (error) {
      console.error('Error canceling round:', error);
    }
  };

  const endRound = async () => {
    try {
      await writeContract({
        address: CONFIG.contractAddress,
        abi: ABI,
        functionName: 'endRound',
      });
    } catch (error) {
      console.error('Error ending round:', error);
    }
  };

  return {
    address,
    currentRound,
    buyTickets,
    cancelRound,
    endRound,
  };
};
