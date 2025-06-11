/**
 * Environment configuration
 * This file centralizes all environment variables and provides defaults
 * for development. In production, these values should be set in the
 * hosting platform (Vercel, Netlify, etc.)
 */

const environment = {
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.deeldeal.com",
  apiTimeout: Number.parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000", 10),
  apiVersion: process.env.NEXT_PUBLIC_API_VERSION || "v1",
  apiKey: process.env.API_KEY || "",

  // Authentication
  authTokenName: process.env.NEXT_PUBLIC_AUTH_TOKEN_NAME || "deeldeal_token",
  userDataName: process.env.NEXT_PUBLIC_USER_DATA_NAME || "deeldeal_user",
  jwtSecret: process.env.JWT_SECRET || "",
  tokenExpiration: Number.parseInt(process.env.TOKEN_EXPIRATION || "86400", 10), // 24 hours in seconds
  refreshTokenName: process.env.REFRESH_TOKEN_NAME || "deeldeal_refresh",
  refreshTokenExpiration: Number.parseInt(process.env.REFRESH_TOKEN_EXPIRATION || "604800", 10), // 7 days in seconds

  // Feature Flags
  enableSocialLogin: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN === "true",
  enableChat: process.env.NEXT_PUBLIC_ENABLE_CHAT === "true",
  enableNotifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === "true",
  enableMapView: process.env.NEXT_PUBLIC_ENABLE_MAP_VIEW === "true",
  enableReviews: process.env.NEXT_PUBLIC_ENABLE_REVIEWS === "true",
  enableWishlist: process.env.NEXT_PUBLIC_ENABLE_WISHLIST === "true",
  enableComparisons: process.env.NEXT_PUBLIC_ENABLE_COMPARISONS === "true",
  enableAuctions: process.env.NEXT_PUBLIC_ENABLE_AUCTIONS === "true",
  enableVideoChat: process.env.NEXT_PUBLIC_ENABLE_VIDEO_CHAT === "true",
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",

  // App Configuration
  appName: process.env.NEXT_PUBLIC_APP_NAME || "DeelDeal",
  appDescription: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Swap and trade items with others",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://deeldeal.com",
  appLogo: process.env.NEXT_PUBLIC_APP_LOGO || "/logo.svg",
  appFavicon: process.env.NEXT_PUBLIC_APP_FAVICON || "/favicon.ico",
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@deeldeal.com",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+1-800-DEELDEAL",
  maxUploadSize: Number.parseInt(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE || "10485760", 10), // 10MB in bytes

  // Analytics
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || "",
  mixpanelToken: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || "",
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
  hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID || "",
  facebookPixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "",

  // Social Media
  facebookAppId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "602047752247-39qmihl9qoh15v24vr6ojptd5g60i9pr.apps.googleusercontent.com",
  twitterApiKey: process.env.TWITTER_API_KEY || "",
  twitterApiSecret: process.env.TWITTER_API_SECRET || "",
  appleClientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "",
  linkedinClientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || "",

  // Deployment
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  isTest: process.env.NODE_ENV === "test",
  port: Number.parseInt(process.env.PORT || "3000", 10),
  host: process.env.HOST || "0.0.0.0",
  deploymentRegion: process.env.DEPLOYMENT_REGION || "us-east-1",
  deploymentStage: process.env.DEPLOYMENT_STAGE || "development",

  // Image Storage
  imageStorageUrl: process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL || "https://storage.deeldeal.com",
  imageStorageProvider: process.env.IMAGE_STORAGE_PROVIDER || "s3",
  imageStorageBucket: process.env.IMAGE_STORAGE_BUCKET || "deeldeal-images",
  imageStorageRegion: process.env.IMAGE_STORAGE_REGION || "us-east-1",
  imageStorageAccessKey: process.env.IMAGE_STORAGE_ACCESS_KEY || "",
  imageStorageSecretKey: process.env.IMAGE_STORAGE_SECRET_KEY || "",
  imageQuality: Number.parseInt(process.env.NEXT_PUBLIC_IMAGE_QUALITY || "80", 10),
  imageThumbnailSize: Number.parseInt(process.env.NEXT_PUBLIC_IMAGE_THUMBNAIL_SIZE || "200", 10),

  // Locale
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en",
  supportedLocales: (process.env.NEXT_PUBLIC_SUPPORTED_LOCALES || "en,ar").split(","),
  rtlLocales: (process.env.NEXT_PUBLIC_RTL_LOCALES || "ar,he,fa").split(","),
  dateFormat: process.env.NEXT_PUBLIC_DATE_FORMAT || "MM/DD/YYYY",
  timeFormat: process.env.NEXT_PUBLIC_TIME_FORMAT || "h:mm A",
  timezone: process.env.NEXT_PUBLIC_TIMEZONE || "America/New_York",
  currencyCode: process.env.NEXT_PUBLIC_CURRENCY_CODE || "USD",
  currencySymbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$",

  // Theme
  defaultTheme: process.env.NEXT_PUBLIC_DEFAULT_THEME || "light",
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#3B82F6",
  secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR || "#10B981",
  accentColor: process.env.NEXT_PUBLIC_ACCENT_COLOR || "#8B5CF6",
  errorColor: process.env.NEXT_PUBLIC_ERROR_COLOR || "#EF4444",
  warningColor: process.env.NEXT_PUBLIC_WARNING_COLOR || "#F59E0B",
  successColor: process.env.NEXT_PUBLIC_SUCCESS_COLOR || "#10B981",
  infoColor: process.env.NEXT_PUBLIC_INFO_COLOR || "#3B82F6",
  fontFamily: process.env.NEXT_PUBLIC_FONT_FAMILY || "Inter, system-ui, sans-serif",

  // Payment Gateway
  stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  paypalClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
  paypalSecret: process.env.PAYPAL_SECRET || "",
  applePay: process.env.NEXT_PUBLIC_ENABLE_APPLE_PAY === "true",
  googlePay: process.env.NEXT_PUBLIC_ENABLE_GOOGLE_PAY === "true",

  // Security
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",
  recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY || "",
  corsOrigins: (process.env.CORS_ORIGINS || "http://localhost:3000").split(","),
  csrfSecret: process.env.CSRF_SECRET || "",
  rateLimitRequests: Number.parseInt(process.env.RATE_LIMIT_REQUESTS || "100", 10),
  rateLimitWindow: Number.parseInt(process.env.RATE_LIMIT_WINDOW || "900000", 10), // 15 minutes in milliseconds

  // Database
  databaseUrl: process.env.DATABASE_URL || "",
  databaseHost: process.env.DATABASE_HOST || "localhost",
  databasePort: Number.parseInt(process.env.DATABASE_PORT || "5432", 10),
  databaseName: process.env.DATABASE_NAME || "deeldeal",
  databaseUser: process.env.DATABASE_USER || "postgres",
  databasePassword: process.env.DATABASE_PASSWORD || "",
  databasePoolSize: Number.parseInt(process.env.DATABASE_POOL_SIZE || "10", 10),

  // Cache
  redisUrl: process.env.REDIS_URL || "",
  redisHost: process.env.REDIS_HOST || "localhost",
  redisPort: Number.parseInt(process.env.REDIS_PORT || "6379", 10),
  redisPassword: process.env.REDIS_PASSWORD || "",
  cacheExpiration: Number.parseInt(process.env.CACHE_EXPIRATION || "3600", 10), // 1 hour in seconds

  // Email
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number.parseInt(process.env.SMTP_PORT || "587", 10),
  smtpUser: process.env.SMTP_USER || "",
  smtpPassword: process.env.SMTP_PASSWORD || "",
  emailFrom: process.env.EMAIL_FROM || "noreply@deeldeal.com",
  sendgridApiKey: process.env.SENDGRID_API_KEY || "",

  // Maps and Geolocation
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  mapboxAccessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "",
  defaultLatitude: Number.parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LATITUDE || "40.7128"),
  defaultLongitude: Number.parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE || "-74.0060"),
  defaultZoomLevel: Number.parseInt(process.env.NEXT_PUBLIC_DEFAULT_ZOOM_LEVEL || "10", 10),

  // Search
  algoliaAppId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
  algoliaApiKey: process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || "",
  algoliaIndexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || "products",

  // Chat and Messaging
  pusherAppId: process.env.NEXT_PUBLIC_PUSHER_APP_ID || "",
  pusherKey: process.env.NEXT_PUBLIC_PUSHER_KEY || "",
  pusherSecret: process.env.PUSHER_SECRET || "",
  pusherCluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2",
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || "",

  // Video
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || "",
  twilioApiKey: process.env.NEXT_PUBLIC_TWILIO_API_KEY || "",
  twilioApiSecret: process.env.TWILIO_API_SECRET || "",

  // AI and Machine Learning
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY || "",

  // Monitoring and Logging
  logLevel: process.env.LOG_LEVEL || "info",
  newRelicLicenseKey: process.env.NEW_RELIC_LICENSE_KEY || "",
  datadogApiKey: process.env.DATADOG_API_KEY || "",

  // Feature Limits
  maxItemsPerUser: Number.parseInt(process.env.NEXT_PUBLIC_MAX_ITEMS_PER_USER || "50", 10),
  maxImagesPerItem: Number.parseInt(process.env.NEXT_PUBLIC_MAX_IMAGES_PER_ITEM || "10", 10),
  maxCategoriesPerItem: Number.parseInt(process.env.NEXT_PUBLIC_MAX_CATEGORIES_PER_ITEM || "5", 10),
  maxTagsPerItem: Number.parseInt(process.env.NEXT_PUBLIC_MAX_TAGS_PER_ITEM || "20", 10),
  maxOffersPerItem: Number.parseInt(process.env.NEXT_PUBLIC_MAX_OFFERS_PER_ITEM || "20", 10),
  maxMessagesPerDay: Number.parseInt(process.env.NEXT_PUBLIC_MAX_MESSAGES_PER_DAY || "100", 10),

  // Social Features
  enableSharing: process.env.NEXT_PUBLIC_ENABLE_SHARING === "true",
  enableFollowing: process.env.NEXT_PUBLIC_ENABLE_FOLLOWING === "true",
  enableLikes: process.env.NEXT_PUBLIC_ENABLE_LIKES === "true",
  enableComments: process.env.NEXT_PUBLIC_ENABLE_COMMENTS === "true",

  // Legal and Compliance
  termsUrl: process.env.NEXT_PUBLIC_TERMS_URL || "/terms",
  privacyUrl: process.env.NEXT_PUBLIC_PRIVACY_URL || "/privacy",
  cookiePolicyUrl: process.env.NEXT_PUBLIC_COOKIE_POLICY_URL || "/cookies",
  gdprCompliant: process.env.NEXT_PUBLIC_GDPR_COMPLIANT === "true",
  ccpaCompliant: process.env.NEXT_PUBLIC_CCPA_COMPLIANT === "true",

  // Experimental Features
  enableExperimentalFeatures: process.env.NEXT_PUBLIC_ENABLE_EXPERIMENTAL === "true",
  experimentalFeaturesList: (process.env.NEXT_PUBLIC_EXPERIMENTAL_FEATURES || "").split(","),


 NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN:true,
NEXT_PUBLIC_ENABLE_CHAT:true,
NEXT_PUBLIC_ENABLE_NOTIFICATIONS:true,
AUTH_GOOGLE_CLIENT_ID:'602047752247-39qmihl9qoh15v24vr6ojptd5g60i9pr.apps.googleusercontent.com',
AUTH_GOOGLE_CLIENT_SECRET:'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',
AUTH_GOOGLE_AUTH_URL:'https://accounts.google.com/o/oauth2/auth',
AUTH_GOOGLE_TOKEN_URL:'https://oauth2.googleapis.com/token',
AUTH_GOOGLE_USER_URL:'https://www.googleapis.com/oauth2/v3/userinfo',
AUTH_GOOGLE_SCOPE:'openid email profile',
AUTH_GOOGLE_ALLOW_PUBLIC_REGISTRATION:true,
AUTH_GOOGLE_IDENTIFIER_KEY:'email',
NEXTAUTH_URL:'http://localhost:3000'

}

export default environment
