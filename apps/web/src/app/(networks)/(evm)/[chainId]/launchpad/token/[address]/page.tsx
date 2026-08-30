import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { type EvmAddress, isEvmAddress, normalizeEvmAddress } from 'sushi/evm'
import { getCachedLaunchpadTokenDefinition } from '../../_lib/get-cached-launchpad-token-definition'
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
import { type LaunchpadChainId, isLaunchpadChainId } from '../../constants'
import { TokenDetailPage } from './_ui/token-detail-page'
import { TokenDetailSkeleton } from './_ui/token-detail-skeleton'

type LaunchpadTokenPageParams = Promise<{
  chainId: string
  address: string
}>

async function LaunchpadTokenStructuredData({
  chainId,
  address,
}: {
  chainId: LaunchpadChainId
  address: EvmAddress
}) {
  const token = await getLaunchpadTokenForSeo(chainId, address)
  if (!token) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeLaunchpadJsonLd(getLaunchpadTokenJsonLd(token)),
      }}
    />
  )
}

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

async function LaunchpadTokenContent({
  params,
}: {
  params: LaunchpadTokenPageParams
}) {
  const result = await getTokenParams(params)
  if (!result) return notFound()
  const { chainId, address } = result
  const definition = await getCachedLaunchpadTokenDefinition({
    chainId,
    address,
  })
  if (!definition) return notFound()

  return (
    <>
      <Suspense fallback={null}>
        <LaunchpadTokenStructuredData chainId={chainId} address={address} />
      </Suspense>
      <TokenDetailPage
        chainId={chainId}
        address={address}
        definition={definition}
      />
    </>
  )
}

export default function LaunchpadTokenPage({
  params,
}: {
  params: LaunchpadTokenPageParams
}) {
  return (
    <Suspense fallback={<TokenDetailSkeleton />}>
      <LaunchpadTokenContent params={params} />
    </Suspense>
  )
}
