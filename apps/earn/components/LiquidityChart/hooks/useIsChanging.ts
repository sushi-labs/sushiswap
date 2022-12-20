import { useEffect, useRef } from 'react'

export const useIsChanging = (value: any) => {
  const ref = useRef(value)
  const isChanging = value !== ref.current
  useEffect(() => {
    ref.current = value
  }, [value])
  return isChanging
}
