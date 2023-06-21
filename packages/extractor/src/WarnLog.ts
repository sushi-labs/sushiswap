function nowDate(): string {
  const d = new Date()
  const year = (d.getFullYear() % 100).toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  const hours = d.getHours().toString().padStart(2, '0')
  const min = d.getMinutes().toString().padStart(2, '0')
  const sec = d.getSeconds().toString().padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${min}:${sec}`
}

export function warnLog(msg: string) {
  console.warn(`${nowDate()}: ${msg}`)
}
