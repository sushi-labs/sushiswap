import { ButtonColor, ButtonSize, ButtonVariant } from './Button'

export const BUTTON_CLASSES: Record<string, string> = {
  btn: 'font-medium flex items-center justify-center gap-2 cursor-pointer transition-all',
  'btn-disabled': 'pointer-events-none before:absolute relative before:inset-0 before:bg-black/[0.4] overflow-hidden',
  'btn-filled': '',
  'btn-empty': '',
  'btn-outlined': '',
  'btn-outlined-red': 'bg-red/[0.15] hover:bg-red/20 active:bg-red/30 text-red',
  'btn-outlined-blue': 'bg-blue/[0.15] hover:bg-blue/20 active:bg-blue/30 text-blue',
  'btn-outlined-gray': 'bg-white dark:bg-slate-600/10 hover:dark:bg-slate-600/20 active:dark:bg-slate-600/30',
  'btn-filled-red': 'bg-red hover:bg-red-600 active:bg-red-700 text-white',
  'btn-filled-blue': 'bg-blue hover:bg-blue-600 active:bg-blue-700 text-white',
  'btn-filled-gray':
    'bg-white dark:bg-slate-800 hover:dark:bg-slate-700 active:dark:bg-slate-600 text-gray-900 dark:text-white',
  'btn-xs': 'px-2 h-[28px] text-xs rounded-lg',
  'btn-sm': 'px-4 h-[32px] text-sm rounded-lg',
  'btn-md': 'px-4 h-[38px] rounded-xl text-base font-semibold',
  'btn-lg': 'px-6 h-[44px] rounded-xl text-base font-semibold',
  'btn-xl': 'px-6 h-[52px] rounded-xl text-base font-semibold',
  'btn-empty-red': 'text-red hover:bg-red/20 active:bg-red/30',
  'btn-empty-blue': 'text-blue hover:bg-blue/20 active:bg-blue/30',
  'btn-empty-gray':
    'hover:bg-white hover:dark:bg-slate-600/20 active:dark:bg-slate-600/30 text-gray-700 hover:text-gray-800 active:text-gray-900 dark:text-slate-200 hover:dark:text-slate-100 active:dark:text-slate-50',
}

export const BUTTON_STYLES: Record<ButtonVariant, Record<ButtonColor, string>> = {
  outlined: {
    red: 'btn-outlined-red',
    blue: 'btn-outlined-blue',
    default: 'btn-outlined-gray',
  },
  filled: {
    red: 'btn-filled-red',
    blue: 'btn-filled-blue',
    default: 'btn-filled-gray',
  },
  empty: {
    red: 'btn-empty-red',
    blue: 'btn-empty-blue',
    default: 'btn-empty-gray',
  },
}

export const BUTTON_STYLES_VARIANT: Record<ButtonVariant, string> = {
  outlined: 'btn-outlined',
  filled: 'btn-filled',
  empty: 'btn-empty',
}

export const BUTTON_SIZES: Record<ButtonSize, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
  xl: 'btn-xl',
}
