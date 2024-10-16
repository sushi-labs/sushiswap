import { notFound } from 'next/navigation'
import { isSupportedChainId } from 'src/config'
import { Providers } from './providers'

export default function PoolLayout({
  children,
  params: { chainId },
}: { children: React.ReactNode; params: { chainId: string } }) {
  if (!isSupportedChainId(+chainId)) {
    return notFound()
  }

  return <Providers>{children}</Providers>
}
