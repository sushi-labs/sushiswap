import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE } from '@sushiswap/core-sdk'
import Form from 'app/components/Form'
import FormFieldHelperText from 'app/components/Form/FormFieldHelperText'
import Typography from 'app/components/Typography'
import { AuctionCreationFormInput } from 'app/features/miso/AuctionCreationForm'
import { useToken } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

interface AuctionCreationFormBatchAuctionProps {}

const AuctionCreationFormBatchAuction: FC<AuctionCreationFormBatchAuctionProps> = ({}) => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { watch } = useFormContext<AuctionCreationFormInput>()
  const data = watch()
  // @ts-ignore TYPE NEEDS FIXING
  const paymentToken = useToken(data.paymentCurrencyAddress) ?? NATIVE[chainId || 1]

  return (
    <Form.Section
      columns={4}
      className="pt-8"
      header={<Form.Section.Header header={i18n._(t`Batch Auction Details`)} />}
    >
      <div className="col-span-4 md:col-span-2">
        <Form.TextField
          {...(paymentToken && {
            endIcon: (
              <Typography variant="sm" weight={700} className="text-secondary">
                {paymentToken.symbol}
              </Typography>
            ),
          })}
          name="minimumRaised"
          label={i18n._(t`Minimum Raised Amount*`)}
          placeholder="0.00"
          helperText={i18n._(t`Minimum amount to raise in order to have a successful auction`)}
        />
      </div>
      <div className="col-span-4">
        <Typography weight={700}>{i18n._(t`Minimum Raised`)}</Typography>
        <Typography className="mt-2">
          {data.minimumRaised ? data.minimumRaised : '0.00'} {paymentToken?.symbol}{' '}
        </Typography>
        <FormFieldHelperText>
          {i18n._(
            t`Minimum amount in order to have a successful auction. If this value is not met, users can withdraw their committed payment token and no tokens will be sold`
          )}
        </FormFieldHelperText>
      </div>
    </Form.Section>
  )
}

export default AuctionCreationFormBatchAuction
