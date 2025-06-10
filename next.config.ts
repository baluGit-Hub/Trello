import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'trello-members.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'trello.com', // For board backgrounds etc.
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
