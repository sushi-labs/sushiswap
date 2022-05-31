import { RadioGroup } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Form from 'app/components/Form'
import { BatchAuctionIcon, CrowdsaleIcon, DutchAuctionIcon } from 'app/components/Icon'
import Typography from 'app/components/Typography'
import useAuctionTemplateMap from 'app/features/miso/context/hooks/useAuctionTemplateMap'
import { AuctionTemplate } from 'app/features/miso/context/types'
import { classNames } from 'app/functions'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

interface AuctionCreationFormTypeSelectorProps {}

const AuctionCreationFormTypeSelector: FC<AuctionCreationFormTypeSelectorProps> = ({}) => {
  const { watch, setValue } = useFormContext()
  const auctionType = watch('auctionType')
  const { i18n } = useLingui()
  const { templateIdToLabel } = useAuctionTemplateMap()

  const items = [
    {
      icon: <DutchAuctionIcon height={83} width={83} />,
      value: AuctionTemplate.DUTCH_AUCTION,
      label: templateIdToLabel(AuctionTemplate.DUTCH_AUCTION),
      description: i18n._(
        t`The price is set at a higher value per token than expected and descends linearly over time.`
      ),
      note: i18n._(t`Great for a completely novel item’s true price discovery`),
    },
    {
      icon: <CrowdsaleIcon height={83} width={83} />,
      value: AuctionTemplate.CROWDSALE,
      label: templateIdToLabel(AuctionTemplate.CROWDSALE),
      description: i18n._(
        t`A set amount of tokens are divided amongst all the contributors to the Market event, weighted according to their contribution to the pool.`
      ),
      note: i18n._(t`Great for projects looking to ensure that everyone taking part is rewarded`),
    },
    {
      icon: <BatchAuctionIcon height={83} width={83} />,
      value: AuctionTemplate.BATCH_AUCTION,
      label: templateIdToLabel(AuctionTemplate.BATCH_AUCTION),
      description: i18n._(t`A fixed price and a fixed set of tokens.`),
      note: i18n._(t`Great when the token price is already known or has been decided on previously`),
    },
  ]

  return (
    <Form.Section
      columns={6}
      header={
        <Form.Section.Header
          header={i18n._(t`Select Auction Type`)}
          subheader={i18n._(t`Decide on the type of auction`)}
        />
      }
    >
      <div className="col-span-6">
        <RadioGroup
          value={auctionType}
          onChange={(auctionType) => setValue('auctionType', auctionType)}
          className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10"
        >
          <input className="hidden" name="auctionType" value={auctionType} onChange={() => {}} />
          {items.map(({ icon, value, label, description, note }) => (
            <RadioGroup.Option value={value} key={value}>
              {({ checked }) => (
                <div
                  className={classNames(
                    checked ? 'bg-dark-1000/40' : 'bg-dark-900',
                    'flex flex-col gap-4 border border-dark-800 p-5 rounded h-full cursor-pointer'
                  )}
                >
                  <Typography variant="lg" weight={700} className="text-high-emphesis">
                    {label}
                  </Typography>
                  {icon}
                  <Typography className="text-high-emphesis">{description}</Typography>
                  <div className="flex items-baseline gap-1">
                    <InformationCircleIcon width={20} height={20} className="top-1 relative" />
                    <Typography className="text-secondary italic">{note}</Typography>
                  </div>
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      </div>
    </Form.Section>
  )
}

export default AuctionCreationFormTypeSelector
