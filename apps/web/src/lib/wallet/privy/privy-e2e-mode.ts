export function isLivePrivyE2eEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_APP_ENV === 'test' &&
    process.env.NEXT_PUBLIC_PRIVY_E2E === 'true'
  )
}
