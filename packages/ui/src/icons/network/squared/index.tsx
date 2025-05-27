import { ChainId } from 'sushi/chain'
import type { IconComponent } from '../../../types'
import { EthereumSquare } from './EthereumSquare'

export const NETWORK_SQUARE_ICON: Partial<
  Record<ChainId | string, IconComponent>
> = {
  [ChainId.ETHEREUM]: EthereumSquare,
}
