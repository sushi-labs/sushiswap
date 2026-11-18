import { classNames } from '@sushiswap/ui'
import type { ComponentProps, JSX } from 'react'
import { SushiSwapProtocol } from 'sushi/evm'

const protocols: Record<
  SushiSwapProtocol,
  { label: string; className: string }
> = {
  [SushiSwapProtocol.SUSHISWAP_V2]: {
    label: 'V2',
    className: 'bg-pink/20 text-pink',
  },
  [SushiSwapProtocol.SUSHISWAP_V3]: {
    label: 'V3',
    className: 'bg-blue/20 text-blue',
  },
  [SushiSwapProtocol.SUSHISWAP_V4]: {
    label: 'V4',
    className: 'bg-purple-500/20 text-purple-500',
  },
  [SushiSwapProtocol.BLADE]: {
    label: 'BLADE',
    className: 'bg-blue/20 text-blue',
  },
}

type ProtocolBadgeProps = ComponentProps<'div'> & {
  protocol: SushiSwapProtocol
  size?: 'default' | 'lg'
}

function renderProtocolBadge({
  protocol,
  size = 'default',
  className,
  ...props
}: ProtocolBadgeProps): JSX.Element {
  const badge = protocols[protocol]

  return (
    <div
      {...props}
      className={classNames(
        'whitespace-nowrap rounded-full',
        badge.className,
        size === 'lg'
          ? 'text-sm px-2 py-1 font-semibold mt-0.5'
          : 'text-[10px] px-2',
        className,
      )}
    >
      {badge.label}
    </div>
  )
}

function ProtocolBadgeComponent(props: ProtocolBadgeProps): JSX.Element {
  return renderProtocolBadge(props)
}

export const ProtocolBadge = Object.assign(ProtocolBadgeComponent, {
  [SushiSwapProtocol.SUSHISWAP_V2]: renderProtocolBadge({
    protocol: SushiSwapProtocol.SUSHISWAP_V2,
  }),
  [SushiSwapProtocol.SUSHISWAP_V3]: renderProtocolBadge({
    protocol: SushiSwapProtocol.SUSHISWAP_V3,
  }),
  [SushiSwapProtocol.SUSHISWAP_V4]: renderProtocolBadge({
    protocol: SushiSwapProtocol.SUSHISWAP_V4,
  }),
  [SushiSwapProtocol.BLADE]: renderProtocolBadge({
    protocol: SushiSwapProtocol.BLADE,
  }),
})
