import type { Wallet } from '../../types'
import type { EvmAdapterId } from './config'

export interface EvmWallet extends Wallet {
  namespace: 'evm'
  adapterId: EvmAdapterId
}

export function isEvmWallet(wallet: Wallet): wallet is EvmWallet {
  return wallet.namespace === 'evm'
}
