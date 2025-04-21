import { classNames } from '@sushiswap/ui'
import {
  type FieldValues,
  FormProvider,
  type UseFormReturn,
} from 'react-hook-form'

interface PortalForm<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues, any, undefined>
  onValid: Parameters<UseFormReturn<TFieldValues, any>['handleSubmit']>[0]
  children: React.ReactNode
  className?: string
}

export function PortalForm<TFieldValues extends FieldValues>({
  form,
  onValid,
  children,
  className,
}: PortalForm<TFieldValues>) {
  return (
    <form
      onSubmit={form.handleSubmit(onValid)}
      className={classNames('space-y-6 w-full', className)}
    >
      <FormProvider {...form}>{children}</FormProvider>
    </form>
  )
}
