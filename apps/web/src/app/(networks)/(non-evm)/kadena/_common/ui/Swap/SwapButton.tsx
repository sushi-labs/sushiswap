import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { Button, Dots } from '@sushiswap/ui'
import { useQueryClient } from '@tanstack/react-query'
import { getChainwebTxnLink } from '~kadena/_common/lib/utils/kadena-helpers'
import { useSwapDispatch, useSwapState } from '~kadena/swap/swap-provider'

export const SwapButton = ({ closeModal }: { closeModal: () => void }) => {
  const queryClient = useQueryClient()
  const { token0, token1, isTxnPending } = useSwapState()
  const {
    setIsTxnPending,
    setAmountIn,
    setAmountOut,
    setPriceImpactPercentage,
  } = useSwapDispatch()
  const address =
    'abf594a764e49a90a98cddf30872d8497e37399684c1d8e2b8e96fd865728cc2'

  const swapToken = async () => {
    if (!address) return
    const txId =
      'abf594a764e49a90a98cddf30872d8497e37399684c1d8e2b8e96fd865728cc2'
    try {
      setIsTxnPending(true)

      createInfoToast({
        summary: 'Swap initiated...',
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
        summary: 'Swap successful',
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
            'An error occurred while trying to swap')

      createFailedToast({
        summary: errorMessage,
        type: 'swap',
        account: address as string,
        chainId: 1,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
        href: txId ? getChainwebTxnLink(txId) : undefined,
      })
      console.error(error)

      setIsTxnPending(false)
    }
  }

  const onSuccess = () => {
    setAmountIn('')
    setAmountOut('')
    setPriceImpactPercentage(0)
    setIsTxnPending(false)
    closeModal()

    queryClient.invalidateQueries({
      queryKey: [
        'useTokenBalance',
        { accountAddress: address, tokenAddress: token0?.address },
      ],
    })

    queryClient.invalidateQueries({
      queryKey: [
        'useTokenBalance',
        { accountAddress: address, tokenAddress: token1?.address },
      ],
    })
  }

  return (
    <Button
      disabled={isTxnPending}
      color="blue"
      fullWidth
      size="xl"
      onClick={swapToken}
    >
      {isTxnPending ? (
        <Dots>Confirming Swap</Dots>
      ) : (
        <>
          Swap {token0?.symbol} For {token1?.symbol}
        </>
      )}
    </Button>
  )
}
