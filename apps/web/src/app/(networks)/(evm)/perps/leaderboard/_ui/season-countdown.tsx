'use client'
import {
  secondsInDay,
  secondsInHour,
  secondsInMinute,
} from 'date-fns/constants'
import { useEffect, useState } from 'react'
import {
  PERPS_LEADERBOARD_SEASON_1_END_DATE,
  PERPS_LEADERBOARD_SEASON_2_END_DATE,
  PERPS_LEADERBOARD_SEASON_2_START_DATE,
} from '../season-constants'

interface Countdown {
  label: string
  timeLeft: string
}

export const SeasonCountdown = () => {
  const [countdown, setCountdown] = useState(() => getCountdown())

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col items-end gap-1">
      <p className="text-xs text-perps-muted-50">{countdown.label}</p>
      <p className="text-base md:text-2xl tabular-nums font-medium bg-gradient-to-r w-fit from-[#27B0E6] from-2% via-[#7D8ACA] via-5% to-[#FA52A0] to-100% text-transparent bg-clip-text">
        {countdown.timeLeft}
      </p>
    </div>
  )
}

function getCountdown(): Countdown {
  const now = new Date()
  const nowTime = now.getTime()

  if (nowTime < PERPS_LEADERBOARD_SEASON_1_END_DATE.getTime()) {
    return {
      label: 'Season 1 ends in',
      timeLeft: getTimeLeft(PERPS_LEADERBOARD_SEASON_1_END_DATE, now),
    }
  }

  if (nowTime < PERPS_LEADERBOARD_SEASON_2_START_DATE.getTime()) {
    return {
      label: 'Season 2 starts in',
      timeLeft: getTimeLeft(PERPS_LEADERBOARD_SEASON_2_START_DATE, now),
    }
  }

  if (nowTime < PERPS_LEADERBOARD_SEASON_2_END_DATE.getTime()) {
    return {
      label: 'Season 2 ends in',
      timeLeft: getTimeLeft(PERPS_LEADERBOARD_SEASON_2_END_DATE, now),
    }
  }

  return {
    label: 'Season 2 has ended',
    timeLeft: '00:00:00:00',
  }
}

function getTimeLeft(targetDate: Date, now: Date): string {
  const difference = Math.max(
    0,
    Math.floor((targetDate.getTime() - now.getTime()) / 1000),
  )

  const days = Math.floor(difference / secondsInDay)
  const hours = Math.floor((difference % secondsInDay) / secondsInHour)
  const minutes = Math.floor((difference % secondsInHour) / secondsInMinute)
  const seconds = Math.floor(difference % secondsInMinute)

  const format = (value: number) => String(value).padStart(2, '0')

  return `${format(days)}:${format(hours)}:${format(minutes)}:${format(seconds)}`
}
