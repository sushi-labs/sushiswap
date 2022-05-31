import { AddressZero } from '@ethersproject/constants'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import useSearchAndSort from 'app/hooks/useSearchAndSort'

export const reduceBalances = (balanceSources: CurrencyAmount<Currency>[]) =>
  Object.values(
    balanceSources.reduce<Record<string, CurrencyAmount<Currency>>>((acc, cur) => {
      if (cur.currency.isNative) {
        if (acc[AddressZero]) acc[AddressZero] = acc[AddressZero].add(cur)
        else acc[AddressZero] = cur
      } else if (acc[cur.currency.wrapped.address]) {
        acc[cur.currency.wrapped.address] = acc[cur.currency.wrapped.address].add(cur)
      } else {
        acc[cur.currency.wrapped.address] = cur
      }

      return acc
    }, {})
  )

export const useKashiBorrowPositions = (pairs: any[]) =>
  useSearchAndSort(
    pairs.filter((pair: any) => pair.userCollateralShare.gt(0) || pair.userBorrowPart.gt(0)),
    { keys: ['search'], threshold: 0.1 },
    { key: 'health.value', direction: 'descending' }
  )

export const useKashiLendPositions = (pairs: any[]) =>
  useSearchAndSort(
    pairs.filter((pair) => pair.userAssetFraction.gt(0)),
    { keys: ['search'], threshold: 0.1 },
    { key: 'currentUserAssetAmount.usdValue', direction: 'descending' }
  )
