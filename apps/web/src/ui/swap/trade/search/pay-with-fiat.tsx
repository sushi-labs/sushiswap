import { ChevronDownIcon, CreditCardIcon } from '@heroicons/react-v1/solid'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  classNames,
} from '@sushiswap/ui'
import { AppleIcon } from '@sushiswap/ui/icons/AppleIcon'
import { type ReactNode, useContext, useEffect } from 'react'
import {
  type FiatPaymentType,
  useDerivedStateFiat,
} from '../../fiat/derivedstate-fiat-provider'
import { TradeModeContext } from '../trade-mode-buttons'

const OPTIONS: {
  label: string
  icon: ReactNode
  paymentType: FiatPaymentType
}[] = [
  {
    label: 'Debit Card',
    icon: <CreditCardIcon width={18} height={18} />,
    paymentType: 'debit',
  },
  {
    label: 'Credit Card',
    icon: <CreditCardIcon width={18} height={18} />,
    paymentType: 'credit',
  },
  {
    label: 'Apple Pay',
    icon: <AppleIcon width={18} height={18} />,
    paymentType: 'apple-pay',
  },
]

export const PayWithFiat = () => {
  const context = useContext(TradeModeContext)
  const tradeMode = context.tradeMode
  const {
    state: { paymentType },
    mutate: { setPaymentType },
  } = useDerivedStateFiat()

  const handleClick = (option: FiatPaymentType) => {
    setPaymentType(option)
    context.switchTradeMode('fiat')
  }

  useEffect(() => {
    if (tradeMode !== 'fiat') {
      setPaymentType(null)
    }
  }, [tradeMode, setPaymentType])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={'secondary'}
          type="button"
          className={classNames('!rounded-full md:overflow-hidden')}
        >
          <div className="flex items-center gap-0.5">
            {paymentType === 'apple-pay' ? (
              <AppleIcon width={18} height={18} />
            ) : (
              <CreditCardIcon width={18} height={18} />
            )}
            {paymentType === null
              ? 'Pay with Fiat'
              : OPTIONS.find((i) => i.paymentType === paymentType)?.label}
            <ChevronDownIcon width={16} height={16} />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="overflow-y-auto hide-scrollbar !bg-slate-50 dark:!bg-slate-900 !backdrop-blur-none"
      >
        <DropdownMenuGroup className="font-medium min-w-[200px]">
          {OPTIONS.map((i, idx) => (
            <DropdownMenuItem
              key={idx}
              onClick={() => handleClick(i.paymentType)}
              className="flex items-center gap-2"
            >
              {i.icon}
              {i.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
