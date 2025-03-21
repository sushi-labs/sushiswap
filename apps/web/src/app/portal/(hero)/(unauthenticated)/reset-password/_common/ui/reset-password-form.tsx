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
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import type { z } from 'zod'
import { resetPasswordAction } from './reset-password-action'
import { resetPasswordFormSchema } from './reset-password-form-schema'

type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [globalMsg, setGlobalMsg] = useState<{
    type: 'error' | 'success'
    message: string
  } | null>(null)

  const form = useForm<ResetPasswordFormValues>({
    defaultValues: {
      userId: searchParams.get('userId') ?? '',
      code: searchParams.get('code') ?? '',
      password: '',
      passwordConfirmation: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(resetPasswordFormSchema),
  })

  useEffect(() => {
    if (form.getValues('password')) {
      form.trigger(['password'])
    }
    if (form.getValues('passwordConfirmation')) {
      form.trigger(['passwordConfirmation'])
    }
  }, [
    form.getValues,
    form.trigger,
    ...form.watch(['password', 'passwordConfirmation']),
  ])

  const onSubmit = useCallback(
    async (values: ResetPasswordFormValues) => {
      const formData = new FormData()
      formData.append('userId', values.userId)
      formData.append('code', values.code)
      formData.append('password', values.password)
      formData.append('passwordConfirmation', values.passwordConfirmation)

      const result = await resetPasswordAction(formData)

      if ('error' in result) {
        if ('field' in result) {
          form.setError(result.field, { message: result.error })
        } else {
          setGlobalMsg({ type: 'error', message: result.error })
        }
      } else {
        router.push('/portal')
      }
    },
    [form.setError, router.push],
  )

  const isPending = form.formState.isSubmitting
  const canSubmit = !isPending && form.formState.isValid

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormProvider {...form}>
        <div className="space-y-6 w-full">
          <div className="space-y-4">
            <FormField
              name="password"
              control={form.control}
              render={({
                field: { value, onChange, onBlur },
                fieldState: { invalid: isError },
              }) => (
                <FormControl>
                  <FormItem className="w-full">
                    <>
                      <FormLabel>Password</FormLabel>
                      <TextField
                        type="text"
                        textType="password"
                        placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={onBlur}
                        className={formClassnames({ isError })}
                        disabled={isPending}
                      />
                    </>
                  </FormItem>
                </FormControl>
              )}
            />
            <FormField
              name="passwordConfirmation"
              control={form.control}
              render={({
                field: { value, onChange, onBlur },
                fieldState: { invalid: isError },
              }) => (
                <FormControl>
                  <FormItem className="w-full">
                    <>
                      <FormLabel>Repeat Password</FormLabel>
                      <TextField
                        type="text"
                        textType="password"
                        placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={onBlur}
                        className={formClassnames({ isError })}
                        disabled={isPending}
                      />
                    </>
                  </FormItem>
                </FormControl>
              )}
            />
          </div>
          <div>
            <Button type="submit" fullWidth disabled={!canSubmit}>
              Reset Password
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
