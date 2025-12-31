import type { ChainId } from 'sushi'
import { Header } from './header'
import { Providers } from './providers'

export default async function PerpsLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const { children } = props
  const chainId = +params.chainId as ChainId

  return (
    <Providers>
      <Header chainId={chainId} />
      {children}
    </Providers>
  )
}
