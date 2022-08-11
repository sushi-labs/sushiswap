import { getAddress } from '@ethersproject/address'
import { Token, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import * as yup from 'yup'
import Reference from 'yup/lib/Reference'
import { Maybe, Message } from 'yup/lib/types'

import { StepConfig } from '../types'

export const stepConfigurations: StepConfig[] = [
  { label: 'Weekly', time: 604800 },
  { label: 'Bi-weekly', time: 2 * 604800 },
  { label: 'Monthly', time: 2620800 },
  { label: 'Quarterly', time: 3 * 2620800 },
  { label: 'Yearly', time: 31449600 },
]

function emptyStringToNull(value: string, originalValue: string) {
  if (typeof originalValue === 'string' && originalValue === '') {
    return null
  }
  return value
}

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
        if (value?.isNative) return true
        if (value?.address?.length === 0) return true

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
  currency: yup.mixed<Token>().currency().required('Currency is required'),
  cliff: yup.boolean().required(),
  startDate: yup
    .date()
    .when('cliffEndDate', (cliffEndDate, schema) => {
      if (cliffEndDate instanceof Date && !isNaN(cliffEndDate?.getTime())) {
        const dayAfter = new Date(cliffEndDate.getTime() - 1)
        return schema.max(dayAfter, 'Start date must be earlier than cliff end date')
      }
      return schema
    })
    .min(new Date(Date.now() + 5 * 60 * 1000), 'Start date must be at least 5 minutes from now')
    .required('Start date is required'),
  // @ts-ignore
  recipient: yup.string().isAddress('Recipient address is invalid').required('Recipient address is required'),
  cliffEndDate: yup.date().when('cliff', {
    is: (value: boolean) => value,
    then: yup
      .date()
      .min(new Date(), 'Cliff end date must be in the future')
      .when('startDate', (startDate, schema) => {
        if (startDate instanceof Date && !isNaN(startDate?.getTime())) {
          const dayAfter = new Date(startDate.getTime() + 1)
          return schema.min(dayAfter, 'Cliff end date must be later than start date')
        }
        return schema
      })
      .required('Cliff end date is required'),
    otherwise: yup.date().nullable().notRequired(),
  }),
  cliffAmount: yup
    .number()
    .transform(emptyStringToNull)
    .when('cliff', {
      is: (value: boolean) => value,
      then: yup.number().min(0, 'Cliff amount cant be negative'),
      otherwise: yup.number().nullable(),
    }),
  stepPayouts: yup
    .number()
    .min(1, 'Amount of periods must be at least 1')
    .integer('Amount of periods must be a whole number')
    .typeError('Amount of periods is required')
    .required('Amount of periods is required'),
  stepAmount: yup
    .number()
    .typeError('Payout per period must be a number')
    .min(0, 'Payout per period must be a positive number')
    .required('Payout per period is required'),
  stepConfig: yup.mixed<StepConfig>().required('Period length is required'),
  fundSource: yup.mixed<FundSource>().required('Fund source is required'),
})
