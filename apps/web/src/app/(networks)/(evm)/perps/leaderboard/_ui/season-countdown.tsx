'use client'
import { useEffect, useState } from 'react'
import {
  secondsInDay,
  secondsInHour,
  secondsInMinute,
} from 'date-fns/constants'

// july 31, 2026 at 11:59:59 PM UTC
const SEASON_1_END_DATE = new Date('2026-07-31T23:59:59Z') //todo: get from DB

export const SeasonCountdown = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  function getTimeLeft() {
    const now = new Date()
    const difference = SEASON_1_END_DATE.getTime() - now.getTime()

    if (difference <= 0) {
      return 'Season 1 has ended'
    }

    const days = Math.floor(difference / secondsInDay)
    const hours = Math.floor((difference % secondsInDay) / secondsInHour)
    const minutes = Math.floor((difference % secondsInHour) / secondsInMinute)
    const seconds = Math.floor((difference % secondsInMinute) / 1000)

    const format = (value: number) => String(value).padStart(2, '0')

    return `${format(days)}:${format(hours)}:${format(minutes)}:${format(seconds)}`
  }
  return (
    <div className="flex flex-col items-end gap-1">
      <p className="text-xs text-perps-muted-50">Season 1 ends in</p>
      <p className="text-2xl tabular-nums font-medium bg-gradient-to-r w-fit from-[#27B0E6] from-2% via-[#7D8ACA] via-5% to-[#FA52A0] to-100% text-transparent bg-clip-text">
        {timeLeft}
      </p>
    </div>
  )
}
