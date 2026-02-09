import { type EvmChainId, EvmNative, EvmToken, isEvmChainId } from 'sushi/evm'
import { type SvmChainId, SvmNative, SvmToken, isSvmChainId } from 'sushi/svm'

export function nativeFromChainId<TChainId extends EvmChainId | SvmChainId>(
  chainId: TChainId,
): CurrencyFor<TChainId> {
  if (isSvmChainId(chainId)) {
    return SvmNative.fromChainId(chainId) as CurrencyFor<TChainId>
  }

  if (isEvmChainId(chainId)) {
    return EvmNative.fromChainId(chainId) as CurrencyFor<TChainId>
  }

  throw new Error(`Unsupported chainId: ${chainId}`)
}

export function newToken(
  args: ConstructorParameters<typeof EvmToken>[0],
): EvmToken
export function newToken(
  args: ConstructorParameters<typeof SvmToken>[0],
): SvmToken
export function newToken(
  args:
    | ConstructorParameters<typeof EvmToken>[0]
    | ConstructorParameters<typeof SvmToken>[0],
): EvmToken | SvmToken
export function newToken(
  args:
    | ConstructorParameters<typeof EvmToken>[0]
    | ConstructorParameters<typeof SvmToken>[0],
): EvmToken | SvmToken {
  if (isSvmChainId(args.chainId)) {
    return new SvmToken(args as ConstructorParameters<typeof SvmToken>[0])
  }

  if (isEvmChainId(args.chainId)) {
    return new EvmToken(args as ConstructorParameters<typeof EvmToken>[0])
  }

  throw new Error(`Unsupported chainId: ${args.chainId}`)
}
