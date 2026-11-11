import { NetworkIcon } from '@sushiswap/ui/icons/network-icon'
import type { SupportedChainId } from 'src/config'
import { getNetworkName } from 'src/lib/network'

export const SwapInputLabel = ({
  chainId,
  type,
}: {
  chainId: SupportedChainId
  type: 'INPUT' | 'OUTPUT'
}) => {
  return (
    <div className="flex items-center text-xs">
      <p className="text-primary mr-1">{type === 'INPUT' ? 'From:' : 'To:'}</p>
      <NetworkIcon chainId={chainId} width={14} height={14} />
      <p className="ml-0.5 text-muted-foreground">{getNetworkName(chainId)}</p>
    </div>
  )
}
