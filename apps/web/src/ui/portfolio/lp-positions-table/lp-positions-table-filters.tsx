import { ProtocolButton } from 'src/app/(networks)/_ui/protocol-button'
import { SushiSwapProtocol } from 'sushi/evm'
import { LPPositionsNetworkFilter } from './lp-positions-network-filter'

export const LPPositionsTableFilters = () => {
  return (
    <div className="flex gap-2 items-center">
      <div className="flex gap-1 items-center">
        <ProtocolButton protocol={SushiSwapProtocol.SUSHISWAP_V2} />
        <ProtocolButton protocol={SushiSwapProtocol.SUSHISWAP_V3} />
        <ProtocolButton protocol="SUSHISWAP_V4" />
        <ProtocolButton protocol="BLADE" />
      </div>
      <LPPositionsNetworkFilter />
    </div>
  )
}
