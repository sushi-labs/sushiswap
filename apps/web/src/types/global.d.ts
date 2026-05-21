import type {
  CurrencyMetadata,
  AddressFor as _AddressFor,
  CurrencyFor as _CurrencyFor,
  TokenFor as _TokenFor,
  TxHashFor as _TxHashFor,
} from 'sushi'
import type { EvmChainId, EvmCurrency, EvmToken } from 'sushi/evm'
import type { StellarAccountAddress, StellarChainId } from 'sushi/stellar'
import type { SvmChainId, SvmCurrency, SvmToken } from 'sushi/svm'
import type { Address } from 'viem'

export declare global {
  type WalletAddressFor<
    TChainId extends EvmChainId | SvmChainId | StellarChainId,
  > = TChainId extends StellarChainId
    ? StellarAccountAddress
    : _AddressFor<TChainId>

  type AddressFor<TChainId extends EvmChainId | SvmChainId | StellarChainId> =
    _AddressFor<TChainId>

  type TokenFor<
    TChainId extends EvmChainId | SvmChainId | StellarChainId,
    Metadata extends CurrencyMetadata = CurrencyMetadata,
  > = _TokenFor<TChainId, Metadata>

  type CurrencyFor<
    TChainId extends EvmChainId | SvmChainId | StellarChainId,
    Metadata extends CurrencyMetadata = CurrencyMetadata,
  > = _CurrencyFor<TChainId, Metadata>

  type TxHashFor<TChainId extends EvmChainId | SvmChainId | StellarChainId> =
    _TxHashFor<TChainId>

  interface String {
    toLowerCase<T extends string>(this: T): T extends Address ? Address : string
  }
}
