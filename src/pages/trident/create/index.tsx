import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums'
import { CreateOracleOption } from 'app/features/trident/create/CreateOracleOption'
import { CreatePoolReviewModal } from 'app/features/trident/create/CreatePoolReviewModal'
import { SelectAssetsWidget } from 'app/features/trident/create/SelectAssetsWidget'
import { SelectFeeTier } from 'app/features/trident/create/SelectFeeTier'
import { SelectionContinueButton } from 'app/features/trident/create/SelectionContinueButton'
import NetworkGuard from 'app/guards/Network'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import Link from 'next/link'
import React from 'react'

const CreateNewPool = () => {
  const { i18n } = useLingui()

  return (
    <>
      <TridentHeader pattern="bg-chevron">
        <div className="flex flex-col gap-3 lg:w-8/12 lg:gap-5 lg:pr-6 h-[68px] lg:h-auto">
          <div>
            <Button
              color="blue"
              variant="outlined"
              size="sm"
              className="rounded-full !pl-2 !py-1.5"
              startIcon={<ChevronLeftIcon width={24} height={24} />}
            >
              <Link href={'/trident/pools'}>{i18n._(t`Pools`)}</Link>
            </Button>
          </div>
          <div className="hidden lg:block">
            <Typography variant="h2" className="text-high-emphesis" weight={700}>
              {i18n._(t`Create Liquidity Pool`)}
            </Typography>
            <Typography variant="sm" weight={400}>
              {i18n._(t`Select a pool type, deposit assets, and create your pool on Sushi.`)}
            </Typography>
          </div>
        </div>
      </TridentHeader>
      <TridentBody>
        <SelectAssetsWidget />
        <SelectFeeTier />
        <CreateOracleOption />
        <SelectionContinueButton />
        <CreatePoolReviewModal />
      </TridentBody>
    </>
  )
}

CreateNewPool.Guard = NetworkGuard(Feature.TRIDENT)
CreateNewPool.Layout = TridentLayout

export default CreateNewPool
