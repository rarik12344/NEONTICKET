import { NextApiRequest } from 'next';
import crypto from 'crypto';

interface FarcasterWebhookRequest extends NextApiRequest {
  headers: {
    'x-farcaster-webhook-signature'?: string;
  };
}

export function verifyWebhook(req: FarcasterWebhookRequest, secret: string): boolean {
  const signature = req.headers['x-farcaster-webhook-signature'];
  
  if (!signature) {
    console.error('Missing signature header');
    return false;
  }

  try {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(JSON.stringify(req.body)).digest('hex');
    return signature === digest;
  } catch (error) {
    console.error('Error verifying webhook:', error);
    return false;
  }
}

export type FrameButton = {
  label: string;
  action: 'post' | 'link';
  target?: string;
};

export function generateFrameResponse(
  imageUrl: string,
  buttons: FrameButton[],
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
