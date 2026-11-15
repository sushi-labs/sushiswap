/** @vitest-environment jsdom */

import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import {
  COW_LIMIT_CHAIN_IDS,
  type CowLimitChainId,
} from 'src/lib/swap/cow/chains'
import { USDC, WNATIVE, defaultQuoteCurrency } from 'sushi/evm'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import {
  DerivedstateSimpleSwapProvider,
  useDerivedStateSimpleSwap,
} from '../../swap/_ui/derivedstate-simple-swap-provider'
import { CowLimitLayout } from './cow-limit-layout'

vi.mock('next/navigation', () => ({
  useParams: () => ({}),
  usePathname: () => window.location.pathname,
  useSearchParams: () => new URLSearchParams(window.location.search),
}))
vi.mock('wagmi', () => ({ useConnection: () => ({}) }))
vi.mock('src/lib/wallet/hooks/use-account', () => ({
  useAccount: () => undefined,
}))
vi.mock('src/lib/wagmi/hooks/tokens/use-token-with-cache', () => ({
  useTokenWithCache: ({
    chainId,
    address,
  }: { chainId: CowLimitChainId; address: AddressFor<CowLimitChainId> }) => ({
    data: [USDC[1], defaultQuoteCurrency[chainId]].find(
      (token) => token.address === address,
    ),
    isInitialLoading: false,
  }),
}))
vi.mock('../../header', () => ({ Header: () => null }))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

let root: Root
let swap: ReturnType<typeof useDerivedStateSimpleSwap<CowLimitChainId>>

function CaptureState(): null {
  swap = useDerivedStateSimpleSwap<CowLimitChainId>()
  return null
}

beforeEach(() => {
  window.history.replaceState(null, '', '/ethereum/limit')
  root = createRoot(document.createElement('div'))
})

afterEach(() => {
  act(() => root.unmount())
})

it.each(COW_LIMIT_CHAIN_IDS)(
  'defaults limit sells to the wrapped native token on chain %s and preserves it in URL updates',
  (chainId) => {
    act(() =>
      root.render(
        <CowLimitLayout chainId={chainId}>
          <CaptureState />
        </CowLimitLayout>,
      ),
    )
    expect(swap.state.token0).toBe(WNATIVE[chainId])
    act(() => swap.mutate.setSwapAmount('1'))
    expect(new URLSearchParams(window.location.search).get('token0')).toBe(
      WNATIVE[chainId].address,
    )
  },
)

it.each(['NATIVE', USDC[1].address])(
  'keeps an explicit sell token from the URL: %s',
  (token0) => {
    window.history.replaceState(null, '', `/ethereum/limit?token0=${token0}`)
    act(() =>
      root.render(
        <CowLimitLayout chainId={1}>
          <CaptureState />
        </CowLimitLayout>,
      ),
    )
    if (token0 === 'NATIVE') {
      expect(swap.state.token0?.isNative).toBe(true)
    } else {
      expect(swap.state.token0).toBe(USDC[1])
    }
  },
)

it('keeps the regular swap default as native ETH', () => {
  act(() =>
    root.render(
      <DerivedstateSimpleSwapProvider chainId={1}>
        <CaptureState />
      </DerivedstateSimpleSwapProvider>,
    ),
  )
  expect(swap.state.token0?.isNative).toBe(true)
})
