/** @type {import('next').NextConfig} */
const nextConfig = {
  // Базовые настройки
  reactStrictMode: true,
  output: 'export', // Критически важно для Vercel
  
  // Настройки изображений
  images: {
    unoptimized: true, // Обязательно при output: 'export'
    domains: ['i.ibb.co'], // Ваши домены для изображений
    loader: 'custom', // Для статического экспорта
  },

  // Настройки заголовков
  async headers() {
    return [
      {
        source: '/.well-known/farcaster.json',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
      // Безопасность
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },

  // Отключаем ненужные функции для статического экспорта
  experimental: {
    appDir: false,
    outputFileTracingExcludes: {
      '*': ['node_modules/**/*'],
    },
  },

  // Настройки для Vercel
  trailingSlash: true, // Важно для корректных URL
  skipTrailingSlashRedirect: true, // Отключаем редиректы
};

module.exports = nextConfig;
