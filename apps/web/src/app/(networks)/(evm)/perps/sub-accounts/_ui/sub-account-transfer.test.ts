import type {
  SpotClearinghouseStateResponse,
  SpotMetaResponse,
} from '@nktkas/hyperliquid'
import { describe, expect, it } from 'vitest'
import {
  getSubAccountTransferAmountError,
  getSubAccountTransferAssets,
  getSubAccountTransferRoute,
} from './sub-account-transfer'

const masterAddress = '0x0000000000000000000000000000000000000001'
const subAccountAddress = '0x0000000000000000000000000000000000000002'
const tokenId = '0x00000000000000000000000000000001'
const meta: SpotMetaResponse = {
  universe: [],
  tokens: [
    {
      name: 'TOKEN',
      index: 7,
      tokenId,
      weiDecimals: 8,
      szDecimals: 2,
      isCanonical: true,
      evmContract: null,
      fullName: null,
      deployerTradingFeeShare: '0',
    },
  ],
}

function getState(total: string, hold = '0'): SpotClearinghouseStateResponse {
  return { balances: [{ coin: 'TOKEN', token: 7, total, hold, entryNtl: '0' }] }
}

describe('sub-account transfer assets', () => {
  it('uses full token metadata even without a listed trading pair', () => {
    expect(
      getSubAccountTransferAssets(getState('1.12345678', '0.1'), meta),
    ).toEqual([
      {
        token: `TOKEN:${tokenId}`,
        symbol: 'TOKEN',
        decimals: 8,
        balance: '1.02345678',
      },
    ])
  })

  it('subtracts holds exactly above JavaScript safe integer precision', () => {
    expect(
      getSubAccountTransferAssets(
        getState('9007199254740993.00000001', '9007199254740993'),
        meta,
      )[0]?.balance,
    ).toBe('0.00000001')
  })

  it('subtracts before flooring to transferable precision', () => {
    expect(
      getSubAccountTransferAssets(
        getState('1.000000009', '0.000000001'),
        meta,
      )[0]?.balance,
    ).toBe('1')
  })

  it('limits withdrawals to the available maintenance margin amount', () => {
    const state = getState('100', '10')
    state.tokenToAvailableAfterMaintenance = [[7, '12.123456789']]
    expect(getSubAccountTransferAssets(state, meta)[0]?.balance).toBe(
      '12.12345678',
    )
  })

  it('does not allow a maintenance limit to exceed the unheld spot balance', () => {
    const state = getState('100', '90')
    state.tokenToAvailableAfterMaintenance = [[7, '50']]
    expect(getSubAccountTransferAssets(state, meta)[0]?.balance).toBe('10')
  })

  it.each([
    ['0', '0'],
    ['1', '1'],
    ['1', '2'],
    ['-1', '0'],
    ['0.000000001', '0'],
  ])('excludes nontransferable total %s with hold %s', (total, hold) => {
    expect(getSubAccountTransferAssets(getState(total, hold), meta)).toEqual([])
  })

  it('rejects malformed API balances', () => {
    expect(() => getSubAccountTransferAssets(getState('NaN'), meta)).toThrow(
      'Unable to read',
    )
  })
})

describe('sub-account transfer amounts', () => {
  const asset = {
    token: `TOKEN:${tokenId}`,
    symbol: 'TOKEN',
    decimals: 8,
    balance: '1.00000001',
  }

  it.each(['0', '-1', 'NaN', 'Infinity', '1e-8', '', '.', '1.000000001'])(
    'rejects %s',
    (amount) => {
      expect(getSubAccountTransferAmountError(amount, asset)).toBeDefined()
    },
  )

  it('rejects even one smallest unit above the available balance', () => {
    expect(getSubAccountTransferAmountError('1.00000002', asset)).toBe(
      'Insufficient available balance.',
    )
  })

  it.each(['1.00000001', '0.00000001', '.1', '1.'])(
    'accepts exact valid amount %s',
    (amount) => {
      expect(getSubAccountTransferAmountError(amount, asset)).toBeUndefined()
    },
  )
})

describe('sub-account transfer routing', () => {
  it('sends from the master to the selected sub-account', () => {
    expect(
      getSubAccountTransferRoute({
        masterAddress,
        subAccountAddress,
        direction: 'to-sub-account',
      }),
    ).toEqual({
      sourceAddress: masterAddress,
      destination: subAccountAddress,
      sourceDex: 'spot',
      destinationDex: 'spot',
      fromSubAccount: undefined,
    })
  })

  it('sends from the selected sub-account back to the master', () => {
    expect(
      getSubAccountTransferRoute({
        masterAddress,
        subAccountAddress,
        direction: 'to-master',
      }),
    ).toEqual({
      sourceAddress: subAccountAddress,
      destination: masterAddress,
      sourceDex: 'spot',
      destinationDex: 'spot',
      fromSubAccount: subAccountAddress,
    })
  })
})
