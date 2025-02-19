'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Collapsible,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  TextField,
  classNames,
  formClassnames,
  useForm,
} from '@sushiswap/ui'
import { useCallback, useEffect, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import type { z } from 'zod'
import { changeOrCreatePasswordAction } from './password-action'
import { changeOrCreatePasswordSchema } from './password-form-schema'

type ChangeOrCreatePasswordValues = z.infer<typeof changeOrCreatePasswordSchema>

export function PasswordCard() {
  const [globalMsg, setGlobalMsg] = useState<{
    type: 'error' | 'success'
    message: string
  } | null>(null)

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

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (globalMsg?.type === 'success') {
      timeout = setTimeout(() => setGlobalMsg(null), 2000)
    }

    return () => clearTimeout(timeout)
  }, [globalMsg])

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
          setGlobalMsg({
            type: 'error',
            message: result.error,
          })
        }
      } else {
        setGlobalMsg({
          type: 'success',
          message: 'Password changed successfully',
        })
        form.reset()
      }
    },
    [form.setError, form.reset],
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
              <div>
                <Button type="submit" fullWidth disabled={isPending}>
                  Change
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
      </CardContent>
    </Card>
  )
}
