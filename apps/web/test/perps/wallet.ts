import {
  type EvmAddress,
  type EvmTxHash,
  multicall3Abi_getEthBalance,
} from 'sushi/evm'
import {
  type Hex,
  decodeFunctionData,
  encodeAbiParameters,
  encodeFunctionResult,
  erc20Abi,
  maxUint256,
  multicall3Abi,
  numberToHex,
  parseAbi,
  toFunctionSelector,
  zeroAddress,
} from 'viem'
import * as z from 'zod'
import type { AnyTokenAnyChainDepositChainId } from '../../src/app/(networks)/(evm)/perps/_ui/account-management/deposit-dialog/any-token-deposit-config'
import type { NetworkMocks } from '../intercept-anvil'

// Public Anvil account used by the app's existing Wagmi test connector.
export const PERPS_TEST_ADDRESS: EvmAddress =
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
export const PERPS_ROUTER_ADDRESS: EvmAddress =
  '0x0000000000000000000000000000000000000002'
export const PERPS_TRANSACTION_HASH: EvmTxHash = `0x${'1'.repeat(64)}`
const BLOCK_HASH: EvmTxHash = `0x${'2'.repeat(64)}`
const ZERO_HASH: EvmTxHash = `0x${'0'.repeat(64)}`
const NATIVE_BALANCE = 10n ** 19n
// Matches Viem's ENS Universal Resolver reverse lookup used by the wallet label.
const ensReverseAbi = parseAbi([
  'function reverseWithGateways(bytes reverseName, uint256 coinType, string[] gateways) view returns (string resolvedName, address resolver, address reverseResolver)',
])

const rpcSchema = z.object({
  id: z.union([z.number(), z.string(), z.null()]),
  method: z.string(),
  params: z.array(z.unknown()).default([]),
})
const hexSchema = z
  .string()
  .regex(/^0x[0-9a-f]*$/i)
  .transform((value) => value as Hex)
const addressSchema = z
  .string()
  .regex(/^0x[0-9a-f]{40}$/i)
  .transform((value) => value as EvmAddress)
const transactionSchema = z
  .object({
    chainId: hexSchema.optional(),
    from: addressSchema,
    to: addressSchema,
    data: hexSchema.default('0x'),
    value: hexSchema.default('0x0'),
    gas: hexSchema.optional(),
    gasPrice: hexSchema.optional(),
    maxFeePerGas: hexSchema.optional(),
    maxPriorityFeePerGas: hexSchema.optional(),
    type: hexSchema.optional(),
  })
  .passthrough()

type ReceiptStatus = 'pending' | 'success' | 'reverted'
type RpcRequest = z.infer<typeof rpcSchema>
type Transaction = z.infer<typeof transactionSchema> & { chainId: Hex }

export interface PerpsWalletTransaction {
  hash: EvmTxHash
  transaction: Transaction
  status: ReceiptStatus
}

/** Controlled JSON-RPC boundary; no request is forwarded to a live chain. */
export class PerpsWalletMocks {
  readonly transactions: PerpsWalletTransaction[] = []
  readonly rpcRequests: RpcRequest[] = []
  receiptStatus: ReceiptStatus = 'success'
  private blockNumber = 1000n
  private rejectNext = false
  private revertNext = false
  private allowance = 0n

  constructor(readonly sourceChainId: AnyTokenAnyChainDepositChainId) {}

  rejectNextTransaction(): void {
    this.rejectNext = true
  }

  revertNextTransaction(): void {
    this.revertNext = true
  }

  setReceiptStatus(status: ReceiptStatus): void {
    this.receiptStatus = status
    for (const transaction of this.transactions) {
      if (transaction.status === 'pending') {
        transaction.status = status
        this.applyApproval(transaction)
      }
    }
    this.blockNumber += 1n
  }

  async handle(request: Request): Promise<Response> {
    const value: unknown = await request.json()
    const chain = new URL(request.url).searchParams.get('chainId')
    const rpcChainId =
      chain === null
        ? undefined
        : z.coerce.number().int().positive().parse(chain)
    const result = Array.isArray(value)
      ? value.map((entry) => this.respond(rpcSchema.parse(entry), rpcChainId))
      : this.respond(rpcSchema.parse(value), rpcChainId)
    return Response.json(result)
  }

  private respond(request: RpcRequest, rpcChainId?: number): object {
    this.rpcRequests.push(request)
    const { id, method, params } = request
    if (
      method === 'eth_sendTransaction' ||
      method === 'wallet_sendTransaction'
    ) {
      const input = transactionSchema.parse(params[0])
      if (rpcChainId === undefined)
        throw new Error('Perps wallet RPC endpoint must identify its chain')
      if (input.chainId !== undefined && Number(input.chainId) !== rpcChainId)
        throw new Error(
          'Wallet transaction chain disagrees with its RPC endpoint',
        )
      if (rpcChainId !== this.sourceChainId) {
        throw new Error(
          `Perps wallet attempted a transaction on ${rpcChainId} instead of ${this.sourceChainId}`,
        )
      }
      // Standard eth_sendTransaction omits chainId. Record the actual provider
      // endpoint's chain, never infer it from the test's expected source chain.
      const transaction: Transaction = {
        ...input,
        chainId: numberToHex(rpcChainId),
      }
      if (transaction.from.toLowerCase() !== PERPS_TEST_ADDRESS.toLowerCase()) {
        throw new Error(
          'Perps wallet attempted a transaction from another account',
        )
      }
      if (this.rejectNext) {
        this.rejectNext = false
        return {
          jsonrpc: '2.0',
          id,
          error: { code: 4001, message: 'User rejected the request.' },
        }
      }
      const approval = transaction.data.startsWith('0x095ea7b3')
      const hash = approval
        ? numberToHex(BigInt(this.transactions.length + 10), { size: 32 })
        : PERPS_TRANSACTION_HASH
      const entry: PerpsWalletTransaction = {
        hash,
        transaction,
        status: this.revertNext ? 'reverted' : this.receiptStatus,
      }
      this.transactions.push(entry)
      this.applyApproval(entry)
      this.revertNext = false
      this.blockNumber += 1n
      return { jsonrpc: '2.0', id, result: hash }
    }

    let result: unknown
    switch (method) {
      case 'eth_chainId':
        result = numberToHex(rpcChainId ?? this.sourceChainId)
        break
      case 'net_version':
        result = String(this.sourceChainId)
        break
      case 'eth_accounts':
        result = [PERPS_TEST_ADDRESS]
        break
      case 'eth_blockNumber':
        result = numberToHex(this.blockNumber)
        break
      case 'eth_getBalance': {
        result = numberToHex(this.nativeBalance())
        break
      }
      case 'eth_getTransactionCount':
        result = numberToHex(this.transactions.length)
        break
      case 'eth_gasPrice':
        result = '0x3b9aca00'
        break
      case 'eth_maxPriorityFeePerGas':
        result = '0x3b9aca00'
        break
      case 'eth_estimateGas':
        result = '0x186a0'
        break
      case 'eth_getCode':
        result = '0x'
        break
      case 'eth_getBlockByNumber':
      case 'eth_getBlockByHash':
        result = this.block(params[1] === true)
        break
      case 'eth_getTransactionReceipt':
        result = this.receipt(params[0])
        break
      case 'eth_getTransactionByHash':
        result = this.transaction(params[0])
        break
      case 'eth_call': {
        const call = z.object({ data: hexSchema }).parse(params[0])
        result = this.call(call.data)
        break
      }
      case 'eth_getLogs':
        result = []
        break
      default:
        throw new Error(`Unmocked perps wallet RPC: ${method}`)
    }
    return { jsonrpc: '2.0', id, result }
  }

  private applyApproval(entry: PerpsWalletTransaction): void {
    if (
      entry.status !== 'success' ||
      !entry.transaction.data.startsWith('0x095ea7b3')
    )
      return
    const decoded = decodeFunctionData({
      abi: erc20Abi,
      data: entry.transaction.data,
    })
    if (decoded.functionName !== 'approve') throw new Error('Expected approve')
    this.allowance = decoded.args[1]
  }

  private call(data: Hex): Hex {
    if (data.startsWith(toFunctionSelector(ensReverseAbi[0]))) {
      decodeFunctionData({ abi: ensReverseAbi, data })
      return encodeFunctionResult({
        abi: ensReverseAbi,
        functionName: 'reverseWithGateways',
        result: ['', zeroAddress, zeroAddress],
      })
    }
    if (data.startsWith(toFunctionSelector(multicall3Abi_getEthBalance[0]))) {
      // The balance provider batches native balance reads through Multicall3.
      const decoded = decodeFunctionData({
        abi: multicall3Abi_getEthBalance,
        data,
      })
      return encodeFunctionResult({
        abi: multicall3Abi_getEthBalance,
        functionName: 'getEthBalance',
        result:
          decoded.args[0].toLowerCase() === PERPS_TEST_ADDRESS.toLowerCase()
            ? this.nativeBalance()
            : 0n,
      })
    }
    if (data.startsWith('0x82ad56cb')) {
      const decoded = decodeFunctionData({ abi: multicall3Abi, data })
      if (decoded.functionName !== 'aggregate3')
        throw new Error('Expected aggregate3')
      return encodeFunctionResult({
        abi: multicall3Abi,
        functionName: 'aggregate3',
        result: decoded.args[0].map((call) => ({
          success: true,
          returnData: this.call(call.callData),
        })),
      })
    }
    const decoded = decodeFunctionData({ abi: erc20Abi, data })
    switch (decoded.functionName) {
      case 'allowance':
        return encodeAbiParameters([{ type: 'uint256' }], [this.allowance])
      case 'balanceOf':
        return encodeAbiParameters([{ type: 'uint256' }], [1000n * 10n ** 6n])
      case 'approve':
        return encodeAbiParameters([{ type: 'bool' }], [true])
      case 'decimals':
        return encodeAbiParameters([{ type: 'uint8' }], [6])
      case 'symbol':
        return encodeAbiParameters([{ type: 'string' }], ['USDC'])
      case 'name':
        return encodeAbiParameters([{ type: 'string' }], ['USD Coin'])
      case 'totalSupply':
        return encodeAbiParameters([{ type: 'uint256' }], [maxUint256])
      default:
        throw new Error(`Unmocked perps contract call: ${decoded.functionName}`)
    }
  }

  private nativeBalance(): bigint {
    const spent = this.transactions
      .filter((entry) => entry.status === 'success')
      .reduce((sum, entry) => sum + BigInt(entry.transaction.value), 0n)
    return NATIVE_BALANCE - spent
  }

  private transaction(hash: unknown): object | null {
    const entry = this.transactions.find(
      (transaction) => transaction.hash === hash,
    )
    if (!entry) return null
    const { transaction } = entry
    return {
      ...transaction,
      hash: entry.hash,
      input: transaction.data,
      nonce: '0x0',
      gas: transaction.gas ?? '0x186a0',
      gasPrice:
        transaction.gasPrice ?? transaction.maxFeePerGas ?? '0x3b9aca00',
      type: transaction.type ?? (transaction.maxFeePerGas ? '0x2' : '0x0'),
      blockHash: entry.status === 'pending' ? null : BLOCK_HASH,
      blockNumber:
        entry.status === 'pending' ? null : numberToHex(this.blockNumber),
      transactionIndex: entry.status === 'pending' ? null : '0x0',
      r: ZERO_HASH,
      s: ZERO_HASH,
      v: '0x1b',
    }
  }

  private receipt(hash: unknown): object | null {
    const entry = this.transactions.find(
      (transaction) => transaction.hash === hash,
    )
    if (!entry || entry.status === 'pending') return null
    return {
      transactionHash: entry.hash,
      transactionIndex: '0x0',
      blockHash: BLOCK_HASH,
      blockNumber: numberToHex(this.blockNumber),
      from: entry.transaction.from,
      to: entry.transaction.to,
      cumulativeGasUsed: '0x186a0',
      gasUsed: '0x186a0',
      contractAddress: null,
      logs: [],
      logsBloom: `0x${'0'.repeat(512)}`,
      status: entry.status === 'success' ? '0x1' : '0x0',
      effectiveGasPrice: '0x3b9aca00',
      type: entry.transaction.type ?? '0x0',
    }
  }

  private block(includeTransactions: boolean): object {
    return {
      number: numberToHex(this.blockNumber),
      hash: BLOCK_HASH,
      parentHash: ZERO_HASH,
      nonce: '0x0000000000000000',
      sha3Uncles: ZERO_HASH,
      logsBloom: `0x${'0'.repeat(512)}`,
      transactionsRoot: ZERO_HASH,
      stateRoot: ZERO_HASH,
      receiptsRoot: ZERO_HASH,
      miner: PERPS_ROUTER_ADDRESS,
      difficulty: '0x0',
      totalDifficulty: '0x0',
      extraData: '0x',
      size: '0x100',
      gasLimit: '0x1c9c380',
      gasUsed: '0x186a0',
      timestamp: numberToHex(1_800_000_000n + this.blockNumber),
      baseFeePerGas: '0x3b9aca00',
      mixHash: ZERO_HASH,
      transactions: this.transactions
        .filter((entry) => entry.status !== 'pending')
        .map((entry) =>
          includeTransactions ? this.transaction(entry.hash) : entry.hash,
        ),
      uncles: [],
    }
  }
}

export function installPerpsWalletMocks(
  mocks: NetworkMocks,
  sourceChainId: AnyTokenAnyChainDepositChainId,
): PerpsWalletMocks {
  const controller = new PerpsWalletMocks(sourceChainId)
  mocks.addRpc((request) => controller.handle(request))
  return controller
}
