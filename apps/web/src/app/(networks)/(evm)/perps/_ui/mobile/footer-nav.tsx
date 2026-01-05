import { UserIcon } from '@heroicons/react-v1/outline'
import { ChartBarIcon } from '@heroicons/react-v1/solid'
import { Button, classNames } from '@sushiswap/ui'
import type { PerpsMobileViewType } from './mobile-layout'

const OPTIONS = [
  {
    value: 'markets' as const,
    text: 'Markets',
    icon: <ChartBarIcon className="h-4 w-4" />,
  },
  {
    value: 'trade' as const,
    text: 'Trade',
    icon: <ChartBarIcon className="h-4 w-4" />,
  },
  {
    value: 'account' as const,
    text: 'Account',
    icon: <UserIcon className="h-3 w-3" />,
  },
]

export const FooterNav = ({
  view,
  setView,
}: {
  view: PerpsMobileViewType
  setView: (view: PerpsMobileViewType) => void
}) => {
  return (
    <div className="fixed bottom-0 w-full p-1 gap-1 left-0 bg-background border-gray-200 dark:border-slate-800 border-t flex items-center">
      {OPTIONS.map((option) => (
        <Button
          onClick={() => setView(option.value)}
          key={option.value}
          variant="ghost"
          size="lg"
          className={classNames(
            'flex !items-center justify-center w-full !gap-1 focus:!bg-transparent',
            view === option.value && 'text-blue',
          )}
        >
          {option.icon}
          <span className="text-xs mt-1">{option.text}</span>
        </Button>
      ))}
    </div>
  )
}
