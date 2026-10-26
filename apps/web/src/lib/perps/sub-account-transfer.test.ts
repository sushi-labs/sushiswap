import type {
  AllPerpMetasResponse,
  SpotClearinghouseStateResponse,
  SpotMetaResponse,
} from '@nktkas/hyperliquid'
import { describe, expect, it } from 'vitest'
import {
  type SubAccountTransferAsset,
  getSubAccountTransferAmountError,
  getSubAccountTransferAssets,
  getSubAccountTransferRoute,
} from './utils'

const usdc: SpotMetaResponse['tokens'][number] = {
  name: 'USDC',
  index: 0,
  szDecimals: 2,
  weiDecimals: 8,
  tokenId: '0x00000000000000000000000000000001',
  isCanonical: true,
  evmContract: null,
  fullName: null,
  deployerTradingFeeShare: '0',
}
const meta: SpotMetaResponse = { tokens: [usdc], universe: [] }
const emptySpot: SpotClearinghouseStateResponse = { balances: [] }
const perpMetas: AllPerpMetasResponse = [
  {
    collateralToken: 0,
    marginTables: [],
    universe: [
      { name: 'BTC', szDecimals: 3, marginTableId: 1, maxLeverage: 10 },
    ],
  },
  {
    collateralToken: 0,
    marginTables: [],
    universe: [
      { name: 'xyz:XYZ', szDecimals: 3, marginTableId: 1, maxLeverage: 10 },
    ],
  },
  {
    collateralToken: 360,
    marginTables: [],
    universe: [
      { name: 'cash:CASH', szDecimals: 3, marginTableId: 1, maxLeverage: 10 },
    ],
  },
]

function spotState(
  total: string,
  hold = '0',
  maintenanceAvailable?: string,
): SpotClearinghouseStateResponse {
  return {
    balances: [{ coin: 'USDC', token: 0, total, hold, entryNtl: '0' }],
    tokenToAvailableAfterMaintenance:
      maintenanceAvailable === undefined ? [] : [[0, maintenanceAvailable]],
  }
}

describe('getSubAccountTransferAssets', () => {
  it('keeps manual-mode perps USDC separate from spot USDC', () => {
    expect(
      getSubAccountTransferAssets(spotState('12', '2'), meta, {
        clearinghouseStates: [['', { withdrawable: '34.1234567' }]],
        perpMetas,
        abstraction: 'disabled',
      }),
    ).toEqual([
      {
        id: JSON.stringify(['spot', `USDC:${usdc.tokenId}`]),
        token: `USDC:${usdc.tokenId}`,
        symbol: 'USDC',
        decimals: 8,
        balance: '10',
        sourceDex: 'spot',
      },
      {
        id: JSON.stringify(['', 'USDC']),
        token: 'USDC',
        symbol: 'USDC',
        decimals: 6,
        balance: '34.123456',
        sourceDex: '',
      },
    ])
  })

  it('keeps native and HIP-3 USDC balances independently selectable', () => {
    const assets = getSubAccountTransferAssets(spotState('3'), meta, {
      clearinghouseStates: [
        ['', { withdrawable: '4' }],
        ['xyz', { withdrawable: '5' }],
      ],
      perpMetas,
      abstraction: 'disabled',
    })
    expect(
      assets.map(({ id, token, balance, sourceDex }) => ({
        id,
        token,
        balance,
        sourceDex,
      })),
    ).toEqual([
      {
        id: JSON.stringify(['spot', `USDC:${usdc.tokenId}`]),
        token: `USDC:${usdc.tokenId}`,
        balance: '3',
        sourceDex: 'spot',
      },
      {
        id: JSON.stringify(['', 'USDC']),
        token: 'USDC',
        balance: '4',
        sourceDex: '',
      },
      {
        id: JSON.stringify(['xyz', 'USDC']),
        token: 'USDC',
        balance: '5',
        sourceDex: 'xyz',
      },
    ])
  })

  it.each([4, 8])(
    'resolves HIP-3 non-USDC collateral with %s token decimals',
    (weiDecimals) => {
      const usdh: SpotMetaResponse['tokens'][number] = {
        ...usdc,
        name: 'USDH',
        index: 360,
        weiDecimals,
        tokenId: '0x00000000000000000000000000000002',
      }
      const assets = getSubAccountTransferAssets(
        emptySpot,
        { tokens: [usdc, usdh], universe: [] },
        {
          clearinghouseStates: [['cash', { withdrawable: '8.123456789' }]],
          perpMetas,
          abstraction: 'disabled',
        },
      )
      expect(assets).toEqual([
        {
          id: JSON.stringify(['cash', `USDH:${usdh.tokenId}`]),
          token: `USDH:${usdh.tokenId}`,
          symbol: 'USDH',
          decimals: Math.min(6, weiDecimals),
          balance: weiDecimals === 4 ? '8.1234' : '8.123456',
          sourceDex: 'cash',
        },
      ])
    },
  )

  it.each(['unknown', 'cash'])(
    'rejects an available %s balance whose collateral cannot be resolved',
    (sourceDex) => {
      expect(() =>
        getSubAccountTransferAssets(emptySpot, meta, {
          clearinghouseStates: [[sourceDex, { withdrawable: '1' }]],
          perpMetas,
          abstraction: 'disabled',
        }),
      ).toThrow(`Unable to identify collateral for ${sourceDex} perps.`)
    },
  )

  it('ignores unsupported DEXs without a transferable balance', () => {
    expect(
      getSubAccountTransferAssets(emptySpot, meta, {
        clearinghouseStates: [
          ['unknown', { withdrawable: '0' }],
          ['cash', { withdrawable: '0.0000009' }],
        ],
        perpMetas,
        abstraction: 'disabled',
      }),
    ).toEqual([])
  })

  it.each(['disabled', 'default', 'dexAbstraction'] as const)(
    'includes available perps USDC with no spot assets in %s mode',
    (abstraction) => {
      expect(
        getSubAccountTransferAssets(emptySpot, meta, {
          clearinghouseStates: [['', { withdrawable: '5.000001' }]],
          perpMetas,
          abstraction,
        }),
      ).toEqual([
        {
          id: JSON.stringify(['', 'USDC']),
          token: 'USDC',
          symbol: 'USDC',
          decimals: 6,
          balance: '5.000001',
          sourceDex: '',
        },
      ])
    },
  )

  it.each(['unifiedAccount', 'portfolioMargin'] as const)(
    'does not duplicate perps collateral in %s mode',
    (abstraction) => {
      const assets = getSubAccountTransferAssets(spotState('10'), meta, {
        clearinghouseStates: [
          ['', { withdrawable: '10' }],
          ['xyz', { withdrawable: '20' }],
        ],
        perpMetas,
        abstraction,
      })
      expect(assets).toHaveLength(1)
      expect(assets[0]).toMatchObject({ balance: '10', sourceDex: 'spot' })
    },
  )

  it.each(['0', '-1', '0.0000009'])(
    'omits nontransferable perps balance %s',
    (withdrawable) => {
      expect(
        getSubAccountTransferAssets(emptySpot, meta, {
          clearinghouseStates: [['', { withdrawable }]],
          perpMetas,
          abstraction: 'disabled',
        }),
      ).toEqual([])
    },
  )

  it.each(['NaN', 'Infinity', '', '1e3', '1.2.3'])(
    'rejects malformed perps balance %s',
    (withdrawable) => {
      expect(() =>
        getSubAccountTransferAssets(emptySpot, meta, {
          clearinghouseStates: [['', { withdrawable }]],
          perpMetas,
          abstraction: 'disabled',
        }),
      ).toThrow('Unable to read the available balance.')
    },
  )

  it('preserves precision above Number.MAX_SAFE_INTEGER and rounds down', () => {
    const assets = getSubAccountTransferAssets(emptySpot, meta, {
      clearinghouseStates: [
        ['', { withdrawable: '9007199254740993.123456999' }],
      ],
      perpMetas,
      abstraction: 'disabled',
    })
    expect(assets[0]?.balance).toBe('9007199254740993.123456')
  })

  it('subtracts spot holds before rounding and applies maintenance limits', () => {
    const assets = getSubAccountTransferAssets(
      spotState('10.000000009', '0.000000002', '9.123456789'),
      meta,
    )
    expect(assets[0]?.balance).toBe('9.12345678')
    expect(
      getSubAccountTransferAssets(
        spotState('10.000000009', '0.000000002', '11'),
        meta,
      )[0]?.balance,
    ).toBe('10')
  })

  it('omits spot assets whose entire available balance is held or restricted', () => {
    expect(getSubAccountTransferAssets(spotState('10', '10'), meta)).toEqual([])
    expect(
      getSubAccountTransferAssets(spotState('10', '0', '0'), meta),
    ).toEqual([])
  })

  it('rejects malformed spot balances', () => {
    expect(() => getSubAccountTransferAssets(spotState('NaN'), meta)).toThrow(
      'Unable to read the available balance.',
    )
  })
})

describe('getSubAccountTransferRoute', () => {
  const masterAddress = '0x0000000000000000000000000000000000000001'
  const subAccountAddress = '0x0000000000000000000000000000000000000002'

  it.each(['spot', '', 'xyz', 'cash'] as const)(
    'routes both directions through the selected %j DEX',
    (sourceDex) => {
      expect(
        getSubAccountTransferRoute({
          masterAddress,
          subAccountAddress,
          direction: 'to-sub-account',
          sourceDex,
        }),
      ).toEqual({
        sourceAddress: masterAddress,
        destination: subAccountAddress,
        sourceDex,
        destinationDex: sourceDex,
        fromSubAccount: undefined,
      })
      expect(
        getSubAccountTransferRoute({
          masterAddress,
          subAccountAddress,
          direction: 'to-master',
          sourceDex,
        }),
      ).toEqual({
        sourceAddress: subAccountAddress,
        destination: masterAddress,
        sourceDex,
        destinationDex: sourceDex,
        fromSubAccount: subAccountAddress,
      })
    },
  )

  it('preserves the default spot transfer route', () => {
    expect(
      getSubAccountTransferRoute({
        masterAddress,
        subAccountAddress,
        direction: 'to-sub-account',
      }),
    ).toMatchObject({ sourceDex: 'spot', destinationDex: 'spot' })
  })
})

describe('getSubAccountTransferAmountError', () => {
  const asset: SubAccountTransferAsset = {
    id: JSON.stringify(['', 'USDC']),
    token: 'USDC',
    symbol: 'USDC',
    decimals: 6,
    balance: '12.123456',
    sourceDex: '',
  }

  it('accepts the exact withdrawable balance without rounding it up', () => {
    expect(getSubAccountTransferAmountError('12.123456', asset)).toBeUndefined()
    expect(
      getSubAccountTransferAmountError('12.1234560', asset),
    ).toBeUndefined()
    expect(getSubAccountTransferAmountError('12.123457', asset)).toBe(
      'Insufficient available balance.',
    )
    expect(getSubAccountTransferAmountError('12.1234561', asset)).toBe(
      'Use no more than 6 decimal places.',
    )
  })

  it.each(['0', '-1', '', 'NaN', '1e3'])(
    'rejects invalid transfer amount %s',
    (amount) => {
      expect(getSubAccountTransferAmountError(amount, asset)).toBe(
        'Enter an amount greater than zero.',
      )
    },
  )

  it('rejects a missing selected asset', () => {
    expect(getSubAccountTransferAmountError('1', undefined)).toBe(
      'Select an available asset.',
    )
  })
})
