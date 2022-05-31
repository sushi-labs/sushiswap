import { BigNumber } from '@ethersproject/bignumber'
import Fuse from 'fuse.js'
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

const useSearchAndSort = (items: any, searchOptions: any = null, sortOptions: any = null) => {
  const [term, setTerm] = useState<string>('')
  const [sortConfig, setSortConfig] = useState(sortOptions)

  const fuse = new Fuse(items, { ...searchOptions })
  const searchedRaw = term ? fuse.search(`${term}`) : items
  const searched = searchedRaw.map((a: { item: any }) => (a.item ? a.item : a))

  const sorted = useMemo(() => {
    if (searched && searched.length > 0) {
      const sortableItems = [...searched]
      if (sortConfig !== null) {
        sortableItems.sort((a, b) => {
          const aValue = getNested(a, sortConfig.key)
          const bValue = getNested(b, sortConfig.key)
          if (aValue instanceof BigNumber && bValue instanceof BigNumber) {
            if (aValue.lt(bValue)) {
              return sortConfig.direction === 'ascending' ? -1 : 1
            }
            if (aValue.gt(bValue)) {
              return sortConfig.direction === 'ascending' ? 1 : -1
            }
          } else {
            if (aValue < bValue) {
              return sortConfig.direction === 'ascending' ? -1 : 1
            }
            if (aValue > bValue) {
              return sortConfig.direction === 'ascending' ? 1 : -1
            }
          }
          return 0
        })
      }
      return sortableItems
    }
    return []
  }, [searched, sortConfig])

  const requestSort = (key: any, direction = 'ascending') => {
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    } else if (sortConfig && sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending'
    }
    setSortConfig({ key, direction })
  }

  return {
    items: sorted,
    term,
    setTerm,
    sortConfig,
    setSortConfig,
    requestSort,
  }
}

export default useSearchAndSort
