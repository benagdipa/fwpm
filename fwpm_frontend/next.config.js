/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'fwpm.nwas.nbnco.net.au'],
  },
  webpack(config) {
    // Support SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  // Environment-specific settings
  publicRuntimeConfig: {
    // Will be available on both server and client
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  // Runtime configuration that's only available on the server-side
  serverRuntimeConfig: {
    // Private config that's only available on the server-side
    mySecret: 'my-server-secret',
  },
};

module.exports = nextConfig; 