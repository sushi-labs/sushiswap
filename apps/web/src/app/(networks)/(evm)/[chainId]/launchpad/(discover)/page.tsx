import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getEvmChainById } from 'sushi/evm'
import {
  getLaunchpadDiscoverJsonLd,
  getLaunchpadTokensForSeo,
  getLaunchpadUrl,
  serializeLaunchpadJsonLd,
} from '../_lib/launchpad-seo'
import { LaunchpadHomePage } from '../_ui/launchpad-home-page'
import { isLaunchpadChainId } from '../constants'

const DESCRIPTION =
  'Create and discover tokens with live markets and permanently locked Sushi V3 liquidity.'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chainId: string }>
}): Promise<Metadata> {
  const chainId = Number((await params).chainId)
  if (!isLaunchpadChainId(chainId)) return {}

  const chain = getEvmChainById(chainId)
  const url = getLaunchpadUrl(chainId)
  const title = `Sushi Launchpad on ${chain.name}`

  // Images come from the opengraph-image file convention.
  return {
    title,
    description: DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: 'Sushi',
      title,
      description: DESCRIPTION,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: DESCRIPTION,
    },
  }
}

export default async function LaunchpadPage({
  params,
}: {
  params: Promise<{ chainId: string }>
}) {
  const chainId = Number((await params).chainId)
  if (!isLaunchpadChainId(chainId)) return notFound()

  const connection = await getLaunchpadTokensForSeo(chainId)
  const jsonLd = getLaunchpadDiscoverJsonLd(chainId, connection)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeLaunchpadJsonLd(jsonLd),
        }}
      />
      <LaunchpadHomePage chainId={chainId} />
    </>
  )
}
