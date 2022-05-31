import { getAddress } from '@ethersproject/address'
import * as yup from 'yup'

export const addressValidator = yup.string().test('is-address', '${value} is not a valid address', (value?: string) => {
  if (value?.length === 0) return true

  try {
    return !!(value && getAddress(value))
  } catch {
    return false
  }
})
