import { notFound } from 'next/navigation'
import { isUnifiedSwapChainId } from 'src/lib/swap/unified-swap'
import { isEvmChainId } from 'sushi/evm'
import { UnifiedSwap } from './unified-swap'

export default async function SwapSimplePage({
  params,
}: { params: Promise<{ chainId: string }> }) {
  const chainId = Number((await params).chainId)
  if (!isUnifiedSwapChainId(chainId) || !isEvmChainId(chainId))
    return notFound()
  return <UnifiedSwap chainId={chainId} />
}
