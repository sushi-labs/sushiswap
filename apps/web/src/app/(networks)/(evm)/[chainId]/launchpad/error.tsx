'use client'

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Button, Container } from '@sushiswap/ui'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'

export default function LaunchpadError({ reset }: { reset: () => void }) {
  return (
    <Container maxWidth="lg" className="w-full px-4 py-20">
      <PerpsCard className="p-8 text-center" fullWidth>
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red/10 text-red">
          <ExclamationTriangleIcon className="h-6 w-6" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold text-perps-muted">
          Launchpad couldn&apos;t load
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-perps-muted-50">
          Your other Sushi tools are unaffected. Try this page again when
          you&apos;re ready.
        </p>
        <Button variant="perps-default" className="mt-6" onClick={reset}>
          Try again
        </Button>
      </PerpsCard>
    </Container>
  )
}
