import type { Metric } from 'web-vitals'

export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined')
    return

  const analyticsWindow = window as Window & {
    gtag?: (event: string, name: string, params: Record<string, unknown>) => void
  }

  // Web Vitals monitoring
  const reportWebVitals = (metric: Metric) => {
    // Send to analytics in production
    if (import.meta.env.PROD && analyticsWindow.gtag) {
      analyticsWindow.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      })
    }
  }

  // Dynamically import web-vitals
  // Note: onFID is deprecated, use onINP instead
  import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
    onCLS(reportWebVitals)
    onINP(reportWebVitals) // Interaction to Next Paint (replaces FID)
    onFCP(reportWebVitals)
    onLCP(reportWebVitals)
    onTTFB(reportWebVitals)
  }).catch((error) => {
    console.error('[Web Vitals] Failed to load:', error)
  })
})
