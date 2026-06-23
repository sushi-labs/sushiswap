import type { EvmChainId } from 'sushi/evm'
import type { StellarChainId } from 'sushi/stellar'
import type { SvmChainId } from 'sushi/svm'

export type TokenSelectorChainId = EvmChainId | SvmChainId | StellarChainId
