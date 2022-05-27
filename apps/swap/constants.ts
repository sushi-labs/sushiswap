import { Theme } from './types'

export const defaultTheme: Theme = {
  accent: '#0993EC',
  primary: {
    default: 'text-slate-200',
    hover: 'hover:text-slate-100',
  },
  secondary: {
    default: 'text-slate-400',
    hover: 'hover:text-slate-300',
  },
  borderRadius: 12,
  background: {
    primary: 'bg-slate-700',
    secondary: 'bg-slate-800',
  },
}
