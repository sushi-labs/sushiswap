/** @vitest-environment jsdom */

import type { VaultV1 } from '@sushiswap/graph-client/data-api'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { EvmChainId } from 'sushi/evm'
import { expect, it, vi } from 'vitest'
import {
  SteerPositionAddProvider,
  useSteerPositionAddActions,
  useSteerPositionAddDerivedInfo,
} from './steer-position-add-provider'

const reserves = vi.hoisted(() => ({ reserve0: 100n, reserve1: 200n }))
vi.mock('src/lib/steer/hooks/use-steer-vault-reserves', () => ({
  useSteerVaultReserves: () => ({ data: reserves, isLoading: false }),
}))
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const vault: VaultV1 = {
  id: '1:0x7187535269d7871bf3ad0c77b5350a5632282ee8',
  address: '0x7187535269d7871bf3ad0c77b5350a5632282ee8',
  chainId: EvmChainId.ETHEREUM,
  poolAddress: '0x7187535269d7871bf3ad0c77b5350a5632282ee8',
  token0: {
    id: '1:0x0000000000000000000000000000000000000001',
    address: '0x0000000000000000000000000000000000000001',
    chainId: EvmChainId.ETHEREUM,
    name: 'Token A',
    symbol: 'A',
    decimals: 6,
  },
  token1: {
    id: '1:0x0000000000000000000000000000000000000002',
    address: '0x0000000000000000000000000000000000000002',
    chainId: EvmChainId.ETHEREUM,
    name: 'Token B',
    symbol: 'B',
    decimals: 18,
  },
  feeTier: 0,
  performanceFee: 0,
  adjustmentFrequency: 0,
  lastAdjustmentTimestamp: 0,
  strategy: 'Test',
  description: '',
  payloadHash: '',
  lowerTick: 0,
  upperTick: 0,
  apr: 0,
  apr1d: 0,
  apr1w: 0,
  reserve0: 0n,
  reserve0USD: 0,
  fees0: 0n,
  fees0USD: 0,
  reserve1: 0n,
  reserve1USD: 0,
  fees1: 0n,
  fees1USD: 0,
  reserveUSD: 0,
  feesUSD: 0,
  feeApr1d: 0,
  feeAndIncentiveApr1d: 0,
  stakedApr1d: 0,
  stakedAndIncentiveApr1d: 0,
  incentiveApr: 0,
  wasIncentivized: false,
  isIncentivized: false,
  isEnabled: true,
  wasEnabled: true,
  isDeprecated: false,
}

it.each([
  [100n, 200n, false, false],
  [0n, 200n, true, false],
  [100n, 0n, false, true],
  [0n, 0n, false, false],
])(
  'calculates deposits with reserves %s:%s',
  (reserve0, reserve1, lockedA, lockedB) => {
    Object.assign(reserves, { reserve0, reserve1 })
    const container = document.createElement('div')
    const root = createRoot(container)
    let info: ReturnType<typeof useSteerPositionAddDerivedInfo> | undefined
    function Probe() {
      info = useSteerPositionAddDerivedInfo({ vault })
      const { onFieldAInput, onFieldBInput } = useSteerPositionAddActions()
      return (
        <>
          <button type="button" onClick={() => onFieldAInput('1')}>
            A
          </button>
          <button type="button" onClick={() => onFieldBInput('1')}>
            B
          </button>
          <button type="button" onClick={() => onFieldBInput('')}>
            Clear
          </button>
        </>
      )
    }
    try {
      act(() =>
        root.render(
          <SteerPositionAddProvider>
            <Probe />
          </SteerPositionAddProvider>,
        ),
      )
      expect(info?.depositADisabled).toBe(lockedA)
      expect(info?.depositBDisabled).toBe(lockedB)
      for (const index of [0, 1]) {
        act(() => container.querySelectorAll('button')[index]?.click())
        const independentReserve = index === 0 ? reserve0 : reserve1
        const dependentReserve = index === 0 ? reserve1 : reserve0
        if (independentReserve > 0n) {
          expect(info?.parsedAmounts).toBeDefined()
          expect(info?.dependentAmount?.amount).toBe(
            (10n ** BigInt(index === 0 ? 6 : 18) * dependentReserve) /
              independentReserve,
          )
        } else {
          expect(info?.parsedAmounts).toBeUndefined()
        }
      }
      act(() => container.querySelectorAll('button')[2]?.click())
      expect(info?.parsedAmounts).toBeUndefined()
    } finally {
      act(() => root.unmount())
    }
  },
)
