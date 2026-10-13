import { Amount, Fraction, getNativeAddress } from 'sushi'
import { EvmChainId, EvmNative, EvmToken } from 'sushi/evm'
import { STELLAR_USDT0, StellarChainId, StellarToken } from 'sushi/stellar'
import { describe, expect, it } from 'vitest'
import type { PriceMap } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import type { TokenSelectorChainId } from '../config'
import { getTokenGroups } from './token-groups'

const sixDecimals = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  address: '0x0000000000000000000000000000000000000001',
  decimals: 6,
  symbol: 'SIX',
  name: 'Six decimals',
})
const eighteenDecimals = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  address: '0x0000000000000000000000000000000000000002',
  decimals: 18,
  symbol: 'EIGHTEEN',
  name: 'Eighteen decimals',
})
const unpriced = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  address: '0x0000000000000000000000000000000000000003',
  decimals: 18,
  symbol: 'OTHER',
  name: 'Other token',
})

function priceMap<TChainId extends TokenSelectorChainId>(
  entries: [ContractAddressFor<TChainId>, Fraction][],
): PriceMap<TChainId> {
  const prices = new Map(entries)
  return {
    has: (address) => prices.has(address),
    get: (address) => prices.get(address)?.toNumber(),
    getFraction: (address) => prices.get(address),
  }
}

function dollars(numerator: number): Fraction {
  return new Fraction({ numerator, denominator: 1 })
}

describe('getTokenGroups', () => {
  it('keeps unique provider currencies in order when balances are unavailable', () => {
    const duplicate = new EvmToken({
      ...sixDecimals.toJSON(),
      metadata: { icon: 'https://example.com/duplicate.png' },
    })
    const currencies = [sixDecimals, eighteenDecimals, duplicate, unpriced]
    const result = getTokenGroups({
      currencies,
      balancesMap: undefined,
      pricesMap: undefined,
    })

    expect(result.myCurrencies).toEqual([])
    expect(result.otherCurrencies).toEqual([
      sixDecimals,
      eighteenDecimals,
      unpriced,
    ])
    expect(result.otherCurrencies[0]).toBe(sixDecimals)
    expect(currencies).toEqual([
      sixDecimals,
      eighteenDecimals,
      duplicate,
      unpriced,
    ])
  })

  it('groups only positive balances from the supported catalog and deduplicates both groups', () => {
    const walletOnly = new EvmToken({
      ...sixDecimals.toJSON(),
      address: '0x0000000000000000000000000000000000000004',
    })
    const result = getTokenGroups({
      currencies: [
        unpriced,
        sixDecimals,
        eighteenDecimals,
        sixDecimals,
        unpriced,
      ],
      balancesMap: new Map([
        [sixDecimals.address, Amount.fromHuman(sixDecimals, '1')],
        [eighteenDecimals.address, Amount.fromHuman(eighteenDecimals, '0')],
        [walletOnly.address, Amount.fromHuman(walletOnly, '100')],
      ]),
      pricesMap: undefined,
    })

    expect(result.myCurrencies).toEqual([sixDecimals])
    expect(result.myCurrencies[0]).toBe(sixDecimals)
    expect(result.otherCurrencies).toEqual([unpriced, eighteenDecimals])
  })

  it('sorts priced holdings by fiat value ahead of larger unpriced holdings', () => {
    const result = getTokenGroups({
      currencies: [unpriced, sixDecimals, eighteenDecimals],
      balancesMap: new Map([
        [unpriced.address, Amount.fromHuman(unpriced, '10000')],
        [sixDecimals.address, Amount.fromHuman(sixDecimals, '100')],
        [eighteenDecimals.address, Amount.fromHuman(eighteenDecimals, '2')],
      ]),
      pricesMap: priceMap<EvmChainId>([
        [sixDecimals.address, dollars(1)],
        [eighteenDecimals.address, dollars(100)],
      ]),
    })

    expect(result.myCurrencies).toEqual([
      eighteenDecimals,
      sixDecimals,
      unpriced,
    ])
    expect(result.otherCurrencies).toEqual([])
  })

  it('normalizes decimals when sorting unpriced token amounts', () => {
    const result = getTokenGroups({
      currencies: [eighteenDecimals, sixDecimals],
      balancesMap: new Map([
        [eighteenDecimals.address, Amount.fromHuman(eighteenDecimals, '1')],
        [sixDecimals.address, Amount.fromHuman(sixDecimals, '2')],
      ]),
      pricesMap: undefined,
    })

    expect(result.myCurrencies).toEqual([sixDecimals, eighteenDecimals])
  })

  it.each([false, true])(
    'keeps catalog order when normalized values tie (priced: %s)',
    (priced) => {
      const result = getTokenGroups({
        currencies: [sixDecimals, eighteenDecimals],
        balancesMap: new Map([
          [sixDecimals.address, Amount.fromHuman(sixDecimals, '1')],
          [
            eighteenDecimals.address,
            Amount.fromHuman(eighteenDecimals, priced ? '2' : '1'),
          ],
        ]),
        pricesMap: priced
          ? priceMap<EvmChainId>([
              [sixDecimals.address, dollars(2)],
              [eighteenDecimals.address, dollars(1)],
            ])
          : undefined,
      })

      expect(result.myCurrencies).toEqual([sixDecimals, eighteenDecimals])
    },
  )

  it('compares exact fiat values beyond floating-point precision', () => {
    const result = getTokenGroups({
      currencies: [sixDecimals, eighteenDecimals],
      balancesMap: new Map([
        [
          sixDecimals.address,
          Amount.fromHuman(sixDecimals, '9007199254740992'),
        ],
        [
          eighteenDecimals.address,
          Amount.fromHuman(eighteenDecimals, '9007199254740993'),
        ],
      ]),
      pricesMap: priceMap<EvmChainId>([
        [sixDecimals.address, dollars(1)],
        [eighteenDecimals.address, dollars(1)],
      ]),
    })

    expect(result.myCurrencies).toEqual([eighteenDecimals, sixDecimals])
  })

  it('keeps different contracts with the same symbol distinct', () => {
    const sameSymbol = new EvmToken({
      ...eighteenDecimals.toJSON(),
      symbol: sixDecimals.symbol,
    })
    const result = getTokenGroups({
      currencies: [sixDecimals, sameSymbol],
      balancesMap: new Map([
        [sameSymbol.address, Amount.fromHuman(sameSymbol, '1')],
      ]),
      pricesMap: undefined,
    })

    expect(result.myCurrencies).toEqual([sameSymbol])
    expect(result.otherCurrencies).toEqual([sixDecimals])
  })

  it('uses distinct native and wrapped balances with the wrapped price address', () => {
    const native = EvmNative.fromChainId(EvmChainId.ETHEREUM)
    const wrapped = native.wrap()
    const result = getTokenGroups({
      currencies: [sixDecimals, wrapped, native],
      balancesMap: new Map<string, Amount<CurrencyFor<EvmChainId>>>([
        [getNativeAddress(native.chainId), Amount.fromHuman(native, '2')],
        [wrapped.address, Amount.fromHuman(wrapped, '1')],
        [sixDecimals.address, Amount.fromHuman(sixDecimals, '1000')],
      ]),
      pricesMap: priceMap<EvmChainId>([
        [wrapped.address, dollars(100)],
        [sixDecimals.address, dollars(1)],
      ]),
    })

    expect(result.myCurrencies).toEqual([sixDecimals, native, wrapped])
    expect(result.myCurrencies[1]).toBe(native)
    expect(result.myCurrencies[2]).toBe(wrapped)
  })

  it('retains Stellar provider objects and issuer metadata', () => {
    const token = new StellarToken({
      ...STELLAR_USDT0[StellarChainId.STELLAR].toJSON(),
      metadata: { icon: 'https://example.com/usdt0.png', approved: true },
    })
    const result = getTokenGroups({
      currencies: [token],
      balancesMap: new Map([
        [token.address, Amount.fromHuman(token, '0.0000001')],
      ]),
      pricesMap: priceMap<StellarChainId>([[token.address, dollars(1)]]),
    })

    expect(result.myCurrencies).toEqual([token])
    expect(result.myCurrencies[0]).toBe(token)
    expect(result.otherCurrencies).toEqual([])
  })
})
