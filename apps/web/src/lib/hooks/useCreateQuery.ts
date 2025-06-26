'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

export const useCreateQuery = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const push = useCallback((path: string) => {
    const newUrl = new URL(`${window.location.origin}${path}`).toString()
    window.history.pushState({}, '', newUrl)
  }, [])

  const defaultedParams = useMemo(() => {
    const params = new URLSearchParams(searchParams)

    return params
  }, [searchParams])

  const createQueryString = useCallback(
    (values: { name: string; value: string | null }[]) => {
      const params = new URLSearchParams(defaultedParams)
      values.forEach(({ name, value }) => {
        if (value === null) {
          params.delete(name)
        } else {
          params.set(name, value)
        }
      })
      return params.toString()
    },
    [defaultedParams],
  )

  const createQuery = useCallback(
    (values: { name: string; value: string | null }[]) => {
      push(`${pathname}?${createQueryString(values)}`)
    },
    [createQueryString, pathname, push],
  )

  return {
    createQuery,
  }
}
