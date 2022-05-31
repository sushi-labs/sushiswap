import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Token } from '@sushiswap/core-sdk'
import Chip from 'app/components/Chip'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import { HeadlessUiModal } from 'app/components/Modal'
import Typography from 'app/components/Typography'
import { shortenAddress } from 'app/functions'
import React, { FC } from 'react'

interface ImportRow {
  token: Token
  onClick(x: any): void
}

const ImportRow: FC<ImportRow> = ({ token, onClick }) => {
  const { i18n } = useLingui()

  return (
    <HeadlessUiModal.BorderedContent className="border hover:border-gray-700 cursor-pointer" onClick={onClick}>
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full overflow-hidden border border-dark-700">
            <CurrencyLogo currency={token} size={48} />
          </div>
          <div className="flex flex-col">
            <div className="flex gap-2 items-center">
              <Typography variant="lg" weight={700} component="span" className="text-white">
                {token.symbol}{' '}
                <Typography variant="xs" component="span">
                  {token.name}
                </Typography>
              </Typography>

              <Chip color="yellow" size="sm" label={i18n._(t`Unknown Source`)}>
                {i18n._(t`Unknown Source`)}
              </Chip>
            </div>
            <Typography variant="xxs" weight={700}>
              {shortenAddress(token.address)}
            </Typography>
          </div>
        </div>
      </div>
    </HeadlessUiModal.BorderedContent>
  )
}

export default ImportRow
