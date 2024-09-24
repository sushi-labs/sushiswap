import { captureRequestError } from '@sentry/nextjs'

function bigintSeriliazer() {
  const originalStringify = JSON.stringify
  const stringify = (value: any, replacer?: any, space?: string | number) => {
    return originalStringify(
      value,
      function (key: string, value: any) {
        if (typeof value === 'bigint') {
          // Check if the reviver supports BigInt
          try {
            if (replacer && !Array.isArray(replacer)) {
              return replacer.call(this, key, value)
            }
          } catch {}

          return {
            __type: 'bigint',
            value: value.toString(),
          }
        }
        if (Array.isArray(replacer)) {
          // If replacer is an array, only include the keys specified in the array
          return replacer.includes(key) ? value : undefined
        }
        if (replacer) {
          return replacer.call(this, key, value)
        }
        return value
      },
      space,
    )
  }
  JSON.stringify = stringify

  const originalParse = JSON.parse
  const parse = (
    text: string,
    reviver?: (this: any, key: string, value: any) => any,
  ) => {
    return originalParse(text, function (key: string, value: any) {
      if (value && typeof value === 'object' && value.__type === 'bigint') {
        value = BigInt(value.value)
      }
      if (reviver) {
        return reviver.call(this, key, value)
      }
      return value
    })
  }
  JSON.parse = parse

  return { stringify, parse }
}

export const { stringify, parse } = bigintSeriliazer()

export async function register() {
  bigintSeriliazer()

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config')
  }
}

export const onRequestError = captureRequestError
