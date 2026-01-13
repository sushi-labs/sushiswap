import { useEffect, useState } from 'react'

export const useInitialDecimals = (value: string | number | undefined) => {
  const [initialDecimals, setInitialDecimals] = useState<number | undefined>(
    undefined,
  )
  useEffect(() => {
    if (initialDecimals !== undefined) return
    if (value) {
      const parts = value.toString().split('.')
      if (parts.length === 2) {
        setInitialDecimals(parts[1].length)
      } else {
        setInitialDecimals(0)
      }
    }
  }, [value, initialDecimals])
  return initialDecimals
}
