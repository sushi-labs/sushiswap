import { Providers } from './providers'

export default async function TradeLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const { children } = props

  return <Providers>{children}</Providers>
}
