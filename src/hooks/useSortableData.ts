import { BigNumber } from '@ethersproject/bignumber'
import { CurrencyAmount, JSBI } from '@sushiswap/core-sdk'
import { useMemo, useState } from 'react'

function getNested(theObject: any, path: string, separator = '.') {
  try {
    return path
      .replace('[', separator)
      .replace(']', '')
      .split(separator)
      .reduce((obj, property) => {
        return obj[property]
      }, theObject)
  } catch (err) {
    return undefined
  }
}

const useSortableData = (items: any, config: any = null) => {
  const [sortConfig, setSortConfig] = useState(config)
  const sortedItems = useMemo(() => {
    if (items && items.length > 0) {
      const sortableItems = [...items]
      if (sortConfig !== null) {
        sortableItems.sort((a, b) => {
          const aValue = getNested(a, sortConfig.key)
          const bValue = getNested(b, sortConfig.key)

          if (typeof aValue === 'number' && typeof bValue === 'number') {
            if (aValue === Infinity) {
              return sortConfig.direction === 'ascending' ? -1 : 1
            } else if (bValue === Infinity) {
              return sortConfig.direction === 'ascending' ? 1 : -1
            } else if (aValue < bValue) {
              return sortConfig.direction === 'ascending' ? -1 : 1
            } else if (aValue > bValue) {
              return sortConfig.direction === 'ascending' ? 1 : -1
            }
          }

          if (aValue instanceof BigNumber && bValue instanceof BigNumber) {
            if (aValue.lt(bValue)) {
              return sortConfig.direction === 'ascending' ? -1 : 1
            }
            if (aValue.gt(bValue)) {
              return sortConfig.direction === 'ascending' ? 1 : -1
            }
          }

          if (aValue instanceof JSBI && bValue instanceof JSBI) {
            if (JSBI.lessThan(aValue, bValue)) {
              return sortConfig.direction === 'ascending' ? -1 : 1
            }
            if (JSBI.greaterThan(aValue, bValue)) {
              return sortConfig.direction === 'ascending' ? 1 : -1
            }
          }

          if (aValue instanceof CurrencyAmount && bValue instanceof CurrencyAmount) {
            if (aValue.lessThan(bValue)) {
              return sortConfig.direction === 'ascending' ? -1 : 1
            }
            if (aValue.greaterThan(bValue)) {
              return sortConfig.direction === 'ascending' ? 1 : -1
            }
          }

          if (!aValue) {
            return 1
          }

          if (!bValue) {
            return -1
          }

          return 0
        })
      }
      return sortableItems
    }
    return []
  }, [items, sortConfig])

  const requestSort = (key: string, direction = 'ascending') => {
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    } else if (sortConfig && sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending'
    }
    setSortConfig({ key, direction })
  }

  return { items: sortedItems, requestSort, sortConfig }
}

export default useSortableData
