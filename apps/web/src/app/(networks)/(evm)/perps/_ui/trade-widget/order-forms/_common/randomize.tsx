import { HoverCard, HoverCardContent, HoverCardTrigger } from '@sushiswap/ui'
import { SwitchSetting } from '~evm/perps/_ui/_common'
import { useAssetState } from '../../asset-state-provider'

export const Randomize = () => {
  const {
    state: { twapRandomize },
    mutate: { setTwapRandomize },
  } = useAssetState()

  return (
    <HoverCard>
      <HoverCardTrigger tabIndex={0}>
        <SwitchSetting
          label="Randomize"
          value={twapRandomize}
          onChange={setTwapRandomize}
        />
      </HoverCardTrigger>
      <HoverCardContent
        forceMount
        side="top"
        className="!px-3 !bg-black/10 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
      >
        <p>
          If Randomize is enabled, the size of each sub-trade will be
          automatically adjusted within a certain range, typically up to 20%
          higher or lower than the original trade size. However, any other
          requirements specified when creating the TWAP trade, such as ensuring
          the randomized trade size does not exceed the maximum single trade
          size, will still be followed.
        </p>
      </HoverCardContent>
    </HoverCard>
  )
}
