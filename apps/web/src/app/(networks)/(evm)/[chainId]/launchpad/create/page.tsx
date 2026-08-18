import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getEvmChainById } from 'sushi/evm'
import { getLaunchpadCreateUrl } from '../_lib/launchpad-seo'
import { isLaunchpadChainId } from '../constants'
import { CreateLaunchPage } from './_ui/create-launch-page'

const DESCRIPTION =
  'Launch a token in minutes with a live market and permanently locked Sushi V3 liquidity.'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chainId: string }>
}): Promise<Metadata> {
  const chainId = Number((await params).chainId)
  if (!isLaunchpadChainId(chainId)) return {}

  const chain = getEvmChainById(chainId)
  const url = getLaunchpadCreateUrl(chainId)
  const title = `Create a token on ${chain.name}`

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

export default async function CreatePage({
  params,
}: {
  params: Promise<{ chainId: string }>
}) {
  const chainId = Number((await params).chainId)
  if (!isLaunchpadChainId(chainId)) return notFound()

  return <CreateLaunchPage chainId={chainId} />
}
