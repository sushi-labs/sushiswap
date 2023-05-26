import { useInterval } from '@sushiswap/hooks'
import { FC, ReactNode, useMemo, useState } from 'react'

import { Schedule } from './createScheduleRepresentation'

interface NextPaymentTimerState {
  days: string
  hours: string
  minutes: string
  seconds: string
}

interface NextPaymentTimerProps {
  schedule: Schedule | undefined
  children(state: NextPaymentTimerState & { isCompleted: boolean | undefined }): ReactNode
}

export const NextPaymentTimer: FC<NextPaymentTimerProps> = ({ schedule, children }) => {
  const [remaining, setRemaining] = useState<NextPaymentTimerState>({
    days: '',
    hours: '',
    minutes: '',
    seconds: '',
  })

  const nextPayment: Date | undefined = useMemo(() => {
    if (!schedule) return undefined

    const now = Date.now()
    const filtered = schedule.filter((el) => el.date.getTime() > now)

    if (filtered.length > 0) {
      return filtered[0].date
    }

    return undefined
  }, [schedule])

  useInterval(() => {
    if (!nextPayment) return

    const total = nextPayment.getTime() - Date.now()
    const seconds = Math.floor((total / 1000) % 60)
    const minutes = Math.floor((total / 1000 / 60) % 60)
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
    const days = Math.floor(total / (1000 * 60 * 60 * 24))

    setRemaining({
      days: String(Math.max(days, 0)).padStart(1, '0'),
      hours: String(Math.max(hours, 0)).padStart(1, '0'),
      minutes: String(Math.max(minutes, 0)).padStart(1, '0'),
      seconds: String(Math.max(seconds, 0)).padStart(1, '0'),
    })
  }, 1000)

  return <>{children({ ...remaining, isCompleted: schedule && schedule.length > 0 && !nextPayment })}</>
}
