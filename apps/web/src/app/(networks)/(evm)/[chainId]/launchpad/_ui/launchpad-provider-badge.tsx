import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { classNames } from '@sushiswap/ui'
import { getLaunchpadProviderConfig } from '../_lib/launchpad-provider'
import type { LaunchpadProvider } from '../types'

export function LaunchpadProviderBadge({
  provider,
  className,
}: {
  provider: LaunchpadProvider
  className?: string
}) {
  const config = getLaunchpadProviderConfig(provider)
  const classes = classNames(
    'inline-flex h-6 items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.05] px-2 text-[10px] font-semibold uppercase tracking-wide text-perps-muted-50',
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
        {config.label}
        <ArrowTopRightOnSquareIcon className="h-3 w-3" />
      </a>
    )
  }

  return <span className={classes}>{config.label}</span>
}
