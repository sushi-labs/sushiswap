const addressRegex = /^0x[a-fA-F0-9]{40}$/

export function isAddressFast(addr: string | undefined) {
  return addr !== undefined && addressRegex.test(addr)
}
