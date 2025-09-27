import { BaseError, UserRejectedRequestError } from 'viem'

export function isUserRejectedError(error: unknown) {
  const userRejectedError =
    error instanceof BaseError
      ? error.walk((err) => err instanceof UserRejectedRequestError)
      : null
  return userRejectedError instanceof UserRejectedRequestError
}
