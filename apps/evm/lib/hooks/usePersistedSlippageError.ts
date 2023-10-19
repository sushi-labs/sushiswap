import { useEffect, useState } from 'react'

export const usePersistedSlippageError = ({
  isSuccess,
  error,
}: { isSuccess: boolean; error: Error | null }) => {
  const [show, setShow] = useState(false)
  const [persistedError, setPersistedError] = useState<Error | null>(error)

  // Need to perform some funky business because wagmi isn't keeping the previous error while its refetching
  useEffect(() => {
    if (error?.message.includes('Minimal ouput balance violation')) {
      setShow(true)
      setPersistedError(error)
    }

    if (isSuccess) setPersistedError(null)
  }, [error, isSuccess])

  const isSlippageError = Boolean(persistedError)

  return { isSlippageError, show, setShow }
}
