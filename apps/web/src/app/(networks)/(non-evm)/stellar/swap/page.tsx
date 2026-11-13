import { StellarChainId } from 'sushi/stellar'
import { UnifiedSwap } from '~evm/[chainId]/(trade)/swap/unified-swap'

export default function SwapSimplePage() {
  return <UnifiedSwap chainId={StellarChainId.STELLAR} />
}
