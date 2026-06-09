import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { useSendableAssets, useSymbolSplit } from 'src/lib/perps'
import { SwapStablesDialog } from '../account-management/swap-stables-dialog'
import { useAssetState } from '../trade-widget'

export const StableAmount: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}) => {
  const {
    state: { asset },
  } = useAssetState()
  const { quoteSymbol } = useSymbolSplit({ asset })
  const { data: sendableAssets } = useSendableAssets('stable')

  const sendableAmount = useMemo(() => {
    const stableAsset = sendableAssets?.find((a) => a.symbol === quoteSymbol)
    return stableAsset?.balance || '0'
  }, [sendableAssets, quoteSymbol])

  const isHIPDex = useMemo(() => {
    return Boolean(asset?.dex)
  }, [asset])

  if (isHIPDex && Number(sendableAmount) === 0 && quoteSymbol !== 'USDC') {
    return (
      <SwapStablesDialog
        trigger={
          <Button fullWidth={fullWidth} size={size} {...props}>
            Swap USDC to {quoteSymbol}
          </Button>
        }
        nonSelectableSwapData={{
          assetSymbolToSend: 'USDC',
          assetSymbolToBuy: quoteSymbol,
        }}
      />
    )
  }

  return <>{children}</>
}
