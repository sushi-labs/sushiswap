import { ImageResponse } from 'next/og'
import { getEvmChainById } from 'sushi/evm'
import { LaunchpadEmbed } from '../_lib/launchpad-embed'
import { getLaunchpadTokensForSeo } from '../_lib/launchpad-seo'
import { isLaunchpadChainId } from '../constants'

const IMAGE_SIZE = {
  width: 1200,
  height: 630,
}

export const revalidate = 60

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ chainId: string }> },
) {
  const chainId = Number((await params).chainId)
  const isSupported = isLaunchpadChainId(chainId)
  const connection = isSupported
    ? await getLaunchpadTokensForSeo(chainId)
    : null
  const chainName = isSupported ? getEvmChainById(chainId).name : 'Sushi'

  return new ImageResponse(
    <LaunchpadEmbed
      chainName={chainName}
      title="Discover tokens as they launch."
      subtitle="Follow live markets and launch with permanently locked Sushi V3 liquidity."
      stats={[
        {
          label: 'Tokens launched',
          value: connection
            ? connection.totalCount.toLocaleString('en-US')
            : '—',
        },
        { label: 'Liquidity', value: 'Permanently locked' },
        { label: 'Market feeds', value: 'Live' },
      ]}
    />,
    IMAGE_SIZE,
  )
}
