'use client'

import {
  Button,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogDescription,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  PerpsDialogTrigger,
  TextField,
} from '@sushiswap/ui'
import {
  type ReactElement,
  type ReactNode,
  useId,
  useRef,
  useState,
} from 'react'
import { useCreateSubAccount } from 'src/lib/perps/exchange/use-create-sub-account'
import { MAX_SUB_ACCOUNT_NAME_LENGTH } from 'src/lib/perps/sub-account'
import { Checker } from 'src/lib/wagmi/systems/checker'
import { useAccount } from 'src/lib/wallet'
import type { EvmAddress } from 'sushi/evm'
import { PerpsChecker } from '~evm/perps/_ui/perps-checker'

export function CreateSubAccountDialog({
  trigger,
}: { trigger?: ReactNode }): ReactElement {
  const masterAddress = useAccount('evm')

  return (
    <CreateSubAccountDialogContent
      key={masterAddress ?? 'disconnected'}
      masterAddress={masterAddress}
      trigger={trigger}
    />
  )
}

function CreateSubAccountDialogContent({
  masterAddress,
  trigger,
}: {
  masterAddress: EvmAddress | undefined
  trigger?: ReactNode
}): ReactElement {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const submitting = useRef(false)
  const inputId = useId()
  const { createSubAccount, isPending, error, reset } = useCreateSubAccount()
  const trimmedName = name.trim()
  const isValidName =
    trimmedName.length > 0 && trimmedName.length <= MAX_SUB_ACCOUNT_NAME_LENGTH

  function handleOpenChange(nextOpen: boolean): void {
    if (isPending || submitting.current) return
    if (nextOpen) {
      setName('')
      reset()
    }
    setOpen(nextOpen)
  }

  function handleSubmit(): void {
    if (!masterAddress || !isValidName || isPending || submitting.current) {
      return
    }
    submitting.current = true
    createSubAccount(
      { masterAddress, name: trimmedName },
      {
        onSuccess: () => {
          setName('')
          setOpen(false)
        },
        onSettled: () => {
          submitting.current = false
        },
      },
    )
  }

  return (
    <PerpsDialog open={open} onOpenChange={handleOpenChange}>
      <PerpsDialogTrigger asChild>
        {trigger ?? (
          <Button variant="perps-tertiary" className="w-full sm:w-auto">
            Create Sub-Account
          </Button>
        )}
      </PerpsDialogTrigger>
      <PerpsDialogContent hideClose={isPending}>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Create Sub-Account</PerpsDialogTitle>
          <PerpsDialogDescription>
            Create a sub-account for your connected master wallet.
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor={inputId} className="text-xs text-perps-muted-70">
                Name (1-{MAX_SUB_ACCOUNT_NAME_LENGTH} characters)
              </label>
              <TextField
                id={inputId}
                type="text"
                value={name}
                onValueChange={setName}
                placeholder="Name"
                minLength={1}
                maxLength={MAX_SUB_ACCOUNT_NAME_LENGTH}
                disabled={isPending}
                data-state="active"
                className="rounded-md font-medium !border-perps-muted-50 !border !text-perps-muted"
              />
            </div>
            {error && (
              <p role="alert" className="text-xs text-perps-red">
                {error.message}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="perps-secondary"
                disabled={isPending}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <PerpsChecker.Legal size="default" variant="perps-tertiary">
                <Checker.Connect
                  namespace="evm"
                  size="default"
                  variant="perps-tertiary"
                >
                  <PerpsChecker.EnableTrading
                    size="default"
                    variant="perps-tertiary"
                  >
                    <Button
                      type="button"
                      variant="perps-tertiary"
                      loading={isPending}
                      disabled={!masterAddress || !isValidName || isPending}
                      onClick={handleSubmit}
                    >
                      Confirm
                    </Button>
                  </PerpsChecker.EnableTrading>
                </Checker.Connect>
              </PerpsChecker.Legal>
            </div>
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
