/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_API_URL: 'https://transtracheal-bently-tarnally.ngrok-free.dev/api/',
        NEXT_PUBLIC_RAZORPAY_KEY_ID: 'rzp_live_SLr5Tb0jLQhU93',
    },
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
    async rewrites() {
        return [
            // Removed rewrites - Next.js rewrite engine preserves the `Host` header
            // which causes Ngrok to throw ERR_NGROK_8012. We must revert to `app/api/...`
        ]
    },
}

export default nextConfig
