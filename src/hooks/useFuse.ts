import Fuse from 'fuse.js'
import { useCallback, useMemo, useState } from 'react'
import IFuseOptions = Fuse.IFuseOptions

interface FuzzySearchPayload<T> {
  fuse: Fuse<T>
  data: T[]
  term: string
}

function fuzzySearch<T>({ fuse, data, term }: FuzzySearchPayload<T>): T[] {
  const results = fuse.search(term)
  return term ? results.map((result) => result.item) : data
}

interface UseFusePayload<T> {
  data: T[]
  options: IFuseOptions<T>
}

function useFuse<T = any>({ data, options }: UseFusePayload<T>) {
  const [term, setTerm] = useState('')
  const reset = useCallback(() => setTerm(''), [])

  return useMemo(() => {
    const fuse = new Fuse<T>(data || [], options)
    const result = fuzzySearch<T>({ fuse, data, term })

    return {
      result,
      search: setTerm,
      term,
      reset,
    }
  }, [data, options, reset, term])
}

export default useFuse
