/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  // 注意：将"your-repo-name"替换为您的实际GitHub仓库名称
  basePath: process.env.NODE_ENV === 'production' ? '/tree-table-component' : '',
}

export default nextConfig