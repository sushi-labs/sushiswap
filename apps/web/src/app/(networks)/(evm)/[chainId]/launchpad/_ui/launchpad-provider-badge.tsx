import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { classNames } from '@sushiswap/ui'
import { getLaunchpadProviderConfig } from '../_lib/launchpad-provider'
import type { LaunchpadProvider } from '../types'
import { LaunchpadProviderMark } from './launchpad-provider-mark'

export function LaunchpadProviderBadge({
  provider,
  variant = 'chip',
  className,
}: {
  provider: LaunchpadProvider
  variant?: 'chip' | 'mark'
  className?: string
}) {
  const config = getLaunchpadProviderConfig(provider)

  if (variant === 'mark') {
    return (
      <span
        title={`Launched on ${config.label}`}
        className={classNames(
          'grid h-6 w-6 place-items-center rounded-full bg-perps-background ring-1 ring-inset ring-white/[0.14]',
          className,
        )}
      >
        <LaunchpadProviderMark provider={provider} size="sm" />
        <span className="sr-only">Launched on {config.label}</span>
      </span>
    )
  }

  const classes = classNames(
    'inline-flex h-7 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.05] pl-1.5 pr-2.5 text-xs font-medium text-perps-muted',
    config.websiteUrl && 'relative z-10',
    config.websiteUrl &&
      'transition hover:border-perps-blue/30 hover:bg-perps-blue/10 hover:text-perps-blue',
    className,
  )

  if (config.websiteUrl) {
    return (
      <a
        href={config.websiteUrl}
        target="_blank"
        rel="noreferrer"
        className={classes}
        aria-label={`Visit ${config.label}`}
      >
        <LaunchpadProviderMark provider={provider} size="sm" />
        {config.label}
        <ArrowTopRightOnSquareIcon aria-hidden className="h-3 w-3" />
      </a>
    )
  }

  return (
    <span className={classes}>
      <LaunchpadProviderMark provider={provider} size="sm" />
      {config.label}
    </span>
  )
}
