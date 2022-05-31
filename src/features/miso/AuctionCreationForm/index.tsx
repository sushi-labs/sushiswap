import { yupResolver } from '@hookform/resolvers/yup'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, NATIVE, Price, Token } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import Form from 'app/components/Form'
import AuctionCreationFormGeneralDetails from 'app/features/miso/AuctionCreationForm/AuctionCreationFormGeneralDetails'
import AuctionCreationFormTypeSelector from 'app/features/miso/AuctionCreationForm/AuctionCreationFormTypeSelector'
import AuctionCreationReviewModal from 'app/features/miso/AuctionCreationForm/AuctionCreationReviewModal'
import { formatCreationFormData } from 'app/features/miso/AuctionCreationForm/utils'
import { AuctionTemplate } from 'app/features/miso/context/types'
import { addressValidator } from 'app/functions/yupValidators'
import { useToken } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

export interface AuctionCreationFormInput {
  auctionType: AuctionTemplate
  token?: string
  tokenAmount?: number
  paymentCurrencyAddress?: string
  fundWallet?: string
  fixedPrice?: number
  minimumTarget?: number
  minimumRaised?: number
  startPrice?: number
  endPrice?: number
  startDate?: string
  endDate?: string
  operator?: string
  pointListAddress?: string
}

export interface AuctionCreationFormInputValidated {
  auctionType: AuctionTemplate
  token: string
  tokenAmount: number
  paymentCurrencyAddress: string
  fixedPrice?: number
  minimumTarget?: number
  minimumRaised?: number
  startPrice?: number
  endPrice?: number
  startDate: string
  endDate: string
  pointListAddress: string
}

export interface AuctionCreationFormInputFormatted {
  auctionType: AuctionTemplate
  auctionToken: Token
  tokenAmount: CurrencyAmount<Token>
  paymentCurrency: Currency
  fixedPrice?: Price<Token, Currency>
  minimumTarget?: CurrencyAmount<Currency>
  minimumRaised?: CurrencyAmount<Currency>
  startPrice?: Price<Token, Currency>
  endPrice?: Price<Token, Currency>
  startDate: Date
  endDate: Date
  pointListAddress: string
}

const schema = yup.object().shape({
  auctionType: yup.number().required('Must select an auction type'),
  token: addressValidator.required('Must enter a valid ERC-20 address'),
  pointListAddress: addressValidator.nullable().notRequired(),
  tokenAmount: yup
    .number()
    .typeError('Amount must be a number')
    .moreThan(0, 'Token amount must be greater than zero')
    .required('Must enter a valid number'),
  paymentCurrencyAddress: addressValidator.required('Must enter a valid address'),
  fixedPrice: yup.number().when('auctionType', {
    // @ts-ignore TYPE NEEDS FIXING
    is: (value) => value === AuctionTemplate.CROWDSALE,
    then: yup.number().typeError('Price must be a number').required('Must enter a fixed price'),
  }),
  minimumTarget: yup.number().when('auctionType', {
    // @ts-ignore TYPE NEEDS FIXING
    is: (value) => value === AuctionTemplate.CROWDSALE,
    then: yup
      .number()
      .typeError('Target must be a number')
      .min(0, 'Must be greater than zero')
      .max(100, 'Can be at most 100%'),
  }),
  minimumRaised: yup.number().when('auctionType', {
    // @ts-ignore TYPE NEEDS FIXING
    is: (value) => value === AuctionTemplate.BATCH_AUCTION,
    then: yup.number().typeError('Target must be a number').min(0, 'Must be greater than zero'),
  }),
  startPrice: yup.number().when('auctionType', {
    // @ts-ignore TYPE NEEDS FIXING
    is: (value) => value === AuctionTemplate.DUTCH_AUCTION,
    then: yup.number().typeError('Price must be a number').required('Must enter a start price'),
  }),
  endPrice: yup.number().when('auctionType', {
    // @ts-ignore TYPE NEEDS FIXING
    is: (value) => value === AuctionTemplate.DUTCH_AUCTION,
    then: yup
      .number()
      .typeError('Price must be a number')
      .lessThan(yup.ref('startPrice'), 'End price must be less than start price')
      .required('Must enter a start price'),
  }),
  startDate: yup.date().min(new Date(), 'Start date may not be due already').required('Must enter a valid date'),
  endDate: yup
    .date()
    .min(yup.ref('startDate'), 'Date must be later than start date')
    .required('Must enter a valid date'),
})

const AuctionCreationForm: FC = () => {
  const { query } = useRouter()
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const [open, setOpen] = useState<boolean>(false)
  const methods = useForm<AuctionCreationFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      auctionType: AuctionTemplate.DUTCH_AUCTION,
      ...(query.token &&
        typeof query.token === 'string' && {
          token: query.token,
        }),
      ...(query.pointListAddress &&
        typeof query.pointListAddress === 'string' && {
          pointListAddress: query.pointListAddress,
        }),
    },
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  const {
    watch,
    formState: { isValid, isValidating },
  } = methods

  const data = watch()

  // Format data
  const auctionToken = useToken(data.token) ?? undefined
  // @ts-ignore TYPE NEEDS FIXING
  const paymentToken = useToken(data.paymentCurrencyAddress) ?? NATIVE[chainId || 1]
  const formattedData =
    auctionToken && paymentToken && !isValidating && isValid
      ? formatCreationFormData(data as AuctionCreationFormInputValidated, auctionToken, paymentToken)
      : undefined

  const handleSubmit = () => setOpen(true)

  return (
    <>
      <Form {...methods} onSubmit={methods.handleSubmit(handleSubmit)}>
        <Form.Card>
          <AuctionCreationFormTypeSelector />
          <AuctionCreationFormGeneralDetails />
          <Form.Submit>
            <div>
              <Button disabled={!formattedData} color="blue" type="submit">
                {i18n._(t`Review`)}
              </Button>
            </div>
          </Form.Submit>
        </Form.Card>
      </Form>
      <AuctionCreationReviewModal open={open} onDismiss={() => setOpen(false)} data={formattedData} />
    </>
  )
}

export default AuctionCreationForm
