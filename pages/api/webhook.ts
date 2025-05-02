import { NextApiRequest, NextApiResponse } from 'next';
import { verifyWebhook } from '../../lib/farcaster';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.FARCASTER_WEBHOOK_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    // Приводим тип запроса к нужному интерфейсу
    const farcasterReq = req as unknown as Parameters<typeof verifyWebhook>[0];
    const isValid = verifyWebhook(farcasterReq, secret);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    console.log('Received webhook event:', event);

    // Обработка событий
    switch (event.type) {
      case 'APP_INSTALL':
        return res.status(200).json({ success: true });

      case 'APP_UNINSTALL':
        return res.status(200).json({ success: true });

      case 'USER_INTERACTION':
        return res.status(200).json({ success: true });

      default:
        return res.status(400).json({ error: 'Unknown event type' });
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
