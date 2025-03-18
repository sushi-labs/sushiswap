'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Collapsible,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  TextField,
  classNames,
  formClassnames,
} from '@sushiswap/ui'
import { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import type { z } from 'zod'
import { forgotPasswordAction } from './forgot-password-action'
import { forgotPasswordFormSchema } from './forgot-password-form-schema'

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>

export function ForgotPasswordForm() {
  const [globalMsg, setGlobalMsg] = useState<{
    type: 'error' | 'success'
    message: string
  } | null>(null)

  const form = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: '',
    },
    mode: 'all',
    resolver: zodResolver(forgotPasswordFormSchema),
  })

  const onSubmit = useCallback(
    async (values: ForgotPasswordFormValues) => {
      const formData = new FormData()
      formData.append('email', values.email)

      const result = await forgotPasswordAction(formData)

      if ('error' in result) {
        if ('field' in result) {
          form.setError(result.field, { message: result.error })
        } else {
          setGlobalMsg({ type: 'error', message: result.error })
        }
      } else {
        setGlobalMsg({ type: 'success', message: 'Password reset email sent' })
      }
    },
    [form.setError],
  )

  const canSubmit =
    !form.formState.isSubmitting &&
    form.formState.isValid &&
    globalMsg?.type !== 'success'

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormProvider {...form}>
        <div className="space-y-6 w-full">
          <div className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({
                field: { value, onChange, onBlur },
                fieldState: { invalid: isError },
              }) => (
                <FormControl>
                  <FormItem className="w-full">
                    <>
                      <FormLabel>E-mail</FormLabel>
                      <TextField
                        type="text"
                        placeholder="example@domain.com"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={onBlur}
                        className={formClassnames({ isError })}
                        disabled={form.formState.isSubmitting}
                      />
                    </>
                  </FormItem>
                </FormControl>
              )}
            />
          </div>
          <div>
            <Button type="submit" fullWidth disabled={!canSubmit}>
              Send Reset Link
            </Button>
            <Collapsible open={!!globalMsg}>
              <div
                className={classNames(
                  globalMsg?.type === 'success' && 'text-green-500',
                  globalMsg?.type === 'error' && 'text-red-500',
                  'w-full text-center font-medium pt-4',
                )}
              >
                {globalMsg?.message || ''}
              </div>
            </Collapsible>
          </div>
        </div>
      </FormProvider>
    </form>
  )
}
