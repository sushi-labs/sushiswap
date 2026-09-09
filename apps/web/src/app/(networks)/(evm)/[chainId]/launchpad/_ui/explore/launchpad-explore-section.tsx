import { Container } from '@sushiswap/ui'
import type { ReactElement, ReactNode } from 'react'

export function LaunchpadExploreSection({
  controls,
  children,
}: {
  controls: ReactNode
  children: ReactNode
}): ReactElement {
  return (
    <section id="discover">
      <Container maxWidth="8xl" className="w-full px-4 sm:px-8">
        <div className="bg-[#151A20] rounded-2xl border border-white/[0.07] px-4 py-5 sm:p-8">
          {controls}
          <div className="mt-6">{children}</div>
        </div>
      </Container>
    </section>
  )
}
