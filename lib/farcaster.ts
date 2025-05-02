import crypto from 'crypto';

export function verifyWebhook(req: any): boolean {
  const signature = req.headers['x-farcaster-webhook-signature'];
  const secret = process.env.FARCASTER_WEBHOOK_SECRET;
  
  if (!signature || !secret) return false;

  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(JSON.stringify(req.body)).digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
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
