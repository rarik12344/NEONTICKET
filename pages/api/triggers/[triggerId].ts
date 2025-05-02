import { NextApiRequest, NextApiResponse } from 'next';
import { CONFIG } from '../../../config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { triggerId } = req.query;

  try {
    // Обработка разных триггеров
    switch (triggerId) {
      case 'buy-ticket':
        return handleBuyTicketTrigger(req, res);

      default:
        return res.status(404).json({ error: 'Trigger not found' });
    }
  } catch (error) {
    console.error('Trigger error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleBuyTicketTrigger(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { castId, fid } = req.body;

  // Логика обработки триггера покупки билета
  return res.status(200).json({
    type: 'frame',
    frame: {
      version: 'vNext',
      image: `${CONFIG.hostUrl}/api/triggers/buy-ticket/image`,
      buttons: [
        {
          label: '🎫 Buy Ticket',
          action: 'post',
          target: `${CONFIG.hostUrl}/api/frame`
        }
      ],
      postUrl: `${CONFIG.hostUrl}/api/frame`
    }
  });
}
