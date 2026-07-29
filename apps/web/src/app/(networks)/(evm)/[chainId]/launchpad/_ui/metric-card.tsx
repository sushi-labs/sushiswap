import type { ReactNode } from 'react'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'

export function MetricCard({
  label,
  value,
  detail,
}: {
  label: string
  value: ReactNode
  detail?: ReactNode
}) {
  return (
    <PerpsCard className="p-4" fullWidth>
      <div className="text-xs font-medium text-perps-muted-50">{label}</div>
      <div className="mt-1 text-xl font-semibold tracking-tight text-perps-muted">
        {value}
      </div>
      {detail ? (
        <div className="mt-1 text-xs text-perps-muted-50">{detail}</div>
      ) : null}
    </PerpsCard>
  )
}
