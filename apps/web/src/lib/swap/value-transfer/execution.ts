import {
  getCompiledTransactionMessageDecoder,
  getTransactionDecoder,
} from '@solana/kit'
import {
  Operation,
  type Transaction,
  TransactionBuilder,
  rpc,
  xdr,
} from '@stellar/stellar-sdk'
import { NETWORK_PASSPHRASE } from 'src/app/(networks)/(non-evm)/stellar/_common/lib/constants'
import { SorobanClient } from 'src/app/(networks)/(non-evm)/stellar/_common/lib/soroban/client'
import type { StellarAccountAddress } from 'sushi/stellar'
import { decodeFunctionData, erc20Abi, isAddressEqual } from 'viem'
import type {
  ValueTransferMetadataResponse,
  ValueTransferSignatureStep,
  ValueTransferUserStep,
} from './schemas'
import type { ValueTransferTrade } from './trade'

export function assertValueTransferQuoteIsCurrent(
  trade: ValueTransferTrade,
): void {
  const { quote, quoteRequest } = trade
  if (
    !trade.sourceAddress ||
    !trade.recipient ||
    quoteRequest.srcWalletAddress !== trade.sourceAddress ||
    quoteRequest.dstWalletAddress !== trade.recipient ||
    quoteRequest.srcChainKey !== trade.srcChain.chainKey ||
    quoteRequest.dstChainKey !== trade.dstChain.chainKey ||
    BigInt(quoteRequest.amount) !== trade.amountIn ||
    BigInt(quote.srcAmount) !== trade.amountIn ||
    BigInt(quote.dstAmountMin) !== trade.minAmountOut
  ) {
    throw new Error('The transfer no longer matches the reviewed quote')
  }
  if (quote.expiresAt) {
    const expiresAt = /^\d+$/.test(quote.expiresAt)
      ? Number(quote.expiresAt)
      : Date.parse(quote.expiresAt)
    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      throw new Error('The transfer quote expired. Review a new quote.')
    }
  }
}

export function isValueTransferApproval(step: ValueTransferUserStep): boolean {
  return (
    step.type === 'TRANSACTION' &&
    step.chainType === 'EVM' &&
    step.transaction.encoded.data.toLowerCase().startsWith('0x095ea7b3')
  )
}

function canonicalValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalValue)
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, entry]) => [key, canonicalValue(entry)]),
    )
  }
  return value
}

function assertReviewedStepsAreUnchanged(
  trade: ValueTransferTrade,
  steps: readonly ValueTransferUserStep[],
): void {
  if (!trade.quote.userSteps?.length) return
  // Allow the API to omit satisfied approvals or add an allowance reset. The
  // actual transfer and signed order must retain the reviewed execution bounds.
  const original = trade.quote.userSteps.filter(
    (step) => !isValueTransferApproval(step),
  )
  const executable = steps.filter((step) => !isValueTransferApproval(step))
  if (original.length !== executable.length)
    throw new Error('The transfer steps changed. Review a new quote.')
  for (const [index, reviewed] of original.entries()) {
    const built = executable[index]
    if (!built || built.type !== reviewed.type)
      throw new Error('The transfer steps changed. Review a new quote.')
    if (reviewed.type === 'SIGNATURE' && built.type === 'SIGNATURE') {
      if (
        JSON.stringify(canonicalValue(reviewed.signature)) !==
        JSON.stringify(canonicalValue(built.signature))
      ) {
        throw new Error('The signature changed. Review a new quote.')
      }
    } else if (
      reviewed.type === 'TRANSACTION' &&
      built.type === 'TRANSACTION'
    ) {
      if (reviewed.chainType !== built.chainType)
        throw new Error('The transfer network changed')
      if (reviewed.chainType === 'EVM' && built.chainType === 'EVM') {
        const before = reviewed.transaction.encoded
        const after = built.transaction.encoded
        if (
          !isAddressEqual(before.to, after.to) ||
          before.data.toLowerCase() !== after.data.toLowerCase() ||
          BigInt(before.value ?? '0') !== BigInt(after.value ?? '0')
        ) {
          throw new Error(
            'The transfer transaction changed. Review a new quote.',
          )
        }
      }
      if (
        reviewed.chainType === 'STELLAR' &&
        built.chainType === 'STELLAR' &&
        JSON.stringify(reviewed.transaction.encoded.operationsXDR) !==
          JSON.stringify(built.transaction.encoded.operationsXDR)
      ) {
        throw new Error('The Stellar transfer changed. Review a new quote.')
      }
      // Solana blockhashes must be refreshed, so validate the signer and verify
      // the signed message against the freshly built message before broadcast.
    }
  }
}

function assertOrderMatchesTrade(
  step: ValueTransferSignatureStep,
  trade: ValueTransferTrade,
): void {
  const { domain, primaryType, message } = step.signature.typedData
  if (
    primaryType !== 'Order' ||
    domain.name !== 'Aori' ||
    !trade.quote.routeSteps.some(({ type }) => type.startsWith('AORI')) ||
    (domain.chainId !== undefined &&
      Number(domain.chainId) !== trade.fromChainId)
  )
    throw new Error('The transfer contains an unsupported signature request')
  const matches = (value: unknown, expected: string): boolean =>
    typeof value === 'string' && value.toLowerCase() === expected.toLowerCase()
  if (
    !matches(message.offerer, trade.quoteRequest.srcWalletAddress) ||
    !matches(message.recipient, trade.quoteRequest.dstWalletAddress) ||
    !matches(message.inputToken, trade.quoteRequest.srcTokenAddress) ||
    !matches(message.outputToken, trade.quoteRequest.dstTokenAddress) ||
    typeof message.inputAmount !== 'string' ||
    !/^\d+$/.test(message.inputAmount) ||
    BigInt(message.inputAmount) !== trade.amountIn ||
    typeof message.outputAmount !== 'string' ||
    !/^\d+$/.test(message.outputAmount) ||
    BigInt(message.outputAmount) < trade.minAmountOut ||
    !Number.isFinite(Number(message.endTime)) ||
    Number(message.endTime) * 1000 <= Date.now()
  )
    throw new Error('The signature does not match the reviewed transfer')

  const original = trade.quote.userSteps?.find(
    (candidate) => candidate.type === 'SIGNATURE',
  )
  if (
    original?.type === 'SIGNATURE' &&
    (original.signature.typedData.domain.verifyingContract.toLowerCase() !==
      domain.verifyingContract.toLowerCase() ||
      original.signature.typedData.message.srcEid !== message.srcEid ||
      original.signature.typedData.message.dstEid !== message.dstEid)
  )
    throw new Error('The signature route changed. Review a new quote.')
}

export function validateValueTransferUserSteps(
  trade: ValueTransferTrade,
  steps: readonly ValueTransferUserStep[],
  metadata: ValueTransferMetadataResponse,
): void {
  assertValueTransferQuoteIsCurrent(trade)
  assertReviewedStepsAreUnchanged(trade, steps)
  if (steps.length === 0 || steps.every(isValueTransferApproval)) {
    throw new Error('The transfer has no executable bridge step')
  }
  const sameAddress = (a: string, b: string): boolean =>
    trade.srcChain.chainType === 'EVM'
      ? a.toLowerCase() === b.toLowerCase()
      : a === b
  let nativeValue = 0n
  const aoriSpenders = steps.flatMap((step) => {
    if (step.type !== 'SIGNATURE') return []
    assertOrderMatchesTrade(step, trade)
    return [step.signature.typedData.domain.verifyingContract]
  })
  for (const step of steps) {
    if (
      step.chainKey !== trade.srcChain.chainKey ||
      !sameAddress(step.signerAddress, trade.quoteRequest.srcWalletAddress)
    ) {
      throw new Error(
        'The transfer step does not match the source wallet or network',
      )
    }
    if (step.type === 'SIGNATURE') {
      if (trade.srcChain.chainType !== 'EVM')
        throw new Error('Unsupported signature network')
      continue
    }
    if (step.chainType !== trade.srcChain.chainType)
      throw new Error('The transfer network changed')
    if (step.chainType !== 'EVM') continue
    const transaction = step.transaction.encoded
    if (
      transaction.chainId !== trade.fromChainId ||
      (transaction.from &&
        !sameAddress(transaction.from, trade.quoteRequest.srcWalletAddress))
    ) {
      throw new Error(
        'The transaction does not match the source wallet or network',
      )
    }
    nativeValue += BigInt(transaction.value ?? '0')
    if (!isValueTransferApproval(step)) continue
    const decoded = decodeFunctionData({
      abi: erc20Abi,
      data: transaction.data,
    })
    if (decoded.functionName !== 'approve')
      throw new Error('Invalid token approval')
    const [spender, amount] = decoded.args
    const deployments = metadata[step.chainKey]?.deployments
    const delegate = deployments?.transferDelegate?.address
    const allowed =
      (delegate && isAddressEqual(spender, delegate)) ||
      aoriSpenders.some((address) => isAddressEqual(spender, address))
    if (
      !allowed ||
      (deployments?.multicall &&
        sameAddress(spender, deployments.multicall.address)) ||
      !sameAddress(transaction.to, trade.quoteRequest.srcTokenAddress) ||
      (amount !== 0n && amount !== trade.amountIn) ||
      BigInt(transaction.value ?? '0') !== 0n
    ) {
      throw new Error('The token approval does not match the reviewed transfer')
    }
  }
  const nativeInput = sameAddress(
    trade.quoteRequest.srcTokenAddress,
    trade.srcChain.nativeCurrency.address,
  )
    ? trade.amountIn
    : 0n
  if (nativeValue > nativeInput + trade.maxNativeFee) {
    throw new Error('The transfer fee increased. Review a new quote.')
  }
}

export function validateValueTransferSolanaTransaction(
  data: string,
  sourceAddress: string,
): ReturnType<ReturnType<typeof getTransactionDecoder>['decode']> {
  const transaction = getTransactionDecoder().decode(
    Buffer.from(data, 'base64'),
  )
  const message = getCompiledTransactionMessageDecoder().decode(
    transaction.messageBytes,
  )
  if (
    message.staticAccounts[0] !== sourceAddress ||
    !Object.hasOwn(transaction.signatures, sourceAddress)
  ) {
    throw new Error('The Solana transaction does not match the source wallet')
  }
  return transaction
}

export function assertValueTransferSolanaSignature(
  unsigned: string,
  signed: string,
  sourceAddress: string,
): void {
  const original = validateValueTransferSolanaTransaction(
    unsigned,
    sourceAddress,
  )
  const transaction = validateValueTransferSolanaTransaction(
    signed,
    sourceAddress,
  )
  if (
    !Buffer.from(original.messageBytes).equals(
      Buffer.from(transaction.messageBytes),
    ) ||
    !Object.entries(transaction.signatures).some(
      ([address, signature]) => address === sourceAddress && signature !== null,
    )
  ) {
    throw new Error(
      'The signed Solana transaction does not match the reviewed transfer',
    )
  }
}

export async function buildValueTransferStellarTransaction({
  operationsXDR,
  inclusionFee,
  sourceAddress,
}: {
  operationsXDR: readonly string[]
  inclusionFee: string
  sourceAddress: StellarAccountAddress
}): Promise<Transaction> {
  const account = await SorobanClient.getAccount(sourceAddress)
  const builder = new TransactionBuilder(account, {
    fee: inclusionFee,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
  let soroban = false
  for (const encoded of operationsXDR) {
    const operation = xdr.Operation.fromXDR(encoded, 'base64')
    const parsed = Operation.fromXDRObject(operation)
    if (parsed.source && parsed.source !== sourceAddress) {
      throw new Error('The Stellar operation does not match the source wallet')
    }
    soroban ||= parsed.type === 'invokeHostFunction'
    builder.addOperation(operation)
  }
  const transaction = builder.setTimeout(180).build()
  if (!soroban) return transaction

  const simulation = await SorobanClient.simulateTransaction(transaction)
  if (rpc.Api.isSimulationError(simulation)) {
    throw new Error(
      `Stellar transaction simulation failed: ${simulation.error}`,
    )
  }
  if (rpc.Api.isSimulationRestore(simulation)) {
    throw new Error(
      'Stellar contract state must be restored before this transfer',
    )
  }
  if (!rpc.Api.isSimulationSuccess(simulation)) {
    throw new Error('Stellar transaction simulation was not successful')
  }
  if (
    simulation.result?.auth.some(
      (entry) =>
        entry.credentials().switch() !==
        xdr.SorobanCredentialsType.sorobanCredentialsSourceAccount(),
    )
  ) {
    throw new Error('The Stellar transfer requires unsupported authorization')
  }
  return rpc.assembleTransaction(transaction, simulation).build()
}
