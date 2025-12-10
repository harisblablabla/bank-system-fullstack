/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.EC2_API_URL}/api/:path*`
      },
    ]
  },
  reactStrictMode: true,
}

module.exports = nextConfig