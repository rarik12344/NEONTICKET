export interface Lottery {
  buyTickets: (ticketAmount: number, ticketPrice: number) => void;
  cancelRound: () => void;
  claimPrize: () => void;
}

export interface RoundInfo {
  startTime: bigint;
  endTime: bigint;
  prizePool: bigint;
  participantsCount: bigint;
  active: boolean;
  canceled: boolean;
  winner: Address;
  prizeAmount: bigint;
}
