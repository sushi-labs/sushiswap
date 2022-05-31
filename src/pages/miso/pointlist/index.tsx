import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums'
import PointlistCreationForm from 'app/features/miso/PointlistCreationForm'
import NetworkGuard from 'app/guards/Network'
import MisoLayout, { MisoBody, MisoHeader } from 'app/layouts/Miso'
import Link from 'next/link'
import React from 'react'

const Pointlist = () => {
  const { i18n } = useLingui()

  return (
    <>
      <MisoHeader className="bg-miso-bowl bg-cover">
        <div className="flex flex-col gap-4">
          <div>
            <Button
              color="blue"
              variant="filled"
              size="sm"
              className="!rounded-full"
              startIcon={<ChevronLeftIcon width={24} height={24} />}
            >
              <Link href={`/miso`}>{i18n._(t`All Auctions`)}</Link>
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <Typography variant="h2" className="text-high-emphesis" weight={700}>
              {i18n._(t`New Permission List`)}
            </Typography>
            <Typography variant="sm" weight={400}>
              {i18n._(t`Create a new permission list you can use to whitelist addresses.`)}
            </Typography>
          </div>
        </div>
      </MisoHeader>
      <MisoBody>
        <PointlistCreationForm />
      </MisoBody>
    </>
  )
}

Pointlist.Layout = MisoLayout
Pointlist.Guard = NetworkGuard(Feature.MISO)

export default Pointlist
