import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums'
import { SelectPoolsAndConfirm } from 'app/features/trident/migrate/SelectPoolsAndConfirm'
import NetworkGuard from 'app/guards/Network'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

const ConfirmMigration = () => {
  const { i18n } = useLingui()
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{i18n._(t`Confirm Migration | Sushi`)}</title>
      </Head>
      <TridentHeader pattern="bg-binary" className="!gap-2">
        <div>
          <Button
            color="blue"
            variant="outlined"
            size="xs"
            onClick={() => router.replace('/trident/migrate')}
            className="flex-none h-6 pl-0 pr-3 rounded-full"
            startIcon={<ChevronLeftIcon width={24} height={24} />}
          >
            {i18n._(t`Go Back`)}
          </Button>
        </div>
        <Typography variant="h2" className="text-high-emphesis" weight={700}>
          {i18n._(t`Select Pools & Confirm`)}
        </Typography>
        <div className="max-w-2xl">
          <Typography variant="sm" className="mt-4" weight={400}>
            {i18n._(t`Select which pool configuration you want to migrate to.`)}
          </Typography>
        </div>
      </TridentHeader>
      <TridentBody className="mb-14">
        <SelectPoolsAndConfirm />
      </TridentBody>
    </>
  )
}

ConfirmMigration.Guard = NetworkGuard(Feature.TRIDENT)
ConfirmMigration.Layout = TridentLayout

export default ConfirmMigration
