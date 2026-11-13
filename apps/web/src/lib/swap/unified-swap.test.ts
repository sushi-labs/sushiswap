import { EvmChainId, USDC } from 'sushi/evm'
import { MvmChainId } from 'sushi/mvm'
import {
  STELLAR_USDC,
  STELLAR_USDT0,
  STELLAR_XLM,
  StellarChainId,
} from 'sushi/stellar'
import { SVM_USDC, SvmChainId } from 'sushi/svm'
import { describe, expect, it } from 'vitest'
import {
  getDefaultCurrency,
  getQuoteCurrency,
} from '~evm/[chainId]/(trade)/_ui/derivedstate-swap-helpers'
import {
  UNIFIED_SWAP_CHAIN_IDS,
  getUnifiedSwapDefaultToken,
  getUnifiedSwapParams,
  isCurrentUnifiedSwapInput,
  isUnifiedSwapChainId,
  selectUnifiedSwapToken,
  switchUnifiedSwapTokens,
} from './unified-swap'

const ethereum = EvmChainId.ETHEREUM
const base = EvmChainId.BASE
const stellar = StellarChainId.STELLAR
const solana = SvmChainId.SOLANA

function createParams(overrides: Record<string, string> = {}): URLSearchParams {
  return new URLSearchParams({
    chainId0: String(ethereum),
    chainId1: String(ethereum),
    token0: 'NATIVE',
    token1: USDC[ethereum].address,
    swapAmount: '12.5',
    referrer: 'existing-campaign',
    ...overrides,
  })
}

describe('unified swap defaults', () => {
  it.each([ethereum, solana])(
    'preserves existing same-chain defaults on chain %s',
    (chainId) => {
      const params = getUnifiedSwapParams('', chainId)
      expect(params.get('chainId0')).toBe(String(chainId))
      expect(params.get('chainId1')).toBe(String(chainId))
      expect(params.get('token0')).toBe(getDefaultCurrency(chainId))
      expect(params.get('token1')).toBe(getQuoteCurrency(chainId))
    },
  )

  it('uses the existing Stellar contract token defaults', () => {
    const params = getUnifiedSwapParams('', stellar)
    expect(params.get('token0')).toBe(STELLAR_XLM[stellar].address)
    expect(params.get('token1')).toBe(STELLAR_USDT0[stellar].address)
    expect(getUnifiedSwapDefaultToken(stellar, 'INPUT')).toBe(
      STELLAR_XLM[stellar].address,
    )
  })

  it('keeps explicitly selected tokens and unrelated URL parameters', () => {
    const current = createParams({ chainId1: String(base), token1: 'NATIVE' })
    expect(getUnifiedSwapParams(current.toString(), solana).toString()).toBe(
      current.toString(),
    )
  })

  it.each(['unknown', '-1', '999999999'])(
    'falls back from an invalid source chain %s and uses the source for an invalid destination',
    (invalidChainId) => {
      const params = getUnifiedSwapParams(
        `chainId0=${invalidChainId}&chainId1=${invalidChainId}`,
        ethereum,
      )
      expect(params.get('chainId0')).toBe(String(ethereum))
      expect(params.get('chainId1')).toBe(String(ethereum))
      expect(params.get('token0')).toBe(getDefaultCurrency(ethereum))
    },
  )

  it('keeps Aptos outside the unified network registry', () => {
    expect(
      UNIFIED_SWAP_CHAIN_IDS.some(
        (chainId) => Number(chainId) === MvmChainId.APTOS,
      ),
    ).toBe(false)
    expect(isUnifiedSwapChainId(MvmChainId.APTOS)).toBe(false)
  })
})

describe('unified token selection', () => {
  it('changes only the destination chain and token when moving into cross-chain swap', () => {
    const current = createParams()
    const original = current.toString()
    const next = selectUnifiedSwapToken(
      current,
      'OUTPUT',
      base,
      USDC[base].address,
    )

    expect(Object.fromEntries(next)).toEqual({
      ...Object.fromEntries(current),
      chainId1: String(base),
      token1: USDC[base].address,
    })
    expect(current.toString()).toBe(original)
  })

  it('clears the input amount when changing the source chain and preserves the destination', () => {
    const current = createParams({ chainId1: String(base) })
    const next = selectUnifiedSwapToken(current, 'INPUT', solana, 'NATIVE')

    expect(next.get('chainId0')).toBe(String(solana))
    expect(next.get('token0')).toBe('NATIVE')
    expect(next.get('chainId1')).toBe(String(base))
    expect(next.get('token1')).toBe(current.get('token1'))
    expect(next.has('swapAmount')).toBe(false)
    expect(next.get('referrer')).toBe('existing-campaign')
  })

  it('does not treat native tokens on different chains as the same token', () => {
    const current = createParams()
    const next = selectUnifiedSwapToken(current, 'OUTPUT', base, 'NATIVE')

    expect(next.get('chainId0')).toBe(String(ethereum))
    expect(next.get('chainId1')).toBe(String(base))
    expect(next.get('token0')).toBe('NATIVE')
    expect(next.get('token1')).toBe('NATIVE')
    expect(next.get('swapAmount')).toBe('12.5')
  })

  it('switches both sides when selecting the opposite token on the same chain', () => {
    const current = createParams()
    const next = selectUnifiedSwapToken(
      current,
      'INPUT',
      ethereum,
      USDC[ethereum].address,
    )

    expect(next.get('token0')).toBe(USDC[ethereum].address)
    expect(next.get('token1')).toBe('NATIVE')
    expect(next.has('swapAmount')).toBe(false)
    expect(next.get('referrer')).toBe('existing-campaign')
  })

  it('compares EVM addresses without case sensitivity', () => {
    const address = USDC[ethereum].address
    const current = createParams({
      token1: `0x${address.slice(2).toUpperCase()}`,
    })
    const next = selectUnifiedSwapToken(
      current,
      'INPUT',
      ethereum,
      address.toLowerCase(),
    )
    expect(next.get('token1')).toBe('NATIVE')
    expect(next.has('swapAmount')).toBe(false)
  })

  it('keeps distinct Solana address casing separate', () => {
    const address = SVM_USDC[solana].address
    const current = createParams({
      chainId0: String(solana),
      chainId1: String(solana),
      token1: address,
    })
    const next = selectUnifiedSwapToken(
      current,
      'INPUT',
      solana,
      address.toLowerCase(),
    )

    expect(next.get('token0')).toBe(address.toLowerCase())
    expect(next.get('token1')).toBe(address)
    expect(next.get('swapAmount')).toBe('12.5')
  })

  it('can return from a cross-chain pair to a same-chain pair without changing the source', () => {
    const current = createParams({ chainId1: String(base), token1: 'NATIVE' })
    const next = selectUnifiedSwapToken(
      current,
      'OUTPUT',
      ethereum,
      USDC[ethereum].address,
    )

    expect(next.get('chainId0')).toBe(String(ethereum))
    expect(next.get('chainId1')).toBe(String(ethereum))
    expect(next.get('token0')).toBe('NATIVE')
    expect(next.get('token1')).toBe(USDC[ethereum].address)
    expect(next.get('swapAmount')).toBe('12.5')
  })

  it.each([STELLAR_XLM[stellar].address, STELLAR_USDC[stellar].address])(
    'preserves Stellar source selection clearing the amount for %s',
    (address) => {
      const current = createParams({
        chainId0: String(stellar),
        chainId1: String(stellar),
        token0: STELLAR_XLM[stellar].address,
        token1: STELLAR_USDT0[stellar].address,
      })
      const next = selectUnifiedSwapToken(current, 'INPUT', stellar, address)

      expect(next.get('token0')).toBe(address)
      expect(next.get('token1')).toBe(STELLAR_USDT0[stellar].address)
      expect(next.has('swapAmount')).toBe(false)
    },
  )
})

describe('unified input snapshots', () => {
  it('switches networks and tokens together without mutating the previous snapshot', () => {
    const current = createParams({
      chainId1: String(solana),
      token1: SVM_USDC[solana].address,
    })
    const original = current.toString()
    const next = switchUnifiedSwapTokens(current)

    expect(Object.fromEntries(next)).toEqual({
      chainId0: String(solana),
      chainId1: String(ethereum),
      token0: SVM_USDC[solana].address,
      token1: 'NATIVE',
      referrer: 'existing-campaign',
    })
    expect(current.toString()).toBe(original)
  })

  it('accepts unchanged trade inputs even when unrelated query parameters change', () => {
    const snapshot = createParams()
    const current = createParams({ referrer: 'new-campaign' })
    expect(isCurrentUnifiedSwapInput(snapshot, current)).toBe(true)
  })

  it.each(['chainId0', 'chainId1', 'token0', 'token1', 'swapAmount'])(
    'rejects a completion callback when %s has changed since submission',
    (key) => {
      const snapshot = createParams()
      const current = new URLSearchParams(snapshot)
      current.set(key, 'changed')
      expect(isCurrentUnifiedSwapInput(snapshot, current)).toBe(false)
    },
  )
})
