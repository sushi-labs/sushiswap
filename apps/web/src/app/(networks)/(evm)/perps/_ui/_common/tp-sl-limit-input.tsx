import { TextField, classNames } from '@sushiswap/ui'
import type { PerpOrSpotAsset } from 'src/lib/perps'

export const TpSlLimitInput = ({
  asset,
  tpLimitPrice,
  slLimitPrice,
  onChangeTpLimitPrice,
  onChangeSlLimitPrice,
  className,
}: {
  asset: PerpOrSpotAsset | undefined
  tpLimitPrice: string
  slLimitPrice: string
  onChangeTpLimitPrice: (value: string) => void
  onChangeSlLimitPrice: (value: string) => void
  className?: string
}) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <div
        className={classNames(
          'w-full border rounded-lg px-4 py-2 border-[#FFFFFF1A] bg-[#FFFFFF0D]',
          className ?? '',
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-[#8f9399] whitespace-nowrap">TP Limit Price</p>
          <div className="flex items-center gap-1 max-h-[35px]">
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
      <div
        className={classNames(
          'w-full border rounded-lg px-4 py-2 border-[#FFFFFF1A] bg-[#FFFFFF0D]',
          className ?? '',
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-[#8f9399] whitespace-nowrap">SL Limit Price</p>
          <div className="flex items-center gap-1 max-h-[35px]">
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
