import { cva } from 'class-variance-authority'

const typographyVariants = cva('scroll-m-20', {
  variants: {
    variant: {
      h1: 'text-3xl font-bold tracking-tighter md:text-5xl lg:leading-[1.1]',
      h2: 'text-3xl font-semibold tracking-tight transition-colors first:mt-0',
      h3: 'text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      p: 'leading-7 [&:not(:first-child)]:mt-6',
      blockquote: 'mt-6 border-l-2 pl-6 italic',
      lead: 'leading-7 [&:not(:first-child)]:mt-6 text-lg text-muted-foreground sm:text-xl',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-muted-foreground',
    },
  },
})

export { typographyVariants }
