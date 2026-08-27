import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AutoDarkMode } from 'src/lib/perps/auto-dark-mode'
import { getEvmChainById } from 'sushi/evm'
import { getStaticChainParams } from '~evm/[chainId]/get-static-chain-params'
import { LaunchpadHeader } from './_ui/launchpad-header'
import { LAUNCHPAD_SUPPORTED_CHAIN_IDS, isLaunchpadChainId } from './constants'

export const metadata: Metadata = {
  title: 'Launchpad',
  description:
    'Create and discover tokens with permanently locked Sushi liquidity.',
}

export function generateStaticParams() {
  return getStaticChainParams(LAUNCHPAD_SUPPORTED_CHAIN_IDS)
}

export default async function LaunchpadLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const chainId = Number((await params).chainId)

  if (!isLaunchpadChainId(chainId)) return notFound()

  const chainKey = getEvmChainById(chainId).key

  return (
    <>
      <LaunchpadHeader
        chainId={chainId}
        chainKey={chainKey}
        networks={LAUNCHPAD_SUPPORTED_CHAIN_IDS}
      />
      <AutoDarkMode />
      <div className="relative min-h-[calc(100vh-56px)] overflow-x-hidden bg-perps-background text-perps-muted">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] overflow-hidden">
          <div className="absolute left-[5%] top-0 h-72 w-72 rounded-full bg-perps-blue/[0.08] blur-3xl" />
          <div className="absolute right-[8%] top-16 h-80 w-80 rounded-full bg-pink-500/[0.06] blur-3xl" />
        </div>
        <main className="relative flex flex-1 flex-col">{children}</main>
      </div>
    </>
  )
}
