import { NextApiRequest, NextApiResponse } from 'next';
import { CONFIG } from '../../config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const buttonIndex = body.untrustedData.buttonIndex;

    switch (buttonIndex) {
      case 1: // Кнопка "Buy Ticket"
        return res.status(200).json({
          type: 'frame',
          frame: {
            version: 'vNext',
            image: `${CONFIG.hostUrl}/frame-success.png`, // Используем прямое URL изображения
            buttons: [
              {
                label: '🎉 View on Explorer',
                action: 'link',
                target: `${CONFIG.baseExplorerUrl}/address/${CONFIG.contract.address}`
              },
              {
                label: '🔄 New Round',
                action: 'post'
              }
            ],
            postUrl: `${CONFIG.hostUrl}${CONFIG.frame.postUrl}`
          }
        });

      default:
        return res.status(200).json({
          type: 'frame',
          frame: {
            version: 'vNext',
            image: CONFIG.frame.imageUrl, // Основное изображение из конфига
            buttons: [
              {
                label: '🎫 Buy Ticket',
                action: 'post'
              }
            ],
            postUrl: `${CONFIG.hostUrl}${CONFIG.frame.postUrl}`
          }
        });
    }
  } catch (error) {
    console.error('Frame error:', error);
    return res.status(200).json({
      type: 'frame',
      frame: {
        version: 'vNext',
        image: `${CONFIG.hostUrl}/frame-error.png`,
        buttons: [
          {
            label: '🔄 Try Again',
            action: 'post'
          }
        ],
        postUrl: `${CONFIG.hostUrl}${CONFIG.frame.postUrl}`
      }
    });
  }
}
