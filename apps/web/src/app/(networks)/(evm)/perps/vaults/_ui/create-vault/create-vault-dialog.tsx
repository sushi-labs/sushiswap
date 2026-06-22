'use client'
import {
  Button,
  Message,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  PerpsDialogTrigger,
  TextField,
  classNames,
} from '@sushiswap/ui'
import { type ReactNode, useCallback, useState } from 'react'
import { useCreateVault, useUserAccountValues } from 'src/lib/perps'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { parseUnits } from 'viem'
import { PerpsChecker } from '~evm/perps/_ui/perps-checker'

export const CreateVaultDialog = ({
  trigger,
  isOpen,
  onOpenChange,
  onSuccess,
}: {
  onSuccess: () => void
  trigger?: ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const [depositAmount, setDepositAmount] = useState<string>('')
  const [vaultName, setVaultName] = useState<string>('')
  const [vaultDescription, setVaultDescription] = useState<string>('')
  const { isPending, createVaultAsync } = useCreateVault()
  const { perpsBalance } = useUserAccountValues()
  const isControlled = isOpen !== undefined
  const resolvedOpen = isControlled ? isOpen : open

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(nextOpen)
      } else {
        setOpen(nextOpen)
      }
    },
    [isControlled, onOpenChange],
  )

  const createVault = useCallback(async () => {
    try {
      await createVaultAsync({
        createData: {
          name: vaultName,
          description: vaultDescription,
          initialUsdcAmount: Number(parseUnits(depositAmount, 6)),
        },
      })
      onSuccess()
      handleOpenChange(false)
    } catch (e) {
      console.error('failed to create vault', e)
    }
  }, [
    vaultName,
    vaultDescription,
    depositAmount,
    onSuccess,
    createVaultAsync,
    handleOpenChange,
  ])

  const insufficientBalance = Number(depositAmount) + 10_000 > perpsBalance

  return (
    <PerpsDialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <PerpsDialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="perps-secondary">Create Vault</Button>
        )}
      </PerpsDialogTrigger>
      <PerpsDialogContent aria-describedby={undefined}>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Create Your Own Vault</PerpsDialogTitle>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
          <div className="flex flex-col gap-4 !text-xs">
            <div className="flex flex-col gap-0.5">
              <label htmlFor="vault-name" className="text-perps-muted-70">
                Enter a name for your vault (3-50 characters)
              </label>
              <TextField
                id="vault-name"
                type="text"
                placeholder="Vault Name"
                onValueChange={setVaultName}
                value={vaultName}
                data-state={'active'}
                className={classNames(
                  'rounded-md font-medium !border-perps-muted-50 !border !text-perps-muted',
                )}
                minLength={3}
                maxLength={50}
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <label
                htmlFor="vault-description"
                className="text-perps-muted-70"
              >
                Enter a description for your vault (10-250 characters)
              </label>
              <textarea
                id="vault-description"
                onChange={(e) => setVaultDescription(e.target.value)}
                value={vaultDescription}
                data-state={'active'}
                placeholder="Vault Description"
                className={classNames(
                  'p-3 bg-secondary !ring-0 !outline-none text-xs hover:bg-muted focus:!outline-none focus:!ring-0 font-medium focus:border-perps-muted-50 !text-perps-muted rounded-lg',
                )}
                rows={3}
                minLength={10}
                maxLength={250}
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <label htmlFor="vault-amount" className="text-perps-muted-70">
                Deposit a minimum of 100 USDC from your account. As the leader,
                you must maintain greater than 5% of the liquidity in the vault.
              </label>
              <TextField
                id="vault-amount"
                type="number"
                onValueChange={setDepositAmount}
                value={depositAmount}
                data-state={'active'}
                className={classNames(
                  'rounded-md font-medium !border-perps-muted-50 !border !text-perps-muted',
                )}
                placeholder="0"
              />
            </div>
            <div className="flex items-center gap-1 justify-between">
              <p className="text-perps-muted-70">
                Available balance in account:
              </p>
              <p className="font-medium">{perpsBalance} USDC</p>
            </div>
            <p className="text-perps-muted-70">
              Leaders receive a 10% profit share. Note: the name and description
              of your vault are permanent and cannot be changed.
            </p>
            <Message
              variant="destructive"
              className="!p-3 !text-xs !rounded-md !text-red-100 border border-red/50"
            >
              The vault creation fee is 10,000 USDC. This fee is not refunded
              even if you close the vault.
            </Message>

            <PerpsChecker.Legal size="default" variant="perps-tertiary">
              <Checker.Connect
                size="default"
                variant="perps-tertiary"
                namespace="evm"
              >
                <Checker.Custom
                  size="default"
                  showChildren={vaultName.length >= 3 && vaultName.length <= 50}
                  buttonText={'Enter Name'}
                  onClick={() => {}}
                  disabled={!(vaultName.length >= 3 && vaultName.length <= 50)}
                  variant="perps-tertiary"
                >
                  <Checker.Custom
                    size="default"
                    showChildren={
                      vaultDescription.length >= 10 &&
                      vaultDescription.length <= 250
                    }
                    buttonText={'Enter Description'}
                    onClick={() => {}}
                    disabled={
                      !(
                        vaultDescription.length >= 10 &&
                        vaultDescription.length <= 250
                      )
                    }
                    variant="perps-tertiary"
                  >
                    <Checker.Custom
                      size="default"
                      showChildren={Boolean(depositAmount)}
                      buttonText={'Enter Amount'}
                      onClick={() => {}}
                      disabled={!depositAmount}
                      variant="perps-tertiary"
                    >
                      <Checker.Custom
                        size="default"
                        showChildren={Number(depositAmount) >= 100}
                        buttonText={'Minimum 100 USDC Deposit Required'}
                        onClick={() => {}}
                        disabled={Number(depositAmount) < 100}
                        variant="perps-tertiary"
                      >
                        <Checker.Custom
                          size="default"
                          showChildren={!insufficientBalance}
                          buttonText={'Insufficient Balance'}
                          onClick={() => {}}
                          disabled={Boolean(insufficientBalance)}
                          variant="perps-tertiary"
                        >
                          <PerpsChecker.EnableTrading
                            size="default"
                            variant="perps-tertiary"
                          >
                            <PerpsChecker.BuilderFee
                              size="default"
                              variant="perps-tertiary"
                            >
                              <PerpsChecker.HyperReferral
                                size="default"
                                variant="perps-tertiary"
                              >
                                <Button
                                  size="default"
                                  className="w-full"
                                  onClick={createVault}
                                  loading={isPending}
                                  variant="perps-tertiary"
                                >
                                  Create Vault
                                </Button>
                              </PerpsChecker.HyperReferral>
                            </PerpsChecker.BuilderFee>
                          </PerpsChecker.EnableTrading>
                        </Checker.Custom>
                      </Checker.Custom>
                    </Checker.Custom>
                  </Checker.Custom>
                </Checker.Custom>
              </Checker.Connect>
            </PerpsChecker.Legal>
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
