import { notFound } from 'next/navigation'
import { getPublicBladeChainIds, isPublicBladeChainId } from 'src/config.server'
import { isBladeChainId } from 'sushi/evm'
import { Header } from '../../header'

export default async function BladePoolLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId
  if (!isBladeChainId(chainId) || !(await isPublicBladeChainId(chainId))) {
    return notFound()
  }

  const bladeChainIds = await getPublicBladeChainIds()

  return (
    <>
      <Header chainId={chainId} networks={bladeChainIds} />
      <main className="flex flex-col h-full flex-1 animate-slide">
        {children}
      </main>
    </>
  )
}
