import { NextResponse } from 'next/server';
import { ABI, CONFIG } from '@/config/constants';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'default';
    
    let buttons = [
      {
        label: '🎟️ Buy Ticket',
        action: 'tx',
        target: `${CONFIG.BASE_URL}/api/tx`
      },
      {
        label: '🏆 View Winners', 
        action: 'link',
        target: `${CONFIG.BASE_URL}/winners`
      }
    ];

    if (action === 'success') {
      buttons[0].label = '✅ Purchased';
    }

    return NextResponse.json({
      type: 'frame',
      frame: {
        image: `${CONFIG.BASE_URL}/api/image?type=frame&t=${Date.now()}`,
        buttons,
        refreshPeriod: 60 // Автообновление каждые 60 сек
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Frame generation failed' },
      { status: 500 }
    );
  }
}
