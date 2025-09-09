import { notFound } from 'next/navigation'
import { EvmChainId, isSushiSwapV3ChainId } from 'sushi/evm'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId
  if (!isSushiSwapV3ChainId(chainId)) {
    return notFound()
  }

  return <>{children}</>
}
