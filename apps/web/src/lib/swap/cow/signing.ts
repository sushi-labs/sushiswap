import {
  CANCELLATIONS_TYPE_FIELDS,
  OrderSigningUtils,
  SigningScheme,
} from '@cowprotocol/cow-sdk'
import { type EvmAddress, isEvmAddressEqual } from 'sushi/evm'
import { type Hex, parseErc6492Signature, recoverAddress } from 'viem'
import type { CowLimitChainId } from './chains'
import { CowUnsupportedSignatureError } from './errors'
import type { CowUnsignedOrder, PreparedCowOrder } from './schema'

interface CowDomain {
  name: string | undefined
  version: string | undefined
  chainId: CowLimitChainId
  verifyingContract: EvmAddress
}

async function getCowDomain(chainId: CowLimitChainId): Promise<CowDomain> {
  const domain = await OrderSigningUtils.getDomain(chainId)
  return {
    name: domain.name,
    version: domain.version,
    chainId,
    verifyingContract: domain.verifyingContract as EvmAddress,
  }
}

export async function getCowTypedData(prepared: PreparedCowOrder): Promise<{
  domain: CowDomain
  types: ReturnType<typeof OrderSigningUtils.getEIP712Types>
  primaryType: 'Order'
  message: CowUnsignedOrder
}> {
  return {
    domain: await getCowDomain(prepared.chainId),
    types: OrderSigningUtils.getEIP712Types(),
    primaryType: 'Order',
    message: prepared.order,
  }
}

export async function getCowCancellationTypedData(
  chainId: CowLimitChainId,
  uid: Hex,
): Promise<{
  domain: CowDomain
  types: { OrderCancellations: typeof CANCELLATIONS_TYPE_FIELDS }
  primaryType: 'OrderCancellations'
  message: { orderUids: Hex[] }
}> {
  return {
    domain: await getCowDomain(chainId),
    types: { OrderCancellations: CANCELLATIONS_TYPE_FIELDS },
    primaryType: 'OrderCancellations',
    message: { orderUids: [uid] },
  }
}

// EOAs (including EIP-7702 delegated ones) produce ECDSA signatures; anything
// else is a contract signature that CoW checks through ERC-1271.
export async function getCowOrderSignature(
  prepared: PreparedCowOrder,
  signature: Hex,
): Promise<{
  signature: Hex
  scheme: SigningScheme.EIP712 | SigningScheme.EIP1271
}> {
  if (signature === '0x')
    throw new CowUnsupportedSignatureError(
      'This wallet cannot return a signature yet, for example a Safe that needs more confirmations. You can authorize the order on-chain instead.',
    )
  // CoW calls ERC-1271 on the deployed owner, so it needs the unwrapped signature.
  const unwrapped = parseErc6492Signature(signature).signature
  const signer = await recoverAddress({
    hash: prepared.digest,
    signature: unwrapped,
  }).catch(() => undefined)

  return {
    signature: unwrapped,
    scheme:
      signer && isEvmAddressEqual(signer, prepared.owner)
        ? SigningScheme.EIP712
        : SigningScheme.EIP1271,
  }
}
