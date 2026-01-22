/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Enable CORS for development
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
  images: {
    // Thêm domain Supabase của bạn vào danh sách bên dưới
    domains: [
      'res.cloudinary.com', 
      'yyqajxbkxiddfqnzkcmr.supabase.co' // <-- Domain Supabase lấy từ lỗi log của bạn
    ],
    unoptimized: true,
  },
}

module.exports = nextConfig