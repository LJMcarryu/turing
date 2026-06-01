import * as Sentry from '@sentry/nuxt'

export default defineNuxtPlugin(() => {
  // Only initialize if DSN is provided
  const dsn = useRuntimeConfig().public.sentryDsn

  if (!dsn) {
    console.warn('[Sentry] No DSN provided, skipping initialization')
    return
  }

  Sentry.init({
    dsn,

    // Performance Monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,

    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

    // Environment
    environment: import.meta.env.MODE,

    // Enable debug mode in development
    debug: import.meta.env.DEV,

    // Integrations
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  })
})
