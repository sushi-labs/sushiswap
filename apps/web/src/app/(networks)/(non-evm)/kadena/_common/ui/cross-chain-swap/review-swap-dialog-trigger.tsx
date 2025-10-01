import { Button, DialogTrigger } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { Amount } from 'sushi'
import { type EvmChainId, type EvmCurrency, isEvmChainId } from 'sushi/evm'
import { type KvmTokenAddress, isKvmChainId } from 'sushi/kvm'
import { formatUnits } from 'viem'
import { injected } from 'wagmi'
import { useAccount, useConnect } from 'wagmi'
import { useBalance } from '~evm/_common/ui/balance-provider/use-balance'
import { MIN_GAS_FEE } from '~kadena/_common/constants/gas'
import { useTokenBalances } from '~kadena/_common/lib/hooks/use-token-balances'
import { useDerivedStateCrossChainSwap } from '~kadena/cross-chain-swap/derivedstate-cross-chain-swap-provider'
import { useKadena } from '~kadena/kadena-wallet-provider'

export const ReviewSwapDialogTrigger = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false)

  const { state } = useDerivedStateCrossChainSwap()

  const { address } = useAccount()
  const { connectAsync } = useConnect()

  const { activeAccount } = useKadena()

  const { data: kadenaBalances, isLoading: kadenaLoading } = useTokenBalances({
    account: activeAccount?.accountName ?? '',
    tokenAddresses:
      state.token0 && isKvmChainId(state.token0.chainId)
        ? [state.token0.address as KvmTokenAddress, 'coin']
        : [],
  })

  const ethBalance = useBalance(
    state.token0?.chainId
      ? isEvmChainId(state.token0?.chainId)
        ? (state.token0.chainId as EvmChainId)
        : undefined
      : undefined,
    state.token0?.address
      ? isEvmChainId(state.token0?.chainId)
        ? (state.token0?.address as `0x${string}`)
        : undefined
      : undefined,
  )

  const hasInsufficientGas = useMemo(() => {
    if (state.token0 && isKvmChainId(state.token0.chainId)) {
      const kdaBalance = Number.parseFloat(
        kadenaBalances?.balanceMap['coin'] ?? '0',
      )
      return kdaBalance < MIN_GAS_FEE
    }
    if (state.token0 && isEvmChainId(state.token0.chainId)) {
      return (
        Number(formatUnits(ethBalance.data ?? 0n, state.token0.decimals)) === 0
      )
    }
    return true
  }, [state.token0, kadenaBalances, ethBalance.data])

  const token0Balance = useMemo(() => {
    if (!state.token0) return 0
    if (isKvmChainId(state.token0.chainId)) {
      return Number.parseFloat(
        kadenaBalances?.balanceMap[state.token0.address] ?? '0',
      )
    }
    if (isEvmChainId(state.token0.chainId)) {
      return Number(formatUnits(ethBalance.data ?? 0n, state.token0.decimals))
    }
    return 0
  }, [state.token0, kadenaBalances, ethBalance.data])

  const hasInsufficientToken0Balance = useMemo(() => {
    if (kadenaLoading) return true
    return token0Balance < Number(state.swapAmountString)
  }, [state.swapAmountString, kadenaLoading, token0Balance])

  // const noRoutes = route?.length === 0
  const noRoutes = false

  // const insufficientLiquidity = priceImpactPercentage >= 100
  const insufficientLiquidity = false

  const buttonText = useMemo(() => {
    // if (isTxnPending) {
    //   return 'Swapping'
    // }
    if (!state.swapAmountString || state.swapAmountString === '0') {
      return 'Enter Amount'
    }
    if (hasInsufficientToken0Balance) {
      return 'Insufficient Balance on Kadena'
    }
    if (noRoutes) {
      return 'No Routes Found'
    }
    if (insufficientLiquidity) {
      return 'Insufficient Liquidity'
    }
    if (hasInsufficientGas) {
      return 'Insufficient Gas Balance'
    }
    return 'Swap'
  }, [
    state.swapAmountString,
    hasInsufficientToken0Balance,
    // noRoutes,
    // insufficientLiquidity,
    hasInsufficientGas,
  ])

  // const userConfirmationNeeded = useMemo(() => {
  //   if (priceImpactPercentage >= 15) {
  //     return true
  //   }
  //   return false
  // }, [priceImpactPercentage])

  // useEffect(() => {
  //   if (priceImpactPercentage < 15) return
  //   setIsChecked(false)
  // }, [priceImpactPercentage])

  const userConfirmationNeeded = false

  return (
    <>
      {
        <DialogTrigger
          disabled={
            insufficientLiquidity ||
            (userConfirmationNeeded && !isChecked) ||
            !state.swapAmountString ||
            hasInsufficientToken0Balance ||
            noRoutes
          }
          asChild
        >
          <Checker.Guard
            guardWhen={!address}
            guardText="Connect Ethereum Wallet"
            onClick={() => {
              connectAsync({ connector: injected() })
            }}
            disabled={false}
          >
            <Checker.Guard
              guardWhen={!activeAccount?.accountName}
              guardText="Connect Kadena Wallet"
            >
              <Button
                size="xl"
                fullWidth
                disabled={
                  insufficientLiquidity ||
                  (userConfirmationNeeded && !isChecked) ||
                  !state.swapAmountString ||
                  hasInsufficientToken0Balance ||
                  noRoutes ||
                  !state.swapAmountString
                }
              >
                {buttonText}
              </Button>
            </Checker.Guard>
          </Checker.Guard>
        </DialogTrigger>
      }
      {userConfirmationNeeded && !isChecked ? (
        <div className="flex items-start px-4 py-3 mt-4 rounded-xl bg-red/20">
          <input
            id="expert-checkbox"
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="cursor-pointer mr-1 w-5 h-5 mt-0.5 text-red-600 !ring-red-600 bg-white border-red rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
          />
          <label
            htmlFor="expert-checkbox"
            className="ml-2 font-medium text-red-600"
          >
            Price impact is too high. You will lose a big portion of your funds
            in this trade. Please tick the box if you would like to continue.
          </label>
        </div>
      ) : null}
    </>
  )
}
