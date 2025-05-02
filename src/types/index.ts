export interface Lottery {
  buyTickets: (ticketAmount: number, ticketPrice: number) => void;
  cancelRound: () => void;
  claimPrize: () => void;
}
