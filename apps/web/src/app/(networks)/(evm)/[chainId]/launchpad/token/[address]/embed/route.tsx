import { ImageResponse } from 'next/og'
import { getEvmChainById } from 'sushi/evm'
import type { EvmAddress } from 'sushi/evm'
import { isAddress } from 'viem'
import { formatLaunchpadPriceUsd, formatUsd } from '../../../_lib/format'
import {
  getLaunchpadTokenForSeo,
  getLaunchpadTokenLogoUrl,
} from '../../../_lib/launchpad-seo'
import { LaunchpadEmbed } from '../../../_ui/launchpad-embed'
import { isLaunchpadChainId } from '../../../constants'

const IMAGE_SIZE = {
  width: 1200,
  height: 630,
}

export const revalidate = 60

async function getLogoDataUrl(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 60 * 60 },
    })
    if (!response.ok) return undefined

    const contentType = response.headers.get('content-type')
    if (!contentType?.startsWith('image/')) return undefined

    const bytes = await response.arrayBuffer()
    return `data:${contentType};base64,${Buffer.from(bytes).toString('base64')}`
  } catch {
    return undefined
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ chainId: string; address: string }> },
) {
  const { chainId: chainIdParam, address } = await params
  const chainId = Number(chainIdParam)
  const isSupported =
    isLaunchpadChainId(chainId) && isAddress(address, { strict: false })
  const token = isSupported
    ? await getLaunchpadTokenForSeo(chainId, address as EvmAddress)
    : null
  const logoDataUrl = token
    ? await getLogoDataUrl(getLaunchpadTokenLogoUrl(token))
    : undefined
  const chainName = isLaunchpadChainId(chainId)
    ? getEvmChainById(chainId).name
    : 'Sushi'
  const symbol = token?.symbol || 'TOKEN'
  const metrics = token?.metrics

  return new ImageResponse(
    <LaunchpadEmbed
      chainName={chainName}
      title={token?.name || 'Sushi Launchpad token'}
      subtitle="Live market data with permanently locked Sushi V3 liquidity."
      symbol={symbol}
      logoDataUrl={logoDataUrl}
      primaryStat={{
        label: 'Price',
        value: formatLaunchpadPriceUsd(metrics?.priceUsd),
      }}
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
    />,
    IMAGE_SIZE,
  )
}
