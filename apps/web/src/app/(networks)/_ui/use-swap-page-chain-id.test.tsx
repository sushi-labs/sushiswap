import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Header as EvmHeader } from 'src/app/(networks)/(evm)/[chainId]/(trade)/header'
import { Header as SolanaHeader } from 'src/app/(networks)/(non-evm)/solana/header'
import { Header as StellarHeader } from 'src/app/(networks)/(non-evm)/stellar/header'
import { ChainId } from 'sushi'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSwapPageChainId } from './use-swap-page-chain-id'

const mocks = vi.hoisted(() => ({
  pathname: '/ethereum/swap',
  evmHeader: vi.fn(),
  headerShell: vi.fn(),
  networkSelector: vi.fn(),
  userPortfolio: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => mocks.pathname,
}))
vi.mock('~evm/[chainId]/header', () => ({ Header: mocks.evmHeader }))
vi.mock('src/app/(networks)/_ui/header-shell', () => ({
  HeaderShell: mocks.headerShell,
}))
vi.mock('src/lib/wagmi/components/header-network-selector', () => ({
  HeaderNetworkSelector: mocks.networkSelector,
}))
vi.mock('src/app/(networks)/_ui/user-portfolio', () => ({
  UserPortfolio: mocks.userPortfolio,
}))

beforeEach(() => {
  vi.clearAllMocks()
  mocks.pathname = '/ethereum/swap'
  mocks.evmHeader.mockReturnValue(null)
  mocks.headerShell.mockImplementation(
    ({ rightElement }: { rightElement: ReactNode }) => rightElement,
  )
  mocks.networkSelector.mockReturnValue(null)
  mocks.userPortfolio.mockReturnValue(null)
})

function readSwapPageChainId(): ReturnType<typeof useSwapPageChainId> {
  let chainId: ReturnType<typeof useSwapPageChainId>
  function Probe(): null {
    chainId = useSwapPageChainId()
    return null
  }
  renderToStaticMarkup(<Probe />)
  return chainId
}

describe('useSwapPageChainId', () => {
  it.each([
    ['/ethereum/swap', ChainId.ETHEREUM],
    ['/base/swap', ChainId.BASE],
    ['/solana/swap', ChainId.SOLANA],
    ['/stellar/swap', ChainId.STELLAR],
    ['/ethereum/swap/', ChainId.ETHEREUM],
    [`/${ChainId.BASE}/swap`, ChainId.BASE],
    [`/${ChainId.SOLANA}/swap`, ChainId.SOLANA],
    [`/${ChainId.STELLAR}/swap`, ChainId.STELLAR],
  ] as const)('reads the chain from %s', (pathname, expected) => {
    mocks.pathname = pathname
    expect(readSwapPageChainId()).toBe(expected)
  })

  it.each([
    '/ethereum/limit',
    '/ethereum/cross-chain-swap',
    '/stellar/pool',
    '/ethereum/swap/details',
    '/swap',
    '/unknown/swap',
    '/NaN/swap',
    '/-1/swap',
    '/999999999/swap',
    '/aptos/swap',
    `/${ChainId.APTOS}/swap`,
  ])('keeps the existing header fallback on %s', (pathname) => {
    mocks.pathname = pathname
    expect(readSwapPageChainId()).toBeUndefined()
  })
})

describe('swap header chain alignment', () => {
  it('overrides the EVM host chain without changing its network options', () => {
    mocks.pathname = '/katana/swap'
    const networks = [ChainId.ETHEREUM, ChainId.KATANA]
    renderToStaticMarkup(
      <EvmHeader chainId={ChainId.ETHEREUM} networks={networks} />,
    )
    expect(mocks.evmHeader.mock.lastCall?.[0]).toMatchObject({
      chainId: ChainId.KATANA,
      networks,
      variant: 'transparent',
    })
  })

  it('preserves the EVM host chain on advanced pages', () => {
    mocks.pathname = '/base/limit'
    renderToStaticMarkup(<EvmHeader chainId={ChainId.ETHEREUM} />)
    expect(mocks.evmHeader.mock.lastCall?.[0].chainId).toBe(ChainId.ETHEREUM)
  })

  it.each([
    ['/base/swap', ChainId.BASE, undefined],
    ['/solana/swap', ChainId.SOLANA, undefined],
    ['/stellar/swap', ChainId.STELLAR, 'stellar'],
  ] as const)(
    'aligns the Stellar header and wallet chooser on %s',
    (pathname, chainId, namespace) => {
      mocks.pathname = pathname
      renderToStaticMarkup(<StellarHeader />)
      expect(mocks.headerShell.mock.lastCall?.[0].chainId).toBe(chainId)
      expect(mocks.networkSelector.mock.lastCall?.[0].selectedNetwork).toBe(
        chainId,
      )
      expect(mocks.userPortfolio.mock.lastCall?.[0]).toMatchObject({
        selectedNetwork: chainId,
        namespace,
      })
    },
  )

  it('aligns the Solana header and wallet chooser to an EVM source', () => {
    mocks.pathname = '/base/swap'
    renderToStaticMarkup(<SolanaHeader />)
    expect(mocks.headerShell.mock.lastCall?.[0].chainId).toBe(ChainId.BASE)
    expect(mocks.networkSelector.mock.lastCall?.[0].selectedNetwork).toBe(
      ChainId.BASE,
    )
    expect(mocks.userPortfolio.mock.lastCall?.[0].selectedNetwork).toBe(
      ChainId.BASE,
    )
  })

  it.each([
    [SolanaHeader, ChainId.SOLANA],
    [StellarHeader, ChainId.STELLAR],
  ] as const)('preserves the non-swap header fallback', (Header, chainId) => {
    mocks.pathname = '/base/pool'
    renderToStaticMarkup(<Header />)
    expect(mocks.headerShell.mock.lastCall?.[0].chainId).toBe(chainId)
  })
})
