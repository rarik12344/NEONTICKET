import { NextApiRequest, NextApiResponse } from 'next'
import { CONFIG } from '../../config'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Обработка POST-запроса от Frame
    const { untrustedData } = req.body
    
    res.status(200).json({
      type: 'frame',
      frame: {
        version: CONFIG.frameVersion,
        imageUrl: CONFIG.frameImageUrl,
        buttons: [
          {
            title: "🎫 Buy ticket",
            action: {
              type: "launch_frame",
              url: "https://lotteryneon.vercel.app/",
              name: "Neon Lottery",
              splashImageUrl: CONFIG.splashImageUrl,
              splashBackgroundColor: CONFIG.splashBackgroundColor
            }
          }
        ]
      }
    })
  } else {
    // Обработка GET-запроса
    res.status(200).json({
      type: 'frame',
      frame: {
        version: CONFIG.frameVersion,
        imageUrl: CONFIG.frameImageUrl,
        buttons: [
          {
            title: "🎫 Buy ticket",
            action: {
              type: "launch_frame",
              url: "https://lotteryneon.vercel.app/",
              name: "Neon Lottery",
              splashImageUrl: CONFIG.splashImageUrl,
              splashBackgroundColor: CONFIG.splashBackgroundColor
            }
          }
        ]
      }
    })
  }
}
