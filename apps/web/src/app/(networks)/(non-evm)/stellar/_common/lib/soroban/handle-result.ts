import type { ErrorMessage, Result } from '@stellar/stellar-sdk/contract'

export const handleResult = <T>(result: Result<T, ErrorMessage>) => {
  if (result.isErr()) {
    const { message } = result.unwrapErr()
    throw new Error(
      `Soroban Contract Error - ${message ? message : 'Unknown error'}`,
    )
  } else {
    return result.unwrap()
  }
}
