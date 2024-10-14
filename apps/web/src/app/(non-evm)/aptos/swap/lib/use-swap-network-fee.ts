import { Aptos, AptosConfig, Ed25519PublicKey } from '@aptos-labs/ts-sdk'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useQuery } from '@tanstack/react-query'
import { parseUnits } from 'viem'
import { networkNameToNetwork } from '~aptos/(common)/config/chains'
import { formatNumberWithDecimals } from '~aptos/(common)/lib/common/format-number-with-decimals'
import { useNetwork } from '~aptos/(common)/lib/common/use-network'
import { useSimpleSwapState } from '../ui/simple/simple-swap-provider/simple-swap-provider'
import { getSwapPayload } from './get-swap-payload'

export const useSwapNetworkFee = () => {
  const {
    network,
    contracts: { swap: swapContract },
  } = useNetwork()
  const { bestRoutes, token0, slippageAmount, amount, token1 } =
    useSimpleSwapState()
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

        const _account = new Ed25519PublicKey(account.publicKey?.toString())

        const minOutput = slippageAmount
          ? formatNumberWithDecimals(
              slippageAmount,
              token1 ? token1.decimals : 8,
            )
          : 0

        const minOut = parseUnits(
          minOutput?.toString(),
          token1.decimals,
        ).toString()
        const amountIn = parseUnits(amount, token0.decimals).toString()

        const payload = getSwapPayload(
          swapContract,
          parseInt(amountIn),
          bestRoutes,
          parseInt(minOut),
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
            transaction: transaction,
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
