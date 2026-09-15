// Browser clients use BotID on our origin; server clients authenticate directly.
export function getRpcUrl(network: string): string {
  const baseUrl =
    typeof window === 'undefined'
      ? 'https://lb.drpc.live'
      : `${window.location.origin}/api/rpc`

  return `${baseUrl}/${network}`
}

export function getRpcHeaders(): { 'Drpc-Key'?: string } {
  if (typeof window !== 'undefined') return {}

  return {
    'Drpc-Key': process.env.DRPC_ID || '',
  }
}
