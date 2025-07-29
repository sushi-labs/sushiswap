'use client'

import {
  type FunkitCheckoutConfig,
  FunkitPaymentsIconLine,
  useFunkitCheckout,
} from '@funkit/connect'
import { Button, type ButtonProps, classNames } from '@sushiswap/ui'
import {
  type FC,
  type HTMLAttributes,
  type MouseEvent,
  useCallback,
  useMemo,
} from 'react'
import type { EvmChainId } from 'sushi/chain'

type FunButtonProps = {
  targetChain?: EvmChainId
  targetAssetAddress: string
  targetAssetAmount: number
  targetAssetTicker?: string
  targetAssetIcon?: string
} & ButtonProps &
  Omit<HTMLAttributes<HTMLButtonElement>, keyof ButtonProps | 'onClick'>

export const FunButton: FC<FunButtonProps> = ({
  targetChain = 137,
  targetAssetAddress,
  targetAssetAmount,
  targetAssetTicker = 'TOKEN',
  targetAssetIcon,
  onClick,
  className,
  variant = 'secondary',
  ...props
}) => {
  const checkoutConfig = useMemo<FunkitCheckoutConfig>(() => {
    return {
      modalTitle: `Buy ${targetAssetTicker}`,
      targetAssetAmount,
      targetChain: Number(targetChain),
      targetAsset: targetAssetAddress,
      targetAssetTicker: targetAssetTicker,
      checkoutItemTitle: targetAssetTicker,
      expirationTimestampMs: 1800000,
      iconSrc: targetAssetIcon || '',
      generateActionsParams: undefined,
      isDefiMode: true,
      isHidden: false,
    }
  }, [
    targetAssetAddress,
    targetAssetAmount,
    targetChain,
    targetAssetTicker,
    targetAssetIcon,
  ])

  const { beginCheckout } = useFunkitCheckout({
    config: checkoutConfig,
  })

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      beginCheckout()
      onClick?.(e)
    },
    [beginCheckout, onClick],
  )

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      className={classNames('flex gap-4 items-center', className)}
      type="button"
      {...props}
    >
      Buy with different method
      <FunkitPaymentsIconLine gap="3" />
    </Button>
  )
}
