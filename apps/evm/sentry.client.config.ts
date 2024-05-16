// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'
import { ErrorEvent, EventHint } from '@sentry/nextjs'
import { getAccount } from '@sushiswap/wagmi'
import { didUserReject } from 'src/lib/swap/swapErrorToUserReadableMessage'
import { wagmiConfig } from 'src/lib/wagmi'
import { v4 as uuidv4 } from 'uuid'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  integrations: [Sentry.browserTracingIntegration()],

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  // debug: process.env.NODE_ENV !== 'production',
  debug: false,

  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV
    ? process.env.NEXT_PUBLIC_VERCEL_ENV
    : 'local',

  beforeBreadcrumb(breadcrumb) {
    if (
      breadcrumb.category &&
      ['fetch', 'console'].includes(breadcrumb.category)
    ) {
      return null
    }
    return breadcrumb
  },
  beforeSend(event, hint) {
    if (shouldRejectError(hint.data)) {
      return null
    }

    updateConnection(event)

    return event
  },
})

function updateConnection(event: ErrorEvent) {
  const { status, address, connector, chainId } = getAccount(wagmiConfig)
  event.extra = {
    ...event.extra,
    connection: {
      chain_id: chainId,
      type: connector?.type,
      name: connector?.name,
      rdns: connector?.id,
      address,
      status,
    },
  }
  event.tags = {
    ...event.tags,
    connectionStatus: status,
    connection: connector?.id ?? connector?.name ?? connector?.type,
  }
}

type ErrorLike = Partial<Error> & Required<Pick<Error, 'message'>>

function isErrorLike(error: unknown): error is ErrorLike {
  return (
    error instanceof Object &&
    'message' in error &&
    typeof (error as Partial<ErrorLike>)?.message === 'string'
  )
}

/** Identifies ethers request errors (as thrown by {@type import(@ethersproject/web).fetchJson}). */
function isEthersRequestErrorLike(
  error: ErrorLike,
): error is ErrorLike & { requestBody: string } {
  return (
    'requestBody' in error &&
    typeof (error as Record<'requestBody', unknown>).requestBody === 'string'
  )
}

function shouldRejectError(error: EventHint['originalException']) {
  // Some libraries throw ErrorLike objects ({ code, message, stack }) instead of true Errors.
  if (isErrorLike(error)) {
    if (isEthersRequestErrorLike(error)) {
      const method = JSON.parse(error.requestBody).method
      // ethers aggressively polls for block number, and it sometimes fails (whether spuriously or through rate-limiting).
      // If block number polling, it should not be considered an exception.
      if (method === 'eth_blockNumber') return true
    }

    // If the error is based on a user rejecting, it should not be considered an exception.
    if (didUserReject(error)) return true
  }
  return false
}

// This is used to identify the user in Sentry.
const SENTRY_USER_ID_KEY = 'sentry-user-id'

let sentryUserId = localStorage.getItem(SENTRY_USER_ID_KEY)
if (!sentryUserId) {
  sentryUserId = uuidv4()
  localStorage.setItem(SENTRY_USER_ID_KEY, sentryUserId)
}
Sentry.setUser({ id: sentryUserId })
