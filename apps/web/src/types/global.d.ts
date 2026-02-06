import type {
  CurrencyMetadata,
  AddressFor as _AddressFor,
  CurrencyFor as _CurrencyFor,
  TokenFor as _TokenFor,
  TxHashFor as _TxHashFor,
} from 'sushi'
import type { EvmChainId, EvmCurrency, EvmToken } from 'sushi/evm'
import type { SvmChainId, SvmCurrency, SvmToken } from 'sushi/svm'
import type { Address } from 'viem'

export declare global {
  type AddressFor<TChainId extends EvmChainId | SvmChainId> =
    _AddressFor<TChainId>

  type TokenFor<
    TChainId extends EvmChainId | SvmChainId,
    Metadata extends CurrencyMetadata = CurrencyMetadata,
  > = _TokenFor<TChainId, Metadata>

  type CurrencyFor<
    TChainId extends EvmChainId | SvmChainId,
    Metadata extends CurrencyMetadata = CurrencyMetadata,
  > = _CurrencyFor<TChainId, Metadata>

  type TxHashFor<TChainId extends EvmChainId | SvmChainId> =
    _TxHashFor<TChainId>

  interface String {
    toLowerCase<T extends string>(this: T): T extends Address ? Address : string
  }
}
