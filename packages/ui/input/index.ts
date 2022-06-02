import { Address } from './Address'
import { Counter } from './Counter'
import { DatetimeLocal } from './DatetimeLocal'
import { Input as Numeric } from './Numeric'

export const DEFAULT_INPUT_CLASSNAME =
  'focus:outline-none rounded-xl bg-slate-800 py-3 px-4 text-left shadow-md border-none sm:text-sm font-bold focus:ring-1 ! ring-offset-2 ring-offset-slate-900 ring-blue'
export const ERROR_INPUT_CLASSNAME = '!ring-red/70 !ring-1'

export const Input = { Address, DatetimeLocal, Counter, Numeric }
