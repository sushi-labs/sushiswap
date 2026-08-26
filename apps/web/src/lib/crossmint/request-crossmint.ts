import {
  type CrossmintEnvironment,
  getCrossmintApiUrl,
  getCrossmintEnvironment,
} from './crossmint-config'

interface CrossmintServerConfig {
  apiKey: string
  apiUrl: string
  environment: CrossmintEnvironment
}

function getCrossmintServerConfig(): CrossmintServerConfig {
  const apiKey = process.env.CROSSMINT_SERVER_SIDE_API_KEY?.trim()

  if (!apiKey) {
    throw new Error('CROSSMINT_SERVER_SIDE_API_KEY is not set')
  }

  let environment: CrossmintEnvironment

  try {
    environment = getCrossmintEnvironment(apiKey)
  } catch {
    throw new Error('CROSSMINT_SERVER_SIDE_API_KEY has an unsupported format')
  }

  return {
    apiKey,
    apiUrl: getCrossmintApiUrl(environment),
    environment,
  }
}

function parseResponseBody(body: string): unknown {
  if (!body) return undefined

  try {
    return JSON.parse(body)
  } catch {
    return body
  }
}

function getCrossmintErrorMessage(payload: unknown): string | undefined {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload &&
    typeof payload.message === 'string'
  ) {
    return payload.message
  }

  return undefined
}

export function getCrossmintServerEnvironment(): CrossmintEnvironment {
  return getCrossmintServerConfig().environment
}

export async function requestCrossmint(
  path: string,
  method: 'GET' | 'POST' | 'PUT',
  body?: unknown,
): Promise<unknown> {
  const { apiKey, apiUrl } = getCrossmintServerConfig()
  const response = await fetch(`${apiUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
  })
  const payload = parseResponseBody(await response.text())

  if (!response.ok) {
    const message = getCrossmintErrorMessage(payload)
    throw new Error(
      message
        ? `Crossmint request failed: ${message}`
        : `Crossmint request failed with status ${response.status}`,
    )
  }

  return payload
}
