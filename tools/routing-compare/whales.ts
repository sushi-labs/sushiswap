import { ChainId } from 'sushi'
import { WETH9_ADDRESS } from 'sushi/currency'
import { Address } from 'viem'

export const whales: Record<number, Record<Address, Address>> = {
  [ChainId.ETHEREUM]: {
    '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE':
      WETH9_ADDRESS[ChainId.ETHEREUM],
  },
}
