import * as Sentry from '@sentry/nuxt'

Sentry.init({
  dsn: process.env.NUXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions in development
  // Set sampling rate for production in environment variables

  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',

  // Integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})
