import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-static'; // Оптимизация для статических изображений

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const prize = searchParams.get('prize') ?? '0.5';
    const time = searchParams.get('time') ?? '24';

    // Загрузка кастомного шрифта (опционально)
    const fontResponse = await fetch(
      new URL('@/assets/fonts/Neon.ttf', import.meta.url)
    );
    const fontData = await fontResponse.arrayBuffer();

    // Генерация изображения
    const response = new ImageResponse(
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
            backgroundImage: 'url(https://i.ibb.co/HfcPqDfC/ogneon.jpg)',
            backgroundSize: 'cover',
            fontFamily: '"Neon"',
            position: 'relative',
          }}
        >
          {/* Градиентный оверлей */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(to bottom, rgba(15, 15, 26, 0.8), rgba(157, 0, 255, 0.4))',
            }}
          />

          {type === 'main' ? (
            <>
              <div style={{
                fontSize: 72,
                fontWeight: 'bold',
                color: '#00f3ff',
                textShadow: '0 0 10px #00f3ff',
                marginBottom: 20,
                zIndex: 1,
              }}>
                ✨ NEON LOTTERY ✨
              </div>
              <div style={{
                fontSize: 42,
                color: '#ff00ff',
                textShadow: '0 0 8px #ff00ff',
                zIndex: 1,
              }}>
                Daily ETH Draws on Base
              </div>
            </>
          ) : (
            <>
              <div style={{
                fontSize: 64,
                fontWeight: 'bold',
                color: '#00f3ff',
                textShadow: '0 0 10px #00f3ff',
                marginBottom: 30,
                zIndex: 1,
              }}>
                Prize Pool: {prize} ETH
              </div>
              <div style={{
                fontSize: 48,
                color: '#ff00ff',
                textShadow: '0 0 8px #ff00ff',
                zIndex: 1,
              }}>
                Time Left: {time} hours
              </div>
            </>
          )}

          {/* Футер */}
          <div style={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            fontSize: 24,
            color: '#ffffff',
            zIndex: 1,
          }}>
            neon-lottery.vercel.app
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Neon',
            data: fontData,
            style: 'normal',
          },
        ],
      }
    );

    // Настройки кеширования
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=600');
    response.headers.set('Vercel-CDN-Cache-Control', 'max-age=3600');
    response.headers.set('Vercel-Cache-Control', 'max-age=3600');
    
    return response;
  } catch (error) {
    console.error('OG image generation failed:', error);
    return new Response('Image generation failed', { status: 500 });
  }
}
