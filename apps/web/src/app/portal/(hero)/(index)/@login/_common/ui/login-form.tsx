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
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import {
  CollapsibleMessage,
  useCollapsibleMessage,
} from 'src/app/portal/_common/ui/collapsible-message'
import { PortalForm } from 'src/app/portal/_common/ui/portal-form'
import type { z } from 'zod'
import { loginAction } from './login-action'
import { loginFormSchema } from './login-form-schema'

type LoginFormValues = z.infer<typeof loginFormSchema>

const paramErrors = {
  oauthAlreadyExists:
    'User with this email already exists, please try logging in with your password instead',
  oauthFailed:
    'Failed to authenticate with OAuth provider, contact us for support',
} as Record<string, string>

export function LoginForm() {
  const router = useRouter()
  const searchParamsError = useSearchParams().get('error_tag')

  const { message, setMessage } = useCollapsibleMessage({
    defaultMessage: searchParamsError
      ? { type: 'error', message: paramErrors[searchParamsError] }
      : null,
  })

  const form = useForm<z.infer<typeof loginFormSchema>>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(loginFormSchema),
  })

  const onSubmit = useCallback(
    async (values: LoginFormValues) => {
      const formData = new FormData()
      formData.append('email', values.email)
      formData.append('password', values.password)

      const result = await loginAction(formData)

      if ('error' in result) {
        if ('field' in result) {
          form.setError(result.field, { message: result.error })
        } else {
          setMessage({ type: 'error', message: result.error })
        }
      } else {
        router.push(result.redirect)
      }
    },
    [form.setError, router.push, setMessage],
  )

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
                    disabled={form.formState.isSubmitting}
                  />
                </>
              </FormItem>
            </FormControl>
          )}
        />
      </div>
      <Button
        type="submit"
        fullWidth
        disabled={form.formState.isSubmitting || !form.formState.isValid}
      >
        Sign In
      </Button>
      <CollapsibleMessage message={message} />
    </PortalForm>
  )
}
