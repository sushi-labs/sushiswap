import { notFound } from 'next/navigation'
import { isPublicBladeChainId } from 'src/config.server'
import { isBladeChainId } from 'sushi/evm'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId
  if (!isBladeChainId(chainId) || !(await isPublicBladeChainId(chainId))) {
    return notFound()
  }

  return <>{children}</>
}
