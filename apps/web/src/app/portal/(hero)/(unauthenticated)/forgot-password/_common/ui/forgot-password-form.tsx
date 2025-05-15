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
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import {
  CollapsibleMessage,
  useCollapsibleMessage,
} from 'src/app/portal/_common/ui/collapsible-message'
import { PortalForm } from 'src/app/portal/_common/ui/portal-form'
import type { z } from 'zod'
import { forgotPasswordAction } from './forgot-password-action'
import { forgotPasswordFormSchema } from './forgot-password-form-schema'

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>

export function ForgotPasswordForm() {
  const { message, setMessage } = useCollapsibleMessage({
    successTimeout: 2000,
  })

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
          setMessage({ type: 'error', message: result.error })
        }
      } else {
        setMessage({ type: 'success', message: 'Password reset email sent' })
      }
    },
    [form.setError, setMessage],
  )

  const canSubmit =
    !form.formState.isSubmitting &&
    form.formState.isValid &&
    message?.type !== 'success'

  return (
    <PortalForm form={form} onValid={onSubmit}>
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
        <CollapsibleMessage message={message} />
      </div>
    </PortalForm>
  )
}
