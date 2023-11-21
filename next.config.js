/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com", //match any number of subdomains
      },
    ],
    //domains: ["res.cloudinary.com", "cdn.pixabay.com"], //deprecated
  },
};

module.exports = nextConfig;
