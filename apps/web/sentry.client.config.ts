// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://28c197e66594eea8cf3014697e6fc0d3@o960777.ingest.us.sentry.io/4507941516410880',

  enabled:
    process.env.CI !== 'true' || process.env.NEXT_PUBLIC_APP_ENV !== 'test',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    // Sentry.thirdPartyErrorFilterIntegration({
    //   // Specify the application keys that you specified in the Sentry bundler plugin
    //   filterKeys: ['web'],

    //   // Defines how to handle errors that contain third party stack frames.
    //   // Possible values are:
    //   // - 'drop-error-if-contains-third-party-frames'
    //   // - 'drop-error-if-exclusively-contains-third-party-frames'
    //   // - 'apply-tag-if-contains-third-party-frames'
    //   // - 'apply-tag-if-exclusively-contains-third-party-frames'
    //   behaviour: 'apply-tag-if-contains-third-party-frames',
    // }),
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: false,
      maskAllInputs: false,
      blockAllMedia: false,
    }),
  ],
})
