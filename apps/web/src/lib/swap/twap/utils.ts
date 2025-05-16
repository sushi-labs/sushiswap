export const fillDelayText = (value?: number) => {
  if (!value) {
    return ''
  }

  const secondsTotal = Math.floor(value / 1000)
  const days = Math.floor(secondsTotal / (24 * 60 * 60))
  const hours = Math.floor((secondsTotal % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((secondsTotal % (60 * 60)) / 60)
  const seconds = secondsTotal % 60

  const arr: string[] = []

  if (days) {
    arr.push(`${days} days`)
  }
  if (hours) {
    arr.push(`${hours} hours`)
  }
  if (minutes) {
    arr.push(`${minutes} minutes`)
  }
  if (seconds) {
    arr.push(`${seconds} seconds`)
  }

  return arr.join(' ')
}
