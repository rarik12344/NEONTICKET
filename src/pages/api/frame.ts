import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Handle frame interaction
    const { buttonIndex, inputText, state } = req.body;

    // Return frame response
    res.status(200).json({
      type: 'frame',
      frame: {
        version: 'next',
        imageUrl: 'https://i.ibb.co/HfcPqDfC/ogneon.jpg',
        buttons: [
          {
            label: 'Buy Ticket',
            action: 'post',
          },
          {
            label: 'View Winners',
            action: 'post_redirect',
          },
        ],
        postUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`,
      },
    });
  } else {
    // Return initial frame
    res.status(200).json({
      type: 'frame',
      frame: {
        version: 'next',
        imageUrl: 'https://i.ibb.co/HfcPqDfC/ogneon.jpg',
        buttons: [
          {
            label: '🎫 Buy Ticket',
            action: 'post',
          },
          {
            label: '🏆 Winners',
            action: 'post_redirect',
          },
        ],
        postUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`,
      },
    });
  }
}
