import { SwitchArrowsIcon } from '@sushiswap/ui/icons/switch-arrows-icon'
import { useSimpleSwapActions } from '~stellar/_common/ui/swap/simple/simple-swap-provider/simple-swap-provider'

export const SimpleSwapSwitchTokensButton = () => {
  const { swapTokens } = useSimpleSwapActions()

  return (
    <div className="left-0 right-0 mt-[-28px] mb-[-28px] flex items-center justify-center ">
      <button
        onClick={swapTokens}
        type="button"
        className="hover:shadow-sm transition-border shadow-md z-10 group bg-background dark:bg-muted py-3 px-7 border border-accent transition-all rounded-full cursor-pointer"
      >
        <div className="transition-transform rotate-0 group-hover:rotate-180">
          <SwitchArrowsIcon className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  )
}
