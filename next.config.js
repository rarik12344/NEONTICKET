/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  
  images: {
    unoptimized: true,
    domains: ['i.ibb.co'],
  },

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

  // Отключаем несовместимые функции для статического экспорта
  experimental: {
    appDir: false,
    outputFileTracingExcludes: {
      '*': ['node_modules/**/*'],
    },
  },
  
  // Фикс для API routes в статическом экспорте
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true
};

module.exports = nextConfig;
