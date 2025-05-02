import React from 'react';
import { useContractRead } from 'wagmi';
import { ABI, CONFIG } from '@/config/constants';
import { Countdown } from './Countdown';

interface LotteryInfoProps {
  currentRound: {
    endTime: number;
    prizePool: bigint;
    participantsCount: number;
  } | null;
  ticketPrice: bigint | undefined;
  userTickets: number;
  isConnected: boolean;
}

export const LotteryInfo: React.FC<LotteryInfoProps> = ({
  currentRound,
  ticketPrice,
  userTickets,
  isConnected
}) => {
  const { data: currentRoundIndex } = useContractRead({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'currentRoundIndex',
  });

  return (
    <div className="space-y-3 mb-6">
      {currentRound ? (
        <>
          <Countdown endTime={currentRound.endTime} />
          <p className={`text-sm text-center mb-5 ${
            currentRound.endTime - Math.floor(Date.now() / 1000) < 3600 
              ? 'text-neon-pink text-shadow-neon-pink' 
              : 'text-text-secondary'
          }`}>
            {currentRound.endTime > Math.floor(Date.now() / 1000) 
              ? 'Round Active' 
              : 'Round Ended - Next round starting'}
          </p>
        </>
      ) : (
        <div className="text-center py-8">Loading round info...</div>
      )}

      <div className="flex justify-between items-center bg-black/25 p-3 rounded-xl border border-white/10 text-sm">
        <span className="text-text-secondary flex items-center gap-1">
          <span>🎟️ Ticket Price:</span>
        </span>
        <span>
          {ticketPrice ? `${(Number(ticketPrice) / 1e18).toFixed(6)} ETH` : 'Loading...'}
        </span>
      </div>

      <div className="flex justify-between items-center bg-black/25 p-3 rounded-xl border border-white/10 text-sm">
        <span className="text-text-secondary flex items-center gap-1">
          <span>💰 Current Pool:</span>
        </span>
        <span>
          {currentRound?.prizePool ? `${(Number(currentRound.prizePool) / 1e18).toFixed(4)} ETH` : 'Loading...'}
        </span>
      </div>

      {isConnected && (
        <div className="flex justify-between items-center bg-black/25 p-3 rounded-xl border border-white/10 text-sm">
          <span className="text-text-secondary flex items-center gap-1">
            <span>👤 Your Tickets:</span>
          </span>
          <span>{userTickets}</span>
        </div>
      )}
    </div>
  );
};
