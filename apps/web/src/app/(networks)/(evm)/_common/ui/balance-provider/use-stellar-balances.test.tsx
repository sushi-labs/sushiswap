/** @vitest-environment jsdom */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactElement, act } from 'react'
import { createRoot } from 'react-dom/client'
import { CurrencyInput } from 'src/lib/wagmi/components/web3-input/currency'
import { Amounts } from 'src/lib/wagmi/systems/checker/amounts'
import { Amount } from 'sushi'
import { STELLAR_USDC, StellarChainId, StellarToken } from 'sushi/stellar'
import { expect, it, vi } from 'vitest'
import { useAmountBalance } from './use-balance'
import { useAmountBalances } from './use-balances'
import { invalidateStellarBalances } from './use-stellar-balances'

const state = vi.hoisted(() => ({
  account: 'GCOBBPEQOWGFBGHOXJBAH2XENGVSLM72S32S5YARQ5OIES5O6FGEYARQ',
  balance: 0n,
  fetch: vi.fn<(addresses: string[]) => Promise<Map<string, bigint>>>(),
}))
vi.mock('src/lib/wallet/hooks/use-account', () => ({
  useAccount: () => state.account,
}))
vi.mock('./use-evm-balances', () => ({ useEvmBalances: () => ({}) }))
vi.mock('./use-svm-balances', () => ({ useSvmBalances: () => ({}) }))
vi.mock('./use-refetch-balances', () => ({
  useRefetchBalances: () => ({ refetchChain: vi.fn() }),
}))
vi.mock(
  '~evm/_common/ui/price-provider/price-provider/use-currency-price',
  () => ({ useCurrencyPrice: () => ({ data: 1, isLoading: false }) }),
)
vi.mock('~stellar/_common/lib/soroban/client', () => ({
  getTokenContractClient: ({ contractId }: { contractId: string }) => ({
    balance: async () => ({
      result: (await state.fetch([contractId])).get(contractId),
    }),
  }),
}))
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const chainId = StellarChainId.STELLAR
const dejAAA = new StellarToken({
  chainId,
  address: 'CC64WBDGS6QQP22QTTIACYIXT3WF7BBQEYOQPLTP7GTKYY7PZ74QYGSL',
  decimals: 18,
  symbol: 'deJAAA',
  name: 'deJAAA',
})
const currencies = [STELLAR_USDC[chainId], dejAAA]

it('uses the same deJAAA balance for the currency input and paired submit guard', async () => {
  await import('./fetch-stellar-balances')
  vi.useFakeTimers()
  state.fetch.mockImplementation(
    async (addresses) =>
      new Map(addresses.map((address) => [address, state.balance])),
  )
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const container = document.createElement('div')
  const root = createRoot(container)
  let inputBalance: Amount<StellarToken> | undefined
  let guardBalance: Amount<StellarToken> | undefined
  let inputError = false
  let guardError = false
  function Input(): ReactElement {
    const query = useAmountBalance(dejAAA)
    inputBalance = query.data
    inputError = query.isError
    return (
      <CurrencyInput
        chainId={chainId}
        currency={dejAAA}
        type="INPUT"
        value="0.000176731577784635"
      />
    )
  }
  function Guard(): ReactElement {
    const query = useAmountBalances(chainId, currencies)
    guardBalance = query.data?.get(dejAAA.id)
    guardError = query.isError
    return (
      <Amounts
        chainId={chainId}
        amounts={[
          Amount.fromHuman(dejAAA, '0.000176731577784635'),
          Amount.fromHuman(currencies[0], '1'),
        ]}
      >
        <button type="button">Add liquidity</button>
      </Amounts>
    )
  }
  async function render(withGuard: boolean): Promise<void> {
    await act(async () => {
      root.render(
        <QueryClientProvider client={client}>
          <Input />
          {withGuard && <Guard />}
        </QueryClientProvider>,
      )
    })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(20)
    })
  }
  try {
    state.balance = 0n
    await render(false)
    expect(inputBalance?.amount).toBe(0n)
    state.balance = 209641704638935271n
    await render(true)
    const deposit = Amount.fromHuman(dejAAA, '0.000176731577784635')
    // A red "Exceeds Balance" input must never disagree with the submit guard.
    expect(inputBalance?.lt(deposit)).toBe(guardBalance?.lt(deposit))
    expect(container.textContent).toContain('Exceeds Balance')
    expect(container.textContent).toContain('Insufficient Balance')
    expect(container.textContent).not.toContain('Add liquidity')
    // Incoming balances appear within one ledger interval, not nearly five minutes.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000)
    })
    expect(inputBalance?.amount).toBe(state.balance)
    expect(guardBalance?.amount).toBe(state.balance)

    expect(container.textContent).not.toContain('Exceeds Balance')
    expect(
      container.querySelector('button[aria-label="Use maximum deJAAA"]')
        ?.textContent,
    ).toMatch(/^0\.20964/)
    expect(container.textContent).toContain('Add liquidity')

    const selectorKey = [
      'data-api-token-list-balances',
      { chainId, account: state.account },
    ]
    client.setQueryData(selectorKey, [])
    state.balance = 100000000000000000n
    await act(async () => {
      await invalidateStellarBalances(client)
    })
    await render(true)
    expect(inputBalance?.amount).toBe(state.balance)
    expect(guardBalance?.amount).toBe(state.balance)
    expect(client.getQueryState(selectorKey)?.isInvalidated).toBe(true)

    state.fetch.mockRejectedValue(new Error('RPC unavailable'))
    await act(async () => {
      await invalidateStellarBalances(client)
    })
    await render(true)
    expect(inputBalance).toBeUndefined()
    expect(guardBalance).toBeUndefined()
    expect(inputError).toBe(true)
    expect(guardError).toBe(true)
    expect(container.textContent).toContain('Balance unavailable')
    expect(container.textContent).not.toContain('Exceeds Balance')
    expect(container.textContent).not.toContain('Add liquidity')

    state.fetch.mockImplementation(
      async (addresses) =>
        new Map(addresses.map((address) => [address, state.balance])),
    )
    await act(async () => {
      await invalidateStellarBalances(client)
    })
    await render(true)
    expect(inputBalance?.amount).toBe(state.balance)
    expect(guardBalance?.amount).toBe(state.balance)

    // Changing accounts must not borrow the previous account's cached balance.
    state.account = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'
    state.fetch.mockImplementation(() => new Promise(() => {}))
    await render(true)
    expect(inputBalance).toBeUndefined()
    expect(guardBalance).toBeUndefined()
  } finally {
    act(() => root.unmount())
    client.clear()
    vi.useRealTimers()
  }
})
