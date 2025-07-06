/** @type {import('next').NextConfig} */
const nextConfig = {

  // ---------------------
auth: {
    providers: [
      {
        provider: 'google',
        driver: 'oauth2',
        icon: 'google',
        name: 'Google',
        enabled: true,
        settings: {
          authorize_url: 'https://accounts.google.com/o/oauth2/v2/auth',
          access_url: 'https://oauth2.googleapis.com/token',
          profile_url: 'https://www.googleapis.com/oauth2/v2/userinfo',
          profile_emails_key: 'email',
          scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
          id: '602047752247-39qmihl9qoh15v24vr6ojptd5g60i9pr.apps.googleusercontent.com',
          secret:'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',
        },
      },
    ],
  },
  //------------------
  reactStrictMode: true,
  swcMinify: true,

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Environment variables that should be available to the browser
  // These must be prefixed with NEXT_PUBLIC_
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || "1.0.0",
  },

  // Image domains for next/image
  images: {
    domains: [
      "storage.deeldeal.com",
      "api.deeldeal.com",
      "localhost",
      // Add other domains as needed
    ],
    unoptimized: true,
  },

  // Redirects
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ]
  },

  // Headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
