import { useQuery } from '@tanstack/react-query'
import { WTRX } from '~tron/_common/constants/token-list'
import {
  getArgsForSwap,
  getDeadline,
  getRouterFunctionSelectors,
  safeGasEstimates,
} from '~tron/_common/lib/utils/helpers'
import { useSwapState } from '~tron/swap/swap-provider'
import { parseUnits } from '../utils/formatters'
import { useTronWeb } from './useTronWeb'

export const useSwapNetworkFee = ({
  swapType,
  address,
  minOutput,
}: {
  swapType: 'wrap' | 'unwrap' | 'swap'
  address: string | null
  minOutput: string
}) => {
  const { tronWeb } = useTronWeb()

  const { token0, token1, amountIn, amountOut, route } = useSwapState()

  return useQuery({
    queryKey: [
      'useSwapNetworkFee',
      token0,
      token1,
      amountIn,
      route,
      swapType,
      address,
      minOutput,
    ],
    queryFn: async () => {
      if (!address || !amountIn || route?.length === 0 || !minOutput) return '0'
      const chainParameters = await tronWeb.trx.getChainParameters()
      const energyCostParam =
        chainParameters.find(
          (param: { key: string; value: string }) =>
            param.key === 'getEnergyFee',
        )?.value ?? 0

      const ENERGY_COST_PER_UNIT_TRX = Number(energyCostParam) / 1000000

      const parsedAmountIn = parseUnits(amountIn, token0?.decimals)
      const parsedAmountOut = parseUnits(amountOut, token1?.decimals)
      if (swapType === 'wrap') {
        const { energy_used } =
          await tronWeb.transactionBuilder.triggerConstantContract(
            WTRX.address, //contract address
            'deposit()', //function name
            { callValue: parsedAmountIn }, // options
            [], //parameters
            address, //issuerAddress
          )
        const trxCost = Number(energy_used) * ENERGY_COST_PER_UNIT_TRX
        return trxCost?.toString()
      } else if (swapType === 'unwrap') {
        const { energy_used } =
          await tronWeb.transactionBuilder.triggerConstantContract(
            WTRX.address, //contract address
            'withdraw(uint256)', //function name
            {}, // options
            [{ type: 'uint256', value: parsedAmountIn }], //parameters
            address, //issuerAddress
          )
        const trxCost = Number(energy_used) * ENERGY_COST_PER_UNIT_TRX
        return trxCost?.toString()
      } else {
        const methodNames = getRouterFunctionSelectors(route)
        const deadline = getDeadline()
        const parsedAmountOutMin = parseUnits(minOutput, token1?.decimals)

        const args = []
        for (let i = 0; i < methodNames.length; i++) {
          const _args = getArgsForSwap(
            methodNames[i],
            parsedAmountIn,
            parsedAmountOut,
            parsedAmountIn,
            parsedAmountOutMin,
            route,
            address,
            deadline,
            address,
          )
          args.push(_args)
        }
        const estimates = await safeGasEstimates(tronWeb, args)
        const safeGasEstimate = estimates.findIndex(
          (predicate) => predicate !== undefined,
        )
        // if (safeGasEstimate === -1) {
        //   throw new Error("Failed to estimate energy. Transaction will fail.");
        // }
        const energy_used = estimates[safeGasEstimate].energy_used
        const trxCost = Number(energy_used) * ENERGY_COST_PER_UNIT_TRX
        return trxCost?.toString()
      }
    },
    enabled: !!address && !!tronWeb,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
}
