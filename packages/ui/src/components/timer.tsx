'use client'

import { useInterval } from '@sushiswap/hooks'
import { type FC, type ReactNode, useState } from 'react'

interface State {
  days: string
  hours: string
  minutes: string
  seconds: string
}

interface Timer {
  date: Date
  children(state: State): ReactNode
}

export const Timer: FC<Timer> = ({ date, children }) => {
  const [remaining, setRemaining] = useState<State>({
    days: '',
    hours: '',
    minutes: '',
    seconds: '',
  })

  useInterval(() => {
    const now = Date.now()
    const interval = date.getTime() - now

    const days = Math.floor(interval / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
      (interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    )
    const minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((interval % (1000 * 60)) / 1000)

    setRemaining({
      days: String(Math.max(days, 0)).padStart(2, '0'),
      hours: String(Math.max(hours, 0)).padStart(2, '0'),
      minutes: String(Math.max(minutes, 0)).padStart(2, '0'),
      seconds: String(Math.max(seconds, 0)).padStart(2, '0'),
    })
  }, 1000)

  return <>{children(remaining)}</>
}
