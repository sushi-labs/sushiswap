import TronWeb from 'tronweb'

export const truncateText = (str: string | `0x${string}`, n = 5): string => {
  if (str) {
    if (str.length <= n) {
      return str
    }
    return `${str.slice(0, n)}...${str.slice(str.length - n)}`
  }
  return ''
}

export const hashStringToColor = (str: string) => {
  const hash = _djb2(str)
  const r = (hash & 0xff0000) >> 16
  const g = (hash & 0x00ff00) >> 8
  const b = hash & 0x0000ff
  return `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

const _djb2 = (str: string) => {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i) /* hash * 33 + c */
  }
  return hash
}

export const toBigNumber = (amount: string | number) => {
  return TronWeb.toBigNumber(amount)
}
