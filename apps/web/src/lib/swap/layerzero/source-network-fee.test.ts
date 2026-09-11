import {
  http,
  type Chain,
  createPublicClient,
  decodeFunctionData,
  padHex,
} from 'viem'
import { arbitrum, mainnet, optimism } from 'viem/chains'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LAYERZERO_OFT_ABI } from './abi'
import { LAYERZERO_USDT0_EVM_DEPLOYMENTS } from './config'
import { estimateLayerZeroSourceNetworkFee } from './source-network-fee'
import type { LayerZeroQuote } from './types'

const { buildStellarOftSend, estimateTotalFee } = vi.hoisted(() => ({
  buildStellarOftSend: vi.fn(),
  estimateTotalFee: vi.fn(),
}))
vi.mock('./stellar', () => ({ buildStellarOftSend }))
vi.mock('viem/op-stack', () => ({ estimateTotalFee }))

const quote: LayerZeroQuote = {
  fromChainId: 1,
  toChainId: -4,
  sourceAddress: '0x000000000000000000000000000000000000dEaD',
  recipient: 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
  amountIn: 1_000_000n,
  amountSent: 1_000_000n,
  amountOut: 10_000_000n,
  minAmountOut: 9_950_000n,
  nativeFee: 1_000n,
  maxNativeFee: 1_100n,
  sendParam: {
    dstEid: 30600,
    to: padHex('0x01', { size: 32 }),
    amountLD: 1_000_000n,
    minAmountLD: 995_000n,
    extraOptions: '0x',
    composeMsg: '0x',
    oftCmd: '0x',
  },
}
const stellarQuote: LayerZeroQuote = {
  ...quote,
  fromChainId: -4,
  toChainId: 1,
  sourceAddress: quote.recipient,
  recipient: quote.sourceAddress,
}

function mockClient(chain: Chain = mainnet) {
  const client = createPublicClient({ chain, transport: http() })
  vi.spyOn(client, 'readContract').mockResolvedValue(quote.amountSent)
  vi.spyOn(client, 'estimateGas').mockResolvedValue(150_000n)
  vi.spyOn(client, 'getGasPrice').mockResolvedValue(2_000_000_000n)
  return client
}

describe('LayerZero source network fee', () => {
  beforeEach(() => vi.resetAllMocks())

  it('estimates the actual OFT call and excludes the messaging fee from source gas', async () => {
    const client = mockClient()
    await expect(
      estimateLayerZeroSourceNetworkFee({ quote, publicClient: client }),
    ).resolves.toEqual({
      status: 'estimated',
      amount: 300_000_000_000_000n,
    })
    const request = vi.mocked(client.estimateGas).mock.calls[0]?.[0]
    expect(request).toMatchObject({
      account: quote.sourceAddress,
      to: LAYERZERO_USDT0_EVM_DEPLOYMENTS[1].oftAddress,
      value: quote.maxNativeFee,
    })
    expect(
      decodeFunctionData({
        abi: LAYERZERO_OFT_ABI,
        data: request?.data ?? '0x',
      }),
    ).toEqual({
      functionName: 'send',
      args: [
        quote.sendParam,
        { nativeFee: quote.maxNativeFee, lzTokenFee: 0n },
        quote.sourceAddress,
      ],
    })
  })

  it.each([0n, 999_999n])(
    'reports missing approval instead of estimating a reverting send (%s)',
    async (allowance) => {
      const client = mockClient()
      vi.mocked(client.readContract).mockResolvedValue(allowance)
      await expect(
        estimateLayerZeroSourceNetworkFee({ quote, publicClient: client }),
      ).resolves.toEqual({ status: 'approval-required' })
      expect(client.estimateGas).not.toHaveBeenCalled()
    },
  )

  it('does not require approval for a native OFT', async () => {
    const client = mockClient(arbitrum)
    await expect(
      estimateLayerZeroSourceNetworkFee({
        quote: { ...quote, fromChainId: 42161 },
        publicClient: client,
      }),
    ).resolves.toMatchObject({ status: 'estimated' })
    expect(client.readContract).not.toHaveBeenCalled()
    expect(client.estimateGas).toHaveBeenCalledOnce()
  })

  it('includes Optimism L1 data and operator fees through the total-fee action', async () => {
    const client = mockClient(optimism)
    estimateTotalFee.mockResolvedValue(400_000_000_000_000n)
    await expect(
      estimateLayerZeroSourceNetworkFee({
        quote: { ...quote, fromChainId: 10 },
        publicClient: client,
      }),
    ).resolves.toEqual({ status: 'estimated', amount: 400_000_000_000_000n })
    expect(estimateTotalFee).toHaveBeenCalledWith(
      client,
      expect.objectContaining({
        account: quote.sourceAddress,
        to: LAYERZERO_USDT0_EVM_DEPLOYMENTS[10].oftAddress,
        value: quote.maxNativeFee,
        chain: optimism,
      }),
    )
  })

  it('uses the assembled Stellar inclusion and resource fee, without signing', async () => {
    buildStellarOftSend.mockResolvedValue({ built: { fee: '123456' } })
    await expect(
      estimateLayerZeroSourceNetworkFee({ quote: stellarQuote }),
    ).resolves.toEqual({ status: 'estimated', amount: 123456n })
    expect(buildStellarOftSend).toHaveBeenCalledWith({
      from: stellarQuote.sourceAddress,
      sendParam: stellarQuote.sendParam,
      nativeFee: stellarQuote.maxNativeFee,
    })
  })

  it('does not use a placeholder account for a disconnected estimate', async () => {
    await expect(
      estimateLayerZeroSourceNetworkFee({
        quote: { ...quote, sourceAddress: undefined },
      }),
    ).rejects.toThrow('Connect both wallets')
    await expect(
      estimateLayerZeroSourceNetworkFee({
        quote: { ...stellarQuote, recipient: undefined },
      }),
    ).rejects.toThrow('Connect both wallets')
    expect(buildStellarOftSend).not.toHaveBeenCalled()
  })

  it('rejects a client connected to a different source chain', async () => {
    const client = mockClient(arbitrum)
    await expect(
      estimateLayerZeroSourceNetworkFee({ quote, publicClient: client }),
    ).rejects.toThrow('Source network unavailable')
    expect(client.readContract).not.toHaveBeenCalled()
    expect(client.estimateGas).not.toHaveBeenCalled()
  })

  it('surfaces EVM simulation failures instead of displaying zero', async () => {
    const client = mockClient()
    vi.mocked(client.estimateGas).mockRejectedValue(
      new Error('Insufficient balance'),
    )
    await expect(
      estimateLayerZeroSourceNetworkFee({ quote, publicClient: client }),
    ).rejects.toThrow('Insufficient balance')
  })

  it('surfaces Stellar simulation failures instead of returning only the base fee', async () => {
    buildStellarOftSend.mockRejectedValue(new Error('Simulation failed'))
    await expect(
      estimateLayerZeroSourceNetworkFee({ quote: stellarQuote }),
    ).rejects.toThrow('Simulation failed')
  })

  it.each([{}, { built: { fee: '0' } }])(
    'rejects an unprepared Stellar fee (%s)',
    async (transaction) => {
      buildStellarOftSend.mockResolvedValue(transaction)
      await expect(
        estimateLayerZeroSourceNetworkFee({ quote: stellarQuote }),
      ).rejects.toThrow()
    },
  )
})
