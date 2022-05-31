import { t } from '@lingui/macro'
import { Trans, useLingui } from '@lingui/react'
import Form from 'app/components/Form'
import FormFieldHelperText from 'app/components/Form/FormFieldHelperText'
import AuctionPaymentCurrencyField from 'app/features/miso/AuctionAdminForm/AuctionPaymentCurrencyField'
import AuctionCreationFormTokenAmount from 'app/features/miso/AuctionCreationForm/AuctionCreationFormGeneralDetails/AuctionCreationFormTokenAmount'
import { AuctionTemplate } from 'app/features/miso/context/types'
import React, { FC, Fragment } from 'react'
import { useWatch } from 'react-hook-form'

import AuctionCreationFormBatchAuction from './AuctionCreationFormBatchAuction'
import AuctionCreationFormCrowdsale from './AuctionCreationFormCrowdsale'
import AuctionCreationFormDutchAuction from './AuctionCreationFormDutchAuction'

interface AuctionCreationFormGeneralDetailsProps {}

const AuctionCreationFormGeneralDetails: FC<AuctionCreationFormGeneralDetailsProps> = () => {
  const { i18n } = useLingui()
  const auctionType = useWatch({ name: 'auctionType' })

  let formSection
  if (auctionType === AuctionTemplate.DUTCH_AUCTION) {
    formSection = <AuctionCreationFormDutchAuction />
  }

  if (auctionType === AuctionTemplate.BATCH_AUCTION) {
    formSection = <AuctionCreationFormBatchAuction />
  }

  if (auctionType === AuctionTemplate.CROWDSALE) {
    formSection = <AuctionCreationFormCrowdsale />
  }

  if (!formSection) throw new Error('Template unknown')

  const link = (
    <a href={'/miso/token'} className="text-blue underline">
      {i18n._(t`Create it now`)}
    </a>
  )

  const link2 = (
    <a href={'/miso/pointlist'} target="_blank" className="text-blue underline" rel="noreferrer">
      {i18n._(t`Create it now`)}
    </a>
  )

  return (
    <>
      <Form.Section
        columns={4}
        className="pt-8"
        header={
          <Form.Section.Header
            header={i18n._(t`General Details`)}
            subheader={i18n._(t`Set up required auction parameters`)}
          />
        }
      >
        <div className="col-span-4 lg:col-span-2">
          <Form.TextField
            name="token"
            label={i18n._(t`Token*`)}
            helperText={
              <FormFieldHelperText>
                <Trans id="Don’t have a token? {link}" values={{ link }} components={Fragment} />
              </FormFieldHelperText>
            }
            placeholder={i18n._(t`Search by symbol or Enter the address of the token you would like to auction.`)}
          />
        </div>
        <AuctionCreationFormTokenAmount />
        <div className="col-span-4">
          <AuctionPaymentCurrencyField name="paymentCurrencyAddress" label={i18n._(t`Auction Payment Currency*`)} />
        </div>
        <div className="col-span-4 md:col-span-2 xl:col-span-1">
          <Form.TextField
            className="inline-flex"
            type="datetime-local"
            name="startDate"
            label={i18n._(t`Start Date*`)}
            placeholder={i18n._(t`Selected a start date for your auction`)}
            helperText={i18n._(t`Please enter your auction start date`)}
          />
        </div>
        <div className="col-span-4 md:col-span-2 xl:col-span-1">
          <Form.TextField
            className="inline-flex"
            type="datetime-local"
            name="endDate"
            label={i18n._(t`End Date*`)}
            placeholder={i18n._(t`Selected an end date for your auction`)}
            helperText={i18n._(t`Please enter your auction end date`)}
          />
        </div>
        <div className="col-span-4">
          <Form.TextField
            className="inline-flex"
            name="pointListAddress"
            label={i18n._(t`Permission List`)}
            placeholder={i18n._(t`Address of permission list`)}
            helperText={
              <FormFieldHelperText>
                <Trans
                  id="Permission lists are used to whitelist addresses. Don't have a permission list? {link2}"
                  values={{ link2 }}
                  components={Fragment}
                />
              </FormFieldHelperText>
            }
          />
        </div>
      </Form.Section>
      {formSection}
    </>
  )
}

export default AuctionCreationFormGeneralDetails
