import type { NextApiRequest, NextApiResponse } from 'next';
import { CONFIG } from '../../config';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Обработка взаимодействия с Frame
    const { buttonIndex } = req.body;
    
    if (buttonIndex === 1) {
      return res.status(200).json({
        type: 'frame',
        frameUrl: CONFIG.baseUrl,
        frameButtonText: '🎫 Buy ticket',
        frameImageUrl: `${CONFIG.baseUrl}/images/ogneon.jpg`,
        framePostUrl: `${CONFIG.baseUrl}/api/frame`
      });
    }
  }

  // GET запрос - первоначальное отображение Frame
  res.status(200).json({
    type: 'frame',
    frameUrl: CONFIG.baseUrl,
    frameButtonText: '🎫 Buy ticket',
    frameImageUrl: `${CONFIG.baseUrl}/images/ogneon.jpg`,
    framePostUrl: `${CONFIG.baseUrl}/api/frame`
  });
}
