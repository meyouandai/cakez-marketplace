import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Filter out sensitive errors
  beforeSend(event, hint) {
    // Allow test errors from Sentry test API even in development
    if (event.request?.url?.includes('/api/test-sentry')) {
      return event
    }

    // Don't send errors from development
    if (process.env.NODE_ENV === 'development') {
      return null
    }

    // Filter out expected errors
    const error = hint.originalException
    if (error && typeof error === 'object' && 'message' in error) {
      const message = String(error.message).toLowerCase()

      // Filter out authentication redirects (not actual errors)
      if (message.includes('redirect') && message.includes('signin')) {
        return null
      }

      // Filter out database connection warmup errors
      if (message.includes('connection') && message.includes('pool')) {
        return null
      }
    }

    return event
  },

  // Add context to all events
  beforeSendTransaction(event) {
    // Add environment info
    event.tags = {
      ...event.tags,
      'node.version': process.version,
    }
    return event
  },
})
