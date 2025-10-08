import { Button, DialogTrigger } from '@sushiswap/ui'
import { useMemo } from 'react'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { Amount } from 'sushi'
import { type EvmChainId, isEvmChainId } from 'sushi/evm'
import { type KvmTokenAddress, isKvmChainId } from 'sushi/kvm'
import { useBalance } from '~evm/_common/ui/balance-provider/use-balance'
import {
  KADENA,
  KINESIS_BRIDGE_KVM_KADENA,
} from '~kadena/_common/constants/token-list'
import { useTokenBalances } from '~kadena/_common/lib/hooks/use-token-balances'
import { useDerivedStateCrossChainSwap } from '~kadena/cross-chain-swap/derivedstate-cross-chain-swap-provider'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { ConnectButton } from '../WalletConnector/connect-button'
import { Approve } from './approve'

export const ReviewSwapDialogTrigger = () => {
  const {
    state: {
      token0,
      swapAmountString,
      isLoadingSimulateBridgeTx,
      simulateBridgeError,
      simulateBridgeTx,
      isAllowanceError,
    },
  } = useDerivedStateCrossChainSwap()

  const { activeAccount } = useKadena()

  const kvmTokenAddresses = useMemo(() => {
    if (token0 && isKvmChainId(token0.chainId)) {
      return [token0.address as KvmTokenAddress, 'coin' as const]
    }
    return []
  }, [token0])

  const { data: kadenaBalances, isLoading: kadenaLoading } = useTokenBalances({
    account: activeAccount?.accountName ?? '',
    tokenAddresses: kvmTokenAddresses,
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
    if (
      token0 &&
      isKvmChainId(token0.chainId) &&
      token0.isSame(KINESIS_BRIDGE_KVM_KADENA)
    ) {
      const kdaBal = new Amount(
        KADENA,
        kadenaBalances?.balanceMap['coin'] ?? '0',
      )
      const totalAmountIn = Amount.fromHuman(KADENA, swapAmountString || '0')
      if (
        totalAmountIn
          .addHuman(simulateBridgeTx?.networkFeeInToken ?? '0')
          .gt(kdaBal)
      ) {
        return true
      }
    }
    if (simulateBridgeError?.message.includes('insufficient funds')) {
      return true
    }
    return false
  }, [
    simulateBridgeError,
    token0,
    simulateBridgeTx,
    swapAmountString,
    kadenaBalances?.balanceMap['coin'],
  ])

  const token0Balance = useMemo(() => {
    if (!token0) return undefined
    if (isKvmChainId(token0.chainId)) {
      return new Amount(
        token0,
        kadenaBalances?.balanceMap[token0.address] ?? '0',
      )
    }
    if (isEvmChainId(token0.chainId)) {
      return new Amount(token0, ethBalance.data ?? 0n)
    }
    return new Amount(token0, 0n)
  }, [token0, kadenaBalances, ethBalance.data])

  const hasInsufficientToken0Balance = useMemo(() => {
    if (kadenaLoading || !token0 || ethBalance?.isLoading) return true
    const amount = Amount.tryFromHuman(token0, swapAmountString || '0')
    return token0Balance?.lt(amount?.amount || 0n)
  }, [swapAmountString, kadenaLoading, token0Balance, token0, ethBalance])

  const buttonText = useMemo(() => {
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
      isLoadingSimulateBridgeTx ||
      (!simulateBridgeTx && !isAllowanceError) ||
      hasInsufficientGas
    )
  }, [
    swapAmountString,
    hasInsufficientToken0Balance,
    isLoadingSimulateBridgeTx,
    simulateBridgeTx,
    isAllowanceError,
    hasInsufficientGas,
  ])

  if (!activeAccount?.accountName) {
    return (
      <ConnectButton btnText={'Connect Kadena Wallet'} fullWidth size="xl" />
    )
  }

  return (
    <Checker.Connect fullWidth size="xl">
      <Approve
        amount={
          token0 ? Amount.fromHuman(token0, swapAmountString || '0') : undefined
        }
        contract={token0?.address as `0x${string}` | undefined}
        enabled={!isDisabled}
      >
        <DialogTrigger asChild>
          <Button size="xl" fullWidth disabled={isDisabled}>
            {buttonText}
          </Button>
        </DialogTrigger>
      </Approve>
    </Checker.Connect>
  )
}
