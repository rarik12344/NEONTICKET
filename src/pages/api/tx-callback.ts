import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { transactionId, status } = req.body;

  if (status === 'success') {
    return res.status(200).json({
      type: 'frame',
      frame: {
        version: 'vNext',
        image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/image?type=success`,
        buttons: [
          {
            label: '🎉 View Transaction',
            action: 'link',
            target: `${CONFIG.BASE_EXPLORER_URL}/tx/${transactionId}`,
          },
          {
            label: '← Back to Lottery',
            action: 'post',
          }
        ],
        postUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`,
      },
    });
  } else {
    return res.status(200).json({
      type: 'frame',
      frame: {
        version: 'vNext',
        image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/image?type=error`,
        buttons: [
          {
            label: '🔄 Try Again',
            action: 'post',
          },
          {
            label: '← Back',
            action: 'post',
          }
        ],
        postUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`,
      },
    });
  }
}
