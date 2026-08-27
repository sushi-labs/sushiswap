import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { shortenAddress } from 'sushi'
import { getEvmChainById } from 'sushi/evm'
import type { EvmAddress } from 'sushi/evm'
import { isAddress } from 'viem'
import {
  getLaunchpadCreatorDescription,
  getLaunchpadCreatorForSeo,
  getLaunchpadCreatorJsonLd,
  getLaunchpadCreatorUrl,
  serializeLaunchpadJsonLd,
} from '../../_lib/launchpad-seo'
import { isLaunchpadChainId } from '../../constants'
import { CreatorPage } from './_ui/creator-page'

type LaunchpadCreatorPageParams = Promise<{
  chainId: string
  address: string
}>

async function getCreatorFromParams(params: LaunchpadCreatorPageParams) {
  const { chainId: chainIdParam, address } = await params
  const chainId = Number(chainIdParam)

  if (!isLaunchpadChainId(chainId) || !isAddress(address, { strict: false })) {
    return null
  }

  return { address: address as EvmAddress, chainId }
}

export async function generateMetadata({
  params,
}: {
  params: LaunchpadCreatorPageParams
}): Promise<Metadata> {
  const result = await getCreatorFromParams(params)
  if (!result) return {}

  const { address, chainId } = result
  const chain = getEvmChainById(chainId)
  const url = getLaunchpadCreatorUrl(chainId, address)
  const title = `Tokens launched by ${shortenAddress(address)} on ${chain.name}`
  const description = getLaunchpadCreatorDescription(address)

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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

async function LaunchpadCreatorContent({
  params,
}: {
  params: LaunchpadCreatorPageParams
}) {
  const result = await getCreatorFromParams(params)
  if (!result) return notFound()
  const { address, chainId } = result
  const creator = await getLaunchpadCreatorForSeo(chainId, address)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeLaunchpadJsonLd(
            getLaunchpadCreatorJsonLd(chainId, address, creator),
          ),
        }}
      />
      <CreatorPage chainId={chainId} address={address} />
    </>
  )
}

export default function LaunchpadCreatorPage({
  params,
}: {
  params: LaunchpadCreatorPageParams
}) {
  return (
    <Suspense fallback={null}>
      <LaunchpadCreatorContent params={params} />
    </Suspense>
  )
}
