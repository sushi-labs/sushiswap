import { FC, ReactNode, useCallback } from 'react'
import { useSwapState } from './trade/TradeProvider'
import { AppType } from '@sushiswap/ui/types'

interface ConfirmationDialogCrossChainProps {
  children({
    onClick,
    isWritePending,
  }: {
    onClick(): void
    isWritePending: boolean
    isLoading: boolean
    isConfirming: boolean
  }): ReactNode
}

export const ConfirmationDialogCrossChain: FC<ConfirmationDialogCrossChainProps> = ({ children }) => {
  const { appType } = useSwapState()
  const enabled = appType === AppType.xSwap
  const onClick = useCallback(() => {}, [])
  const isWritePending = false
  const isLoading = false
  const isConfirming = false

  return (
    <>
      {children({
        onClick,
        isWritePending,
        isLoading,
        isConfirming,
      })}
      <span />
    </>
  )
}
