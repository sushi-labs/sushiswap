import { yupResolver } from '@hookform/resolvers/yup'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Form from 'app/components/Form'
import AuctionPaymentCurrencyField from 'app/features/miso/AuctionAdminForm/AuctionPaymentCurrencyField'
import { useStore } from 'app/features/miso/context/store'
import { generalDetailsDefaultValues, IGeneralDetails } from 'app/features/miso/context/store/createGeneralDetailsSlice'
import React, { FC, ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

export const generalDetailsSchema = yup.object().shape({
  paymentCurrencyAddress: yup.string().required('Must enter a payment currency'),
  startDate: yup
    .date()
    .typeError('Please enter a valid date')
    .min(new Date(), 'Start date may not be due already')
    .required('Must enter a valid date'),
  endDate: yup
    .date()
    .typeError('Please enter a valid date')
    .min(yup.ref('startDate'), 'Date must be later than start date')
    .required('Must enter a valid date'),
})

const GeneralDetailsStep: FC<{ children(isValid: boolean): ReactNode }> = ({ children }) => {
  const { i18n } = useLingui()
  const setGeneralDetails = useStore((state) => state.setGeneralDetails)
  const methods = useForm<IGeneralDetails>({
    defaultValues: generalDetailsDefaultValues,
    resolver: yupResolver(generalDetailsSchema),
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  const {
    formState: { isValid },
  } = methods

  return (
    <Form {...methods} onSubmit={methods.handleSubmit((data: IGeneralDetails) => setGeneralDetails(data))}>
      <Form.Fields>
        <div className="w-full md:w-1/2">
          <AuctionPaymentCurrencyField name="paymentCurrencyAddress" label={i18n._(t`Payment Currency*`)} />
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4">
          <Form.TextField
            className="inline-flex"
            type="datetime-local"
            name="startDate"
            label={i18n._(t`Start Date*`)}
            placeholder={i18n._(t`Selected a start date for your auction`)}
            helperText={i18n._(t`Please enter your auction start date`)}
          />
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4">
          <Form.TextField
            className="inline-flex"
            type="datetime-local"
            name="endDate"
            label={i18n._(t`End Date*`)}
            placeholder={i18n._(t`Selected an end date for your auction`)}
            helperText={i18n._(t`Please enter your auction end date`)}
          />
        </div>
        {children(isValid)}
      </Form.Fields>
    </Form>
  )
}

export default GeneralDetailsStep
