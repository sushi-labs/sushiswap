import { type EvmAddress, isEvmAddress } from 'sushi/evm'

export const viewAllHrefs = [
  '/perps/tradeHistory',
  '/perps/fundingHistory',
  '/perps/historicalOrders',
  '/perps/borrowLendInterest',
  '/perps/transferHistory',
  '/perps/twapHistory',
  '/perps/twapFillHistory',
] as const

export type ViewAllHref = (typeof viewAllHrefs)[number]

interface ViewAllRoute {
  href: ViewAllHref
  address: EvmAddress
}

export function getViewAllHrefFromSegment(
  segment: string,
): ViewAllHref | undefined {
  const href = `/perps/${segment}`
  return viewAllHrefs.find((viewAllHref) => viewAllHref === href)
}

export function getViewAllRoute(
  segments: readonly string[] | undefined,
): ViewAllRoute | undefined {
  if (segments?.length !== 2) return undefined

  const [hrefSegment, address] = segments
  const href = getViewAllHrefFromSegment(hrefSegment)

  if (!href || !isEvmAddress(address)) return undefined

  return { href, address }
}

export function getViewAllRouteFromPathname(
  pathname: string,
): ViewAllRoute | undefined {
  const segments = pathname.split('/').filter(Boolean)

  if (segments[0] !== 'perps') return undefined

  return getViewAllRoute(segments.slice(1))
}
