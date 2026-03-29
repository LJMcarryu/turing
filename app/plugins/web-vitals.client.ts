export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined')
    return

  // Web Vitals monitoring
  const reportWebVitals = (metric: any) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', metric.name, metric.value)
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
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
