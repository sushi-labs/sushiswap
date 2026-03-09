import { TextField, classNames } from '@sushiswap/ui'
import type { PerpOrSpotAsset } from 'src/lib/perps/subscription'

export const TpSlLimitInput = ({
  asset,
  tpLimitPrice,
  slLimitPrice,
  onChangeTpLimitPrice,
  onChangeSlLimitPrice,
}: {
  asset: PerpOrSpotAsset | undefined
  tpLimitPrice: string
  slLimitPrice: string
  onChangeTpLimitPrice: (value: string) => void
  onChangeSlLimitPrice: (value: string) => void
}) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="w-full border rounded-lg border-accent px-4 py-2 dark:bg-slate-700 bg-slate-50">
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground whitespace-nowrap">
            TP Limit Price
          </p>
          <div className="flex items-center gap-1">
            <TextField
              type="number"
              variant="naked"
              disabled={!asset}
              onValueChange={onChangeTpLimitPrice}
              value={tpLimitPrice}
              readOnly={!asset}
              maxDecimals={asset?.decimals}
              className={classNames('!text-lg font-medium text-right')}
            />
          </div>
        </div>
      </div>
      <div className="w-full border rounded-lg border-accent px-4 py-2 dark:bg-slate-700 bg-slate-50">
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground whitespace-nowrap">
            SL Limit Price
          </p>
          <div className="flex items-center gap-1">
            <TextField
              type="number"
              variant="naked"
              onValueChange={onChangeSlLimitPrice}
              value={slLimitPrice}
              maxDecimals={asset?.decimals}
              disabled={!asset}
              className={classNames('!text-lg font-medium text-right')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
