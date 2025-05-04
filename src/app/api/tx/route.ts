import { NextResponse } from 'next/server';
import { encodeFunctionData, parseEther } from 'viem';
import { ABI, CONFIG } from '@/config/constants';

export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json({
    chainId: 'eip155:8453', // Base Chain ID
    method: 'eth_sendTransaction',
    params: {
      abi: ABI,
      to: CONFIG.CONTRACT_ADDRESS,
      data: encodeFunctionData({
        functionName: 'buyTickets',
        args: [1] // 1 билет
      }),
      value: parseEther('0.01').toString() // Стоимость билета
    }
  });
}
