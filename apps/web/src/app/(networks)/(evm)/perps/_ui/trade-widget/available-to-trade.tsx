'use client'
import { useMemo, useState } from 'react'
import { perpsNumberFormatter, useSymbolSplit } from 'src/lib/perps'
import { StatItem, TableButton } from '../_common'
import { PerpSpotTransferDialog } from '../account-management'
import { SwapStablesDialog } from '../account-management/swap-stables-dialog'
import { useAssetState } from './asset-state-provider'

export const AvailableToTrade = () => {
  const {
    state: { tradeSide, availableToLong, availableToShort, asset, markPrice },
  } = useAssetState()
  const { baseSymbol, quoteSymbol } = useSymbolSplit({ asset })
  const [open, setOpen] = useState(false)

  const { availToLong, availToShort } = useMemo(() => {
    if (asset?.marketType === 'spot') {
      const longValue = (
        Number.parseFloat(availableToLong) * Number(markPrice)
      ).toString()
      return {
        availToLong: perpsNumberFormatter({
          value: longValue,
          minFraxDigits: 2,
          maxFraxDigits: 2,
        }),
        availToShort: perpsNumberFormatter({
          value: availableToShort,
          maxFraxDigits: asset?.formatParseDecimals,
        }),
      }
    }
    return {
      availToLong: perpsNumberFormatter({
        value: availableToLong,
        minFraxDigits: 2,
        maxFraxDigits: 2,
      }),
      availToShort: perpsNumberFormatter({
        value: availableToShort,
        minFraxDigits: 2,
        maxFraxDigits: 2,
      }),
    }
  }, [availableToLong, availableToShort, asset, markPrice])

  const buttonText = useMemo(() => {
    return `${tradeSide === 'long' ? availToLong : availToShort} ${quoteSymbol}`
  }, [tradeSide, availToLong, availToShort, quoteSymbol])

  if (asset?.marketType === 'spot') {
    return (
      <StatItem
        title={
          tradeSide === 'long' ? (
            <PerpSpotTransferDialog
              trigger={
                <button
                  className="underline text-muted-foreground"
                  type="button"
                >
                  Available to Trade
                </button>
              }
            />
          ) : (
            'Available to Trade'
          )
        }
        value={
          tradeSide === 'long'
            ? `${availToLong} ${quoteSymbol}`
            : `${availToShort} ${baseSymbol}`
        }
      />
    )
  }
  return (
    <>
      <StatItem
        title="Available to Trade"
        value={
          asset?.dex !== '' && quoteSymbol !== 'USDC' ? (
            <TableButton onClick={() => setOpen(true)}>
              {buttonText}
            </TableButton>
          ) : (
            buttonText
          )
        }
      />
      {open ? (
        <SwapStablesDialog
          trigger={<div />}
          nonSelectableSwapData={{
            assetSymbolToSend: 'USDC',
            assetSymbolToBuy: quoteSymbol,
          }}
          isOpen={open}
          onOpenChange={setOpen}
        />
      ) : null}
    </>
  )
}
