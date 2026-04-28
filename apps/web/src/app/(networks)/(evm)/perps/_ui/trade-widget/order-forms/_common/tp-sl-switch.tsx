import { HoverCard, HoverCardContent, HoverCardTrigger } from '@sushiswap/ui'
import { SwitchSetting } from '~evm/perps/_ui/_common'
import { useAssetState } from '../../asset-state-provider'

export const TpSlSwitch = () => {
  const {
    state: { hasTpSl },
    mutate: { setHasTpSl },
  } = useAssetState()

  return (
    <HoverCard>
      <HoverCardTrigger tabIndex={0}>
        <SwitchSetting
          label="Take Profit / Stop Loss"
          value={hasTpSl}
          onChange={(val) => setHasTpSl(val)}
        />
      </HoverCardTrigger>
      <HoverCardContent
        forceMount
        side="top"
        className="!px-3 !bg-black/10 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
      >
        <p>
          Places simple market TP/SL orders. For advanced features such as limit
          prices or partial TP/SL, set the TP/SL on an open position.
        </p>
      </HoverCardContent>
    </HoverCard>
  )
}
