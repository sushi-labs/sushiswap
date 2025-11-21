import { isBladeChainId } from '@sushiswap/graph-client/data-api'
import { notFound } from 'next/navigation'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId
  if (!isBladeChainId(chainId)) {
    return notFound()
  }

  return <>{children}</>
}
