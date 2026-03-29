import * as Sentry from '@sentry/nuxt'

export default defineNuxtPlugin(() => {
  // Only initialize if DSN is provided
  const dsn = useRuntimeConfig().public.sentryDsn || process.env.NUXT_PUBLIC_SENTRY_DSN

  if (!dsn) {
    console.warn('[Sentry] No DSN provided, skipping initialization')
    return
  }

  Sentry.init({
    dsn,

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

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
})
