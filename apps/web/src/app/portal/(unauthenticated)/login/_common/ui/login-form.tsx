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
import { loginAction } from './login-action'
import { loginFormSchema } from './login-form-schema'

type LoginFormValues = z.infer<typeof loginFormSchema>

export function LoginForm() {
  const [globalErrorMsg, setGlobalErrorMsg] = useState<string | null>(null)

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
