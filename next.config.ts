import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'tunkwyfukkiveltixrqy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**'
      }
    ]
  },

  experimental: {
    proxyClientMaxBodySize: "50mb", // Límite del proxy interno

    serverActions: {
      bodySizeLimit: "50mb", // Límite de las Server Actions
    },
  },
};

export default nextConfig;