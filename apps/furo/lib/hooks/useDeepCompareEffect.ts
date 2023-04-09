/**
 * @param value the value to be memoized (usually a dependency list)
 * @returns a memoized version of the value as long as it remains deeply equal
 */
import cloneDeep from 'lodash.clonedeep'
import React from 'react'
import { deepEqual } from '@sushiswap/wagmi'

export function useDeepCompareMemoize<T>(value: T) {
  const ref = React.useRef<T>(value)
  const signalRef = React.useRef<number>(0)

  if (!deepEqual(value, ref.current)) {
    // this is the missing link, replace with your `cloneDeep` lib of choice
    ref.current = cloneDeep(value)
    signalRef.current += 1
  }

  return ref.current
}
