/** @vitest-environment jsdom */

import {
  QueryClient,
  QueryClientProvider,
  notifyManager,
} from '@tanstack/react-query'
import { act, createElement } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { type EvmAddress, EvmChainId } from 'sushi/evm'
import {
  custom,
  defineChain,
  encodeAbiParameters,
  encodeFunctionResult,
  multicall3Abi,
} from 'viem'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { WagmiContext, createConfig } from 'wagmi'
import { readContractsQueryKey } from 'wagmi/query'
import { useHolderRewards } from './use-holder-rewards'

const token: EvmAddress = '0x0000000000000000000000000000000000000001'
const distributor: EvmAddress = '0x0000000000000000000000000000000000000002'
const holder: EvmAddress = '0x0000000000000000000000000000000000000003'
const precision = 10n ** 36n
const chain = defineChain({
  id: EvmChainId.ROBINHOOD,
  name: 'Test launch network',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['http://localhost'] } },
  contracts: {
    multicall3: {
      address: '0x0000000000000000000000000000000000000004',
      blockCreated: 0,
    },
  },
})
let root: Root
let container: HTMLDivElement
let client: QueryClient
let values: bigint[]
const request = vi.fn()
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

beforeEach(() => {
  notifyManager.setNotifyFunction((callback) => act(callback))
  values = [7n, precision / 2n, 2_000_000_000n, precision, 100n, 10n]
  request
    .mockReset()
    .mockImplementation(async ({ method }: { method: string }) => {
      if (method !== 'eth_call')
        throw new Error(`Unexpected RPC method: ${method}`)
      return encodeFunctionResult({
        abi: multicall3Abi,
        functionName: 'aggregate3',
        result: values.map((value) => ({
          success: true,
          returnData: encodeAbiParameters([{ type: 'uint256' }], [value]),
        })),
      })
    })
  container = document.createElement('div')
  root = createRoot(container)
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
})
afterEach(() => {
  act(() => root.unmount())
  client.clear()
  notifyManager.setNotifyFunction((callback) => callback())
})

async function render(enabled = true) {
  const config = createConfig({
    chains: [chain],
    transports: { [chain.id]: custom({ request }, { retryCount: 0 }) },
    multiInjectedProviderDiscovery: false,
  })
  function Probe() {
    const { data, isError } = useHolderRewards({
      chainId: chain.id,
      token,
      holder,
      distributor: enabled ? distributor : undefined,
    })
    return createElement(
      'span',
      null,
      isError
        ? 'error'
        : data
          ? `${data.earned}:${data.ratePerDay}`
          : 'pending',
    )
  }
  await act(async () =>
    root.render(
      createElement(
        WagmiContext.Provider,
        { value: config },
        createElement(QueryClientProvider, { client }, createElement(Probe)),
      ),
    ),
  )
}

it.each([
  { periodFinish: 2_000_000_000n, supply: 100n, balance: 10n, expected: 4320n },
  { periodFinish: 0n, supply: 100n, balance: 10n, expected: 0n },
  { periodFinish: 2_000_000_000n, supply: 0n, balance: 10n, expected: 0n },
  { periodFinish: 2_000_000_000n, supply: 100n, balance: 0n, expected: 0n },
])(
  'reads rewards and selects the daily rate (case %#)',
  async ({ periodFinish, supply, balance, expected }) => {
    values[2] = periodFinish
    values[4] = supply
    values[5] = balance
    await render()
    await vi.waitFor(() => expect(container.textContent).toBe(`7:${expected}`))
    expect(request).toHaveBeenCalledOnce()

    values[0] = 9n
    await act(async () =>
      client.invalidateQueries({
        queryKey: readContractsQueryKey({
          scopeKey: `holder-rewards:${chain.id}:${token}`,
        }),
      }),
    )
    await vi.waitFor(() => expect(container.textContent).toBe(`9:${expected}`))
  },
)

it('surfaces failed reads instead of reporting zero rewards', async () => {
  request.mockRejectedValue(new Error('RPC unavailable'))
  await render()
  await vi.waitFor(() => expect(container.textContent).toBe('error'))
})

it('does not read contracts without a reward distributor', async () => {
  await render(false)
  expect(request).not.toHaveBeenCalled()
  expect(container.textContent).toBe('pending')
})
