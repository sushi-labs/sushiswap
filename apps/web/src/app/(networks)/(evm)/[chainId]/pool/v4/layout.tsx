import { notFound } from 'next/navigation'
import { isSushiSwapV4ChainId } from 'src/lib/pool/v4'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const { chainId: chainIdParam } = await props.params

  if (!isSushiSwapV4ChainId(+chainIdParam)) {
    return notFound()
  }

  return props.children
}
