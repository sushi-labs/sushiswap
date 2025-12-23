'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { ResponseError } from '@sushiswap/styro-client'
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  TextField,
  formClassnames,
} from '@sushiswap/ui'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { parseStyroError } from 'src/app/portal/_common/lib/styro/parse-error'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import { CheckerRoleClient } from 'src/app/portal/_common/ui/checker/checker-role/checker-role-client'
import {
  CollapsibleMessage,
  useCollapsibleMessage,
} from 'src/app/portal/_common/ui/collapsible-message'
import { PortalForm } from 'src/app/portal/_common/ui/portal-form'
import * as z from 'zod'

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
    .max(16, { message: 'Maximum length is 16 characters' }),
})

type ManageTeamFormValues = z.infer<typeof manageTeamFormSchema>

export function ManageTeamForm({ team: initialTeam }: ManageTeamForm) {
  const client = useStyroClient(true)
  const router = useRouter()

  const { message, setMessage } = useCollapsibleMessage({
    successTimeout: 2000,
  })

  const form = useForm<ManageTeamFormValues>({
    defaultValues: initialTeam,
    mode: 'all',
    resolver: zodResolver(manageTeamFormSchema),
  })

  const { mutateAsync } = useMutation({
    mutationKey: ['portal-patchTeamsTeamId', initialTeam.id],
    mutationFn: async (values: ManageTeamFormValues) => {
      const response = await client.patchTeamsTeamId({
        teamId: initialTeam.id,
        // Not sure why it has it "post" prefix
        postTeamsRequest: {
          name: values.name,
        },
      })

      return response.data.team
    },
    onSuccess: (data) => {
      form.reset(data)
      setMessage({ type: 'success', message: 'Team name updated' })
      router.refresh()
    },
    onError: async (e: ResponseError) => {
      setMessage({ type: 'error', message: await parseStyroError(e) })
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
    <PortalForm form={form} onValid={onSubmit}>
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
      <div>
        <CheckerRoleClient
          requiredRole="admin"
          message="Only admins and owners can manage the team"
          teamId={initialTeam.id}
        >
          {(disabled) => (
            <Button type="submit" fullWidth disabled={!canSubmit || disabled}>
              Change
            </Button>
          )}
        </CheckerRoleClient>
        <CollapsibleMessage message={message} />
      </div>
    </PortalForm>
  )
}
