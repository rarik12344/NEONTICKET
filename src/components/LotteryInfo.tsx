import { CONFIG } from '../config';

interface LotteryInfoProps {
  currentPool: string;
  ticketPrice: string;
}

export default function LotteryInfo({ currentPool, ticketPrice }: LotteryInfoProps) {
  return (
    <div className="space-y-2 my-4">
      <div className="flex justify-between">
        <span>Current Pool:</span>
        <span>{currentPool} {CONFIG.currencySymbol}</span>
      </div>
      <div className="flex justify-between">
        <span>Ticket Price:</span>
        <span>{ticketPrice} {CONFIG.currencySymbol}</span>
      </div>
    </div>
  );
}
