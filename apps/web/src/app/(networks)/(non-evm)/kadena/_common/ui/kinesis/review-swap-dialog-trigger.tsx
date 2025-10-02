import { Button, DialogTrigger } from '@sushiswap/ui'
import { useMemo } from 'react'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { type EvmChainId, isEvmChainId } from 'sushi/evm'
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
  const { state } = useDerivedStateCrossChainSwap()

  const { address } = useAccount()
  const { connectAsync } = useConnect()

  const { activeAccount } = useKadena()

  const tokenAddresses = useMemo(() => {
    if (state.token0 && isKvmChainId(state.token0.chainId)) {
      return [
        state.token0.address as KvmTokenAddress,
        'coin' as KvmTokenAddress,
      ]
    }
    return []
  }, [state.token0])

  const { data: kadenaBalances, isLoading: kadenaLoading } = useTokenBalances({
    account: activeAccount?.accountName ?? '',
    tokenAddresses,
  })

  const ethBalanceChainId =
    state.token0?.chainId && isEvmChainId(state.token0?.chainId)
      ? (state.token0.chainId as EvmChainId)
      : undefined

  const ethBalanceAddress =
    state.token0?.address && isEvmChainId(state.token0?.chainId)
      ? (state.token0?.address as `0x${string}`)
      : undefined

  const ethBalance = useBalance(ethBalanceChainId, ethBalanceAddress)

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

  const buttonText = useMemo(() => {
    // if (isTxnPending) {
    //   return 'Swapping'
    // }
    if (!state.swapAmountString || state.swapAmountString === '0') {
      return 'Enter Amount'
    }
    if (hasInsufficientToken0Balance) {
      return 'Insufficient Balance'
    }

    if (hasInsufficientGas) {
      return 'Insufficient Gas Balance'
    }
    return 'Swap'
  }, [state.swapAmountString, hasInsufficientToken0Balance, hasInsufficientGas])

  const isDisabled = useMemo(() => {
    return (
      !(state.swapAmountString && Number(state.swapAmountString) > 0) ||
      hasInsufficientToken0Balance
    )
  }, [state.swapAmountString, hasInsufficientToken0Balance])

  return (
    <>
      {
        <DialogTrigger className="w-full" disabled={isDisabled}>
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
              <Button size="xl" fullWidth disabled={isDisabled}>
                {buttonText}
              </Button>
            </Checker.Guard>
          </Checker.Guard>
        </DialogTrigger>
      }
    </>
  )
}
