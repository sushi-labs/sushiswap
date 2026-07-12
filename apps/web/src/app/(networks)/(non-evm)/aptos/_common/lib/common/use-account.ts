import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useEffect, useState } from 'react'

export function useConnection() {
  const { connected } = useWallet()
  const [isLoading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (connected) {
      setLoading(false)
      return
    }

    const timeout = setTimeout(() => {
      setLoading(false)
    }, 1750)

    return () => clearTimeout(timeout)
  }, [connected])

  return { isLoadingAccount: isLoading }
}
