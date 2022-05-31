import { yupResolver } from '@hookform/resolvers/yup'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import Form from 'app/components/Form'
import WhitelistChecker from 'app/features/miso/AuctionAdminForm/AuctionAdminFormWhitelistSection/WhitelistChecker'
import AuctionPaymentCurrencyField from 'app/features/miso/AuctionAdminForm/AuctionPaymentCurrencyField'
import { WhitelistEntry } from 'app/features/miso/context/types'
import PointlistCreationReviewModal from 'app/features/miso/PointlistCreationForm/PointlistCreationReviewModal'
import WhitelistUpload from 'app/features/miso/WhitelistUpload'
import { addressValidator } from 'app/functions/yupValidators'
import { useToken } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

export interface PointListFormInputs {
  paymentTokenAddress: string
  wlAddresses: WhitelistEntry[]
}

const schema = yup.object({
  paymentTokenAddress: addressValidator.required(
    'Permission list must have a payment token address for decimals calculation'
  ),
})

const PointlistCreationFormSetup: FC = () => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const [open, setOpen] = useState<boolean>(false)

  const methods = useForm<PointListFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      paymentTokenAddress: '',
      wlAddresses: [],
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const {
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = methods

  const data = watch()
  // @ts-ignore TYPE NEEDS FIXING
  const token = useToken(data.paymentTokenAddress) ?? NATIVE[chainId || 1]

  const onSubmit = () => setOpen(true)

  if (!account) return <></>

  return (
    <>
      <Form {...methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <Form.Card>
          <Form.Section columns={6} header={<Form.Section.Header header={i18n._(t`General Details`)} />}>
            <div className="col-span-6">
              <AuctionPaymentCurrencyField name="paymentTokenAddress" label={i18n._(t`Auction Payment Currency*`)} />
            </div>
            <WhitelistUpload
              value={getValues('wlAddresses')}
              disabled={false}
              onChange={(param) =>
                typeof param === 'function'
                  ? setValue('wlAddresses', param(getValues('wlAddresses')))
                  : setValue('wlAddresses', param)
              }
            />
            <div className="flex justify-end col-span-6">
              <div>
                <Button disabled={Object.keys(errors).length > 0} color="blue" type="submit">
                  {i18n._(t`Review`)}
                </Button>
              </div>
            </div>
          </Form.Section>
          <Form.Section header={<></>}>
            <div className="col-span-6">
              <WhitelistChecker paymentToken={token} />
            </div>
          </Form.Section>
        </Form.Card>
      </Form>
      <PointlistCreationReviewModal open={open} onDismiss={() => setOpen(false)} data={data} />
    </>
  )
}

export default PointlistCreationFormSetup
