const addressRegex = /^0x[a-fA-F0-9]{40}$/

export function isAddressFast(addr: unknown) {
  return typeof addr === 'string' && addressRegex.test(addr)
}
