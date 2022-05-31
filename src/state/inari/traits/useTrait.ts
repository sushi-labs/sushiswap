// Base trait hook
import { useEffect, useMemo } from 'react'

export interface BaseTrait {
  overrides: string[]
}

// @ts-ignore TYPE NEEDS FIXING
const useTrait = (props, { overrides = [] }) => {
  useEffect(() => {
    const intersection = overrides.filter((value) => (props.overrides || []).includes(value))
    if (intersection.length > 0) {
      throw new Error(`Multiple traits are overriding the same property: ${JSON.stringify(intersection)}`)
    }
  }, [overrides, props.overrides])

  return useMemo(
    () => ({
      ...props,
      overrides,
    }),
    [overrides, props]
  )
}

export default useTrait
