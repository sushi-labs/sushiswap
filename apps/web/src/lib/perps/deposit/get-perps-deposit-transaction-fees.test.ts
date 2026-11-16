import { EvmChainId, evmChains } from 'sushi/evm'
import {
  type Chain,
  type PublicClient,
  createPublicClient,
  custom,
  serializeTransaction,
  toHex,
} from 'viem'
import { type Mock, describe, expect, it, vi } from 'vitest'
import { ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS } from '~evm/perps/_ui/account-management/deposit-dialog/any-token-deposit-config'
import { getPerpsDepositTransactionFees } from './get-perps-deposit-transaction-fees'

interface RpcState {
  baseFeePerGas: bigint | null
  priorityFee: bigint
  gasPrice: bigint
  failMethod?: string
}

interface RpcRequest {
  method: string
  params?: unknown
}

interface FeeFixture {
  state: RpcState
  request: Mock<(request: RpcRequest) => Promise<unknown>>
  client: Pick<PublicClient, 'chain' | 'estimateFeesPerGas'>
}

function chainFor(chainId: EvmChainId): Chain {
  const chain = evmChains.find((chain) => chain.viemChain.id === chainId)
  if (!chain) throw new Error(`Missing chain ${chainId}`)
  return chain.viemChain
}

function setup(
  chainId: EvmChainId = EvmChainId.ETHEREUM,
  overrides: Partial<RpcState> = {},
): FeeFixture {
  const state: RpcState = {
    baseFeePerGas: 100n,
    priorityFee: 8n,
    gasPrice: 3n,
    ...overrides,
  }
  const request = vi.fn(async ({ method }: RpcRequest): Promise<unknown> => {
    if (state.failMethod === method) throw new Error('RPC unavailable')
    switch (method) {
      case 'eth_getBlockByNumber':
        return state.baseFeePerGas === null
          ? {}
          : { baseFeePerGas: toHex(state.baseFeePerGas) }
      case 'eth_maxPriorityFeePerGas':
        return toHex(state.priorityFee)
      case 'eth_gasPrice':
        return toHex(state.gasPrice)
      default:
        throw new Error(`Unexpected RPC method: ${method}`)
    }
  })
  const client = createPublicClient({
    chain: chainFor(chainId),
    transport: custom({ request }, { retryCount: 0 }),
  })
  return { state, request, client }
}

describe('perps deposit transaction fees', () => {
  it.each(ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS)(
    'uses fresh buffered EIP-1559 fees for configured source %s',
    async (chainId) => {
      const { client, request } = setup(chainId)
      const fees = await getPerpsDepositTransactionFees(chainId, client)
      expect(fees).toEqual({
        type: 'eip1559',
        gasPrice: undefined,
        maxFeePerGas: 210n,
        maxPriorityFeePerGas: 10n,
      })
      expect(
        serializeTransaction({ chainId, gas: 21_000n, ...fees }).startsWith(
          '0x02',
        ),
      ).toBe(true)
      expect(request).toHaveBeenCalledWith(
        { method: 'eth_getBlockByNumber', params: ['latest', false] },
        undefined,
      )
    },
  )

  it('uses a refreshed legacy price only when the block has no EIP-1559 base fee', async () => {
    const { client, request } = setup(EvmChainId.ETHEREUM, {
      baseFeePerGas: null,
      gasPrice: 3n,
    })
    const fees = await getPerpsDepositTransactionFees(
      EvmChainId.ETHEREUM,
      client,
    )
    expect(fees).toEqual({
      type: 'legacy',
      gasPrice: 4n,
      maxFeePerGas: undefined,
      maxPriorityFeePerGas: undefined,
    })
    expect(
      serializeTransaction({ chainId: 1, gas: 21_000n, ...fees }).startsWith(
        '0x02',
      ),
    ).toBe(false)
    expect(request.mock.calls.map(([request]) => request.method)).not.toContain(
      'eth_maxPriorityFeePerGas',
    )
  })

  it('rounds small priority fees up and includes the extra tip in the fee cap', async () => {
    const { client } = setup(EvmChainId.ETHEREUM, { priorityFee: 1n })
    await expect(
      getPerpsDepositTransactionFees(EvmChainId.ETHEREUM, client),
    ).resolves.toMatchObject({
      maxFeePerGas: 202n,
      maxPriorityFeePerGas: 2n,
    })
  })

  it('preserves a zero suggested tip without imposing a cross-chain gwei minimum', async () => {
    const { client } = setup(EvmChainId.ROBINHOOD, { priorityFee: 0n })
    await expect(
      getPerpsDepositTransactionFees(EvmChainId.ROBINHOOD, client),
    ).resolves.toMatchObject({
      maxFeePerGas: 200n,
      maxPriorityFeePerGas: 0n,
    })
  })

  it('refreshes the latest base fee and priority fee for each submission', async () => {
    const { client, request, state } = setup()
    await getPerpsDepositTransactionFees(EvmChainId.ETHEREUM, client)
    state.baseFeePerGas = 200n
    state.priorityFee = 12n
    await expect(
      getPerpsDepositTransactionFees(EvmChainId.ETHEREUM, client),
    ).resolves.toMatchObject({
      maxFeePerGas: 415n,
      maxPriorityFeePerGas: 15n,
    })
    expect(
      request.mock.calls.filter(
        ([request]) => request.method === 'eth_getBlockByNumber',
      ),
    ).toHaveLength(2)
  })

  it('preserves the chain-defined priority fee policy when adding headroom', async () => {
    const { request } = setup()
    const client = createPublicClient({
      chain: {
        ...chainFor(EvmChainId.ETHEREUM),
        fees: { maxPriorityFeePerGas: 16n },
      },
      transport: custom({ request }, { retryCount: 0 }),
    })
    await expect(
      getPerpsDepositTransactionFees(EvmChainId.ETHEREUM, client),
    ).resolves.toMatchObject({
      maxFeePerGas: 220n,
      maxPriorityFeePerGas: 20n,
    })
    expect(request.mock.calls.map(([request]) => request.method)).not.toContain(
      'eth_maxPriorityFeePerGas',
    )
  })

  it('rejects a client for a different source chain before requesting fees', async () => {
    const { client, request } = setup()
    await expect(
      getPerpsDepositTransactionFees(EvmChainId.BASE, client),
    ).rejects.toThrow()
    expect(request).not.toHaveBeenCalled()
  })

  it('propagates RPC failure without falling back to legacy or a quoted price', async () => {
    const { client, request } = setup(EvmChainId.ETHEREUM, {
      failMethod: 'eth_getBlockByNumber',
    })
    await expect(
      getPerpsDepositTransactionFees(EvmChainId.ETHEREUM, client),
    ).rejects.toThrow('RPC unavailable')
    expect(request.mock.calls.map(([request]) => request.method)).not.toContain(
      'eth_gasPrice',
    )
  })

  it('propagates a failed legacy gas price request', async () => {
    const { client } = setup(EvmChainId.ETHEREUM, {
      baseFeePerGas: null,
      failMethod: 'eth_gasPrice',
    })
    await expect(
      getPerpsDepositTransactionFees(EvmChainId.ETHEREUM, client),
    ).rejects.toThrow('RPC unavailable')
  })
})
