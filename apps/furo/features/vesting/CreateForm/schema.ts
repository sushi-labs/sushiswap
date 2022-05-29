import { Native, Token, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { getAddress } from 'ethers/lib/utils'
import * as yup from 'yup'
import Reference from 'yup/lib/Reference'
import { Maybe, Message } from 'yup/lib/types'

import { StepConfig } from './types'

export const stepConfigurations: StepConfig[] = [
  { label: 'Weekly', time: 604800 },
  { label: 'Bi-weekly', time: 2 * 604800 },
  { label: 'Monthly', time: 2620800 },
  { label: 'Quarterly', time: 3 * 2620800 },
  { label: 'Yearly', time: 31449600 },
]

yup.addMethod(
  yup.mixed,
  'currency',
  function (
    address: string | Reference<string>,
    msg: Message<{ address: string }> = '${address} is not a valid token address'
  ) {
    return this.test({
      message: msg,
      name: 'currency',
      exclusive: true,
      params: { address },
      test(value: Maybe<Type>) {
        if (value instanceof Native) return true
        if (value?.address.length === 0) return true

        try {
          return !!(value && getAddress(value.address))
        } catch {
          return false
        }
      },
    })
  }
)

yup.addMethod(yup.string, 'isAddress', function (msg: Message<{ address: string }> = 'Invalid address') {
  return this.test({
    message: msg,
    name: 'isAddress',
    exclusive: true,
    test(value: Maybe<string>) {
      if (value?.length === 0) return true

      try {
        return !!(value && getAddress(value))
      } catch {
        return false
      }
    },
  })
})

export const createVestingSchema = yup.object({
  // @ts-ignore
  currency: yup.mixed<Token>().currency().required('This field is required'),
  cliff: yup.boolean().required('This field is required'),
  startDate: yup
    .date()
    .when('cliffEndDate', (cliffEndDate, schema) => {
      if (cliffEndDate) {
        const dayAfter = new Date(cliffEndDate.getTime() - 1)
        return schema.max(dayAfter, 'Date must be earlier than cliff end date')
      }
      return schema
    })
    .min(new Date(), 'Date is be due already')
    .required('This field is required'),
  // @ts-ignore
  recipient: yup.string().isAddress('Invalid recipient address').required('This field is required'),
  cliffEndDate: yup.date().when('cliff', {
    is: (value: boolean) => value,
    then: yup
      .date()
      .min(new Date(), 'Date is be due already')
      .when('startDate', (startDate, schema) => {
        if (startDate) {
          const dayAfter = new Date(startDate.getTime() + 1)
          return schema.min(dayAfter, 'Date must be later than start date')
        }
        return schema
      })
      .required('This field is required'),
    otherwise: yup.date().nullable().notRequired(),
  }),
  cliffAmount: yup.number().when('cliff', {
    is: (value: boolean) => value,
    then: yup.number().typeError('Target must be a number').min(0, 'Must be greater than zero'),
    otherwise: yup.number().nullable(),
  }),
  stepPayouts: yup
    .number()
    .min(1, 'Must be more than 1')
    .integer('Must be a whole number')
    .typeError('This field is required')
    .required('This field is required'),
  stepAmount: yup
    .number()
    .typeError('Target must be a number')
    .min(0, 'Must be greater than zero')
    .required('This field is required'),
  stepConfig: yup.mixed<StepConfig>().required('This field is required'),
  fundSource: yup.mixed<FundSource>().required('This field is required'),
})
