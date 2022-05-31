import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { Trans } from '@lingui/react'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums'
import TokenCreationForm from 'app/features/miso/TokenCreationForm'
import NetworkGuard from 'app/guards/Network'
import MisoLayout, { MisoBody, MisoHeader } from 'app/layouts/Miso'
import Link from 'next/link'
import React, { Fragment } from 'react'

const Token = () => {
  const { i18n } = useLingui()

  const link = (
    <a href="https://instantmiso.gitbook.io/miso/tokens" target="_blank" rel="noreferrer" className="text-blue">
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
              {i18n._(t`New Token`)}
            </Typography>
            <Typography variant="sm" weight={400}>
              <Trans
                id="Create your own Token at the Token Factory. For details on all current Token types, please visit our {link}"
                values={{ link }}
                components={Fragment}
              />
            </Typography>
          </div>
        </div>
      </MisoHeader>
      <MisoBody>
        <TokenCreationForm />
      </MisoBody>
    </>
  )
}

Token.Layout = MisoLayout
Token.Guard = NetworkGuard(Feature.MISO)

export default Token
