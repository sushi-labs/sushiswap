import { useCallback } from 'react'
import {
  getSizeAndPercentageFromInput,
  getSizeAndPercentageFromPercentageInput,
} from 'src/lib/perps/utils'
import { PercentageSlider } from '~evm/perps/_ui/_common/percentage-slider'
import { SizeInput } from '~evm/perps/_ui/_common/size-input'
import { useAssetState } from '../../asset-state-provider'

export const OrderSizeInput = () => {
  const {
    state: { asset, sizeSide, size, maxTradeSize, markPrice, percentage },
    mutate: { setSizeSide, setSize, setPercentage },
  } = useAssetState()

  const handleSetSize = useCallback(
    (value: string) => {
      if (!asset) return

      try {
        const { baseSize, quoteSize, percentage } =
          getSizeAndPercentageFromInput({
            inputValue: value,
            sizeSide,
            maxSize: maxTradeSize,
            priceUsd: markPrice ?? '0',
            decimals: asset.decimals,
          })
        setPercentage(percentage)

        setSize({
          base: sizeSide === 'base' ? value : baseSize,
          quote: sizeSide === 'quote' ? value : quoteSize,
        })
      } catch (e) {
        console.error('Error formatting size:', e)
        setSize({
          base: sizeSide === 'base' ? value : '0',
          quote: sizeSide === 'quote' ? value : '0',
        })
      }
    },
    [asset, sizeSide, maxTradeSize, markPrice, setPercentage, setSize],
  )

  const handleSetPercent = useCallback(
    (val: number) => {
      if (!asset) {
        setSize({ base: '0', quote: '0' })
        setPercentage(0)
        return
      }

      try {
        const { baseSize, quoteSize, percentage } =
          getSizeAndPercentageFromPercentageInput({
            percentageInput: val,
            maxSize: maxTradeSize,
            priceUsd: markPrice ?? '0',
            decimals: asset.decimals,
          })

        setSize({ base: baseSize, quote: quoteSize })
        setPercentage(percentage)
      } catch (e) {
        console.error('Error formatting size:', e)
        setSize({ base: '0', quote: '0' })
        setPercentage(val)
      }
    },
    [asset, maxTradeSize, markPrice, setSize, setPercentage],
  )

  return (
    <div className="flex flex-col gap-1">
      <SizeInput
        asset={asset}
        sizeSide={sizeSide}
        setSizeSide={setSizeSide}
        value={size}
        onChange={handleSetSize}
        className="!py-0 text-sm !px-2"
      />
      <PercentageSlider value={percentage} onChange={handleSetPercent} />
    </div>
  )
}
