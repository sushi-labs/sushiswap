import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from 'src/app/(networks)/_ui/header/header'
import { isSupportedChainId } from 'src/config'
import { EvmChainId } from 'sushi/evm'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Swap',
  description:
    'Trade crypto effortlessly with SushiSwap, supporting over 30 chains and featuring a powerful aggregator for the best rates across DeFi.',
}

export default async function SwapLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const { children } = props
  const chainId = +params.chainId

  if (!isSupportedChainId(chainId)) {
    return notFound()
  }

  const headerTheme = chainId === EvmChainId.KATANA ? 'transparent' : 'default'

  return (
    <Providers>
      <Header chainId={chainId} theme={headerTheme} />
      <main className="lg:p-4 mt-16 mb-[86px]">{children}</main>
    </Providers>
  )
}
