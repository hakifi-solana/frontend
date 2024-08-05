const IS_OUTPUT_STANDALONE = process.env.IS_OUTPUT_STANDALONE === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sgp1.digitaloceanspaces.com",
        pathname: "/nami-dev/**",
      },
      {
        protocol: "https",
        hostname: "sgp1.digitaloceanspaces.com",
        pathname: "/static.nami/nami.exchange/images/coins/64/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/commons/thumb/0/01/**",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        pathname: "/images/**",
      },
    ],
    // domains: ['https://']
  },
  reactStrictMode: false,
};

if (IS_OUTPUT_STANDALONE) {
  nextConfig.output = "standalone";
}

export default nextConfig;
