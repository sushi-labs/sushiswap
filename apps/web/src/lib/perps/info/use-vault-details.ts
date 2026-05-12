import { vaultDetails } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'src/lib/wallet'
import type { EvmAddress } from 'sushi/evm'
import { hlHttpTransport } from '../transports'

export const useVaultDetails = ({
  vaultAddress,
}: {
  vaultAddress: EvmAddress | undefined
}) => {
  const address = useAccount('evm')
  return useQuery({
    queryKey: ['useVaultDetails', vaultAddress, address],
    queryFn: () => {
      if (!vaultAddress) {
        throw new Error('vaultAddress is undefined')
      }
      return vaultDetails(
        {
          transport: hlHttpTransport,
        },
        {
          ...(address ? { user: address } : {}),
          vaultAddress: vaultAddress,
        },
      )
    },
    enabled: !!vaultAddress,
  })
}
