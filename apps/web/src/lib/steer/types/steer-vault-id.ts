import type { EvmAddress, EvmID } from 'sushi/evm'
import type { SteerChainId } from '../config.js'

export type SteerVaultId = {
  id: EvmID
  address: EvmAddress
  chainId: SteerChainId
}
