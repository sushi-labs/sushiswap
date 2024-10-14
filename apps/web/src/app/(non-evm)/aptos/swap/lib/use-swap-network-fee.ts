import { Aptos, AptosConfig, Ed25519PublicKey } from '@aptos-labs/ts-sdk'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useQuery } from '@tanstack/react-query'
import { networkNameToNetwork } from '~aptos/(common)/config/chains'
import { useNetwork } from '~aptos/(common)/lib/common/use-network'
import { useSimpleSwapState } from '../ui/simple/simple-swap-provider/simple-swap-provider'
import { getSwapPayload } from './get-swap-payload'

export const useSwapNetworkFee = () => {
  const {
    network,
    contracts: { swap: swapContract },
  } = useNetwork()
  const { bestRoutes, token0, slippageAmount, amount } = useSimpleSwapState()
  const { account } = useWallet()

  return useQuery({
    queryKey: [
      'useSwapNetworkFee',
      bestRoutes,
      token0,
      account,
      slippageAmount,
      amount,
    ],
    queryFn: async () => {
      if (
        !account ||
        !amount ||
        bestRoutes?.length === 0 ||
        !slippageAmount ||
        !token0
      )
        return 0
      if (!account?.address) return 0
      try {
        const config = new AptosConfig({
          network: networkNameToNetwork(network),
        })
        const aptos = new Aptos(config)
        const { gas_estimate } = await aptos.getGasPriceEstimation()

        const _account = new Ed25519PublicKey(account.address)

        const payload = getSwapPayload(
          swapContract,
          parseInt(
            (parseFloat(String(amount)) *
              10 ** token0.decimals) as unknown as string,
          ),
          bestRoutes,
          parseInt(String(slippageAmount)),
        )

        const transaction = await aptos.transaction.build.simple({
          sender: account.address,
          data: {
            //@ts-expect-error
            function: payload?.data?.function,
            functionArguments: payload?.data?.functionArguments,
            typeArguments: payload?.data?.typeArguments,
          },
        })

        const [userTransactionResponse] =
          await aptos.transaction.simulate.simple({
            signerPublicKey: _account,
            transaction,
          })

        const gasUsed = Number(userTransactionResponse?.gas_used) || 14

        const _networkFee = gasUsed * gas_estimate

        const networkFee = Number.isNaN(_networkFee)
          ? 0.000014
          : _networkFee / 10 ** 8
        return networkFee
      } catch (error) {
        console.log('useSwapNetworkFee error: ', error)
        return 0
      }
    },
    enabled: !!account && !!amount && bestRoutes?.length > 0,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
}
