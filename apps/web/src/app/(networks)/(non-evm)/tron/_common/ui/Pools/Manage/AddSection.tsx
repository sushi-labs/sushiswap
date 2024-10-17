import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import {
  IconButton,
  SettingsModule,
  SettingsOverlay,
  Widget,
  WidgetAction,
  WidgetDescription,
  WidgetHeader,
  WidgetTitle,
} from '@sushiswap/ui'
import { AmountInToken0 } from '../Add/AmountInToken0'
import { AmountInToken1 } from '../Add/AmountIntToken1'
import { Plus } from '../Add/Plus'
import { ReviewAddDialog } from '../Add/ReviewAddDialog'

export const AddSection = () => {
  return (
    <Widget id="addLiquidity" variant="empty">
      <WidgetHeader>
        <WidgetTitle>Add Liquidity</WidgetTitle>
        <WidgetDescription>
          Provide liquidity to receive SLP tokens.
        </WidgetDescription>
        <WidgetAction variant="empty">
          <SettingsOverlay
            options={{
              slippageTolerance: {
                storageKey: SlippageToleranceStorageKey.AddLiquidity,
              },
            }} //use this key to get slippage from localStorage
            modules={[SettingsModule.SlippageTolerance]}
          >
            <IconButton
              size="sm"
              name="Settings"
              icon={Cog6ToothIcon}
              variant="secondary"
            />
          </SettingsOverlay>
        </WidgetAction>
      </WidgetHeader>
      <section className="relative flex flex-col w-full gap-4">
        <AmountInToken0 theme="outline" disabled />
        <Plus theme="outline" />
        <AmountInToken1 theme="outline" disabled />
      </section>
      <div className="flex flex-col w-full mt-4">
        <ReviewAddDialog variant="outline" fullWidth />
      </div>
    </Widget>
  )
}
