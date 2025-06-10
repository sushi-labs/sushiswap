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
import { useContext, useEffect, useState } from 'react'
import { TradeModeContext } from '../trade-mode-buttons'

const OPTIONS = {
  debit: {
    label: 'Debit Card',
    icon: <CreditCardIcon width={18} height={18} />,
  },
  credit: {
    label: 'Credit Card',
    icon: <CreditCardIcon width={18} height={18} />,
  },
  'apple-pay': {
    label: 'Apple Pay',
    icon: <AppleIcon width={18} height={18} />,
  },
}

export const PayWithFiat = () => {
  const context = useContext(TradeModeContext)
  const [value, setValue] = useState<null | string>(null)
  const tradeMode = context.tradeMode

  const handleClick = (option: string) => {
    setValue(option)
    context.switchTradeMode('fiat')
  }

  useEffect(() => {
    if (tradeMode !== 'fiat') {
      setValue(null)
    }
  }, [tradeMode])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={'secondary'}
          type="button"
          className={classNames('!rounded-full md:overflow-hidden')}
        >
          <div className="flex items-center gap-0.5">
            {value === 'Apple Pay' ? (
              <AppleIcon width={18} height={18} />
            ) : (
              <CreditCardIcon width={18} height={18} />
            )}
            {value === null ? 'Pay with Fiat' : value}
            <ChevronDownIcon width={16} height={16} />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="overflow-y-auto hide-scrollbar !bg-slate-50 dark:!bg-slate-900 !backdrop-blur-none"
      >
        <DropdownMenuGroup className="font-medium min-w-[200px]">
          {Object.values(OPTIONS).map((i, idx) => (
            <DropdownMenuItem
              key={idx}
              onClick={() => handleClick(i.label)}
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
