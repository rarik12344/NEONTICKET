import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { CONFIG } from '../../config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const buttonIndex = body.untrustedData.buttonIndex;
    const fid = body.untrustedData.fid;
    const inputText = body.untrustedData.inputText || '';

    // Обработка разных кнопок
    switch (buttonIndex) {
      case 1: // Кнопка "Buy Ticket"
        const txHash = await processTicketPurchase(fid);
        return res.status(200).json({
          type: 'frame',
          frame: {
            version: 'vNext',
            image: `${CONFIG.hostUrl}/api/frame/success?tx=${txHash}`,
            buttons: [
              {
                label: '🎉 View on Explorer',
                action: 'link',
                target: `${CONFIG.baseExplorerUrl}/tx/${txHash}`
              },
              {
                label: '🔄 New Round',
                action: 'post'
              }
            ],
            postUrl: `${CONFIG.hostUrl}/api/frame`
          }
        });

      default:
        return res.status(200).json({
          type: 'frame',
          frame: {
            version: 'vNext',
            image: `${CONFIG.hostUrl}/api/frame/default`,
            buttons: [
              {
                label: '🎫 Buy Ticket',
                action: 'post'
              }
            ],
            postUrl: `${CONFIG.hostUrl}/api/frame`
          }
        });
    }
  } catch (error) {
    console.error('Frame error:', error);
    return res.status(200).json({
      type: 'frame',
      frame: {
        version: 'vNext',
        image: `${CONFIG.hostUrl}/api/frame/error`,
        buttons: [
          {
            label: '🔄 Try Again',
            action: 'post'
          }
        ],
        postUrl: `${CONFIG.hostUrl}/api/frame`
      }
    });
  }
}

async function processTicketPurchase(fid: number): Promise<string> {
  // Здесь реализация покупки билетов через контракт
  // Возвращаем хэш транзакции
  return '0x123...abc';
}
