import { Native, Token, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { getAddress } from 'ethers/lib/utils'
import * as yup from 'yup'
import Reference from 'yup/lib/Reference'
import { Maybe, Message } from 'yup/lib/types'

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

export const createStreamSchema = yup.object({
  // @ts-ignore
  currency: yup.mixed<Token>().currency().required('This field is required'),
  // @ts-ignore
  recipient: yup.string().isAddress('Invalid recipient address').required('This field is required'),
  startDate: yup.date().min(new Date(), 'Start date must be in the future').required('This field is required'),
  endDate: yup
    .date()
    .when('startDate', (startDate, schema) => {
      if (startDate) {
        const dayAfter = new Date(startDate.getTime() + 1)
        return schema.min(dayAfter, 'Date must be later than start date')
      }
      return schema
    })
    .min(new Date(), 'End date must be in the future')
    .required('This field is required'),
  amount: yup
    .number()
    .typeError('Target must be a number')
    .min(0, 'Must be greater than zero')
    .required('This field is required'),
  fundSource: yup.mixed<FundSource>().required('This field is required'),
})
