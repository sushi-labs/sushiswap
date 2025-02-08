'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Checkbox,
  Collapsible,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormControl,
  FormField,
  FormItem,
  useForm,
} from '@sushiswap/ui'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { type ReactNode, useCallback, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { z } from 'zod'

interface DeleteTeamModal {
  children: ReactNode
  teamId: string
}

const deleteTeamFormSchema = z.object({
  confirm: z.boolean().refine((value) => value === true, {}),
})

type DeleteTeamFormValues = z.infer<typeof deleteTeamFormSchema>

export function DeleteTeamModal({ children }: DeleteTeamModal) {
  const [globalErrorMsg, setGlobalErrorMsg] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<DeleteTeamFormValues>({
    defaultValues: {
      confirm: false,
    },
    mode: 'all',
    resolver: zodResolver(deleteTeamFormSchema),
  })

  const { mutateAsync } = useMutation({
    mutationKey: ['delete-team'],
    mutationFn: async () => {
      return undefined
    },
    onSuccess: () => {
      router.push('/portal/dashboard')
    },
  })

  const onSubmit = useCallback(
    async (_values: DeleteTeamFormValues) => {
      await mutateAsync()
    },
    [mutateAsync],
  )

  const isDisabled = form.formState.isSubmitting || !form.formState.isValid

  return (
    <Dialog onOpenChange={() => setGlobalErrorMsg(null)}>
      <FormProvider {...form}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Team</DialogTitle>
            <DialogDescription>
              Deleting the team is permanent. All keys, members and billing
              information will be lost.
            </DialogDescription>
          </DialogHeader>
          <FormField
            name="confirm"
            control={form.control}
            render={({ field: { value, onChange, onBlur } }) => (
              <FormControl>
                <FormItem>
                  <div className="items-center flex justify-between">
                    <label htmlFor="confirm">
                      I understand that this action is irreversible.
                    </label>
                    <Checkbox
                      checked={value}
                      onCheckedChange={onChange}
                      onBlur={onBlur}
                    />
                  </div>
                </FormItem>
              </FormControl>
            )}
          />
          <DialogFooter>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <Button
                type="submit"
                variant="destructive"
                fullWidth
                disabled={isDisabled}
              >
                Delete Team
              </Button>
              <Collapsible open={!!globalErrorMsg}>
                <div className="w-full text-center font-medium pt-4 text-red-500">
                  {globalErrorMsg || ''}
                </div>
              </Collapsible>
            </form>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  )
}
