import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { Button, type ButtonProps } from '@sushiswap/ui'
import { useQueryClient } from '@tanstack/react-query'
import { getChainwebTxnLink } from '~kadena/_common/lib/utils/kadena-helpers'
import { usePoolDispatch, usePoolState } from '../pool-provider'

export const AddButton = ({
  closeModal,
  buttonProps,
}: { closeModal: () => void; buttonProps?: ButtonProps }) => {
  const queryClient = useQueryClient()

  const { token0, token1, isTxnPending, amountInToken0, amountInToken1 } =
    usePoolState()
  const { setIsTxnPending, setAmountInToken0, setAmountInToken1 } =
    usePoolDispatch()
  const address =
    'abf594a764e49a90a98cddf30872d8497e37399684c1d8e2b8e96fd865728cc2'

  const addLiquidity = async () => {
    if (!token0 || !token1 || !amountInToken0 || !amountInToken1 || !address)
      return
    try {
      setIsTxnPending(true)

      const txId =
        'abf594a764e49a90a98cddf30872d8497e37399684c1d8e2b8e96fd865728cc2'

      createInfoToast({
        summary: 'Add liquidity initiated...',
        type: 'swap',
        account: address as string,
        chainId: 1,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
        txHash: txId,
        href: getChainwebTxnLink(txId),
      })

      await new Promise((resolve) => setTimeout(resolve, 1800))

      //create success toast
      createSuccessToast({
        summary: 'Add liquidity successful',
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
            'An error occurred while trying to add liquidity')
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
    setIsTxnPending(false)
    setAmountInToken0('')
    setAmountInToken1('')
    closeModal()
    queryClient.invalidateQueries({
      queryKey: [
        'useTokenBalance',
        { accountAddress: address, tokenAddress: token0?.tokenAddress },
      ],
    })
    queryClient.invalidateQueries({
      queryKey: [
        'useTokenBalance',
        { accountAddress: address, tokenAddress: token1?.tokenAddress },
      ],
    })
  }

  return (
    <Button
      disabled={isTxnPending}
      loading={isTxnPending}
      onClick={addLiquidity}
      {...buttonProps}
    >
      {isTxnPending ? 'Adding Liquidity' : 'Add Liquidity'}
    </Button>
  )
}
