import { NextApiRequest, NextApiResponse } from 'next';
import { ABI, CONFIG } from '@/config/constants';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

// Инициализация клиента для чтения данных контракта
const client = createPublicClient({
  chain: base,
  transport: http(CONFIG.BASE_RPC_URL),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      // Обработка взаимодействия с фреймом
      const { untrustedData } = req.body;
      const { buttonIndex, inputText, fid } = untrustedData || {};

      // Получаем актуальные данные лотереи
      const [currentRound, ticketPrice, roundInfo] = await Promise.all([
        client.readContract({
          address: CONFIG.CONTRACT_ADDRESS,
          abi: ABI,
          functionName: 'currentRoundIndex',
        }),
        client.readContract({
          address: CONFIG.CONTRACT_ADDRESS,
          abi: ABI,
          functionName: 'ticketPriceETH',
        }),
        client.readContract({
          address: CONFIG.CONTRACT_ADDRESS,
          abi: ABI,
          functionName: 'getCurrentRoundInfo',
        }),
      ]);

      const prizePool = roundInfo[2];
      const endTime = Number(roundInfo[1]) * 1000;
      const timeLeft = endTime - Date.now();
      const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));

      // Обработка нажатия кнопок
      if (buttonIndex === 1) {
        // Кнопка "Купить билет"
        return res.status(200).json({
          type: 'frame',
          frame: {
            version: 'vNext',
            image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/image?type=buy&prize=${Number(prizePool)/1e18}&time=${hoursLeft}`,
            buttons: [
              {
                label: '1 Ticket',
                action: 'tx',
                target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/tx?amount=1`,
                postUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/tx-callback`,
              },
              {
                label: '5 Tickets',
                action: 'tx',
                target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/tx?amount=5`,
                postUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/tx-callback`,
              },
              {
                label: '← Back',
                action: 'post',
              }
            ],
            postUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`,
            state: JSON.stringify({ fid, lastAction: 'buy' }),
          },
        });
      } else if (buttonIndex === 2) {
        // Кнопка "Победители"
        return res.status(200).json({
          type: 'frame',
          frame: {
            version: 'vNext',
            image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/image?type=winners`,
            buttons: [
              {
                label: 'View on Basescan',
                action: 'link',
                target: `${CONFIG.BASE_EXPLORER_URL}/address/${CONFIG.CONTRACT_ADDRESS}`,
              },
              {
                label: '← Back',
                action: 'post',
              }
            ],
            postUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`,
          },
        });
      }
    }

    // Возвращаем начальный фрейм по умолчанию
    const initialFrame = {
      type: 'frame',
      frame: {
        version: 'vNext',
        image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/image?type=main`,
        imageAspectRatio: '1.91:1',
        buttons: [
          {
            label: '🎟️ Buy Ticket',
            action: 'post',
          },
          {
            label: '🏆 Winners',
            action: 'post_redirect',
          },
          {
            label: 'ℹ️ How It Works',
            action: 'post',
          }
        ],
        postUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`,
        input: {
          text: 'Enter ticket amount (1-10)',
        },
      },
    };

    res.status(200).json(initialFrame);
  } catch (error) {
    console.error('Frame error:', error);
    res.status(500).json({ error: 'Failed to process frame' });
  }
}
