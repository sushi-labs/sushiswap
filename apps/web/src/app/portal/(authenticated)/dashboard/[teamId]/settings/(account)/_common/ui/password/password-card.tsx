'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  TextField,
  formClassnames,
  useForm,
} from '@sushiswap/ui'
import { useCallback, useEffect, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { changeOrCreatePasswordAction } from './password-action'
import { changeOrCreatePasswordSchema } from './password-form-schema'

type ChangeOrCreatePasswordValues = z.infer<typeof changeOrCreatePasswordSchema>

export function PasswordCard() {
  const [globalErrorMsg, setGlobalErrorMsg] = useState<string | null>(null)

  const form = useForm<ChangeOrCreatePasswordValues>({
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(changeOrCreatePasswordSchema),
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
    async (values: ChangeOrCreatePasswordValues) => {
      const formData = new FormData()
      formData.append('password', values.password)
      formData.append('passwordConfirmation', values.passwordConfirmation)

      const result = await changeOrCreatePasswordAction(formData)

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

  const isPending = form.formState.isSubmitting

  return (
    <Card className="w-full min-w-[470px]">
      <CardHeader className="bg-secondary rounded-t-xl">
        <CardTitle>Password</CardTitle>
        <CardDescription>Change or create your password</CardDescription>
      </CardHeader>
      <CardContent className="bg-secondary rounded-b-xl">
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
              <Button type="submit" fullWidth disabled={isPending}>
                Change
              </Button>
              {globalErrorMsg && (
                <div className="w-full text-center text-red-500 font-medium">
                  {globalErrorMsg}
                </div>
              )}
            </div>
          </FormProvider>
        </form>
      </CardContent>
    </Card>
  )
}
