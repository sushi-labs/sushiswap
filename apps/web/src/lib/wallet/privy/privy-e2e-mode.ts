export function isLivePrivyE2eEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_APP_ENV === 'test' &&
    process.env.NEXT_PUBLIC_PRIVY_E2E === 'true'
  )
}

export function isPrivyTestRuntimeEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_APP_ENV === 'test' &&
    process.env.NEXT_PUBLIC_PRIVY_TEST_RUNTIME === 'true'
  )
}

export function isPrivyE2eEnabled(): boolean {
  return isLivePrivyE2eEnabled() || isPrivyTestRuntimeEnabled()
}
