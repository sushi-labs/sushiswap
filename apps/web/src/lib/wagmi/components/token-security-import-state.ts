export type TokenSecurityImportState =
  | 'not-required'
  | 'scanning'
  | 'unavailable'
  | 'ready'

interface GetTokenSecurityImportState {
  required: boolean
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  isAvailable: boolean | undefined
}

export function getTokenSecurityImportState({
  required,
  isLoading,
  isFetching,
  isError,
  isAvailable,
}: GetTokenSecurityImportState): TokenSecurityImportState {
  if (!required) return 'not-required'
  if (isLoading || (isFetching && isAvailable !== true)) return 'scanning'
  if (isError || isAvailable === false) return 'unavailable'
  return isAvailable ? 'ready' : 'scanning'
}

export function combineTokenSecurityImportStates(
  states: TokenSecurityImportState[],
): TokenSecurityImportState {
  if (states.includes('scanning')) return 'scanning'
  if (states.includes('unavailable')) return 'unavailable'
  if (states.includes('ready')) return 'ready'
  return 'not-required'
}
