/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Важно для Vercel:
  output: 'export', // Используем статический экспорт вместо standalone
  
  // Настройки изображений:
  images: {
    unoptimized: true, // Обязательно для статического экспорта
    domains: ['i.ibb.co'],
  },

  // Настройки заголовков:
  async headers() {
    return [
      {
        source: '/.well-known/farcaster.json',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Content-Type', value: 'application/json' }
        ],
      }
    ];
  },

  // Отключаем API routes для статического экспорта:
  experimental: {
    outputFileTracingExcludes: {
      '*': ['node_modules/**/*'],
    },
  },

  // Редиректы (опционально):
  async redirects() {
    return [
      {
        source: '/',
        destination: '/',
        permanent: false,
      }
    ];
  }
};

module.exports = nextConfig;
