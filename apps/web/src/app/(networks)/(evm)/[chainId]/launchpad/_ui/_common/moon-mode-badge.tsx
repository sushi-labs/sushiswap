import { classNames } from '@sushiswap/ui'
import { Rocket } from 'lucide-react'

export const MoonModeBadge = ({
  size = 'default',
}: { size?: 'default' | 'sm' }) => {
  return (
    <div
      className={classNames(
        'bg-pink/80 ',
        size === 'default' ? 'p-1 rounded-md' : 'p-0.5 rounded',
      )}
      title="Moon Mode"
    >
      <Rocket
        className={classNames(size === 'default' ? 'h-4 w-4' : 'h-3 w-3')}
        aria-hidden="true"
      />
    </div>
  )
}
