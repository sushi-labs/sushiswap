export type RouteAvailability =
  | 'unsupported'
  | 'idle'
  | 'loading'
  | 'available'
  | 'empty'
  | 'error'

export type CrossChainProvider = 'lifi' | 'near-intents' | 'layerzero'

export class NoCrossChainRouteError extends Error {
  constructor(message = 'No route found') {
    super(message)
    this.name = 'NoCrossChainRouteError'
  }
}

export function isNoRouteResponse(status: number, body: unknown): boolean {
  if (status !== 400 && status !== 404 && status !== 422) return false
  if (!body || typeof body !== 'object') return false
  if ('code' in body && (body.code === 'NO_QUOTE' || body.code === 'NO_ROUTE'))
    return true
  return (
    'message' in body &&
    typeof body.message === 'string' &&
    /^no (?:quote|route)s? (?:found|available)\.?$/i.test(body.message.trim())
  )
}

export function isLifiNoRouteResponse(status: number, body: unknown): boolean {
  return (
    (status === 400 || status === 404 || status === 422) &&
    !!body &&
    typeof body === 'object' &&
    'code' in body &&
    body.code === 1002
  )
}

export function canTryNextProvider(availability: RouteAvailability): boolean {
  return availability === 'unsupported' || availability === 'empty'
}

export function getPreferredProvider(
  lifi: RouteAvailability,
  near: RouteAvailability,
): CrossChainProvider {
  if (!canTryNextProvider(lifi)) return 'lifi'
  if (!canTryNextProvider(near)) return 'near-intents'
  return 'layerzero'
}
