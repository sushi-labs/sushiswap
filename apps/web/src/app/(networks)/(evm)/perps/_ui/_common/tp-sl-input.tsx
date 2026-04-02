'use client'
import { Button, TextField, classNames } from '@sushiswap/ui'
import { useCallback, useEffect, useState } from 'react'
import {
  type PerpOrSpotAsset,
  type TpSlGainLossType,
  calculateGainFromTp,
  calculateLossFromSl,
  calculateSlFromLoss,
  calculateTpFromGain,
  formatPrice,
} from 'src/lib/perps'

export const TpSlInput = ({
  asset,
  entryPrice,
  tpPrice,
  slPrice,
  onChangeTpPrice,
  onChangeSlPrice,
  side,
  type,
  setType,
  positionSize,
  positionLeverage,
  showExpectedProfit,
  hideTp,
  hideSl,
  inputSize = 'default',
}: {
  asset: PerpOrSpotAsset | undefined
  entryPrice: string
  tpPrice: string
  slPrice: string
  onChangeTpPrice: (value: string) => void
  onChangeSlPrice: (value: string) => void
  side: 'A' | 'B'
  type: TpSlGainLossType
  setType: (type: TpSlGainLossType) => void
  positionSize: string
  positionLeverage: number
  showExpectedProfit?: boolean
  hideTp?: boolean
  hideSl?: boolean
  inputSize?: 'default' | 'sm'
}) => {
  const [gain, setGain] = useState<{
    usd: string
    percent: string
  }>({
    usd: '',
    percent: '',
  })

  const [loss, setLoss] = useState<{
    usd: string
    percent: string
  }>({
    usd: '',
    percent: '',
  })

  const needsPositionSize = Number(positionSize) === 0 && type === 'usd'

  const onChangeGain = useCallback(
    (value: string) => {
      if (!value || needsPositionSize) {
        onChangeTpPrice('')
        setGain({ usd: '', percent: '' })
        return
      }
      const decimals = asset?.formatParseDecimals || 18

      const { tpPrice, gainUsd, gainPercent } = calculateTpFromGain({
        entryPrice,
        positionSize,
        side,
        leverage: BigInt(positionLeverage),
        decimals,
        gainType: type,
        gainValue: value,
      })

      onChangeTpPrice(
        formatPrice(tpPrice, asset?.decimals || 0, asset?.marketType || 'perp'),
      )
      setGain({ usd: gainUsd, percent: gainPercent })
    },
    [
      entryPrice,
      type,
      onChangeTpPrice,
      positionSize,
      asset,
      positionLeverage,
      side,
      needsPositionSize,
    ],
  )

  const _onChangeTpPrice = useCallback(
    (value: string) => {
      if (!value || needsPositionSize) {
        onChangeTpPrice('')
        setGain({ usd: '', percent: '' })
        return
      }
      const decimals = asset?.formatParseDecimals || 18

      const { gainUsd, gainPercent } = calculateGainFromTp({
        entryPrice,
        positionSize,
        tpPrice: value,
        side,
        leverage: BigInt(positionLeverage),
        decimals,
      })

      onChangeTpPrice(
        formatPrice(value, asset?.decimals || 0, asset?.marketType || 'perp'),
      )
      setGain({ usd: gainUsd, percent: gainPercent })
    },
    [
      entryPrice,
      onChangeTpPrice,
      positionSize,
      asset,
      positionLeverage,
      side,
      needsPositionSize,
    ],
  )

  const onChangeLoss = useCallback(
    (value: string) => {
      if (!value || needsPositionSize) {
        onChangeSlPrice('')
        setLoss({ usd: '', percent: '' })
        return
      }
      const decimals = asset?.formatParseDecimals || 18

      const { slPrice, lossUsd, lossPercent } = calculateSlFromLoss({
        entryPrice,
        positionSize,
        side,
        leverage: BigInt(positionLeverage),
        decimals,
        lossType: type,
        lossValue: value,
      })

      onChangeSlPrice(
        formatPrice(slPrice, asset?.decimals || 0, asset?.marketType || 'perp'),
      )
      setLoss({ usd: lossUsd, percent: lossPercent })
    },
    [
      entryPrice,
      type,
      onChangeSlPrice,
      positionSize,
      asset,
      positionLeverage,
      side,
      needsPositionSize,
    ],
  )

  const _onChangeSlPrice = useCallback(
    (value: string) => {
      if (!value || needsPositionSize) {
        onChangeSlPrice('')
        setLoss({ usd: '', percent: '' })
        return
      }
      const decimals = asset?.formatParseDecimals || 18

      const { lossUsd, lossPercent } = calculateLossFromSl({
        entryPrice,
        positionSize,
        slPrice: value,
        side,
        leverage: BigInt(positionLeverage),
        decimals,
      })

      onChangeSlPrice(
        formatPrice(value, asset?.decimals || 0, asset?.marketType || 'perp'),
      )
      setLoss({ usd: lossUsd, percent: lossPercent })
    },
    [
      entryPrice,
      onChangeSlPrice,
      positionSize,
      asset,
      positionLeverage,
      side,
      needsPositionSize,
    ],
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: if positionSize changes externally (ex: user edits position size in another dialog input), need to recalculate gain/loss based on new position size
  useEffect(() => {
    if (needsPositionSize) return
    if (Number.parseFloat(positionSize) > 0) {
      onChangeGain(type === 'usd' ? gain.usd : gain.percent)
    }
    if (Number.parseFloat(positionSize) > 0) {
      onChangeLoss(type === 'usd' ? loss.usd : loss.percent)
    }
  }, [positionSize, needsPositionSize])

  return (
    <div className="flex flex-col gap-2 relative">
      {needsPositionSize ? (
        <div className="absolute inset-0 backdrop-blur-sm z-10 select-none flex items-center justify-center rounded-md">
          <p className="text-red font-medium text-xs italic text-center">
            Enter position size to set TP/SL in USD
          </p>
        </div>
      ) : null}
      {/* take profit */}
      {hideTp ? null : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div
              className={`w-full border rounded-lg border-[#FFFFFF1A] bg-[#FFFFFF0D] ${inputSize === 'sm' ? 'text-sm py-0 px-2' : 'px-4 py-2'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[#8f9399] whitespace-nowrap cursor-default">
                  TP Price
                </p>
                <div className="flex items-center gap-1 max-h-[35px]">
                  <TextField
                    type="number"
                    variant="naked"
                    disabled={!asset}
                    onValueChange={_onChangeTpPrice}
                    value={tpPrice}
                    readOnly={!asset}
                    maxDecimals={asset?.formatParseDecimals}
                    className={classNames(
                      'font-medium text-right',
                      inputSize === 'sm' ? '!text-sm' : '!text-lg',
                    )}
                  />
                </div>
              </div>
            </div>
            <div
              className={`w-full border rounded-lg border-[#FFFFFF1A] bg-[#FFFFFF0D] ${inputSize === 'sm' ? 'text-sm py-0 px-2' : 'px-4 py-2'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[#8f9399] cursor-default">Gain</p>
                <div className="flex items-center gap-1 max-h-[35px]">
                  <TextField
                    type="number"
                    variant="naked"
                    onValueChange={onChangeGain}
                    value={type === 'usd' ? gain.usd : gain.percent}
                    maxDecimals={type === 'usd' ? 0 : 2}
                    disabled={!asset}
                    className={classNames(
                      'font-medium text-right',
                      inputSize === 'sm' ? '!text-sm' : '!text-lg',
                    )}
                  />
                  <TypeToggle type={type} setType={setType} />
                </div>
              </div>
            </div>
          </div>
          {gain.percent && gain.usd && showExpectedProfit ? (
            <p className="text-right text-xs text-muted-foreground">
              Expected profit:{' '}
              {type === 'percent' ? `${gain.usd} USDC` : `${gain.percent}%`}
            </p>
          ) : null}
        </div>
      )}

      {/* stop loss */}
      {hideSl ? null : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div
              className={`w-full border rounded-lg border-[#FFFFFF1A] bg-[#FFFFFF0D] ${inputSize === 'sm' ? 'text-sm py-0 px-2' : 'px-4 py-2'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[#8f9399] whitespace-nowrap cursor-default">
                  SL Price
                </p>
                <div className="flex items-center gap-1 max-h-[35px]">
                  <TextField
                    type="number"
                    variant="naked"
                    disabled={!asset}
                    onValueChange={_onChangeSlPrice}
                    value={slPrice}
                    readOnly={!asset}
                    maxDecimals={asset?.formatParseDecimals}
                    className={classNames(
                      'font-medium text-right',
                      inputSize === 'sm' ? '!text-sm' : '!text-lg',
                    )}
                  />
                </div>
              </div>
            </div>
            <div
              className={`w-full border rounded-lg border-[#FFFFFF1A] bg-[#FFFFFF0D] ${inputSize === 'sm' ? 'text-sm py-0 px-2' : 'px-4 py-2'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[#8f9399] cursor-default">Loss</p>
                <div className="flex items-center gap-1 max-h-[35px]">
                  <TextField
                    type="number"
                    variant="naked"
                    onValueChange={onChangeLoss}
                    value={type === 'usd' ? loss.usd : loss.percent}
                    maxDecimals={type === 'usd' ? 0 : 2}
                    disabled={!asset}
                    className={classNames(
                      'font-medium text-right',
                      inputSize === 'sm' ? '!text-sm' : '!text-lg',
                    )}
                  />
                  <TypeToggle type={type} setType={setType} />
                </div>
              </div>
            </div>
          </div>
          {loss.percent && loss.usd && showExpectedProfit ? (
            <p className="text-right text-xs text-muted-foreground">
              Expected loss:{' '}
              {type === 'percent' ? `-${loss.usd} USDC` : `${loss.percent}%`}
            </p>
          ) : null}
        </div>
      )}
    </div>
  )
}

const TypeToggle = ({
  type,
  setType,
}: {
  type: 'usd' | 'percent'
  setType: (type: 'usd' | 'percent') => void
}) => {
  return (
    <div className="flex items-center rounded-lg p-0.5">
      <Button
        size="xs"
        variant={'ghost'}
        onClick={() => setType('usd')}
        className={classNames(
          'text-xs !min-h-[18px] !h-[18px] !px-1 !rounded-md',
          type === 'percent' ? 'text-muted-foreground' : '',
        )}
      >
        $
      </Button>
      <Button
        size="xs"
        variant={'ghost'}
        onClick={() => setType('percent')}
        className={classNames(
          'text-xs !min-h-[18px] !h-[18px] !px-1 !rounded-md',
          type === 'usd' ? 'text-muted-foreground' : '',
        )}
      >
        %
      </Button>
    </div>
  )
}
