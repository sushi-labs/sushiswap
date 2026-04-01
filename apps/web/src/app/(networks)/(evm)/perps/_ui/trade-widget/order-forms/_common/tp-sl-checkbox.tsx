import { HoverCard, HoverCardContent, HoverCardTrigger } from '@sushiswap/ui'
import { CheckboxSetting } from '~evm/perps/_ui/_common'
import { useAssetState } from '../../asset-state-provider'

export const TpSlCheckbox = () => {
  const {
    state: { hasTpSl },
    mutate: { setHasTpSl },
  } = useAssetState()

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger tabIndex={0}>
        <CheckboxSetting
          label="Take Profit / Stop Loss"
          value={hasTpSl}
          onChange={(val) => setHasTpSl(val)}
        />
      </HoverCardTrigger>
      <HoverCardContent
        forceMount
        side="top"
        className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
      >
        <p>
          Places simple market TP/SL orders. For advanced features such as limit
          prices or partial TP/SL, set the TP/SL on an open position.
        </p>
      </HoverCardContent>
    </HoverCard>
  )
}
