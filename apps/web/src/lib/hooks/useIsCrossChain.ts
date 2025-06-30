import { useSearchParams } from 'next/navigation'

export const useIsCrossChain = (): { isCrossChain: boolean } => {
  const searchParams = useSearchParams()
  const chainId0 = searchParams.get('chainId0')
  const chainId1 = searchParams.get('chainId1')

  const isCrossChain = Boolean(chainId0 && chainId1 && chainId0 !== chainId1)
  return { isCrossChain }
}
