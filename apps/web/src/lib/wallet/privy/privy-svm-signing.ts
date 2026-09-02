import type { SendTransactionModalUIOptions } from '@privy-io/react-auth'
import type { PrivyStandardWallet } from '@privy-io/react-auth/solana'

type PrivySvmSignAndSendFeature = Pick<
  PrivyStandardWallet['features']['privy:']['privy'],
  'signAndSendTransaction'
>

interface SignAndSendPrivySvmTransactionInput {
  address: string
  chain: 'solana:mainnet'
  options?: { uiOptions?: SendTransactionModalUIOptions }
  transaction: Uint8Array
}

export async function signAndSendPrivySvmTransaction(
  privy: PrivySvmSignAndSendFeature,
  input: SignAndSendPrivySvmTransactionInput,
): Promise<{ signature: Uint8Array }> {
  // Privy's implementation accesses private fields through `this`, so the
  // feature method must not be called as a detached function.
  // Its injected implementation also accepts the public hook's UI options,
  // although the lower-level feature type omits them.
  const privyWithUiOptions = privy as unknown as {
    signAndSendTransaction(
      input: SignAndSendPrivySvmTransactionInput,
    ): Promise<{ signature: Uint8Array }>
  }
  return privyWithUiOptions.signAndSendTransaction(input)
}
