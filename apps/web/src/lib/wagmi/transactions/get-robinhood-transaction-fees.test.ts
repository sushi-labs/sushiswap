import { EvmChainId } from 'sushi/evm'
import { createPublicClient, custom, serializeTransaction, toHex } from 'viem'
import { arbitrum, robinhood } from 'viem/chains'
import { describe, expect, it, vi } from 'vitest'
import { getRobinhoodTransactionFees } from './get-robinhood-transaction-fees'

function setup(baseFeePerGas = 21_754_000n, priorityFee = 0n) {
  const request = vi.fn(async ({ method }: { method: string }) => {
    if (method === 'eth_getBlockByNumber') {
      return { baseFeePerGas: toHex(baseFeePerGas) }
    }
    if (method === 'eth_maxPriorityFeePerGas') return toHex(priorityFee)
    throw new Error(`Unexpected RPC method: ${method}`)
  })
  const client = createPublicClient({
    chain: robinhood,
    transport: custom({ request }, { retryCount: 0 }),
  })
  return { client, request }
}

describe('getRobinhoodTransactionFees', () => {
  it('replaces an underpriced legacy quote with a buffered EIP-1559 cap', async () => {
    const { client } = setup()
    const fees = await getRobinhoodTransactionFees(EvmChainId.ROBINHOOD, client)
    expect(fees).toEqual({
      type: 'eip1559',
      gasPrice: undefined,
      maxFeePerGas: 43_508_000n,
      maxPriorityFeePerGas: 0n,
    })
    if (!fees) throw new Error('Expected Robinhood fees')

    const quote = {
      chainId: EvmChainId.ROBINHOOD,
      type: 'legacy',
      gasPrice: 21_452_000n,
      gas: 505_470n,
    }
    const transaction = { ...quote, ...fees }
    expect(serializeTransaction(transaction).startsWith('0x02')).toBe(true)
  })

  it('keeps the estimated priority fee without doubling it', async () => {
    const { client } = setup(100n, 7n)
    await expect(
      getRobinhoodTransactionFees(EvmChainId.ROBINHOOD, client),
    ).resolves.toMatchObject({
      maxFeePerGas: 207n,
      maxPriorityFeePerGas: 7n,
    })
  })

  it('reads a fresh latest block for each submission', async () => {
    const { client, request } = setup()
    await getRobinhoodTransactionFees(EvmChainId.ROBINHOOD, client)
    request.mockImplementation(async ({ method }) => {
      if (method === 'eth_getBlockByNumber') {
        return { baseFeePerGas: toHex(30_000_000n) }
      }
      return '0x0'
    })
    await expect(
      getRobinhoodTransactionFees(EvmChainId.ROBINHOOD, client),
    ).resolves.toMatchObject({ maxFeePerGas: 60_000_000n })
    expect(
      request.mock.calls.filter(
        ([args]) => args.method === 'eth_getBlockByNumber',
      ),
    ).toHaveLength(2)
    expect(request).toHaveBeenCalledWith(
      { method: 'eth_getBlockByNumber', params: ['latest', false] },
      undefined,
    )
  })

  it('leaves other chains and their quoted fees unchanged without an RPC call', async () => {
    const { client, request } = setup()
    const quote = { gasPrice: 123n }
    expect({
      ...quote,
      ...(await getRobinhoodTransactionFees(EvmChainId.ARBITRUM, client)),
    }).toEqual(quote)
    expect(request).not.toHaveBeenCalled()
    await expect(
      getRobinhoodTransactionFees(undefined, undefined),
    ).resolves.toBeUndefined()
  })

  it('rejects a missing or wrong-chain client', async () => {
    const { client } = setup()
    for (const invalidClient of [undefined, { ...client, chain: arbitrum }]) {
      await expect(
        getRobinhoodTransactionFees(EvmChainId.ROBINHOOD, invalidClient),
      ).rejects.toThrow('Robinhood RPC client')
    }
  })

  it('propagates RPC failure instead of falling back to a stale quote', async () => {
    const { client, request } = setup()
    request.mockRejectedValue(new Error('RPC unavailable'))
    await expect(
      getRobinhoodTransactionFees(EvmChainId.ROBINHOOD, client),
    ).rejects.toThrow('RPC unavailable')
  })
})
