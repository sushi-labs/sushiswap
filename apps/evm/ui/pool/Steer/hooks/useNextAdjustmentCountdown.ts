import { SteerVault } from '@sushiswap/client/src/pure/steer-vault/vault'
import { useEffect, useState } from 'react'

const getNextAdjustment = (lastAdjustment: number, frequency: number) => {
  let diff = lastAdjustment + frequency - Math.floor(Date.now() / 1000)
  if (diff < 0) {
    diff = 0
  }

  const hours = Math.floor(diff / 60 / 60)
  const minutes = Math.floor((diff - hours * 60 * 60) / 60)
  const seconds = diff - hours * 60 * 60 - minutes * 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function useNextAdjustmentCountdown(vault: SteerVault) {
  const [nextAdjustment, setNextAdjustment] = useState(
    getNextAdjustment(vault.lastAdjustmentTimestamp, vault.adjustmentFrequency)
  )

  useEffect(() => {
    const countdownInterval = setInterval(
      () => setNextAdjustment(getNextAdjustment(vault.lastAdjustmentTimestamp, vault.adjustmentFrequency)),
      1000
    )

    return () => {
      clearInterval(countdownInterval)
    }
  }, [vault, setNextAdjustment])

  return nextAdjustment
}
