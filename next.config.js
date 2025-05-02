/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['i.ibb.co', 'lotteryneon.vercel.app'],
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/.well-known/farcaster.json',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Content-Type', value: 'application/json' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { 
            key: 'X-Frame-Options', 
            value: 'ALLOW-FROM https://warpcast.com' 
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
