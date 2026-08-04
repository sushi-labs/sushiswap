import { ImageResponse } from 'next/og'
import { getEvmChainById, isEvmAddress } from 'sushi/evm'
import { formatUsd } from '../../_lib/format'
import { getLaunchpadEmbedFonts } from '../../_lib/launchpad-embed-fonts'
import { buildLaunchpadEmbedSparkline } from '../../_lib/launchpad-embed-sparkline'
import {
  getLaunchpadDayCandlesForSeo,
  getLaunchpadTokenEmbedLogoUrl,
  getLaunchpadTokenForSeo,
} from '../../_lib/launchpad-seo'
import { LaunchpadTokenEmbed } from '../../_ui/launchpad-embed'
import { isLaunchpadChainId } from '../../constants'

const DEFAULT_ALT = 'Sushi Launchpad token market overview'
const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'
export const revalidate = 60

/** Only here to give each card alt text naming its own token. */
export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ chainId: string; address: string }>
}) {
  const token = await getTokenFromParams(params)

  return [
    {
      id: 'market-overview',
      alt: token
        ? `${token.name} (${token.symbol}) market overview on Sushi Launchpad`
        : DEFAULT_ALT,
      contentType,
      size,
    },
  ]
}

/** Formats satori can rasterize. Anything else takes the initial fallback. */
const SUPPORTED_LOGO_CONTENT_TYPES = ['image/png', 'image/jpeg']

async function getLogoDataUrl(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 60 * 60 },
    })
    if (!response.ok) return undefined

    const contentType = response.headers.get('content-type')?.split(';')[0]
    if (!contentType || !SUPPORTED_LOGO_CONTENT_TYPES.includes(contentType)) {
      return undefined
    }

    const bytes = await response.arrayBuffer()
    return `data:${contentType};base64,${Buffer.from(bytes).toString('base64')}`
  } catch {
    return undefined
  }
}

async function getTokenFromParams(
  params: Promise<{ chainId: string; address: string }>,
) {
  const { chainId: chainIdParam, address } = await params
  const chainId = Number(chainIdParam)

  if (!isLaunchpadChainId(chainId) || !isEvmAddress(address)) return null

  return getLaunchpadTokenForSeo(chainId, address)
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ chainId: string; address: string }>
}) {
  const { chainId: chainIdParam } = await params
  const chainId = Number(chainIdParam)
  const isSupportedChain = isLaunchpadChainId(chainId)
  const token = await getTokenFromParams(params)
  const [logoDataUrl, candles, fonts] = await Promise.all([
    token ? getLogoDataUrl(getLaunchpadTokenEmbedLogoUrl(token)) : undefined,
    token && isSupportedChain
      ? getLaunchpadDayCandlesForSeo(chainId, token.address)
      : null,
    getLaunchpadEmbedFonts(),
  ])
  const chainName = isSupportedChain ? getEvmChainById(chainId).name : 'Sushi'
  const metrics = token?.metrics
  const sparkline = buildLaunchpadEmbedSparkline(candles)

  return new ImageResponse(
    <LaunchpadTokenEmbed
      chainId={isSupportedChain ? chainId : undefined}
      chainName={chainName}
      changePercent={sparkline?.changePercent ?? null}
      logoDataUrl={logoDataUrl}
      marketCap={formatUsd(metrics?.marketCapitalizationUsd)}
      name={token?.name || 'Sushi Launchpad token'}
      sparkline={sparkline ?? undefined}
      stats={[
        {
          label: '24h volume',
          value: formatUsd(metrics?.volumeUsd.h24),
        },
        {
          label: 'Liquidity',
          value: formatUsd(metrics?.currentTvlUsd),
        },
      ]}
      symbol={token?.symbol || 'TOKEN'}
    />,
    {
      ...size,
      ...(fonts.length === 0 ? {} : { fonts }),
    },
  )
}
