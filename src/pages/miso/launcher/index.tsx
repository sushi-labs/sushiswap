import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { Trans } from '@lingui/react'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums'
import LiquidityLauncherCreationForm from 'app/features/miso/LiquidityLauncherCreationForm'
import NetworkGuard from 'app/guards/Network'
import MisoLayout, { MisoBody, MisoHeader } from 'app/layouts/Miso'
import Link from 'next/link'
import React, { Fragment } from 'react'

const LiquidityLauncher = () => {
  const { i18n } = useLingui()

  const link = (
    <a
      href="https://instantmiso.gitbook.io/miso/dev/pool-liquidity-smart-contract/pool-liquidity-contract"
      target="_blank"
      rel="noreferrer"
      className="text-blue"
    >
      documentation
    </a>
  )

  return (
    <>
      <MisoHeader className="bg-miso-bowl bg-cover">
        <div className="flex flex-col gap-4">
          <div>
            <Button
              color="blue"
              size="sm"
              className="rounded-full !pl-2 !py-1.5"
              startIcon={<ChevronLeftIcon width={24} height={24} />}
            >
              <Link href={`/miso`}>{i18n._(t`All Auctions`)}</Link>
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <Typography variant="h2" className="text-high-emphesis" weight={700}>
              {i18n._(t`New Liquidity Launcher`)}
            </Typography>
            <Typography variant="sm" weight={400}>
              <Trans
                id="Create your own Liquidity Launcher at the LiquidityLauncher Factory. For details on all current LiquidityLauncher types, please visit our {link}"
                values={{ link }}
                components={Fragment}
              />
            </Typography>
          </div>
        </div>
      </MisoHeader>
      <MisoBody>
        <LiquidityLauncherCreationForm />
      </MisoBody>
    </>
  )
}

LiquidityLauncher.Layout = MisoLayout
LiquidityLauncher.Guard = NetworkGuard(Feature.MISO)

export default LiquidityLauncher
