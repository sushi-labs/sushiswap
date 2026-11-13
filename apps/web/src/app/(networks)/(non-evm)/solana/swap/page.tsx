import { SvmChainId } from 'sushi/svm'
import { UnifiedSwap } from '~evm/[chainId]/(trade)/swap/unified-swap'

export default function SwapSimplePage() {
  return <UnifiedSwap chainId={SvmChainId.SOLANA} />
}
