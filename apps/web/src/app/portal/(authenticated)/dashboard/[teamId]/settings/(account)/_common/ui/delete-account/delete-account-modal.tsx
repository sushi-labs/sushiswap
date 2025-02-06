'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Checkbox,
  Collapsible,
  Dialog,
  DialogClose,
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
import { type ReactNode, useCallback, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { deleteAccountAction } from './delete-account-action'

interface DeleteAccountModal {
  children: ReactNode
}

const deleteAccountFormSchema = z.object({
  confirm: z.boolean().refine((value) => value === true, {}),
})

type DeleteAccountFormValues = z.infer<typeof deleteAccountFormSchema>

export function DeleteAccountModal({ children }: DeleteAccountModal) {
  const [globalErrorMsg, setGlobalErrorMsg] = useState<string | null>(null)

  const form = useForm<DeleteAccountFormValues>({
    defaultValues: {
      confirm: false,
    },
    mode: 'all',
    resolver: zodResolver(deleteAccountFormSchema),
  })

  const onSubmit = useCallback(async (_values: DeleteAccountFormValues) => {
    const result = await deleteAccountAction()

    if ('error' in result) {
      setGlobalErrorMsg(result.error)
    }
  }, [])

  const isDisabled = form.formState.isSubmitting || !form.formState.isValid

  return (
    <Dialog onOpenChange={() => setGlobalErrorMsg(null)}>
      <FormProvider {...form}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Deleting your account is permanent. All your data will be lost and
              cannot be recovered.
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
                Delete Account
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
