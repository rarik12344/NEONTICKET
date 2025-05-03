import { Countdown } from './Countdown';

interface RoundData {
  endTime: number; // UNIX timestamp в секундах
  prizePool: string;
  ticketsSold: number;
  winnerAddress?: string;
}

interface LotteryInfoProps {
  currentRound?: RoundData;
  onRoundEnd?: () => void;
}

export const LotteryInfo = ({ currentRound, onRoundEnd }: LotteryInfoProps) => {
  // Конвертируем UNIX timestamp (секунды) в Date
  const endDate = currentRound ? new Date(currentRound.endTime * 1000) : null;

  // Проверяем, осталось ли меньше часа до конца раунда
  const isLessThanOneHour = currentRound 
    ? currentRound.endTime - Math.floor(Date.now() / 1000) < 3600
    : false;

  return (
    <div className="lottery-info">
      {currentRound && endDate ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="info-card">
              <h3>Prize Pool</h3>
              <p className="text-neon-green">{currentRound.prizePool} ETH</p>
            </div>
            <div className="info-card">
              <h3>Tickets Sold</h3>
              <p>{currentRound.ticketsSold.toLocaleString()}</p>
            </div>
          </div>

          <div className="countdown-section">
            <h2>Time Remaining</h2>
            <Countdown 
              targetDate={endDate} 
              onComplete={onRoundEnd} 
            />
            {isLessThanOneHour && (
              <p className="text-neon-pink text-shadow-neon-pink mt-2">
                Less than 1 hour remaining!
              </p>
            )}
          </div>

          {currentRound.winnerAddress && (
            <div className="winner-section">
              <h2>Winner</h2>
              <p className="text-neon-blue">
                {`${currentRound.winnerAddress.slice(0, 6)}...${currentRound.winnerAddress.slice(-4)}`}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="no-active-round">
          <h2>No Active Round</h2>
          <p>Check back later for the next lottery round</p>
        </div>
      )}
    </div>
  );
};
