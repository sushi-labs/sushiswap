import { notFound } from 'next/navigation'
import { isSupportedChainId } from 'src/config'

export default async function PoolLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { chainId } = params

  const { children } = props

  if (!isSupportedChainId(+chainId)) {
    return notFound()
  }

  return children
}
