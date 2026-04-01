import { HoverCard, HoverCardContent, HoverCardTrigger } from '@sushiswap/ui'
import { CheckboxSetting } from '~evm/perps/_ui/_common'
import { useAssetState } from '../../asset-state-provider'

export const ReduceOnly = () => {
  const {
    state: { reduceOnly },
    mutate: { setReduceOnly },
  } = useAssetState()

  return (
    <HoverCard>
      <HoverCardTrigger tabIndex={0}>
        <CheckboxSetting
          label="Reduce Only"
          value={reduceOnly}
          onChange={setReduceOnly}
        />
      </HoverCardTrigger>
      <HoverCardContent
        forceMount
        side="top"
        className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
      >
        <p>
          This order will not open a new position no matter how large the order
          size is. It will compare to the existing position at the time of
          exection.
        </p>
      </HoverCardContent>
    </HoverCard>
  )
}
