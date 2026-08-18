import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import type { DetailListItem } from '../_ui/detail-list'
import { DetailList } from '../_ui/detail-list'

export interface LaunchDetailSection {
  title?: string
  items: readonly DetailListItem[]
  note?: string
}

export function LaunchDetailsCard({
  title = 'Launch details',
  sections,
}: {
  title?: string
  sections: readonly LaunchDetailSection[]
}) {
  return (
    <PerpsCard className="p-4" fullWidth>
      <h2 className="font-semibold text-perps-muted">{title}</h2>
      <div className="mt-3 divide-y divide-white/[0.06]">
        {sections.map((section, index) => (
          <section
            key={section.title ?? index}
            className="py-3 first:pt-0 last:pb-0"
          >
            {section.title ? (
              <h3 className="mb-1 text-[11px] font-medium uppercase tracking-wide text-perps-muted-50">
                {section.title}
              </h3>
            ) : null}
            <DetailList
              variant="compact"
              valueClassName="max-w-[68%]"
              items={section.items}
            />
            {section.note ? (
              <p className="mt-2 text-xs leading-5 text-perps-muted-50">
                {section.note}
              </p>
            ) : null}
          </section>
        ))}
      </div>
    </PerpsCard>
  )
}
