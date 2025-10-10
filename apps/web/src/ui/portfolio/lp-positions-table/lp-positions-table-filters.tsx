import type { PortfolioV2Protocol } from '@sushiswap/graph-client/data-api-portfolio'
import { ProtocolButton } from 'src/app/(networks)/_ui/protocol-button'
import { SushiSwapProtocol } from 'sushi/evm'
import { useLPPositionContext } from '~evm/[chainId]/portfolio/lp-position-provider'
import { LPPositionsNetworkFilter } from './lp-positions-network-filter'

export const LPPositionsTableFilters = () => {
  const {
    state: { protocols },
    mutate: { setProtocols },
  } = useLPPositionContext()

  const handleProtocolClick = (protocol: PortfolioV2Protocol) => {
    if (protocols.includes(protocol)) {
      setProtocols(protocols.filter((p) => p !== protocol))
    } else {
      setProtocols([...protocols, protocol])
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="flex gap-1 items-center">
        <ProtocolButton
          protocol={SushiSwapProtocol.SUSHISWAP_V2}
          selectedProtocol={
            protocols.includes('V2') ? 'SUSHISWAP_V2' : undefined
          }
          onClick={() => handleProtocolClick('V2')}
        />
        <ProtocolButton
          protocol={SushiSwapProtocol.SUSHISWAP_V3}
          selectedProtocol={
            protocols.includes('V3') ? 'SUSHISWAP_V3' : undefined
          }
          onClick={() => handleProtocolClick('V3')}
        />
        <ProtocolButton
          protocol="SUSHISWAP_V4"
          selectedProtocol={
            protocols.includes('V4') ? 'SUSHISWAP_V4' : undefined
          }
          onClick={() => handleProtocolClick('V4')}
        />
        <ProtocolButton
          protocol="BLADE"
          selectedProtocol={protocols.includes('BLADE') ? 'BLADE' : undefined}
          onClick={() => handleProtocolClick('BLADE')}
        />
      </div>
      <LPPositionsNetworkFilter />
    </div>
  )
}
