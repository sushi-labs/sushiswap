import { ImageResponse } from 'next/og'
import { getEvmChainById } from 'sushi/evm'
import { getLaunchpadEmbedFonts } from './_lib/launchpad-embed-fonts'
import { LaunchpadDiscoverEmbed } from './_ui/launchpad-embed'
import { isLaunchpadChainId } from './constants'

export const alt = 'Discover tokens on Sushi Launchpad'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ chainId: string }>
}) {
  const chainId = Number((await params).chainId)
  const isSupported = isLaunchpadChainId(chainId)
  const chainName = isSupported ? getEvmChainById(chainId).name : 'Sushi'
  const fonts = await getLaunchpadEmbedFonts()

  return new ImageResponse(
    <LaunchpadDiscoverEmbed
      chainId={isSupported ? chainId : undefined}
      chainName={chainName}
    />,
    {
      ...size,
      ...(fonts.length === 0 ? {} : { fonts }),
    },
  )
}
