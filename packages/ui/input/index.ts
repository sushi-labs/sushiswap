import { FC } from 'react'
import Address, { AddressProps } from './Address'
import DatetimeLocal, { DatetimeLocalProps } from './DatetimeLocal'

export const DEFAULT_INPUT_CLASSNAME =
  'rounded-xl bg-dark-800 py-3 px-4 text-left shadow-md border-none text-sm font-bold focus:ring-1 focus-within:ring-1 ring-offset-2 ring-offset-dark-900 ring-blue'

export type InputProps = {
  Address: FC<AddressProps>
  DatetimeLocal: FC<DatetimeLocalProps>
}

export const Input: InputProps = { Address, DatetimeLocal }
