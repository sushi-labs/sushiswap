import { cva } from 'class-variance-authority'

const inputVariants = cva(
  'flex items-center truncate font-medium block w-full text-gray-900 bg-secondary hover:bg-muted focus:bg-accent border-0 appearance-none dark:text-slate-50 focus:outline-none focus:ring-0',
  {
    variants: {
      size: {
        xs: 'min-h-[26px] h-[26px] px-2 text-xs rounded-lg',
        sm: 'min-h-[36px] h-[36px] px-3 text-sm rounded-xl',
        default: 'min-h-[40px] h-[40px] px-3 py-2 text-sm rounded-xl',
        lg: 'min-h-[44px] h-[44px] px-4 rounded-xl',
        xl: 'min-h-[52px] h-[52px] px-4 rounded-xl',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

export { inputVariants }
