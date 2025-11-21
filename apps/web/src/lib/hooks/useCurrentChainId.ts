import { useParams, useSearchParams } from 'next/navigation'
import { useChainId } from 'wagmi'

export const useCurrentChainId = () => {
  const connectedChainId = useChainId()
  const params = useParams()
  const _chainId = params.chainId ? Number(params.chainId) : connectedChainId

  const searchParams = useSearchParams()
  const chainId0 = searchParams.get('chainId0')

  const chainId = chainId0 ? Number(chainId0) : _chainId

  return { chainId }
}
