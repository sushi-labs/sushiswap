import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isEvmAddress, normalizeEvmAddress } from 'sushi/evm'
import { getCachedLaunchpadToken } from '../../_lib/get-cached-launchpad-token'
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

async function getTokenParams(params: LaunchpadTokenPageParams) {
  const { chainId: chainIdParam, address } = await params
  const chainId = Number(chainIdParam)

  if (!isLaunchpadChainId(chainId) || !isEvmAddress(address)) {
    return null
  }
  const normalizedAddress = normalizeEvmAddress(address)

  return { address: normalizedAddress, chainId }
}

export async function generateMetadata({
  params,
}: {
  params: LaunchpadTokenPageParams
}): Promise<Metadata> {
  const result = await getTokenParams(params)
  if (!result) return {}

  const token = await getLaunchpadTokenForSeo(result.chainId, result.address)
  if (!token) return {}
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
  const result = await getTokenParams(params)
  if (!result) return notFound()
  const { address, chainId } = result
  const token = await getCachedLaunchpadToken({ chainId, address })
  if (!token) return notFound()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeLaunchpadJsonLd(getLaunchpadTokenJsonLd(token)),
        }}
      />
      <TokenDetailPage
        chainId={chainId}
        address={address}
        initialToken={token}
      />
    </>
  )
}
