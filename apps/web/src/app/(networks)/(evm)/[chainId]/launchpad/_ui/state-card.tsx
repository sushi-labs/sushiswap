import { Container, classNames } from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'

interface StateContentProps {
  icon?: ReactNode
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  children?: ReactNode
  titleClassName?: string
  descriptionClassName?: string
}

function StateContent({
  icon,
  title,
  description,
  action,
  children,
  titleClassName,
  descriptionClassName,
}: StateContentProps) {
  if (children) return children

  return (
    <div>
      {icon}
      {title ? (
        <h2
          className={classNames(
            Boolean(icon) && 'mt-4',
            'font-semibold text-perps-muted',
            titleClassName,
          )}
        >
          {title}
        </h2>
      ) : null}
      {description ? (
        <p
          className={classNames(
            Boolean(title) && 'mt-1',
            'text-sm leading-6 text-perps-muted-50',
            descriptionClassName,
          )}
        >
          {description}
        </p>
      ) : null}
      {action ? <div className={title ? 'mt-5' : 'mt-4'}>{action}</div> : null}
    </div>
  )
}

export function CollectionStateCard({
  className,
  size = 'default',
  ...contentProps
}: StateContentProps & {
  className?: string
  size?: 'compact' | 'default' | 'large'
}) {
  return (
    <PerpsCard
      className={classNames(
        'grid place-items-center text-center',
        size === 'compact' ? 'p-6' : 'p-8',
        size === 'default' && 'min-h-64',
        size === 'large' && 'min-h-72',
        className,
      )}
      fullWidth
    >
      <StateContent {...contentProps} />
    </PerpsCard>
  )
}

export function PageState({
  className,
  ...contentProps
}: StateContentProps & { className?: string }) {
  return (
    <Container maxWidth="lg" className="w-full px-4 py-20">
      <PerpsCard className={classNames('p-8 text-center', className)} fullWidth>
        <StateContent titleClassName="text-2xl" {...contentProps} />
      </PerpsCard>
    </Container>
  )
}
