/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/.next/**',
        'C:/DumpStack.log.tmp',
        'C:/pagefile.sys',
        'C:/hiberfil.sys',
        'C:/swapfile.sys',
      ],
    }
    return config
  },
}

module.exports = nextConfig
