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
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  CollapsibleMessage,
  useCollapsibleMessage,
} from 'src/app/portal/_common/ui/collapsible-message'
import { PortalForm } from 'src/app/portal/_common/ui/portal-form'
import type { z } from 'zod'
import { registerAction } from './register-action'
import { registerFormSchema } from './register-form-schema'

type RegisterFormValues = z.infer<typeof registerFormSchema>

export function RegisterForm() {
  const router = useRouter()

  const { message, setMessage } = useCollapsibleMessage()

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(registerFormSchema),
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
    async (values: RegisterFormValues) => {
      const formData = new FormData()
      formData.append('email', values.email)
      formData.append('password', values.password)
      formData.append('passwordConfirmation', values.passwordConfirmation)

      const result = await registerAction(formData)

      if ('error' in result) {
        if ('field' in result) {
          form.setError(result.field, { message: result.error })
        } else {
          setMessage({ type: 'error', message: result.error })
        }
      } else {
        router.push('/portal/verify')
      }
    },
    [form.setError, router.push, setMessage],
  )

  const isPending = form.formState.isSubmitting

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
                    disabled={isPending}
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
        <Button type="submit" fullWidth disabled={isPending}>
          Register
        </Button>
        <CollapsibleMessage message={message} />
      </div>
    </PortalForm>
  )
}
