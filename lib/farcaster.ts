import { createHmac } from 'crypto';

type WebhookRequest = {
  headers: {
    'x-farcaster-webhook-signature'?: string;
  };
  body: any;
};

export function verifyWebhook(req: WebhookRequest): boolean {
  const signature = req.headers['x-farcaster-webhook-signature'];
  const secret = process.env.FARCASTER_WEBHOOK_SECRET;
  
  if (!signature || !secret) {
    console.error('Missing signature or secret');
    return false;
  }

  try {
    const hmac = createHmac('sha256', secret);
    const digest = hmac.update(JSON.stringify(req.body)).digest('hex');
    
    // Сравнение строк вместо Buffer
    return signature === digest;
  } catch (error) {
    console.error('Error verifying webhook:', error);
    return false;
  }
}

export function generateFrameResponse(
  imageUrl: string,
  buttons: Array<{
    label: string;
    action: 'post' | 'link';
    target?: string;
  }>,
  postUrl: string
) {
  return {
    type: 'frame' as const,
    frame: {
      version: 'vNext' as const,
      image: imageUrl,
      buttons,
      postUrl
    }
  };
}
