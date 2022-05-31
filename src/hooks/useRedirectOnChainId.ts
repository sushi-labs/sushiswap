import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useRedirectOnChainId = (address: string) => {
  const router = useRouter()

  useEffect(() => {
    const { ethereum } = window
    if (ethereum && ethereum.on) {
      const onChainChange = () => router.push(address)

      ethereum.on('chainChanged', onChainChange)
      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', onChainChange)
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
