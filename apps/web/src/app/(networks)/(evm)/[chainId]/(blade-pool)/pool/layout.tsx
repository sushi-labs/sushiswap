import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { BLADE_SUPPORTED_NETWORKS } from 'src/config'
import { isBladeChainId } from 'sushi/evm'
import { Header } from '../../header'

interface BladePoolLayoutProps {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}

export default function BladePoolLayout(props: BladePoolLayoutProps) {
  return (
    <Suspense fallback={null}>
      <BladePoolLayoutContent {...props} />
    </Suspense>
  )
}

async function BladePoolLayoutContent(props: BladePoolLayoutProps) {
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
