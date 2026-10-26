'use client'

import { PencilIcon } from '@heroicons/react/24/outline'
import {
  Button,
  IconButton,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  PerpsDialogTrigger,
  TextField,
} from '@sushiswap/ui'
import {
  type ReactElement,
  type ReactNode,
  useCallback,
  useId,
  useState,
} from 'react'
import {
  MAX_SUB_ACCOUNT_NAME_LENGTH,
  useRenameSubAccount,
} from 'src/lib/perps/exchange/use-rename-sub-account'
import type { EvmAddress } from 'sushi/evm'
import { PerpsChecker } from '~evm/perps/_ui/perps-checker'

type RenameSubAccountDialogProps = {
  masterAddress: EvmAddress
  subAccount: { subAccountUser: EvmAddress; name: string }
  trigger?: ReactNode
}

export function RenameSubAccountDialog({
  masterAddress,
  subAccount,
  trigger,
}: RenameSubAccountDialogProps): ReactElement {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(subAccount.name)
  const inputId = useId()
  const { renameSubAccountAsync, isPending, error, reset } =
    useRenameSubAccount()
  const trimmedName = name.trim()
  const isValidName =
    trimmedName.length > 0 &&
    trimmedName.length <= MAX_SUB_ACCOUNT_NAME_LENGTH &&
    trimmedName !== subAccount.name

  function handleOpenChange(nextOpen: boolean): void {
    if (isPending) return
    if (nextOpen) {
      setName(subAccount.name)
      reset()
    }
    setOpen(nextOpen)
  }

  const handleSubmit = useCallback(async () => {
    if (!isValidName || isPending) return
    await renameSubAccountAsync(
      {
        masterAddress,
        subAccountUser: subAccount.subAccountUser,
        name: trimmedName,
      },
      { onSuccess: () => setOpen(false) },
    )
  }, [
    isValidName,
    isPending,
    renameSubAccountAsync,
    masterAddress,
    subAccount.subAccountUser,
    trimmedName,
  ])

  return (
    <PerpsDialog open={open} onOpenChange={handleOpenChange}>
      <PerpsDialogTrigger asChild>
        {trigger ?? (
          <IconButton
            icon={PencilIcon}
            iconProps={{ className: 'h-3.5 w-3.5' }}
            size="xs"
            variant="ghost"
            className="text-perps-blue"
            name={`Rename ${subAccount.name}`}
          />
        )}
      </PerpsDialogTrigger>
      <PerpsDialogContent aria-describedby={undefined} hideClose={isPending}>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Rename Sub-Account</PerpsDialogTitle>
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
            {error ? (
              <p role="alert" className="text-xs text-perps-red">
                {error.message}
              </p>
            ) : null}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="perps-secondary"
                disabled={isPending}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <PerpsChecker.EnableTrading
                size="default"
                variant="perps-tertiary"
              >
                <PerpsChecker.Legal size="default" variant="perps-tertiary">
                  <Button
                    type="submit"
                    variant="perps-tertiary"
                    loading={isPending}
                    disabled={!isValidName || isPending}
                    onClick={handleSubmit}
                  >
                    Confirm
                  </Button>
                </PerpsChecker.Legal>
              </PerpsChecker.EnableTrading>
            </div>
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
