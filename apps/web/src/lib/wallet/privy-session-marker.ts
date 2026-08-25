export const PRIVY_SESSION_MARKER_KEY = 'sushi:privy-session'

type PrivySessionMarker = {
  svmReconnect: boolean
}

function isPrivySessionMarker(value: unknown): value is PrivySessionMarker {
  if (!value || typeof value !== 'object') return false
  const marker = value as Partial<PrivySessionMarker>
  return typeof marker.svmReconnect === 'boolean'
}

function readPrivySessionMarker(): PrivySessionMarker | undefined {
  if (typeof window === 'undefined') return undefined

  try {
    const value = window.localStorage.getItem(PRIVY_SESSION_MARKER_KEY)
    if (!value) return undefined
    const parsed: unknown = JSON.parse(value)
    if (isPrivySessionMarker(parsed)) return parsed
  } catch {}

  return undefined
}

function writePrivySessionMarker(marker: PrivySessionMarker): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(
      PRIVY_SESSION_MARKER_KEY,
      JSON.stringify(marker),
    )
  } catch {}
}

export function hasPrivySessionMarker(): boolean {
  return Boolean(readPrivySessionMarker())
}

export function ensurePrivySessionMarker(): void {
  writePrivySessionMarker({
    svmReconnect: readPrivySessionMarker()?.svmReconnect ?? false,
  })
}

export function setPrivySvmReconnect(enabled: boolean): void {
  const marker = readPrivySessionMarker()
  if (!marker && !enabled) return
  if (marker?.svmReconnect === enabled) return
  writePrivySessionMarker({ svmReconnect: enabled })
}

export function shouldReconnectPrivySvm(): boolean {
  return readPrivySessionMarker()?.svmReconnect ?? false
}

export function clearPrivySessionMarker(): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.removeItem(PRIVY_SESSION_MARKER_KEY)
  } catch {}
}
