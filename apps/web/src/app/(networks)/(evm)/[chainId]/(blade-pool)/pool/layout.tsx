import { notFound } from 'next/navigation'
import { BLADE_SUPPORTED_NETWORKS } from 'src/config'
import { isBladeChainId } from 'sushi/evm'
import { Header } from '../../header'

export default async function BladePoolLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId
  if (!isBladeChainId(chainId)) {
    return notFound()
  }

  return (
    <>
      <Header chainId={chainId} networks={BLADE_SUPPORTED_NETWORKS} />
      <main className="flex flex-col h-full flex-1 animate-slide">
        {children}
      </main>
    </>
  )
}
