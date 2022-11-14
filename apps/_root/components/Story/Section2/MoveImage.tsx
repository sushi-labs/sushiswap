import { ChainId } from '@sushiswap/chain'
import { SUSHI } from '@sushiswap/currency'
import { Currency } from '@sushiswap/ui'

import { NetworkStellarSVG } from '../../SVG/NetworkStellarSVG'

export const MoveImage = () => {
  return (
    <div className="relative scale-[0.9] sm:scale-[1] relative relative -right-[120px] sm:left-0">
      <NetworkStellarSVG width={423} height={320} />
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center z-[2]">
        <Currency.Icon currency={SUSHI[ChainId.ETHEREUM]} width={112} height={112} />
      </div>
    </div>
  )
}
