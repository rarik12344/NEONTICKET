import { NextApiRequest, NextApiResponse } from 'next';
import { verifyWebhook } from '../../lib/farcaster';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Верификация подписи вебхука
    const isValid = verifyWebhook(req);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    console.log('Webhook event:', event);

    // Обработка разных типов событий
    switch (event.type) {
      case 'APP_INSTALL':
        // Логика при установке MiniApp
        return res.status(200).json({ success: true });

      case 'APP_UNINSTALL':
        // Логика при удалении MiniApp
        return res.status(200).json({ success: true });

      case 'USER_INTERACTION':
        // Логика взаимодействия пользователя
        return res.status(200).json({ success: true });

      default:
        return res.status(400).json({ error: 'Unknown event type' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
