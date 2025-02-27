import type { NextConfig } from "next";
import { ImageConfig } from "next/dist/shared/lib/image-config";

const RemotePatterns: ImageConfig['remotePatterns'] = [
  {
    protocol: 'https',
    hostname: 'res.cloudinary.com',
    port: '',
    pathname: '/**',
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: RemotePatterns,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;
