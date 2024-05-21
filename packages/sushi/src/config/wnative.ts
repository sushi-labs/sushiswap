import { zeroAddress } from 'viem'
import { ChainId } from '../chain'
import { WNATIVE_ADDRESS } from '../currency'

export const isWNativeSupported = (chainId: ChainId) =>
  WNATIVE_ADDRESS[chainId] !== zeroAddress
