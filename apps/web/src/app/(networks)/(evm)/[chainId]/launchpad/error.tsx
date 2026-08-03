'use client'

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Button } from '@sushiswap/ui'
import { PageState } from './_ui/state-card'

export default function LaunchpadError({ reset }: { reset: () => void }) {
  return (
    <PageState
      icon={
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red/10 text-red">
          <ExclamationTriangleIcon className="h-6 w-6" />
        </span>
      }
      title="Launchpad couldn't load"
      description={
        <>
          Your other Sushi tools are unaffected. Try this page again when
          you&apos;re ready.
        </>
      }
      descriptionClassName="mx-auto max-w-md"
      action={
        <Button variant="perps-default" onClick={reset}>
          Try again
        </Button>
      }
    />
  )
}
