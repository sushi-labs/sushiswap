export async function register() {
  await import('sushi/bigint-serializer')

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config')
  }
}

export const onRequestError = (...args) => {
  Sentry.captureRequestError(...args)

  // ... additional logic here
}
