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
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  CollapsibleMessage,
  useCollapsibleMessage,
} from 'src/app/portal/_common/ui/collapsible-message'
import { PortalForm } from 'src/app/portal/_common/ui/portal-form'
import type { z } from 'zod'
import { ResendCodeButton } from './resend-code/resend-code-button'
import { verifyEmailAction } from './verify-email-action'
import { verifyEmailFormSchema } from './verify-form-schema'

type VerifyFormValues = z.infer<typeof verifyEmailFormSchema>

export function VerifyForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { message, setMessage } = useCollapsibleMessage()

  const form = useForm<VerifyFormValues>({
    defaultValues: {
      code: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(verifyEmailFormSchema),
  })

  useEffect(() => {
    if (searchParams.has('code')) {
      form.setValue('code', searchParams.get('code')!)
    }
  }, [searchParams, form.setValue])

  const onSubmit = useCallback(
    async (values: VerifyFormValues) => {
      const formData = new FormData()
      formData.append('code', values.code)

      const result = await verifyEmailAction(formData)

      if ('error' in result) {
        if ('field' in result) {
          form.setError(result.field, { message: result.error })
        } else {
          setMessage({ type: 'error', message: result.error })
        }
      } else {
        router.push('/portal')
      }
    },
    [form.setError, router.push, setMessage],
  )

  return (
    <PortalForm form={form} onValid={onSubmit}>
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
      <div>
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
        <CollapsibleMessage message={message} />
      </div>
    </PortalForm>
  )
}
