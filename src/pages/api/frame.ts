import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Обработка взаимодействия с Frame
    const { buttonIndex, inputText } = req.body;
    
    if (buttonIndex === 1) {
      // Кнопка "Купить билет"
      res.status(200).json({
        type: 'frame',
        frameUrl: 'https://neon-lottery.vercel.app/',
        frameButtonText: '🎫 Buy ticket',
        frameImageUrl: 'https://neon-lottery.vercel.app/images/ogneon.jpg',
        framePostUrl: 'https://neon-lottery.vercel.app/api/frame'
      });
    }
  } else {
    // GET запрос - отображение Frame
    res.status(200).json({
      type: 'frame',
      frameUrl: 'https://neon-lottery.vercel.app/',
      frameButtonText: '🎫 Buy ticket',
      frameImageUrl: 'https://neon-lottery.vercel.app/images/ogneon.jpg',
      framePostUrl: 'https://neon-lottery.vercel.app/api/frame'
    });
  }
}
