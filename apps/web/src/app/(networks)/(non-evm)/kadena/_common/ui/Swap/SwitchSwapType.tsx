import { Button } from '@sushiswap/ui'
import { ShuffleIcon } from '@sushiswap/ui/icons/ShuffleIcon'
import { PathnameButton } from 'src/ui/pathname-button'

const swapTypes = ['Swap', 'Limit', 'DCA']

const crossChainType = {
  label: 'Cross-Chain',
  icon: <ShuffleIcon width={20} height={20} className="text-blue" />,
  className: 'bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent',
}

export const SwitchSwapType = () => {
  return (
    <div className="flex md:flex-row flex-col gap-2">
      <div className="flex gap-2">
        {swapTypes.map((type) => (
          <PathnameButton
            key={type}
            pathname={`/kadena/${type.toLowerCase()}`}
            size="sm"
            disabled={type !== 'Swap'}
          >
            {type}
          </PathnameButton>
        ))}
      </div>
      <div className="flex gap-2">
        <Button
          key={crossChainType.label}
          size="sm"
          variant="secondary"
          className={crossChainType.className}
          disabled
        >
          {crossChainType.icon}
          {crossChainType.label}
        </Button>
      </div>
    </div>
  )
}
