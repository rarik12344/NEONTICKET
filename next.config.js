/** @type {import('next').NextConfig} */
const nextConfig = {
  // Основные настройки
  reactStrictMode: true,
  output: 'standalone',
  trailingSlash: true,
  
  // Поддержка изображений (для Frame и иконок)
  images: {
    domains: [
      'i.ibb.co', // Ваши изображения
      'lotteryneon.vercel.app' // Для Frame-превью
    ],
    unoptimized: true // Для стабильной работы Frames
  },

  // Критические заголовки
  async headers() {
    return [
      // Для Farcaster Frame-валидации
      {
        source: '/.well-known/farcaster.json',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Content-Type', value: 'application/json' }
        ]
      },
      // Для MiniApp в Warpcast
      {
        source: '/:path*',
        headers: [
          { 
            key: 'X-Frame-Options', 
            value: 'ALLOW-FROM https://warpcast.com' 
          },
          { 
            key: 'Content-Security-Policy',
            value: "frame-ancestors https://warpcast.com" 
          }
        ]
      }
    ];
  },

  // Переопределение API-роутов
  async rewrites() {
    return [
      // Обработчик Frame
      {
        source: '/api/frame',
        destination: '/api/frame'
      },
      // Вебхук для MiniApp
      {
        source: '/api/webhook',
        destination: '/api/webhook'
      },
      // Триггеры
      {
        source: '/api/triggers/:path*',
        destination: '/api/triggers/:path*'
      }
    ];
  },

  // Конфигурация PWA (опционально)
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true
  }
};

module.exports = nextConfig;
