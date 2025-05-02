/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  trailingSlash: true,
  images: {
    domains: ['i.ibb.co', 'lotteryneon.vercel.app'],
    unoptimized: true
  },
  async headers() {
    return [
      {
        source: '/.well-known/farcaster.json',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Content-Type', value: 'application/json' }
        ]
      },
      {
        source: '/:path*',
        headers: [
          { 
            key: 'X-Frame-Options', 
            value: 'ALLOW-FROM https://warpcast.com' 
          },
          { 
            key: 'Content-Security-Policy',
            value: "frame-ancestors https://warpcast.com 'self'" 
          }
        ]
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/frame',
        destination: '/api/frame'
      },
      {
        source: '/api/webhook',
        destination: '/api/webhook'
      },
      {
        source: '/api/triggers/:path*',
        destination: '/api/triggers/:path*'
      }
    ];
  }
};

module.exports = nextConfig;
