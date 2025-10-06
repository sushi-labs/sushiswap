import { Button, DialogTrigger } from '@sushiswap/ui'
import { useMemo } from 'react'
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
import { WalletConnector } from '../WalletConnector/WalletConnector'

export const ReviewSwapDialogTrigger = () => {
  const {
    state: { token0, swapAmountString, isLoadingSimulateBridgeTx },
  } = useDerivedStateCrossChainSwap()

  const { address } = useAccount()
  const { connectAsync } = useConnect()

  const { activeAccount } = useKadena()

  const tokenAddresses = useMemo(() => {
    if (token0 && isKvmChainId(token0.chainId)) {
      return [token0.address as KvmTokenAddress, 'coin' as KvmTokenAddress]
    }
    return []
  }, [token0])

  const { data: kadenaBalances, isLoading: kadenaLoading } = useTokenBalances({
    account: activeAccount?.accountName ?? '',
    tokenAddresses,
  })

  const ethBalanceChainId =
    token0?.chainId && isEvmChainId(token0?.chainId)
      ? (token0.chainId as EvmChainId)
      : undefined

  const ethBalanceAddress =
    token0?.address && isEvmChainId(token0?.chainId)
      ? (token0?.address as `0x${string}`)
      : undefined

  const ethBalance = useBalance(ethBalanceChainId, ethBalanceAddress)

  const hasInsufficientGas = useMemo(() => {
    if (token0 && isKvmChainId(token0.chainId)) {
      const kdaBalance = Number.parseFloat(
        kadenaBalances?.balanceMap['coin'] ?? '0',
      )
      return kdaBalance < MIN_GAS_FEE
    }
    if (token0 && isEvmChainId(token0.chainId)) {
      return Number(formatUnits(ethBalance.data ?? 0n, token0.decimals)) === 0
    }
    return true
  }, [token0, kadenaBalances, ethBalance.data])

  const token0Balance = useMemo(() => {
    if (!token0) return 0
    if (isKvmChainId(token0.chainId)) {
      return Number.parseFloat(
        kadenaBalances?.balanceMap[token0.address] ?? '0',
      )
    }
    if (isEvmChainId(token0.chainId)) {
      return Number(formatUnits(ethBalance.data ?? 0n, token0.decimals))
    }
    return 0
  }, [token0, kadenaBalances, ethBalance.data])

  const hasInsufficientToken0Balance = useMemo(() => {
    if (kadenaLoading) return true
    return token0Balance < Number(swapAmountString)
  }, [swapAmountString, kadenaLoading, token0Balance])

  const buttonText = useMemo(() => {
    // if (isTxnPending) {
    //   return 'Swapping'
    // }

    if (!swapAmountString || swapAmountString === '0') {
      return 'Enter Amount'
    }
    if (hasInsufficientToken0Balance) {
      return 'Insufficient Balance'
    }

    if (hasInsufficientGas) {
      return 'Insufficient Gas Balance'
    }
    return 'Swap'
  }, [swapAmountString, hasInsufficientToken0Balance, hasInsufficientGas])

  const isDisabled = useMemo(() => {
    return (
      !(swapAmountString && Number(swapAmountString) > 0) ||
      hasInsufficientToken0Balance ||
      isLoadingSimulateBridgeTx
    )
  }, [
    swapAmountString,
    hasInsufficientToken0Balance,
    isLoadingSimulateBridgeTx,
  ])

  return (
    <>
      {!address ? (
        <Button
          size="xl"
          fullWidth
          onClick={() => connectAsync({ connector: injected() })}
        >
          Connect Ethereum Wallet
        </Button>
      ) : !activeAccount?.accountName ? (
        <WalletConnector
          variant="default"
          fullWidth
          size="xl"
          btnText="Connect Kadena Wallet"
        />
      ) : (
        <DialogTrigger asChild>
          <Button size="xl" fullWidth disabled={isDisabled}>
            {buttonText}
          </Button>
        </DialogTrigger>
      )}
    </>
  )
}
