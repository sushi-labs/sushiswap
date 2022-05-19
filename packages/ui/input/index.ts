import { FC } from 'react'

import Address, { AddressProps } from './Address'
import DatetimeLocal, { DatetimeLocalProps } from './DatetimeLocal'
import Numeric, { NumericProps } from './Numeric'

export const DEFAULT_INPUT_CLASSNAME =
  'focus:outline-none rounded-xl bg-slate-800 py-3 px-4 text-left shadow-md border-none sm:text-sm font-bold focus:ring-1 focus-within:ring-1 ring-offset-2 ring-offset-slate-900 ring-blue'

export type InputProps = {
  Address: FC<AddressProps>
  DatetimeLocal: FC<DatetimeLocalProps>
  Numeric: FC<NumericProps>
}

export const Input: InputProps = { Address, DatetimeLocal, Numeric }
