import { notFound } from 'next/navigation'
import type { EvmChainId } from 'sushi/chain'
import { isSushiSwapV3ChainId } from 'sushi/config'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId as EvmChainId
  if (!isSushiSwapV3ChainId(chainId)) {
    return notFound()
  }

  return <>{children}</>
}
