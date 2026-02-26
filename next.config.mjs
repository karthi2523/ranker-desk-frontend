/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    webpack: (config) => {
        // pdfjs-dist requires canvas to be excluded from server builds (browser-only API)
        config.resolve.alias.canvas = false
        return config
    },
}

export default nextConfig
