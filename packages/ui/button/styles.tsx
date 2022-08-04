import { ButtonColor, ButtonSize, ButtonVariant } from './Button'

export const BUTTON_CLASSES: Record<string, string> = {
  btn: 'font-medium flex hover:ring-2 focus:ring-2 items-center justify-center gap-2 rounded-xl cursor-pointer',
  'btn-disabled': 'cursor-not-allowed opacity-40 !ring-0',
  'btn-filled': 'text-slate-50',
  'btn-empty': '!ring-0',
  'btn-outlined': 'border-2 hover:ring-2 border-opacity-20 ring-offset-2 ring-offset-slate-900 rounded-xl',
  'btn-outlined-red': 'border-2 hover:ring-2 border-opacity-20 ring-offset-2 ring-offset-slate-900 rounded-xl',
  'btn-outlined-pink': 'border-pink ring-pink-700 text-pink',
  'btn-outlined-blue': 'border-blue ring-blue-700 text-blue',
  'btn-outlined-purple': 'border-purple ring-purple-700 text-purple',
  'btn-outlined-gradient':
    'bg-gradient-to-r hover:ring-4 ring-slate-600 ring-purple/30 from-blue to-pink focus:border-blue-700',
  'btn-outlined-gray': 'border-slate-700 ring-slate-700 text-slate-400',
  'btn-filled-red': 'bg-red ring-red-700',
  'btn-filled-pink': 'bg-pink ring-pink-700',
  'btn-filled-blue': 'bg-blue ring-blue-700',
  'btn-filled-purple': 'bg-purple ring-purple-700',
  'btn-filled-gradient': 'bg-gradient-to-r hover:ring-4 !ring-pink/20 from-blue-600 to-pink-600 focus:border-blue-700',
  'btn-filled-gray': 'bg-slate-700 ring-slate-600',
  'btn-xs': 'px-2 h-[28px] text-xs',
  'btn-sm': 'px-3 h-[36px] text-sm font-semibold',
  'btn-default': 'px-3 h-[44px] text-sm font-semibold',
  'btn-md': 'px-4 h-[52px] rounded-2xl text-base font-semibold',
  'btn-lg': 'px-6 h-[60px] rounded-2xl text-base font-semibold',
  'btn-empty-red': 'text-red hover:text-red-300',
  'btn-empty-pink': 'text-pink hover:text-pink-300',
  'btn-empty-blue': 'text-blue hover:text-blue-300',
  'btn-empty-purple': 'text-purple hover:text-purple-300',
  'btn-empty-gray': 'text-slate-400 hover:text-slate-200',
}

export const BUTTON_STYLES: Record<ButtonVariant, Record<ButtonColor, string>> = {
  outlined: {
    red: 'btn-outlined-red',
    pink: 'btn-outlined-pink',
    blue: 'btn-outlined-blue',
    purple: 'btn-outlined-purple',
    gradient: 'btn-outlined-gradient',
    gray: 'btn-outlined-gray',
  },
  filled: {
    red: 'btn-filled-red',
    pink: 'btn-filled-pink',
    blue: 'btn-filled-blue',
    purple: 'btn-filled-purple',
    gradient: 'btn-filled-gradient',
    gray: 'btn-filled-gray',
  },
  empty: {
    red: 'btn-empty-red',
    pink: 'btn-empty-pink',
    blue: 'btn-empty-blue',
    purple: 'btn-empty-purple',
    gradient: 'btn-empty-gradient',
    gray: 'btn-empty-gray',
  },
}

export const BUTTON_STYLES_VARIANT: Record<ButtonVariant, string> = {
  outlined: 'btn-outlined',
  filled: 'btn-filled',
  empty: 'btn-empty',
}

export const BUTTON_SIZES: Record<ButtonSize, string> = {
  default: 'btn-default',
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
}
