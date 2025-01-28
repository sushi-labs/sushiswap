'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  TextField,
  formClassnames,
} from '@sushiswap/ui'
import { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { ResendCodeButton } from './resend-code/resend-code-button'
import { verifyEmailAction } from './verify-email-action'
import { verifyEmailFormSchema } from './verify-form-schema'

type VerifyFormValues = z.infer<typeof verifyEmailFormSchema>

export function VerifyForm() {
  const [globalErrorMsg, setGlobalErrorMsg] = useState<string | null>(null)

  const form = useForm<VerifyFormValues>({
    defaultValues: {
      code: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(verifyEmailFormSchema),
  })

  const onSubmit = useCallback(
    async (values: VerifyFormValues) => {
      const formData = new FormData()
      formData.append('code', values.code)

      const result = await verifyEmailAction(formData)

      if ('error' in result) {
        if ('field' in result) {
          form.setError(result.field, { message: result.error })
        } else {
          setGlobalErrorMsg(result.error)
        }
      }
    },
    [form.setError],
  )

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormProvider {...form}>
        <div className="space-y-6 w-full">
          <div className="space-y-4">
            <FormField
              name="code"
              control={form.control}
              render={({
                field: { value, onChange, onBlur },
                fieldState: { invalid: isError },
              }) => (
                <FormControl>
                  <FormItem className="w-full">
                    <>
                      <FormLabel>Code</FormLabel>
                      <TextField
                        type="text"
                        placeholder="ABC123"
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
          <div className="flex space-x-4">
            <ResendCodeButton />
            <Button
              type="submit"
              fullWidth
              disabled={form.formState.isSubmitting}
            >
              Verify
            </Button>
          </div>
          {globalErrorMsg && (
            <div className="w-full text-center text-red-500 font-medium">
              {globalErrorMsg}
            </div>
          )}
        </div>
      </FormProvider>
    </form>
  )
}
