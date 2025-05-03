import { NextApiRequest, NextApiResponse } from 'next';
import { ABI, CONFIG } from '@/config/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { amount } = req.query;
  const ticketAmount = Math.min(10, Math.max(1, parseInt(amount as string) || 1));

  res.status(200).json({
    chainId: `eip155:${CONFIG.BASE_CHAIN_ID}`,
    method: 'eth_sendTransaction',
    params: {
      abi: ABI,
      to: CONFIG.CONTRACT_ADDRESS,
      data: encodeFunctionData({
        abi: ABI,
        functionName: 'buyTickets',
        args: [BigInt(ticketAmount)],
      }),
      value: (await getTicketPrice()) * BigInt(ticketAmount),
    },
  });
}

async function getTicketPrice(): Promise<bigint> {
  // Реализация получения цены билета
  return BigInt(1000000000000000); // 0.001 ETH в примере
}
