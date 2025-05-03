import { NextApiRequest, NextApiResponse } from 'next';
import { createCanvas, loadImage } from 'canvas';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type, prize, time } = req.query;
  
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // Фон
  ctx.fillStyle = '#0f0f1a';
  ctx.fillRect(0, 0, 1200, 630);

  try {
    // Загрузка и отрисовка основного изображения
    const bgImage = await loadImage('https://i.ibb.co/HfcPqDfC/ogneon.jpg');
    ctx.drawImage(bgImage, 0, 0, 1200, 630);

    // Добавление динамического текста
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    
    if (type === 'main') {
      ctx.fillText('✨ NEON LOTTERY ✨', 600, 100);
      ctx.font = '36px sans-serif';
      ctx.fillText('Daily ETH Draws on Base', 600, 160);
    } else if (type === 'buy') {
      ctx.fillText(`Prize Pool: ${prize} ETH`, 600, 100);
      ctx.font = '36px sans-serif';
      ctx.fillText(`Time Left: ${time} hours`, 600, 160);
    }

    res.setHeader('Content-Type', 'image/png');
    canvas.createPNGStream().pipe(res);
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).send('Error generating image');
  }
}
