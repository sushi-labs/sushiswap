import { classNames } from '@sushiswap/ui'

const sizeVariants = {
  sm: 'h-4 min-w-[16px] text-[10px] px-1',
  default: 'h-5 min-w-[20px] text-xs px-1.5',
}

export type NotificationBadgeSize = keyof typeof sizeVariants

export const NotificationBadge = ({
  notificationCount,
  className,
  size = 'default',
}: {
  notificationCount: number
  size?: NotificationBadgeSize
  className?: string
}) => {
  if (notificationCount === 0) return null

  const count = notificationCount > 99 ? '99+' : notificationCount

  return (
    <div
      className={classNames(
        'text-white rounded-full bg-blue flex items-center justify-center',
        sizeVariants[size],
        className ?? '',
      )}
    >
      {count}
    </div>
  )
}
