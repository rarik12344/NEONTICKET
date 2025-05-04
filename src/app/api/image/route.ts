import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'main';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          background: '#0f0f1a',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: `url(${CONFIG.FRAME_IMAGE_URL})`,
          backgroundSize: 'cover',
          fontFamily: '"Inter"',
          position: 'relative'
        }}
      >
        {/* Градиентный оверлей */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(15, 15, 26, 0.8), rgba(157, 0, 255, 0.4))'
          }}
        />

        {type === 'main' ? (
          <>
            <div style={{ fontSize: 72, fontWeight: 'bold', color: '#00f3ff', textShadow: '0 0 10px #00f3ff', marginBottom: 20, zIndex: 1 }}>
              ✨ NEON LOTTERY ✨
            </div>
            <div style={{ fontSize: 42, color: '#ff00ff', textShadow: '0 0 8px #ff00ff', zIndex: 1 }}>
              Daily ETH Draws on Base
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 64, fontWeight: 'bold', color: '#00f3ff', textShadow: '0 0 10px #00f3ff', marginBottom: 30, zIndex: 1 }}>
              Prize Pool: 1.25 ETH
            </div>
            <div style={{ fontSize: 48, color: '#ff00ff', textShadow: '0 0 8px #ff00ff', zIndex: 1 }}>
              Time Left: 4h 22m
            </div>
          </>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
