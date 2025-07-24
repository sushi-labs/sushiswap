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
import { useCallback, useEffect } from 'react'
import { FormProvider } from 'react-hook-form'
import {
  CollapsibleMessage,
  useCollapsibleMessage,
} from 'src/app/portal/_common/ui/collapsible-message'
import { PortalForm } from 'src/app/portal/_common/ui/portal-form'
import type { z } from 'zod'
import { changeOrCreatePasswordAction } from './password-action'
import { changeOrCreatePasswordSchema } from './password-form-schema'

type ChangeOrCreatePasswordValues = z.infer<typeof changeOrCreatePasswordSchema>

export function PasswordCard() {
  const { message, setMessage } = useCollapsibleMessage({
    successTimeout: 2000,
  })

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
          setMessage({
            type: 'error',
            message: result.error,
          })
        }
      } else {
        setMessage({
          type: 'success',
          message: 'Password changed successfully',
        })
        form.reset()
      }
    },
    [form.setError, form.reset, setMessage],
  )

  const isPending = form.formState.isSubmitting

  return (
    <Card className="h-min">
      <CardHeader className="rounded-t-xl">
        <CardTitle>Password</CardTitle>
        <CardDescription>Change or create your password</CardDescription>
      </CardHeader>
      <CardContent className="rounded-b-xl">
        <PortalForm form={form} onValid={onSubmit}>
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
            <Button
              type="submit"
              fullWidth
              disabled={
                isPending || !form.formState.isDirty || !form.formState.isValid
              }
            >
              Change
            </Button>
            <CollapsibleMessage message={message} />
          </div>
        </PortalForm>
      </CardContent>
    </Card>
  )
}
