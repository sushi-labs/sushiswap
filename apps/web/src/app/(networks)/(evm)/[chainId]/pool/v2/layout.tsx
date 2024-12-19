import { notFound } from 'next/navigation'
import { ChainId } from 'sushi/chain'
import { isSushiSwapV2ChainId } from 'sushi/config'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId as ChainId
  if (!isSushiSwapV2ChainId(chainId)) {
    return notFound()
  }

  return <>{children}</>
}
