'use client'
import NumberFlow from '@number-flow/react'
import { type FC, useEffect, useState } from 'react'

type Format = Omit<Intl.NumberFormatOptions, 'notation'> & {
  notation?: Exclude<
    Intl.NumberFormatOptions['notation'],
    'scientific' | 'engineering'
  >
}

const RollingNumber: FC<{
  value: number
  shouldNotAnimateFirstRender?: boolean
  delayMs?: number
  prefix?: string
  suffix?: string
  isolate?: boolean
  format?: Format
  locales?: Intl.LocalesArgument
  willChange?: boolean
  onAnimationsStart?: (e: CustomEvent<undefined>) => void
  onAnimationsFinish?: (e: CustomEvent<undefined>) => void
}> = (props) => {
  const [_value, _setValue] = useState<number>(0)
  const [isFirstRender, setIsFirstRender] = useState(true)
  useEffect(() => {
    if (!isFirstRender) return
    const timeout = setTimeout(() => {
      _setValue(props.value)
      setIsFirstRender(false)
    }, props.delayMs ?? 0)
    return () => clearTimeout(timeout)
  }, [props.value, props.delayMs, isFirstRender])

  return (
    <NumberFlow
      {...props}
      value={props.shouldNotAnimateFirstRender ? props.value : _value}
    />
  )
}

export { RollingNumber }
