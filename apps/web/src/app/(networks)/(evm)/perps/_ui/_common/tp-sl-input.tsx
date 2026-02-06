import { formatPrice } from '@nktkas/hyperliquid/utils'
import { Button, TextField, classNames } from '@sushiswap/ui'
import { useCallback, useState } from 'react'
import type { PerpOrSpotAsset } from 'src/lib/perps/subscription/use-asset-list'
import {
  type TpSlGainLossType,
  calculateGainFromTp,
  calculateLossFromSl,
  calculateSlFromLoss,
  calculateTpFromGain,
} from 'src/lib/perps/utils'

export const TpSlInput = ({
  asset,
  entryPrice,
  tpPrice,
  slPrice,
  onChangeTpPrice,
  onChangeSlPrice,
  side,
  positionSize,
  positionLeverage,
  showExpectedProfit,
}: {
  asset: PerpOrSpotAsset | undefined
  entryPrice: string
  tpPrice: string
  slPrice: string
  onChangeTpPrice: (value: string) => void
  onChangeSlPrice: (value: string) => void
  side: 'A' | 'B'
  positionSize: string
  positionLeverage: number
  showExpectedProfit?: boolean
}) => {
  const [gain, setGain] = useState<{
    usd: string
    percent: string
  }>({
    usd: '',
    percent: '',
  })
  const [type, setType] = useState<TpSlGainLossType>('percent')
  const [loss, setLoss] = useState<{
    usd: string
    percent: string
  }>({
    usd: '',
    percent: '',
  })

  const onChangeGain = useCallback(
    (value: string) => {
      if (!value) {
        onChangeTpPrice('')
        setGain({ usd: '', percent: '' })
        return
      }
      const decimals = asset?.decimals || 18

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
        formatPrice(tpPrice, decimals, asset?.marketType || 'perp'),
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
    ],
  )

  const _onChangeTpPrice = useCallback(
    (value: string) => {
      if (!value) {
        onChangeTpPrice('')
        setGain({ usd: '', percent: '' })
        return
      }
      const decimals = asset?.decimals || 18

      const { gainUsd, gainPercent } = calculateGainFromTp({
        entryPrice,
        positionSize,
        tpPrice: value,
        side,
        leverage: BigInt(positionLeverage),
        decimals,
      })

      onChangeTpPrice(formatPrice(value, decimals, asset?.marketType || 'perp'))
      setGain({ usd: gainUsd, percent: gainPercent })
    },
    [entryPrice, onChangeTpPrice, positionSize, asset, positionLeverage, side],
  )

  const onChangeLoss = useCallback(
    (value: string) => {
      if (!value) {
        onChangeSlPrice('')
        setLoss({ usd: '', percent: '' })
        return
      }
      const decimals = asset?.decimals || 18

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
        formatPrice(slPrice, decimals, asset?.marketType || 'perp'),
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
    ],
  )

  const _onChangeSlPrice = useCallback(
    (value: string) => {
      if (!value) {
        onChangeSlPrice('')
        setLoss({ usd: '', percent: '' })
        return
      }
      const decimals = asset?.decimals || 18

      const { lossUsd, lossPercent } = calculateLossFromSl({
        entryPrice,
        positionSize,
        slPrice: value,
        side,
        leverage: BigInt(positionLeverage),
        decimals,
      })

      onChangeSlPrice(formatPrice(value, decimals, asset?.marketType || 'perp'))
      setLoss({ usd: lossUsd, percent: lossPercent })
    },
    [entryPrice, onChangeSlPrice, positionSize, asset, positionLeverage, side],
  )

  return (
    <div className="flex flex-col gap-2">
      {/* take profit */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="w-full border rounded-lg border-accent px-4 py-2 dark:bg-slate-700 bg-slate-50">
            <div className="flex items-center justify-between gap-2">
              <p className="text-muted-foreground whitespace-nowrap">
                TP Price
              </p>
              <div className="flex items-center gap-1">
                <TextField
                  type="number"
                  variant="naked"
                  disabled={!asset}
                  onValueChange={_onChangeTpPrice}
                  value={tpPrice}
                  readOnly={!asset}
                  maxDecimals={asset?.decimals}
                  className={classNames('!text-lg font-medium text-right')}
                />
              </div>
            </div>
          </div>
          <div className="w-full border rounded-lg border-accent px-4 py-2 dark:bg-slate-700 bg-slate-50">
            <div className="flex items-center justify-between gap-2">
              <p className="text-muted-foreground">Gain</p>
              <div className="flex items-center gap-1">
                <TextField
                  type="number"
                  variant="naked"
                  onValueChange={onChangeGain}
                  value={type === 'usd' ? gain.usd : gain.percent}
                  maxDecimals={type === 'usd' ? 0 : 2}
                  disabled={!asset}
                  className={classNames('!text-lg font-medium text-right')}
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

      {/* stop loss */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="w-full border rounded-lg border-accent px-4 py-2 dark:bg-slate-700 bg-slate-50">
            <div className="flex items-center justify-between gap-2">
              <p className="text-muted-foreground whitespace-nowrap">
                SL Price
              </p>
              <div className="flex items-center gap-1">
                <TextField
                  type="number"
                  variant="naked"
                  disabled={!asset}
                  onValueChange={_onChangeSlPrice}
                  value={slPrice}
                  readOnly={!asset}
                  maxDecimals={asset?.decimals}
                  className={classNames('!text-lg font-medium text-right')}
                />
              </div>
            </div>
          </div>
          <div className="w-full border rounded-lg border-accent px-4 py-2 dark:bg-slate-700 bg-slate-50">
            <div className="flex items-center justify-between gap-2">
              <p className="text-muted-foreground">Loss</p>
              <div className="flex items-center gap-1">
                <TextField
                  type="number"
                  variant="naked"
                  onValueChange={onChangeLoss}
                  value={type === 'usd' ? loss.usd : loss.percent}
                  maxDecimals={type === 'usd' ? 0 : 2}
                  disabled={!asset}
                  className={classNames('!text-lg font-medium text-right')}
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
    <div className="flex items-center border border-accent rounded-lg p-0.5">
      <Button
        size="xs"
        variant={type === 'usd' ? 'secondary' : 'ghost'}
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
        variant={type === 'percent' ? 'secondary' : 'ghost'}
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
