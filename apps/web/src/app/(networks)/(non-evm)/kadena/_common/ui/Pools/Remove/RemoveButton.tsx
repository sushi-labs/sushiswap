import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { Button, type ButtonProps } from '@sushiswap/ui'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { formatUnitsForInput } from '~kadena/_common/lib/utils/formatters'
import { getChainwebTxnLink } from '~kadena/_common/lib/utils/kadena-helpers'
import { WalletConnector } from '~kadena/_common/ui/WalletConnector/WalletConnector'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { usePoolState } from '../pool-provider'
import { useRemoveLiqDispatch, useRemoveLiqState } from './pool-remove-provider'

export const ROUTER_CONTRACT = 'TG61TbGhkx757ATfceRbnSHD3kHzQ7tk97'
const PAIR_DECIMALS = 18

export const RemoveButton = (props: ButtonProps) => {
  const queryClient = useQueryClient()
  const address =
    'abf594a764e49a90a98cddf30872d8497e37399684c1d8e2b8e96fd865728cc2'
  const { isConnected } = useKadena()
  const {
    percentage,
    isTxnPending,
    lpToRemove,
    minAmountToken0,
    minAmountToken1,
  } = useRemoveLiqState()
  const { setIsTxnPending, setPercentage } = useRemoveLiqDispatch()
  const { token0, token1, pairAddress } = usePoolState()
  const allowanceAmount = '.72'
  // const refetch = () => {}

  const removeLiquidity = async () => {
    if (
      !isConnected ||
      !address ||
      !token0 ||
      !token1 ||
      !lpToRemove ||
      !minAmountToken0 ||
      !minAmountToken1
    ) {
      return
    }
    try {
      setIsTxnPending(true)

      const txId =
        'abf594a764e49a90a98cddf30872d8497e37399684c1d8e2b8e96fd865728cc2'

      createInfoToast({
        summary: `Removing liquidity from the ${token0.tokenSymbol}/${token1.tokenSymbol} pair.`,
        type: 'swap',
        account: address as string,
        chainId: 1,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
        txHash: txId,
        href: getChainwebTxnLink(txId),
      })

      await new Promise((resolve) => setTimeout(resolve, 1800))

      createSuccessToast({
        summary: 'Successfully removed liquidity!',
        txHash: txId,
        type: 'swap',
        account: address as string,
        chainId: 1,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
        href: getChainwebTxnLink(txId),
      })
      onSuccess()
    } catch (error) {
      const errorMessage =
        typeof error === 'string'
          ? error
          : ((error as Error)?.message ??
            'An error occurred while trying to remove liquidity.')
      //create error toast
      createFailedToast({
        summary: errorMessage,
        type: 'swap',
        account: address as string,
        chainId: 1,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })
      console.error(error)
      setIsTxnPending(false)
    }
  }

  const onSuccess = () => {
    setPercentage(0)
    setIsTxnPending(false)
    queryClient.invalidateQueries({
      queryKey: [
        'useTokenBalance',
        { accountAddress: address, tokenAddress: pairAddress },
      ],
    })
  }

  const allowanceFormatted = formatUnitsForInput(
    allowanceAmount ?? '0',
    token0?.tokenDecimals ?? 18,
  )

  const buttonText = useMemo(() => {
    if (isTxnPending) {
      return 'Removing'
    }
    if (percentage === 0) {
      return 'Enter Amount'
    }
    if (
      allowanceAmount &&
      Number(formatUnitsForInput(lpToRemove, PAIR_DECIMALS)) >
        Number(allowanceFormatted)
    ) {
      return 'Approve'
    }
    return 'Remove'
  }, [percentage, isTxnPending, allowanceFormatted, lpToRemove])

  if (!isConnected) {
    return <WalletConnector fullWidth {...props} />
  }

  // if (buttonText === 'Approve') {
  //   return (
  //     <ApproveToken
  //       tokenToApprove={{
  //         address: pairAddress as string,
  //         decimals: PAIR_DECIMALS,
  //         symbol: 'SLP',
  //         name: 'SushiSwap LP',
  //       }}
  //       amount={formatUnitsForInput(lpToRemove, PAIR_DECIMALS)}
  //       spenderAddress={ROUTER_CONTRACT}
  //       onSuccess={async () => {
  //         await refetch()
  //       }}
  //       buttonProps={props}
  //     />
  //   )
  // }

  return (
    <Button
      onClick={removeLiquidity}
      disabled={percentage === 0 || isTxnPending}
      {...props}
    >
      {buttonText}
    </Button>
  )
}
