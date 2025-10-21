import { useQuery } from '@tanstack/react-query'
import { useStellarWallet } from '~stellar/providers'

const fetchTotalSupply = async (_pairAddress: string): Promise<number> => {
  try {
    // TODO(@wu-benjamin): implement for Stellar
    throw new Error('Function not implemented yet for Stellar')
  } catch (error) {
    console.log(error)
    return 0
  }
}

const fetchOwnedSupply = async (_params: {
  pairAddress: string
  walletAddress: string
}): Promise<number> => {
  try {
    // TODO(@wu-benjamin): implement for Stellar
    throw new Error('Function not implemented yet for Stellar')
  } catch (error) {
    console.log(error)
    return 0
  }
}

export const usePoolOwnership = ({
  pairAddress,
}: { pairAddress: string | undefined | null }) => {
  const { connectedAddress } = useStellarWallet()
  return useQuery({
    queryKey: ['usePoolOwnership', { pairAddress }],
    queryFn: async () => {
      if (!pairAddress || !connectedAddress) {
        return { ownership: '0', ownedSupply: '0' }
      }
      const totalSupply = await fetchTotalSupply(pairAddress)
      const ownedSupply = await fetchOwnedSupply({
        pairAddress: pairAddress,
        walletAddress: connectedAddress,
      })

      const ownership = (ownedSupply / totalSupply).toString()

      return { ownership, ownedSupply: ownedSupply.toString() }
    },
    enabled: !!pairAddress && !!connectedAddress,
  })
}
