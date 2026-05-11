import { useCallback } from 'react'
import {
  getSizeAndPercentageFromInput,
  getSizeAndPercentageFromPercentageInput,
} from 'src/lib/perps'
import { PercentageSlider, SizeInput } from '~evm/perps/_ui/_common'
import { useAssetState } from '../../asset-state-provider'

export const OrderSizeInput = () => {
  const {
    state: {
      asset,
      sizeSide,
      size,
      maxTradeSize,
      markPrice,
      limitPrice,
      tradeType,
      percentage,
      tradeSide,
    },
    mutate: { setSizeSide, setSize, setPercentage },
  } = useAssetState()

  const handleSetSize = useCallback(
    (value: string) => {
      if (!asset) return
      let price = markPrice
      if (
        tradeType.toLowerCase().includes('limit') &&
        limitPrice &&
        asset?.marketType === 'perp'
      ) {
        price = limitPrice
      }
      try {
        const { baseSize, quoteSize, percentage } =
          getSizeAndPercentageFromInput({
            inputValue: value,
            sizeSide,
            maxSize: maxTradeSize,
            priceUsd: price ?? '0',
            decimals: asset.formatParseDecimals,
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
    [
      asset,
      sizeSide,
      maxTradeSize,
      markPrice,
      limitPrice,
      tradeType,
      setPercentage,
      setSize,
    ],
  )

  const handleSetPercent = useCallback(
    (val: number) => {
      if (!asset) {
        setSize({ base: '0', quote: '0' })
        setPercentage(0)
        return
      }
      let price = markPrice
      if (
        tradeType.toLowerCase().includes('limit') &&
        limitPrice &&
        asset?.marketType === 'perp'
      ) {
        price = limitPrice
      }
      try {
        const { baseSize, quoteSize, percentage } =
          getSizeAndPercentageFromPercentageInput({
            percentageInput: val,
            maxSize: maxTradeSize,
            priceUsd: price ?? '0',
            decimals: asset.formatParseDecimals,
          })

        setSize({ base: baseSize, quote: quoteSize })
        setPercentage(percentage)
      } catch (e) {
        console.error('Error formatting size:', e)
        setSize({ base: '0', quote: '0' })
        setPercentage(val)
      }
    },
    [
      asset,
      maxTradeSize,
      markPrice,
      limitPrice,
      tradeType,
      setSize,
      setPercentage,
    ],
  )

  return (
    <div className="flex flex-col gap-2">
      <SizeInput
        asset={asset}
        sizeSide={sizeSide}
        setSizeSide={setSizeSide}
        value={size}
        onChange={handleSetSize}
        className="!py-0 text-sm !px-2"
      />
      <PercentageSlider
        value={percentage}
        onChange={handleSetPercent}
        variant={tradeSide}
      />
    </div>
  )
}
