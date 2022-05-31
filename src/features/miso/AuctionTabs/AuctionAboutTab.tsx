import { MinusSmIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { Auction } from 'app/features/miso/context/Auction'
import { getCountryName } from 'app/features/miso/context/utils'
import { classNames } from 'app/functions'
import { FC } from 'react'

interface AuctionAboutTabProps {
  auction: Auction
  active: boolean
}

const AuctionAboutTab: FC<AuctionAboutTabProps> = ({ auction, active }) => {
  const { i18n } = useLingui()
  const documents = auction.auctionDocuments

  return (
    <div className={classNames(active ? 'flex' : 'hidden', 'flex-col gap-8')}>
      <Typography weight={700}>{documents?.description}</Typography>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          {documents?.bannedCountries && (
            <Typography weight={700} variant="sm" className="text-high-emphesis italic">
              {i18n._(t`The following countries are banned from participation`)}
            </Typography>
          )}
          {documents?.bannedCountries?.split(',').map((el, index) => (
            <div className="flex gap-0.5 items-center" key={index}>
              <MinusSmIcon width={10} />
              <Typography variant="xs" className="italic">
                {getCountryName(el)}
              </Typography>
            </div>
          ))}
        </div>
        {documents?.bannedWarning && (
          <Typography variant="xs" className="italic">
            {documents.bannedWarning}
          </Typography>
        )}
      </div>
    </div>
  )
}

export default AuctionAboutTab
