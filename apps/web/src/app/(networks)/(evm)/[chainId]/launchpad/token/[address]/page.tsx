import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { EvmAddress } from 'sushi/evm'
import { isAddress } from 'viem'
import {
  getLaunchpadCardValues,
  getLaunchpadCardVersion,
} from '../../_lib/launchpad-card'
import {
  getLaunchpadTokenCardPath,
  getLaunchpadTokenDescription,
  getLaunchpadTokenForSeo,
  getLaunchpadTokenJsonLd,
  getLaunchpadTokenUrl,
  serializeLaunchpadJsonLd,
} from '../../_lib/launchpad-seo'
import { isLaunchpadChainId } from '../../constants'
import { TokenDetailPage } from './_ui/token-detail-page'

type LaunchpadTokenPageParams = Promise<{
  chainId: string
  address: string
}>

async function getTokenFromParams(params: LaunchpadTokenPageParams) {
  const { chainId: chainIdParam, address } = await params
  const chainId = Number(chainIdParam)

  if (!isLaunchpadChainId(chainId) || !isAddress(address, { strict: false })) {
    return null
  }

  const token = await getLaunchpadTokenForSeo(chainId, address as EvmAddress)
  return { address: address as EvmAddress, chainId, token }
}

export async function generateMetadata({
  params,
}: {
  params: LaunchpadTokenPageParams
}): Promise<Metadata> {
  const result = await getTokenFromParams(params)
  if (!result?.token) return {}

  const { token } = result
  const url = getLaunchpadTokenUrl(token)
  const title = `${token.name} (${token.symbol})`
  const description = getLaunchpadTokenDescription(token)
  // Not the opengraph-image convention: its URL only changes per deployment,
  // and an id derived from the data would 404 every card already shared.
  const values = getLaunchpadCardValues(token)
  const image = {
    url: getLaunchpadTokenCardPath(token, getLaunchpadCardVersion(values)),
    width: 1200,
    height: 630,
    alt: `${token.name} (${token.symbol}) market overview on Sushi Launchpad`,
  }

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: 'Sushi',
      title,
      description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default async function LaunchpadTokenPage({
  params,
}: {
  params: LaunchpadTokenPageParams
}) {
  const result = await getTokenFromParams(params)
  if (!result) return notFound()
  const { address, chainId, token } = result

  return (
    <>
      {token ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeLaunchpadJsonLd(getLaunchpadTokenJsonLd(token)),
          }}
        />
      ) : null}
      <TokenDetailPage chainId={chainId} address={address} />
    </>
  )
}
