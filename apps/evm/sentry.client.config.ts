// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://55d403547a5655039a8f9eb2906a6121@o960777.ingest.sentry.io/4505784139776000',

  // Replay may only be enabled for the client-side
  integrations: [
    new Sentry.Replay({
      // Additional Replay configuration goes in here
    }),
  ],

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  // debug: process.env.NODE_ENV !== 'production',
  debug: false,

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  enabled: process.env.VERCEL_ENV !== 'production',
})
