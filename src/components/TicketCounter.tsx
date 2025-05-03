import { useState } from 'react';
import { useLotteryContract } from '@/hooks/useContract';

export const TicketCounter = () => {
  const [ticketAmount, setTicketAmount] = useState(1);
  const { buyTickets, ticketPrice } = useLotteryContract();

  const handleBuy = async () => {
    try {
      await buyTickets(ticketAmount);
      alert('Tickets purchased successfully!');
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to purchase tickets');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setTicketAmount(prev => Math.max(1, prev - 1))}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          -
        </button>
        <span className="text-xl">{ticketAmount}</span>
        <button 
          onClick={() => setTicketAmount(prev => prev + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          +
        </button>
      </div>
      <button
        onClick={handleBuy}
        className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Buy {ticketAmount} Ticket{ticketAmount !== 1 ? 's' : ''}
      </button>
      {ticketPrice && (
        <p className="text-sm text-gray-600">
          Total: {(Number(ticketPrice) * ticketAmount / 1e18).toFixed(4)} ETH
        </p>
      )}
    </div>
  );
};
