/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/register/:path*",
        destination: "http://localhost:5000/register/:path*",
      },
    ];
  },
};

export default nextConfig;
