'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { ResponseError } from '@sushiswap/styro-client'
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
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { parseStyroError } from 'src/app/portal/_common/lib/styro/parse-error'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import { z } from 'zod'

interface ManageTeamForm {
  team: {
    id: string
    name: string
  }
}

const manageTeamFormSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(4, { message: 'Minimum length is 4 characters' })
    .max(14, { message: 'Maximum length is 14 characters' }),
})

type ManageTeamFormValues = z.infer<typeof manageTeamFormSchema>

export function ManageTeamForm({ team: initialTeam }: ManageTeamForm) {
  const client = useStyroClient(true)
  const router = useRouter()

  const [globalMsg, setGlobalMsg] = useState<{
    type: 'error' | 'success'
    message: string
  } | null>(null)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (globalMsg?.type === 'success') {
      timeout = setTimeout(() => setGlobalMsg(null), 2000)
    }

    return () => clearTimeout(timeout)
  }, [globalMsg])

  const form = useForm<ManageTeamFormValues>({
    defaultValues: initialTeam,
    mode: 'all',
    resolver: zodResolver(manageTeamFormSchema),
  })

  const { mutateAsync } = useMutation({
    mutationKey: ['manage-team'],
    mutationFn: async (values: ManageTeamFormValues) => {
      const response = await client.patchTeamsTeamId({
        teamId: initialTeam.id,
        patchTeamsTeamIdRequest: {
          name: values.name,
        },
      })

      form.reset(response.data.team)
    },
    onSuccess: () => {
      setGlobalMsg({ type: 'success', message: 'Team name updated' })
      router.refresh()
    },
    onError: async (e: ResponseError) => {
      setGlobalMsg({ type: 'error', message: await parseStyroError(e) })
    },
  })

  const onSubmit = useCallback(
    async (values: ManageTeamFormValues) => {
      await mutateAsync(values)
    },
    [mutateAsync],
  )

  const isDirty = form.formState.isDirty
  const isPending = form.formState.isSubmitting

  const canSubmit = isDirty && !isPending

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormProvider {...form}>
        <div className="space-y-6 w-full">
          <div className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({
                field: { value, onChange, onBlur },
                fieldState: { invalid: isError, isDirty },
              }) => (
                <FormControl>
                  <FormItem className="w-full">
                    <>
                      <FormLabel>Team Name</FormLabel>
                      <TextField
                        type="text"
                        placeholder="The Best Team"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={onBlur}
                        className={formClassnames({ isError, isDirty })}
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
  )
}
