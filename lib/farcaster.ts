import crypto from 'crypto';

export function verifyWebhook(req: any): boolean {
  const signature = req.headers['x-farcaster-webhook-signature'];
  const secret = process.env.FARCASTER_WEBHOOK_SECRET;
  
  if (!signature || !secret) return false;

  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(JSON.stringify(req.body)).digest('hex');
  
  // Исправленная версия сравнения
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'utf8'),
    Buffer.from(digest, 'hex')
  );
}

export function generateFrameResponse(imageUrl: string, buttons: any[], postUrl: string) {
  return {
    type: 'frame',
    frame: {
      version: 'vNext',
      image: imageUrl,
      buttons,
      postUrl
    }
  };
}
