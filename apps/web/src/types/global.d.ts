import type { CurrencyMetadata, AddressFor as _AddressFor } from 'sushi'
import type { EvmChainId, EvmCurrency, EvmToken } from 'sushi/evm'
import type { SvmChainId, SvmCurrency, SvmToken } from 'sushi/svm'
import type { Address } from 'viem'

export declare global {
  type AddressFor<TChainId extends EvmChainId | SvmChainId> =
    _AddressFor<TChainId>

  type TokenFor<
    TChainId extends EvmChainId | SvmChainId,
    Metadata extends CurrencyMetadata = CurrencyMetadata,
  > = TChainId extends EvmChainId
    ? EvmToken<Metadata>
    : TChainId extends SvmChainId
      ? SvmToken<Metadata>
      : never

  type CurrencyFor<
    TChainId extends EvmChainId | SvmChainId,
    Metadata extends CurrencyMetadata = CurrencyMetadata,
  > = TChainId extends EvmChainId
    ? EvmCurrency<Metadata>
    : TChainId extends SvmChainId
      ? SvmCurrency<Metadata>
      : never

  interface String {
    toLowerCase<T extends string>(this: T): T extends Address ? Address : string
  }
}
