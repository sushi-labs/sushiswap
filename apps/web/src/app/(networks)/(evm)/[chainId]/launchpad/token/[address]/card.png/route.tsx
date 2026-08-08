import { ImageResponse } from 'next/og'
import { getEvmChainById, isEvmAddress } from 'sushi/evm'
import { getLaunchpadCardValues } from '../../../_lib/launchpad-card'
import { getLaunchpadEmbedFonts } from '../../../_lib/launchpad-embed-fonts'
import { buildLaunchpadEmbedSparkline } from '../../../_lib/launchpad-embed-sparkline'
import {
  getLaunchpadDayCandlesForSeo,
  getLaunchpadTokenEmbedLogoUrl,
  getLaunchpadTokenForSeo,
} from '../../../_lib/launchpad-seo'
import { LaunchpadTokenEmbed } from '../../../_ui/launchpad-embed'
import { isLaunchpadChainId } from '../../../constants'

const IMAGE_SIZE = {
  width: 1200,
  height: 630,
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

/**
 * The `v` query is a cache buster for social platforms and is deliberately
 * ignored here — an already-shared URL keeps rendering current data instead of
 * going stale or 404ing.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ chainId: string; address: string }> },
) {
  const { chainId: chainIdParam, address } = await params
  const chainId = Number(chainIdParam)
  const isSupportedChain = isLaunchpadChainId(chainId)
  const token =
    isSupportedChain && isEvmAddress(address)
      ? await getLaunchpadTokenForSeo(chainId, address)
      : null
  const [logoDataUrl, candles, fonts] = await Promise.all([
    token ? getLogoDataUrl(getLaunchpadTokenEmbedLogoUrl(token)) : undefined,
    token && isSupportedChain
      ? getLaunchpadDayCandlesForSeo(chainId, token.address)
      : null,
    getLaunchpadEmbedFonts(),
  ])
  const chainName = isSupportedChain ? getEvmChainById(chainId).name : 'Sushi'
  const sparkline = buildLaunchpadEmbedSparkline(candles)
  const values = getLaunchpadCardValues(token)

  return new ImageResponse(
    <LaunchpadTokenEmbed
      chainId={isSupportedChain ? chainId : undefined}
      chainName={chainName}
      changePercent={sparkline?.changePercent ?? null}
      logoDataUrl={logoDataUrl}
      marketCap={values.marketCap}
      name={values.name}
      sparkline={sparkline ?? undefined}
      stats={values.stats}
      symbol={values.symbol}
    />,
    {
      ...IMAGE_SIZE,
      ...(fonts.length === 0 ? {} : { fonts }),
    },
  )
}
