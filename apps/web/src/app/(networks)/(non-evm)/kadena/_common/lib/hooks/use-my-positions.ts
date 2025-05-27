import { useQuery } from '@tanstack/react-query'
import type {
  WalletPosition,
  WalletPositionsResponse,
} from '~kadena/_common/types/get-positions'
import { useKadena } from '~kadena/kadena-wallet-provider'

export const useMyPositions = () => {
  const { activeAccount } = useKadena()

  return useQuery({
    queryKey: ['wallet-positions', activeAccount?.accountName],
    enabled: !!activeAccount?.accountName,
    queryFn: async (): Promise<WalletPosition[]> => {
      const res = await fetch(
        `/kadena/api/positions?walletAddress=${activeAccount?.accountName}`,
      )
      const json = (await res.json()) as WalletPositionsResponse
      console.log('positions json', json)
      if (!json.success) throw new Error('Failed to fetch wallet positions')
      return json.data
    },
    staleTime: 1000 * 60,
  })
}
