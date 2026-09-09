import { BASE_FEE, Horizon, StrKey, contract, rpc } from '@stellar/stellar-sdk'
import {
  HORIZON_URL,
  NETWORK_PASSPHRASE,
  RPC_HEADERS,
  RPC_URL,
} from 'src/app/(networks)/(non-evm)/stellar/_common/lib/constants'
import {
  STELLAR_USDT0,
  type StellarAccountAddress,
  StellarChainId,
} from 'sushi/stellar'
import { hexToBytes, parseUnits, toHex } from 'viem'
import * as z from 'zod'
import { LAYERZERO_STELLAR_OFT_ADDRESS } from './config'
import type { LayerZeroSendParam } from './types'

let specPromise: Promise<contract.Spec> | undefined

function getStellarOftSpec(): Promise<contract.Spec> {
  specPromise ??= contract.Client.from({
    contractId: LAYERZERO_STELLAR_OFT_ADDRESS,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    headers: RPC_HEADERS,
  })
    .then((client) => client.spec)
    .catch((error: unknown) => {
      specPromise = undefined
      throw error
    })
  return specPromise
}

export function encodeStellarLayerZeroRecipient(
  address: StellarAccountAddress,
): `0x${string}` {
  return toHex(StrKey.decodeEd25519PublicKey(address))
}

function toStellarSendParam(param: LayerZeroSendParam) {
  return {
    dst_eid: param.dstEid,
    to: hexToBytes(param.to),
    amount_ld: param.amountLD,
    min_amount_ld: param.minAmountLD,
    extra_options: hexToBytes(param.extraOptions),
    compose_msg: hexToBytes(param.composeMsg),
    oft_cmd: hexToBytes(param.oftCmd),
  }
}

async function getStellarInclusionFee(): Promise<string> {
  const server = new rpc.Server(RPC_URL, { headers: RPC_HEADERS })
  const stats = await server.getFeeStats()
  const estimate = z
    .string()
    .regex(/^\d+$/, 'Invalid Stellar inclusion fee estimate')
    .transform(BigInt)
    .parse(stats.sorobanInclusionFee.p95)
  // Soroban has its own surge pricing. Allow headroom while the wallet signs;
  // simulation adds the separate resource fee to this inclusion-fee bid.
  const buffered = estimate * 2n
  return (buffered > BigInt(BASE_FEE) ? buffered : BigInt(BASE_FEE)).toString()
}

async function buildStellarOftTransaction(
  method: 'quote_oft' | 'quote_send' | 'send',
  args: Record<string, unknown>,
  publicKey?: StellarAccountAddress,
): Promise<contract.AssembledTransaction<unknown>> {
  const [spec, inclusionFee] = await Promise.all([
    getStellarOftSpec(),
    method === 'send' ? getStellarInclusionFee() : undefined,
  ])
  return contract.AssembledTransaction.build({
    contractId: LAYERZERO_STELLAR_OFT_ADDRESS,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    headers: RPC_HEADERS,
    publicKey,
    fee: inclusionFee,
    timeoutInSeconds: 180,
    method,
    args: spec.funcArgsToScVals(method, args),
    parseResultXdr: (result) => spec.funcResToNative(method, result),
  })
}

const oftQuoteSchema = z.tuple([
  z.object({ min_amount_ld: z.bigint(), max_amount_ld: z.bigint() }),
  z.array(z.unknown()),
  z.object({
    amount_sent_ld: z.bigint().nonnegative(),
    amount_received_ld: z.bigint().nonnegative(),
  }),
])
const messagingFeeSchema = z.object({
  native_fee: z.bigint().nonnegative(),
  zro_fee: z.bigint().nonnegative(),
})

export async function quoteStellarOft(
  from: StellarAccountAddress,
  sendParam: LayerZeroSendParam,
): Promise<{
  minAmount: bigint
  maxAmount: bigint
  amountSent: bigint
  amountReceived: bigint
}> {
  const transaction = await buildStellarOftTransaction('quote_oft', {
    from,
    send_param: toStellarSendParam(sendParam),
  })
  const [limit, , receipt] = oftQuoteSchema.parse(transaction.result)
  return {
    minAmount: limit.min_amount_ld,
    maxAmount: limit.max_amount_ld,
    amountSent: receipt.amount_sent_ld,
    amountReceived: receipt.amount_received_ld,
  }
}

export async function quoteStellarMessagingFee(
  from: StellarAccountAddress,
  sendParam: LayerZeroSendParam,
): Promise<bigint> {
  const transaction = await buildStellarOftTransaction('quote_send', {
    from,
    send_param: toStellarSendParam(sendParam),
    pay_in_zro: false,
  })
  const fee = messagingFeeSchema.parse(transaction.result)
  if (fee.zro_fee !== 0n) throw new Error('Unsupported LayerZero token fee')
  return fee.native_fee
}

export async function buildStellarOftSend({
  from,
  sendParam,
  nativeFee,
}: {
  from: StellarAccountAddress
  sendParam: LayerZeroSendParam
  nativeFee: bigint
}): Promise<contract.AssembledTransaction<unknown>> {
  const transaction = await buildStellarOftTransaction(
    'send',
    {
      from,
      send_param: toStellarSendParam(sendParam),
      fee: { native_fee: nativeFee, zro_fee: 0n },
      refund_address: from,
    },
    from,
  )
  // The SDK returns a built envelope even when simulation fails. Only a
  // successful simulation supplies the resources and authorization for signing.
  if (!transaction.simulation) {
    throw new Error('Stellar LayerZero transaction was not simulated')
  }
  if (rpc.Api.isSimulationError(transaction.simulation)) {
    throw new Error(
      `Stellar LayerZero simulation failed: ${transaction.simulation.error}`,
    )
  }
  if (rpc.Api.isSimulationRestore(transaction.simulation)) {
    throw new Error(
      'Stellar contract state must be restored before this LayerZero transfer',
    )
  }
  if (transaction.needsNonInvokerSigningBy().length !== 0) {
    throw new Error('LayerZero transfer requires unsupported authorization')
  }
  return transaction
}

export async function assertStellarUsdt0Recipient(
  recipient: StellarAccountAddress,
  amountOut: bigint,
): Promise<void> {
  const token = STELLAR_USDT0[StellarChainId.STELLAR]
  const account = await new Horizon.Server(HORIZON_URL).loadAccount(recipient)
  const trustline = account.balances.find(
    (balance) =>
      balance.asset_type !== 'native' &&
      'asset_code' in balance &&
      balance.asset_code === token.symbol &&
      balance.asset_issuer === token.issuer,
  )
  if (
    !trustline ||
    !('limit' in trustline) ||
    !('buying_liabilities' in trustline) ||
    trustline.is_authorized === false
  ) {
    throw new Error('The Stellar recipient needs an authorized USDT0 trustline')
  }
  const capacity =
    parseUnits(trustline.limit, 7) -
    parseUnits(trustline.balance, 7) -
    parseUnits(trustline.buying_liabilities, 7)
  if (capacity < amountOut) {
    throw new Error(
      'The Stellar USDT0 trustline limit is too low for this transfer',
    )
  }
}
