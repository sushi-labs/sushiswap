import { ChevronDownIcon, CreditCardIcon } from '@heroicons/react-v1/solid'
import { Button, classNames } from '@sushiswap/ui'

export const PayWithFiat = () => {
  //TODO: make this a menu trigger with options for different fiat payment methods
  return (
    <Button
      variant={'secondary'}
      type="button"
      className={classNames('!rounded-full md:overflow-hidden')}
    >
      <div className="flex items-center gap-0.5">
        <CreditCardIcon width={18} height={18} />
        Pay with Fiat
        <ChevronDownIcon width={16} height={16} />
      </div>
    </Button>
  )
}
