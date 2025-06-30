import { notFound } from 'next/navigation'
import type { EvmChainId } from 'sushi/chain'
import { BLADE_SUPPORTED_CHAIN_IDS, isBladeChainId } from 'sushi/config'
import { Header } from '../../header'

export default async function BladePoolLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId as EvmChainId
  if (!isBladeChainId(chainId)) {
    return notFound()
  }

  return (
    <>
      <Header chainId={chainId} supportedNetworks={BLADE_SUPPORTED_CHAIN_IDS} />
      <main className="flex flex-col h-full flex-1 animate-slide">
        {children}
      </main>
    </>
  )
}
