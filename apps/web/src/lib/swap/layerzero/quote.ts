import { isEvmAddress } from 'sushi/evm'
import {
  STELLAR_USDT0,
  StellarChainId,
  isStellarAccountAddress,
} from 'sushi/stellar'
import { type PublicClient, padHex } from 'viem'
import { LAYERZERO_OFT_ABI } from './abi'
import {
  LAYERZERO_USDT0_EVM_DEPLOYMENTS,
  type LayerZeroChainId,
  getLayerZeroDecimals,
  getLayerZeroEid,
  isLayerZeroEvmChainId,
} from './config'
import {
  encodeStellarLayerZeroRecipient,
  quoteStellarMessagingFee,
  quoteStellarOft,
} from './stellar'
import type { LayerZeroQuote, LayerZeroSendParam } from './types'

const PREVIEW_EVM_RECIPIENT = '0x000000000000000000000000000000000000dEaD'
const PREVIEW_STELLAR_ACCOUNT = STELLAR_USDT0[StellarChainId.STELLAR].issuer

export function scaleLayerZeroAmount(
  amount: bigint,
  fromDecimals: number,
  toDecimals: number,
): bigint {
  return fromDecimals > toDecimals
    ? amount / 10n ** BigInt(fromDecimals - toDecimals)
    : amount * 10n ** BigInt(toDecimals - fromDecimals)
}

export function normalizeLayerZeroAmount(
  amount: bigint,
  decimals: number,
): bigint {
  const factor = 10n ** BigInt(decimals - 6)
  return amount - (amount % factor)
}

export async function fetchLayerZeroQuote({
  fromChainId,
  toChainId,
  amount,
  slippageBps,
  sourceAddress,
  recipient,
  publicClient,
}: {
  fromChainId: LayerZeroChainId
  toChainId: LayerZeroChainId
  amount: bigint
  slippageBps: number
  sourceAddress?: AddressFor<LayerZeroChainId>
  recipient?: AddressFor<LayerZeroChainId>
  publicClient?: Pick<PublicClient, 'readContract'>
}): Promise<LayerZeroQuote> {
  if (
    fromChainId === toChainId ||
    (fromChainId !== StellarChainId.STELLAR &&
      toChainId !== StellarChainId.STELLAR)
  ) {
    throw new Error('Unsupported LayerZero USDT0 pair')
  }
  if (
    !Number.isInteger(slippageBps) ||
    slippageBps < 0 ||
    slippageBps >= 10_000
  ) {
    throw new Error('Invalid slippage tolerance')
  }
  const fromDecimals = getLayerZeroDecimals(fromChainId)
  const toDecimals = getLayerZeroDecimals(toChainId)
  const amountLD = normalizeLayerZeroAmount(amount, fromDecimals)
  if (amountLD <= 0n)
    throw new Error('Minimum transfer amount is 0.000001 USDT0')

  const destination =
    recipient ??
    (toChainId === StellarChainId.STELLAR
      ? PREVIEW_STELLAR_ACCOUNT
      : PREVIEW_EVM_RECIPIENT)
  if (!destination) throw new Error('Invalid destination account')
  const to =
    toChainId === StellarChainId.STELLAR
      ? isStellarAccountAddress(destination)
        ? encodeStellarLayerZeroRecipient(destination)
        : undefined
      : isEvmAddress(destination)
        ? padHex(destination, { size: 32 })
        : undefined
  if (!to) throw new Error('Invalid destination account')

  const sendParam: LayerZeroSendParam = {
    dstEid: getLayerZeroEid(toChainId),
    to,
    amountLD,
    minAmountLD: 0n,
    // USDT0 configures the required receive gas as enforced options on-chain.
    extraOptions: '0x',
    composeMsg: '0x',
    oftCmd: '0x',
  }
  const stellarSource = sourceAddress ?? PREVIEW_STELLAR_ACCOUNT
  const receipt = await (async () => {
    if (fromChainId === StellarChainId.STELLAR) {
      if (!stellarSource || !isStellarAccountAddress(stellarSource)) {
        throw new Error('Invalid Stellar source account')
      }
      return quoteStellarOft(stellarSource, sendParam)
    }
    if (!publicClient) throw new Error('Source network unavailable')
    const [limit, , receipt] = await publicClient.readContract({
      address: LAYERZERO_USDT0_EVM_DEPLOYMENTS[fromChainId].oftAddress,
      abi: LAYERZERO_OFT_ABI,
      functionName: 'quoteOFT',
      args: [sendParam],
    })
    return {
      minAmount: limit.minAmountLD,
      maxAmount: limit.maxAmountLD,
      amountSent: receipt.amountSentLD,
      amountReceived: receipt.amountReceivedLD,
    }
  })()
  if (amountLD < receipt.minAmount || amountLD > receipt.maxAmount) {
    throw new Error('Amount is outside the current LayerZero transfer limits')
  }
  if (
    receipt.amountReceived <= 0n ||
    receipt.amountSent > amountLD ||
    normalizeLayerZeroAmount(receipt.amountReceived, fromDecimals) !==
      receipt.amountReceived
  ) {
    throw new Error('Invalid LayerZero quote amounts')
  }
  sendParam.minAmountLD = normalizeLayerZeroAmount(
    (receipt.amountReceived * BigInt(10_000 - slippageBps)) / 10_000n,
    fromDecimals,
  )
  if (sendParam.minAmountLD === 0n)
    sendParam.minAmountLD = 10n ** BigInt(fromDecimals - 6)
  const nativeFee = await (async () => {
    if (isLayerZeroEvmChainId(fromChainId)) {
      if (!publicClient) throw new Error('Source network unavailable')
      const fee = await publicClient.readContract({
        address: LAYERZERO_USDT0_EVM_DEPLOYMENTS[fromChainId].oftAddress,
        abi: LAYERZERO_OFT_ABI,
        functionName: 'quoteSend',
        args: [sendParam, false],
      })
      if (fee.lzTokenFee !== 0n)
        throw new Error('Unsupported LayerZero token fee')
      return fee.nativeFee
    }
    if (!stellarSource || !isStellarAccountAddress(stellarSource)) {
      throw new Error('Invalid Stellar source account')
    }
    return quoteStellarMessagingFee(stellarSource, sendParam)
  })()

  return {
    fromChainId,
    toChainId,
    sourceAddress,
    recipient,
    amountIn: amount,
    amountSent: receipt.amountSent,
    amountOut: scaleLayerZeroAmount(
      receipt.amountReceived,
      fromDecimals,
      toDecimals,
    ),
    minAmountOut: scaleLayerZeroAmount(
      sendParam.minAmountLD,
      fromDecimals,
      toDecimals,
    ),
    nativeFee,
    // Bound the fee the user approves. The OFT refunds unused native fees to the sender.
    maxNativeFee: (nativeFee * 110n + 99n) / 100n,
    sendParam,
  }
}

export function assertLayerZeroQuoteIsSafe(
  reviewed: LayerZeroQuote,
  executable: LayerZeroQuote,
): void {
  if (
    reviewed.fromChainId !== executable.fromChainId ||
    reviewed.toChainId !== executable.toChainId ||
    reviewed.amountIn !== executable.amountIn ||
    reviewed.sourceAddress !== executable.sourceAddress ||
    reviewed.recipient !== executable.recipient
  ) {
    throw new Error('Swap inputs changed. Review a new quote.')
  }
  if (executable.amountOut < reviewed.minAmountOut) {
    throw new Error('The received amount changed. Review a new quote.')
  }
  if (executable.nativeFee > reviewed.maxNativeFee) {
    throw new Error('The LayerZero fee increased. Review a new quote.')
  }
}
